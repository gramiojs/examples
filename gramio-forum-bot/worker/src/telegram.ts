import type { Env } from "./env";

const BASE_URL = "https://api.telegram.org/bot";

async function callTelegram(
	env: Env,
	method: string,
	params: Record<string, unknown>,
) {
	const response = await fetch(`${BASE_URL}${env.BOT_TOKEN}/${method}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(params),
	});
	return response.json();
}

export async function sendToGithubTopic(
	env: Env,
	text: string,
	pinMessage = false,
) {
	const message = (await callTelegram(env, "sendMessage", {
		chat_id: Number(env.CHAT_ID),
		message_thread_id: Number(env.TOPIC_ID),
		text,
		parse_mode: "HTML",
		link_preview_options: { is_disabled: true },
	})) as { result: { message_id: number } };

	console.log(message);

	if (pinMessage && message.result?.message_id) {
		await callTelegram(env, "pinChatMessage", {
			chat_id: Number(env.CHAT_ID),
			message_id: message.result.message_id,
			disable_notification: true,
		});
	}
}

export async function sendToChannel(env: Env, text: string) {
	const message = await callTelegram(env, "sendMessage", {
		chat_id: Number(env.CHANNEL_ID),
		text,
		parse_mode: "HTML",
		link_preview_options: { is_disabled: true },
	});

	console.log(message);
}
