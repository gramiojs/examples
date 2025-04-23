import { expandableBlockquote, format, link } from "gramio";
import { github } from "./github";
import { sendToGithubTopic } from "./telegram";
import "./webhook";

github.webhooks.on(
	"push",
	({ payload: { repository, commits, compare, pusher } }) => {
		if (
			repository.visibility !== "public" ||
			!commits.length ||
			pusher.name === "renovate[bot]"
		)
			return;

		sendToGithubTopic(
			format`${link(repository.full_name, repository.html_url)}
		

		${commits.map((commit) => `- ${commit.message}`).join("\n")}


		${link("Compare changes", compare)}`,
		);
	},
);

github.webhooks.on(
	"release.created",
	({ payload: { release, repository } }) => {
		const [_, changelog] =
			release.body?.match(/\*\*Full Changelog\*\*: (.*)/) || [];

		sendToGithubTopic(
			format`🎉 ${link(
				`${repository.full_name}@${release.tag_name.replace("v", "")}`,
				release.html_url,
			)}


			${
				release.body?.replace(/\*\*Full Changelog\*\*:(.*)/, "") ||
				"No body found."
			}
			
			${link("Compare release changes", changelog)}`,
		);
	},
);

github.webhooks.on("issues.opened", ({ payload: { issue, repository } }) => {
	sendToGithubTopic(
		format`⁉️ ${link(repository.full_name, repository.html_url)} - ${link(`#${issue.number} ${issue.title}`, issue.html_url)}
		
		${expandableBlockquote(issue.body || "No body found.")}`,
	);
});

github.webhooks.on("issues.closed", ({ payload: { issue, repository } }) => {
	sendToGithubTopic(
		format`✅ ${link(repository.full_name, repository.html_url)} - ${link(`#${issue.number} ${issue.title}`, issue.html_url)}
		
		${expandableBlockquote(issue.body || "No body found.")}`,
	);
});

github.webhooks.on("pull_request.opened", ({ payload: { pull_request, repository } }) => {
	sendToGithubTopic(
		format`🔄 ${link(repository.full_name, repository.html_url)} - ${link(`#${pull_request.number} ${pull_request.title}`, pull_request.html_url)}
		
		${expandableBlockquote(pull_request.body || "No body found.")}`,
	);
});