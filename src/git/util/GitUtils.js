/**
 * <p>
 *   Description: GitUtils
 * </p>
 * @author c332030
 * @since 2025/7/20
 */

import simpleGit from 'simple-git'
import {GitHubClient} from '../client/GitHubClient.js'
import {GitLabClient} from '../client/GitLabClient.js'
import {GITHUB, GITLAB} from '../enums/GitType.js'

const git = simpleGit()

export class GitUtils {

    static dealConfig(config) {

        // console.debug('dealConfig config', config)

        const { host } = config;
        let { type } = config;

        const hostArr = host.split('://');

        const scheme = hostArr[0]
        const domain = hostArr[1]

        if(!type) {

            if(domain.indexOf(GITHUB) > -1) {
                type = GITHUB;
            } else if(domain.indexOf(GITLAB) > -1) {
                type = GITLAB;
            } else {
                throw new Error(`Unsupported server type ` + type);
            }

        }

        return  {
            scheme,
            domain,
            type,
            ...config,
        }
    }

    static newClient(config) {

        const configNew = this.dealConfig(config);
        // console.debug('configNew', configNew)

        const { type } = configNew;

        switch (type) {
            case GITHUB:
                return new GitHubClient(configNew);
            case GITLAB:
                return new GitLabClient(configNew);
            default:
                throw new Error(`Unsupported server type ${type}`);
        }

    }

    static cloneOrPull(repoUrl, path) {

        simpleGit()
            .clone(repoUrl,  './local-path')
            .then(() => console.log('克隆成功'))
            .catch(err => console.error('克隆失败:', err));

    }

}
