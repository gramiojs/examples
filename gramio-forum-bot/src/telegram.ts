import { Bot } from "gramio";

const bot = new Bot(process.env.BOT_TOKEN!);

export function sendToGithubTopic(text: string) {
	return bot.api.sendMessage({
		chat_id: -1002092610175,
		message_thread_id: 39,
		text: text,
	});
}
