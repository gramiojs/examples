import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN!);

export function sendToGithubTopic(text: string) {
	return bot.api.sendMessage({
		chat_id: Number(process.env.CHAT_ID!),
		message_thread_id: Number(process.env.TOPIC_ID!),
		text: text,
		link_preview_options: {
			is_disabled: true,
		},
	});
}
