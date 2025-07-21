
import fs from 'fs'
import child_process from 'child_process'

const username = '袁兴旺';
const command = `git config user.name ${username}`

function commitName() {

    readSubDirThenDo('D:/file/gzg', (path) => {

        child_process.exec(command, { cwd: path }, function(error) {
            if(error) {
                console.error(error)
            }
        });

    })

}

function readSubDirThenDo(path, callback) {

    fs.readdir(path, (err, files) => {

        if(err) {
            console.error(err)
            return
        }

        // console.debug('files:', typeof files)
        //
        // if(files.contains('.git')) {
        //     callback(path);
        //     return
        // }

        if(files.includes('.git')) {
            console.debug(`Commit name for: ${path}`)
            callback(path);
            return
        }

        files.forEach(file => {

            const filePath = path + '/' + file
            fs.stat(filePath, (err, stats) => {

                if(err) {
                    console.log(err)
                    return
                }

                if(stats.isDirectory()) {
                    readSubDirThenDo(filePath, callback)
                }

            })
        })
    })

}

commitName()
