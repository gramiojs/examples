import { format, link } from "gramio";
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
			format`${link(repository.full_name, repository.url)}
		

		${commits.map((commit) => `- ${commit.message}`).join("\n")}


		${link("Compare changes", compare)}`,
		);
	},
);

github.webhooks.on(
	"release.created",
	({ payload: { release, repository } }) => {
		sendToGithubTopic(
			format`🎉 ${link(
				`${repository.full_name}@${release.tag_name.replace("v", "")}`,
				repository.html_url,
			)}


			${release.body}`,
		);
	},
);
