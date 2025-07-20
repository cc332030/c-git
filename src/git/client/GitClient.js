/**
 * <p>
 *   Description: Git
 * </p>
 * @author c332030
 * @since 2025/7/20
 */

export class GitClient {

    config

    client

    constructor(config) {
        this.config = config
        this.client = this.createClient(config)
    }

    getConfig() {
        return this.config
    }

    createClient(config) {

    }

    async repoConsumer(repoConsumer) {

    }

    getTokenUrl(repo) {

        const { token, scheme, domain } = this.config
        return `${scheme}://${token}@${domain}/${repo}`
    }

}
