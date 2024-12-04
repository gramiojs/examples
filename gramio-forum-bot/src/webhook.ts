import { Elysia, t } from "elysia";
import { github } from "./github";

new Elysia()
	.post(
		"/webhook",
		async ({ headers, body }) => {
			await github.webhooks.verifyAndReceive({
				id: headers["x-github-delivery"],
				name: headers["x-github-event"] as Parameters<
					typeof github.webhooks.verifyAndReceive
				>["0"]["name"],
				signature: headers["x-hub-signature-256"],
				payload: body,
			});
		},
		{
			parse: ({ request }) => request.text(),
			headers: t.Object({
				"x-github-delivery": t.String(),
				"x-github-event": t.String(),
				"x-hub-signature-256": t.String(),
			}),
			body: t.String(),
		},
	)
	.listen(process.env.WEBHOOK_PORT!, () => console.log("[WEBHOOK] started!"));
