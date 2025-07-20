/**
 * <p>
 *   Description: GitLabClient
 * </p>
 * @author c332030
 * @since 2025/7/20
 */

import {Gitlab} from '@gitbeaker/node'
import {GitClient} from './GitClient.js'

export class GitLabClient extends GitClient {

    constructor(config) {
        super(config)
    }

    createClient(config) {
        return new Gitlab({
            host: this.config.host,
            token: this.config.token,
        });
    }

    async repoConsumer(repoConsumer) {

        const projects = await this.client.Projects.all({
            membership: true,       // 仅列出当前用户有权限的项目
            min_access_level: 10,   // 最小权限：Guest (10) 及以上
            perPage: 100,           // 每页数量
            maxPages: 10            // 最大页数（按需调整）
        });

        projects.forEach((project,  index) => {
            repoConsumer(project.path_with_namespace);
        });
    }

}
