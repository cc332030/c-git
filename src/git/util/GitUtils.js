/**
 * <p>
 *   Description: GitUtils
 * </p>
 * @author c332030
 * @since 2025/7/20
 */

import fs from 'fs'
import ora from 'ora'
import simpleGit from 'simple-git'

import {GitHubClient} from '../client/GitHubClient.js'
import {GitLabClient} from '../client/GitLabClient.js'
import {GITHUB, GITLAB} from '../enums/GitType.js'

const spinner = ora('开始下载').start()
const progress = ({ stage, progress }) => {

    let textTemplate = `当前下载进度: ${stage} ${progress}%`;
    spinner.text = textTemplate;
    if (progress === 100) {
        spinner.text = textTemplate + '下载完成';
    }
};

const git = simpleGit({progress})

export class GitUtils {

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

    static async cloneOrPull(repoUrl, repo, path) {

        const repoPath = `${path}/${repo}`
        console.debug(`\ncloneOrPull repoPath: ${repoPath}`)

        try {

            fs.accessSync(repoPath)
            console.debug(`pull start`)

            // 目录存在，检查是否是Git仓库
            const gitInRepo = simpleGit(repoPath)
            const isRepo = await gitInRepo.checkIsRepo()

            if (isRepo) {
                await gitInRepo.pull((err, result) => {
                    if (err) {
                        console.error(`pull failure`, err)
                    } else {
                        console.log(`pull success`)
                    }
                })
            } else {
                console.error(' 目标目录存在，但不是Git仓库。')
            }

        } catch (e) {

            console.debug(`clone start`)

            // 目录不存在，执行克隆
            await git.clone(repoUrl, repoPath, ['--depth=1'], (cloneErr) => {
                if (cloneErr) {
                    console.error(`clone failure`, cloneErr)
                } else {
                    console.debug(`clone success`)
                }
            })
        }

    }

}
