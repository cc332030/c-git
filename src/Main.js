import fs from 'fs'
import yaml from 'js-yaml'

import {GitUtils} from './git/util/GitUtils.js'

async function main() {

    const config = yaml.load(fs.readFileSync('config.yml',  'utf8'));
    const { path, servers } = config

    // console.debug('servers', JSON.stringify(servers, null, 2));

    const repos = await loadRepos(servers);

    // fs.writeFileSync('d:/repos.txt', JSON.stringify(repos, null, 2), 'utf8');

    for (const [repo, repoConfig] of Object.entries(repos)) {

        const client = repoConfig.clients[0]
        const tokenUrl = client.getTokenUrl(repo)
        // console.debug('tokenUrl', tokenUrl)

        await GitUtils.cloneOrPull(tokenUrl, repo, path)

    }

}

async function loadRepos(servers) {

    const repos = {}

    for (const server of servers) {

        console.debug(`\nload host: ${server.host}`);

        const client = GitUtils.newClient(server)
        await client.repoConsumer(repo => {

            let repoConfig = repos[repo]
            if (!repoConfig) {
                repos[repo] = repoConfig = {
                    clients: [],
                }
            }

            const { clients: repoClients } = repoConfig
            repoClients.push(client)

        })

    }

    return repos
}

main()
