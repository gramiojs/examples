import { github } from "./github";
import { sendToGithubTopic } from "./telegram";
import "./webhook";

github.webhooks.on("push", ({ payload: { repository, commits, compare } }) => {
	if (repository.visibility === "public")
		sendToGithubTopic(
			`${repository.full_name}\n\n${commits
				.map((commit) => `- ${commit.message}`)
				.join("\n")}\n\n${compare}`,
		);
});

github.webhooks.on(
	"release.created",
	({ payload: { release, repository } }) => {
		sendToGithubTopic(
			`🎉 ${repository.full_name}@${release.tag_name.replace("v", "")}\n\n${
				release.body
			}`,
		);
	},
);
