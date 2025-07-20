/**
 * <p>
 *   Description: GitHubClient
 * </p>
 * @author c332030
 * @since 2025/7/20
 */

import {Octokit} from '@octokit/rest'

import {GitClient} from './GitClient.js'

export class GitHubClient extends GitClient {

    constructor(config) {
        super({
            host: 'https://github.com',
            ...config,
        })
    }

    createClient(config) {
        return new Octokit({ auth: config.token  })
    }

    async repoConsumer(repoConsumer) {

        const iterator = this.client.paginate.iterator(this.client.repos.listForAuthenticatedUser,  {
            per_page: 100,
            visibility: 'all'
        });

        for await (const { data: repos } of iterator) {
            repos.forEach(repo  => {

                repoConsumer(repo.full_name);

            });
        }

    }

}
