import type { Env } from "./env";
import { expandableBlockquote, link } from "./format";
import { sendToChannel, sendToGithubTopic } from "./telegram";

type WebhookEvent =
	| { event: "push"; payload: PushPayload }
	| { event: "release"; payload: ReleasePayload }
	| { event: "issues"; payload: IssuesPayload }
	| { event: "pull_request"; payload: PullRequestPayload }
	| { event: "issue_comment"; payload: IssueCommentPayload };

interface Repository {
	full_name: string;
	html_url: string;
	visibility: string;
}

interface Commit {
	message: string;
}

interface PushPayload {
	repository: Repository;
	commits: Commit[];
	compare: string;
	pusher: { name: string };
}

interface ReleasePayload {
	release: {
		tag_name: string;
		html_url: string;
		body?: string;
	};
	repository: Repository;
}

interface IssueCommentPayload {
	action: string;
	comment: {
		body?: string;
		html_url: string;
	};
	issue: IssuesPayload["issue"];
	repository: Repository;
}

interface IssuesPayload {
	action: string;
	issue: {
		number: number;
		title: string;
		html_url: string;
		body?: string;
	};
	repository: Repository;
}

interface PullRequestPayload {
	action: string;
	pull_request: {
		number: number;
		title: string;
		html_url: string;
		body?: string;
	};
	repository: Repository;
}

export async function handleWebhook(
	env: Env,
	event: string,
	payload: unknown,
): Promise<void> {
	switch (event) {
		case "push":
			await handlePush(env, payload as PushPayload);
			break;
		case "release":
			await handleRelease(env, payload as ReleasePayload);
			break;
		case "issues":
			await handleIssues(env, payload as IssuesPayload);
			break;
		case "pull_request":
			await handlePullRequest(env, payload as PullRequestPayload);
			break;
		case "issue_comment":
			await handleIssueComment(env, payload as IssueCommentPayload);
			break;
		default:
			console.log(`Unhandled event: ${event}`);
	}
}

async function handlePush(env: Env, payload: PushPayload): Promise<void> {
	const { repository, commits, compare, pusher } = payload;

	if (
		repository.visibility !== "public" ||
		!commits.length ||
		pusher.name === "renovate[bot]" ||
		commits.every((commit) => commit.message.includes("chore(deps)"))
	) {
		return;
	}

	const text = `${link(repository.full_name, repository.html_url)}

${commits.map((commit) => `- ${commit.message}`).join("\n")}

${link("Compare changes", compare)}`;

	await sendToGithubTopic(env, text);
}

async function handleIssueComment(
	env: Env,
	payload: IssueCommentPayload,
): Promise<void> {
	const { action, comment, issue, repository } = payload;
	if (action !== "created") return;

	const text = `💬 ${link(
		repository.full_name,
		repository.html_url,
	)} - ${link(`#${issue.number} ${issue.title}`, issue.html_url)}

${expandableBlockquote(comment.body || "No comment body.")}

${link("View comment", comment.html_url)}`;

	await sendToGithubTopic(env, text);
}

async function handleRelease(env: Env, payload: ReleasePayload): Promise<void> {
	const { release, repository } = payload;
	const [_, changelog] =
		release.body?.match(/\*\*Full Changelog\*\*: (.*)/) || [];

	const text = `🎉 ${link(
		`${repository.full_name}@${release.tag_name.replace("v", "")}`,
		release.html_url,
	)}

${expandableBlockquote(
	release.body?.replace(/\*\*Full Changelog\*\*:(.*)/, "") || "No body found.",
)}

${link("Compare release changes", changelog || release.html_url)}`;

	await Promise.all([
		sendToGithubTopic(env, text, true),
		sendToChannel(env, text),
	]);
}

async function handleIssues(env: Env, payload: IssuesPayload): Promise<void> {
	const { action, issue, repository } = payload;

	if (action === "opened") {
		const text = `⁉️ ${link(repository.full_name, repository.html_url)} - ${link(`#${issue.number} ${issue.title}`, issue.html_url)}

${expandableBlockquote(issue.body || "No body found.")}`;

		await sendToGithubTopic(env, text);
	} else if (action === "closed") {
		const text = `✅ ${link(repository.full_name, repository.html_url)} - ${link(`#${issue.number} ${issue.title}`, issue.html_url)}

${expandableBlockquote(issue.body || "No body found.")}`;

		await sendToGithubTopic(env, text);
	}
}

async function handlePullRequest(
	env: Env,
	payload: PullRequestPayload,
): Promise<void> {
	const { action, pull_request, repository } = payload;

	if (action !== "opened") return;
	if (pull_request.title.includes("chore(deps)")) {
		console.log("chore(deps) pull request", pull_request);
		return;
	}

	const text = `🔄 ${link(repository.full_name, repository.html_url)} - ${link(`#${pull_request.number} ${pull_request.title}`, pull_request.html_url)}

${expandableBlockquote(pull_request.body || "No body found.")}`;

	await sendToGithubTopic(env, text);
}
