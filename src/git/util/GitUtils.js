/**
 * <p>
 *   Description: GitUtils
 * </p>
 * @author c332030
 * @since 2025/7/20
 */

import simpleGit from 'simple-git'

const git = simpleGit()

export class GitUtils {

    static cloneOrPull(repoUrl, path) {

        simpleGit()
            .clone(repoUrl,  './local-path')
            .then(() => console.log('克隆成功'))
            .catch(err => console.error('克隆失败:', err));

    }

}
