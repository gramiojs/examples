import { github } from "./github";
import { sendToGithubTopic } from "./telegram";
import "./webhook";

github.webhooks.on("push", ({ payload: { repository, commits } }) => {
	if (repository.visibility === "public")
		sendToGithubTopic(
			`${repository.full_name}\n\n${commits
				.map((commit) => `- ${commit.message}`)
				.join("\n")}`,
		);
});
