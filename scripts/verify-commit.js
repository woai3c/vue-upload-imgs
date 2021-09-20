/* eslint-disable max-len */
const chalk = require('chalk')

const msgPath = process.env.HUSKY_GIT_PARAMS
const userEmail = process.env.GIT_AUTHOR_EMAIL
const msg = require('fs')
.readFileSync(msgPath, 'utf-8')
.trim()

const commitRE = /^(feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|release|workflow)(\(.+\))?: .{1,80}/

if (!commitRE.test(msg)) {
    console.log()
    console.error(
        `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
            '不合法的 commit 消息格式',
        )}\n\n`
        + chalk.red(
            '  请使用正确的提交格式:\n\n',
        )
        + `    ${chalk.green('feat: add \'comments\' option')}\n`
        + `    ${chalk.green('fix: handle events on blur (close #28)')}\n\n`
        + chalk.blue('  请查看 git commit 提交规范：http://10.20.6.62:10001/front-end-specification/git.html#git-commit-message-%E8%A7%84%E8%8C%83 \n'),
    )

    process.exit(1)
}

if (!/@shiqiao\.com$/.test(userEmail)) {
    console.error(
        `${chalk.bgRed.white(' ERROR ')} ${chalk.red('此用户没有权限，具有权限的用户为： xxx@shiqiao.com.')}\n`,
        `${chalk.blue('       请将你的 Git 邮箱设置为狮桥邮箱.')}`,
    )

    process.exit(1)
}
