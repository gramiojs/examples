import type { Env } from "./env";
import { truncate } from "./format";
import { Telegram } from "wrappergram";

const BASE_URL = "https://api.telegram.org/bot";

function cleanToken(token: string): string {
	// Remove whitespace and zero-width/BOM characters that break the URL
	return token.trim().replace(/[\u200B-\u200D\uFEFF]/g, "");
}

async function callTelegram(
	env: Env,
	method: string,
	params: Record<string, unknown>,
) {
	const token = cleanToken(env.BOT_TOKEN);
	const url = `${BASE_URL}${token}/${method}`;

	const response = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(params),
	});

	console.log("Telegram request", { url, params });

	const text = await response.text();

	if (!response.ok) {
		console.error("Telegram API non-200", {
			method,
			status: response.status,
			statusText: response.statusText,
			text,
			path: url,
			body: JSON.stringify(params),
		});
	}

	if (!text) {
		console.error("Telegram API empty body", { method, status: response.status });
		throw new Error(`Telegram API empty response for ${method}`);
	}

	try {
		return JSON.parse(text);
	} catch (error) {
		console.error("Failed to parse Telegram response", {
			method,
			status: response.status,
			text,
			error,
		});
		throw new Error(`Telegram API parse error for ${method}`);
	}
}

export async function sendToGithubTopic(
	env: Env,
	text: string,
	pinMessage = false,
) {
	const message = (await callTelegram(env, "sendMessage", {
		chat_id: Number(env.CHAT_ID),
		message_thread_id: Number(env.TOPIC_ID),
		text: truncate(text),
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
