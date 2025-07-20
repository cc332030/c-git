import fs from 'fs'
import yaml from 'js-yaml'
import {GitUtils} from './git/util/GitUtils.js'

function loadRepos(servers) {

    const repos = {}

    for (const server of servers) {

        const client = GitUtils.newClient(server)
        client.repoConsumer(repo => {

            let repoConfig = repos[repo]
            if (!repoConfig) {
                repoConfig = {
                    clients: [],
                }
            }

            const { clients: repoClients } = repoConfig
            repoClients.push(client)

        })

    }

    return repos
}

function main() {

    const config = yaml.load(fs.readFileSync('config.yml',  'utf8'));
    const { servers } = config

    const repos = loadRepos(servers);

    console.debug('repos', JSON.stringify(repos, null, 2));

}

main()
