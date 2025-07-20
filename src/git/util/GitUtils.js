/**
 * <p>
 *   Description: GitUtils
 * </p>
 * @author c332030
 * @since 2025/7/20
 */

import fs from 'fs'
import simpleGit from 'simple-git'

import {GitHubClient} from '../client/GitHubClient.js'
import {GitLabClient} from '../client/GitLabClient.js'
import {GITHUB, GITLAB} from '../enums/GitType.js'

export class GitUtils {

    static createGit(path) {
        return simpleGit(path)
    }

    static dealConfig(config) {

        // console.debug('dealConfig config', config)

        const {host} = config
        let {type} = config

        const hostArr = host.split('://')

        const scheme = hostArr[0]
        const domain = hostArr[1]

        if (!type) {

            if (domain.indexOf(GITHUB) > -1) {
                type = GITHUB
            } else if (domain.indexOf(GITLAB) > -1) {
                type = GITLAB
            } else {
                throw new Error(`Unsupported server type ` + type)
            }

        }

        return {
            scheme,
            domain,
            type,
            ...config,
        }
    }

    static newClient(config) {

        const configNew = this.dealConfig(config)
        // console.debug('configNew', configNew)

        const {type} = configNew

        switch (type) {
            case GITHUB:
                return new GitHubClient(configNew)
            case GITLAB:
                return new GitLabClient(configNew)
            default:
                throw new Error(`Unsupported server type ${type}`)
        }

    }

    static async cloneOrPull(repoUrl, client, repo, path) {

        const repoPath = `${path}/${repo}`
        const serverConfig = client.getConfig()
        const { type, username, host } = serverConfig

        console.debug(`\ncloneOrPull, type: ${type}, type: ${username}, type: ${host}, repoPath: ${repoPath}`)

        let exists = true;
        try {
            fs.accessSync(repoPath)
        } catch (e) {
            exists = false
        }

        if(!exists) {

            console.debug(`clone start`)
            try {
                await this.createGit().clone(repoUrl, repoPath, ['--depth=1'])
                console.debug(`clone success`)
            } catch (e) {
                console.error(`clone failure, repoUrl: ${repoUrl}`, e)
            }
            return;
        }

        console.debug(`pull start`)
        const gitInRepo = this.createGit(repoPath)
        const isRepo = await gitInRepo.checkIsRepo()

        if (isRepo) {
            try {
                await gitInRepo.pull()
                console.log(`pull success`)
            } catch (e) {
                console.error(`pull failure, repoUrl: ${repoUrl}`, e)
            }
        } else {
            console.error(`pull cancel of not git`)
        }

    }

}
