/**
 * <p>
 *   Description: GitUtils
 * </p>
 * @author c332030
 * @since 2025/7/20
 */

import fs from 'fs'
import simpleGit from 'simple-git'

import {GitHubClient} from '#git/client/GitHubClient.js'
import {GitLabClient} from '#git/client/GitLabClient.js'
import {GiteaClient} from '#git/client/GiteaClient.js'
import {GITEA, GITHUB, GITLAB} from '#git/enums/GitType.js'

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
            } else if (domain.indexOf(GITEA) > -1) {
                type = GITEA
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
            case GITEA:
                return new GiteaClient(configNew)
            default:
                throw new Error(`Unsupported server type ${type}`)
        }

    }

    static async cloneOrUpdate(repoConfig, repo, path) {

        const repoPath = `${path}/${repo}`

        const clients = repoConfig.clients
        for (const client of clients) {

            const serverConfig = client.getConfig()
            const { username, host } = serverConfig

            const repoUrl = client.getTokenUrl(repo)

            console.debug(`\ncloneOrUpdate, username: ${username}, host: ${host}, repoPath: ${repoPath}`)

            let exists = true;
            try {
                fs.accessSync(repoPath)
            } catch (e) {
                exists = false
            }

            const sshHost = serverConfig.sshHost
            const cloneUrl = sshHost
                ? `ssh://${sshHost}/${repo}.git`
                : repoUrl
            if(!exists) {

                console.debug(`clone start`)
                try {

                    await this.createGit().clone(cloneUrl, repoPath, [])
                    console.debug(`clone success`)
                } catch (e) {
                    console.error(`clone failure, repoUrl: ${repoUrl}`, e)
                }
                return;
            }

            console.debug(`update start`)
            const gitInRepo = this.createGit(repoPath)

            const remoteUrl = await gitInRepo.listRemote(['--get-url', 'origin'])
            // console.debug(`remoteUrl`, remoteUrl)

            if(!remoteUrl.startsWith(cloneUrl)) {
                await gitInRepo.remote(['set-url', 'origin', cloneUrl]);
            }

            const isRepo = await gitInRepo.checkIsRepo()

            if (isRepo) {

                // try {
                //     await gitInRepo.fetch(['--unshallow'])
                // } catch (e) {}

                try {
                    // await gitInRepo.raw([
                    //     'config',
                    //     '--replace-all',
                    //     'remote.origin.fetch',
                    //     '+refs/heads/*:refs/remotes/origin/*'
                    // ]);

                    await gitInRepo.fetch(['--all'])
                    console.log(`fetch success`)
                } catch (e) {
                    console.error(`fetch failure, cloneUrl: ${cloneUrl}`, e)
                }

                // try {
                //     await gitInRepo.pull()
                //     console.log(`pull success`)
                // } catch (e) {
                //     console.error(`pull failure, try fetch, cloneUrl: ${cloneUrl}`, e)
                // }
            } else {
                console.error(`update cancel of not git`)
            }

            break

        }

    }

}
