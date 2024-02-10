import { format, link } from "gramio";
import { github } from "./github";
import { sendToGithubTopic } from "./telegram";
import "./webhook";

github.webhooks.on("push", ({ payload: { repository, commits, compare } }) => {
	if (repository.visibility !== "public" || !commits.length) return;

	sendToGithubTopic(
		format`${link(repository.full_name, repository.url)}\n\n${commits
			.map((commit) => `- ${commit.message}`)
			.join("\n")}\n\n${link("Compare changes", compare)}`,
	);
});

github.webhooks.on(
	"release.created",
	({ payload: { release, repository } }) => {
		sendToGithubTopic(
			format`🎉 ${link(
				`${repository.full_name}@${release.tag_name.replace("v", "")}`,
				repository.url,
			)}\n\n${release.body}`,
		);
	},
);
