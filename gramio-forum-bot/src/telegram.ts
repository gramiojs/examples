import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN!);

export async function sendToGithubTopic(
	text: string | { toString(): string },
	pinMessage = false,
) {
	const message = await bot.api.sendMessage({
		chat_id: Number(process.env.CHAT_ID!),
		message_thread_id: Number(process.env.TOPIC_ID!),
		text: text,
		link_preview_options: {
			is_disabled: true,
		},
	});

	console.log(message);

	if (pinMessage) {
		await bot.api.pinChatMessage({
			chat_id: Number(process.env.CHAT_ID!),
			message_id: message.message_id,
			disable_notification: true,
		});
	}
}

export async function sendToChannel(text: string | { toString(): string }) {
	const message = await bot.api.sendMessage({
		chat_id: Number(process.env.CHANNEL_ID!),
		text: text,
		link_preview_options: {
			is_disabled: true,
		},
	});

	console.log(message);
}
