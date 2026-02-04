import type { Env } from "./env";
import { handleWebhook } from "./handlers";
import { verifyGitHubWebhook } from "./verify";

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method !== "POST") {
			return new Response("Method not allowed", { status: 405 });
		}

		const url = new URL(request.url);
		if (url.pathname !== "/webhook") {
			return new Response("Not found", { status: 404 });
		}

		const signature = request.headers.get("x-hub-signature-256");
		const event = request.headers.get("x-github-event");
		const delivery = request.headers.get("x-github-delivery");

		if (!signature || !event || !delivery) {
			return new Response("Missing required headers", { status: 400 });
		}

		const payload = await request.text();

		const isValid = await verifyGitHubWebhook(
			payload,
			signature,
			env.GITHUB_WEBHOOK_SECRET,
		);

		if (!isValid) {
			return new Response("Invalid signature", { status: 401 });
		}

		try {
			const parsedPayload = JSON.parse(payload);
			await handleWebhook(env, event, parsedPayload);
			return new Response("OK", { status: 200 });
		} catch (error) {
			console.error("Error handling webhook:", error);
			return new Response("Internal server error", { status: 500 });
		}
	},
};
