import type { Env } from "./env";
import type { TelegramMessageEntity } from "@gramio/types";
import { Telegram } from "wrappergram";

function getTelegram(env: Env) {
	return new Telegram(env.BOT_TOKEN);
}

export interface FormattedMessage {
	text: string;
	entities?: TelegramMessageEntity[];
}

export async function sendToGithubTopic(
	env: Env,
	message: FormattedMessage,
	pinMessage = false,
) {
	const telegram = getTelegram(env);

	const response = await telegram.api.sendMessage({
		chat_id: Number(env.CHAT_ID),
		message_thread_id: Number(env.TOPIC_ID),
		text: message.text,
		entities: message.entities,
		link_preview_options: { is_disabled: true },
	});

	console.log(response);

	if (pinMessage && response.ok && response.result.message_id) {
		await telegram.api.pinChatMessage({
			chat_id: Number(env.CHAT_ID),
			message_id: response.result.message_id,
			disable_notification: true,
		});
	}
}

export async function sendToChannel(env: Env, message: FormattedMessage) {
	const telegram = getTelegram(env);

	const response = await telegram.api.sendMessage({
		chat_id: Number(env.CHANNEL_ID),
		text: message.text,
		entities: message.entities,
		link_preview_options: { is_disabled: true },
	});

	console.log(response);
}
