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

        const host = config.host;

        const scheme = host.split(':')[0];
        const domain = host.split('//')[1];

        this.config = {
            scheme,
            domain,
            ...this.config,
        }
        this.client = this.createClient(config)
    }

    createClient(config) {

    }

    async repoConsumer(repoConsumer) {

    }

    getTokenUrl(repo) {

        const {token, scheme, domain} = this.config
        return `${scheme}://${token}:${domain}/${repo}`
    }

}
