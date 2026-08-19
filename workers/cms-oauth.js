const STATE_COOKIE = "decap_oauth_state";
const STATE_MAX_AGE_SECONDS = 600;
const GITHUB_AUTHORIZE = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN = "https://github.com/login/oauth/access_token";

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		try {
			if (url.pathname === "/auth" || url.pathname === "/auth/") {
				return handleAuth(request, url, env);
			}

			if (url.pathname === "/callback" || url.pathname === "/callback/") {
				return handleCallback(request, url, env);
			}

			return new Response("Not found", { status: 404 });
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unknown error";
			console.error(
				JSON.stringify({
					message: "oauth handler failed",
					error: message,
					path: url.pathname,
				}),
			);
			return new Response("Authentication failed.", { status: 500 });
		}
	},
};

function handleAuth(request, url, env) {
	const missingCredentials = missingOAuthConfig(env);
	if (missingCredentials) {
		return missingCredentials;
	}

	const provider = url.searchParams.get("provider");
	if (provider && provider !== "github") {
		return new Response("Unsupported provider.", { status: 400 });
	}

	const state = randomHex(16);
	const redirectUri = `${url.origin}/callback`;
	const scope = isPrivateRepo(env) ? "repo user" : "public_repo user";

	const authorizeUrl = new URL(GITHUB_AUTHORIZE);
	authorizeUrl.searchParams.set("client_id", env.GITHUB_OAUTH_ID);
	authorizeUrl.searchParams.set("redirect_uri", redirectUri);
	authorizeUrl.searchParams.set("response_type", "code");
	authorizeUrl.searchParams.set("scope", scope);
	authorizeUrl.searchParams.set("state", state);

	const response = new Response(null, {
		status: 302,
		headers: {
			Location: authorizeUrl.toString(),
		},
	});
	response.headers.append("Set-Cookie", serializeStateCookie(state, url));
	return response;
}

async function handleCallback(request, url, env) {
	const missingCredentials = missingOAuthConfig(env);
	if (missingCredentials) {
		return missingCredentials;
	}

	const errorParam = url.searchParams.get("error");
	if (errorParam) {
		return callbackScriptResponse("error", {
			message: url.searchParams.get("error_description") || errorParam,
		});
	}

	const code = url.searchParams.get("code");
	if (!code) {
		return new Response("Missing authorization code.", { status: 400 });
	}

	const returnedState = url.searchParams.get("state") ?? "";
	const cookieState = readCookie(request, STATE_COOKIE);
	if (!cookieState || !(await statesMatch(returnedState, cookieState))) {
		return new Response("Invalid OAuth state.", { status: 400 });
	}

	const tokenResponse = await fetch(GITHUB_TOKEN, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			client_id: env.GITHUB_OAUTH_ID,
			client_secret: env.GITHUB_OAUTH_SECRET,
			code,
			redirect_uri: `${url.origin}/callback`,
			grant_type: "authorization_code",
		}),
	});

	const tokenPayload = await tokenResponse.json();
	if (!tokenResponse.ok || !tokenPayload.access_token) {
		console.error(
			JSON.stringify({
				message: "github token exchange failed",
				status: tokenResponse.status,
				error: tokenPayload.error || "missing_access_token",
			}),
		);
		return callbackScriptResponse("error", {
			message: "Unable to complete GitHub login.",
		});
	}

	const response = callbackScriptResponse("success", { token: tokenPayload.access_token });
	response.headers.append("Set-Cookie", clearStateCookie(url));
	return response;
}

function missingOAuthConfig(env) {
	if (env.GITHUB_OAUTH_ID && env.GITHUB_OAUTH_SECRET) {
		return null;
	}

	console.error(
		JSON.stringify({
			message: "github oauth is not configured",
			hasClientId: Boolean(env.GITHUB_OAUTH_ID),
			hasClientSecret: Boolean(env.GITHUB_OAUTH_SECRET),
		}),
	);
	return new Response("GitHub OAuth is not configured.", { status: 500 });
}

function isPrivateRepo(env) {
	const value = env.GITHUB_REPO_PRIVATE;
	return Boolean(value) && value !== "0" && value.toLowerCase() !== "false";
}

function callbackScriptResponse(status, payload) {
	// JSON.stringify the whole postMessage payload so token JSON quotes
	// cannot break out of the generated JavaScript string.
	const messageLiteral = JSON.stringify(
		`authorization:github:${status}:${JSON.stringify(payload)}`,
	).replace(/</g, "\\u003c");
	const html = `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>Authorizing Decap CMS</title>
		<script>
			(function () {
				function receiveMessage(message) {
					window.opener.postMessage(${messageLiteral}, message.origin);
					window.removeEventListener("message", receiveMessage, false);
				}
				window.addEventListener("message", receiveMessage, false);
				window.opener.postMessage("authorizing:github", "*");
			})();
		</script>
	</head>
	<body>
		<p>Authorizing Decap CMS…</p>
	</body>
</html>`;

	return new Response(html, {
		headers: {
			"Content-Type": "text/html; charset=utf-8",
			"Cache-Control": "no-store",
		},
	});
}

function randomHex(bytes) {
	const buffer = new Uint8Array(bytes);
	crypto.getRandomValues(buffer);
	return Array.from(buffer, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function serializeStateCookie(state, url) {
	const secure = url.protocol === "https:" ? "; Secure" : "";
	return `${STATE_COOKIE}=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${STATE_MAX_AGE_SECONDS}${secure}`;
}

function clearStateCookie(url) {
	const secure = url.protocol === "https:" ? "; Secure" : "";
	return `${STATE_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

function readCookie(request, name) {
	const header = request.headers.get("Cookie");
	if (!header) {
		return null;
	}

	for (const part of header.split(";")) {
		const [rawKey, ...rawValue] = part.split("=");
		if (rawKey && rawKey.trim() === name) {
			return rawValue.join("=").trim();
		}
	}

	return null;
}

async function statesMatch(provided, expected) {
	const encoder = new TextEncoder();
	const [providedHash, expectedHash] = await Promise.all([
		crypto.subtle.digest("SHA-256", encoder.encode(provided)),
		crypto.subtle.digest("SHA-256", encoder.encode(expected)),
	]);
	return crypto.subtle.timingSafeEqual(providedHash, expectedHash);
}
