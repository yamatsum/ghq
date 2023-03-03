import { ActionPanel, List, Action } from "@raycast/api";
import { execSync } from "child_process";

export default function Command() {
  const stdout = execSync(`export PATH="$PATH:/opt/homebrew/bin:/usr/bin"; ghq list`);
  const repositories: string[] = stdout
    .toString()
    .split(/\n/)
    .filter((v) => v !== "");

  const remoteRepositories: { [key: string]: string[] } = {};

  repositories.map((repository) => {
    const [remote, organization, name] = repository.split("/");

    if (remoteRepositories[remote]?.length) {
      remoteRepositories[remote].push(`${organization}/${name}`);
    } else {
      remoteRepositories[remote] = [`${organization}/${name}`];
    }
  });

  return (
    <List>
      <>
        {Object.keys(remoteRepositories).map((remote) => {
          return (
            <List.Section title={remote} key={remote}>
              {remoteRepositories[remote].map((repository, index) => {
                return (
                  <List.Item
                    key={index}
                    icon="list-icon.png"
                    title={repository}
                    actions={
                      <ActionPanel title="#1 in raycast/extensions">
                        <Action.OpenInBrowser url={`https://${repository}`} />
                      </ActionPanel>
                    }
                  />
                );
              })}
            </List.Section>
          );
        })}
      </>
    </List>
  );
}
