import { format, customEmoji } from "@gramio/format";
import { InlineKeyboard, Keyboard } from "@gramio/keyboards";
import type { TelegramUpdate } from "wrappergram";
import { Telegram } from "wrappergram";
import type { Env } from "./env";

const EMOJI_ID = "5208728790884190662";

function emojiText(label: string) {
	return format`${label} ${customEmoji("✈️", EMOJI_ID)}`;
}

export async function handleTelegramUpdate(
	env: Env,
	update: TelegramUpdate,
): Promise<void> {
	if (!update.message) return;

	const chatId = update.message.chat.id;
	const telegram = new Telegram(env.BOT_TOKEN);

	const msg1 = emojiText("inline keyboard");
	await telegram.api.sendMessage({
		chat_id: chatId,
		text: msg1.text,
		entities: msg1.entities,
		reply_markup: new InlineKeyboard()
			.text("no style", "dummy").row()
			.text("primary", "dummy", { style: "primary" }).row()
			.text("danger", "dummy", { style: "danger" }).row()
			.text("success", "dummy", { style: "success" }).row()
			.text("icon", "dummy", { icon_custom_emoji_id: EMOJI_ID }).row()
			.text("icon+primary", "dummy", { icon_custom_emoji_id: EMOJI_ID, style: "primary" }).row()
			.text("icon+danger", "dummy", { icon_custom_emoji_id: EMOJI_ID, style: "danger" }).row()
			.text("icon+success", "dummy", { icon_custom_emoji_id: EMOJI_ID, style: "success" }).row()
			.text(" ", "dummy", { icon_custom_emoji_id: EMOJI_ID }).row()
			.text(" ", "dummy", { icon_custom_emoji_id: EMOJI_ID, style: "primary" }).row()
			.text(" ", "dummy", { icon_custom_emoji_id: EMOJI_ID, style: "danger" }).row()
			.text(" ", "dummy", { icon_custom_emoji_id: EMOJI_ID, style: "success" }),
	});

	const msg2 = emojiText("inline keyboard button types");
	await telegram.api.sendMessage({
		chat_id: chatId,
		text: msg2.text,
		entities: msg2.entities,
		reply_markup: new InlineKeyboard()
			.url("url", "https://example.com").row()
			.url("url+style", "https://example.com", { style: "primary", icon_custom_emoji_id: EMOJI_ID }).row()
			.webApp("web_app", "https://example.com").row()
			.webApp("web_app+style", "https://example.com", { style: "danger", icon_custom_emoji_id: EMOJI_ID }).row()
			.switchToChat("switch_inline_query", "test").row()
			.switchToChat("siq+style", "test", { style: "primary", icon_custom_emoji_id: EMOJI_ID }).row()
			.switchToCurrentChat("siq_current", "test").row()
			.switchToCurrentChat("siq_current+style", "test", { style: "danger", icon_custom_emoji_id: EMOJI_ID }).row()
			.switchToChosenChat("siq_chosen", { allow_user_chats: true }).row()
			.switchToChosenChat("siq_chosen+style", { allow_user_chats: true }, { style: "success", icon_custom_emoji_id: EMOJI_ID }).row()
			.copy("copy_text", "copied!").row()
			.copy("copy_text+style", "copied!", { style: "primary", icon_custom_emoji_id: EMOJI_ID }),
	});

	const msg3 = emojiText("reply keyboard");
	await telegram.api.sendMessage({
		chat_id: chatId,
		text: msg3.text,
		entities: msg3.entities,
		reply_markup: new Keyboard()
			.text("no style").row()
			.text("primary", { style: "primary" }).row()
			.text("danger", { style: "danger" }).row()
			.text("success", { style: "success" }).row()
			.text("icon", { icon_custom_emoji_id: EMOJI_ID }).row()
			.text("icon+primary", { icon_custom_emoji_id: EMOJI_ID, style: "primary" }).row()
			.text("icon+danger", { icon_custom_emoji_id: EMOJI_ID, style: "danger" }).row()
			.text("icon+success", { icon_custom_emoji_id: EMOJI_ID, style: "success" }).row()
			.text(" ", { icon_custom_emoji_id: EMOJI_ID }).row()
			.text(" ", { icon_custom_emoji_id: EMOJI_ID, style: "primary" }).row()
			.text(" ", { icon_custom_emoji_id: EMOJI_ID, style: "danger" }).row()
			.text(" ", { icon_custom_emoji_id: EMOJI_ID, style: "success" })
			.resized(),
	});

	const msg4 = emojiText("reply keyboard button types");
	await telegram.api.sendMessage({
		chat_id: chatId,
		text: msg4.text,
		entities: msg4.entities,
		reply_markup: new Keyboard()
			.requestUsers("request_users", 1).row()
			.requestUsers("request_users+style", 2, {}, { style: "primary", icon_custom_emoji_id: EMOJI_ID }).row()
			.requestChat("request_chat", 3).row()
			.requestChat("request_chat+style", 4, {}, { style: "danger", icon_custom_emoji_id: EMOJI_ID }).row()
			.requestContact("contact").row()
			.requestContact("contact+style", { style: "success", icon_custom_emoji_id: EMOJI_ID }).row()
			.requestLocation("location").row()
			.requestLocation("location+style", { style: "primary", icon_custom_emoji_id: EMOJI_ID }).row()
			.requestPoll("poll").row()
			.requestPoll("poll+style", undefined, { style: "danger", icon_custom_emoji_id: EMOJI_ID }).row()
			.webApp("web_app", "https://example.com").row()
			.webApp("web_app+style", "https://example.com", { style: "success", icon_custom_emoji_id: EMOJI_ID })
			.resized(),
	});
}
