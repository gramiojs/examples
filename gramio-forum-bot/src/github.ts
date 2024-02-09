import { App } from "octokit";

export const github = new App({
	appId: process.env.GITHUB_APP_ID!,
	privateKey: process.env.GITHUB_PRIVATE_KEY!,
	webhooks: {
		secret: process.env.GITHUB_WEBHOOK_SECRET!,
	},
});
