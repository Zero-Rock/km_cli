#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const exec = require('child_process').exec;

exec('echo "git is interesting >>111.json "', (error, stdout, stderr) => {
  console.log(1234567890);
  if (error !== null) {
    console.log(`exec error: ${error}`);
  }
});

program
  .version('1.0.0');

program
  .command('setup [env]')
  .description('run setup commands for all envs')
  .option('-s, --setup_mode [mode]', 'Which setup mode to use')
  .action((env, options) => {
    const mode = options.setup_mode || 'normal';
    env = env || 'all';
    console.log('setup for %s env(s) with %s mode', env, mode);
  });

program
  .command('exec <cmd>')
  .alias('ex')
  .description('execute the given remote cmd')
  .option('-e, --exec_mode <mode>', 'Which exec mode to use')
  .action((cmd, options) => {
    console.log('exec "%s" using %s mode', cmd, options.exec_mode);
  })
  .on('--help', () => {
    console.log('  Examples:');
    console.log();
    console.log('    $ deploy exec sequential');
    console.log('    $ deploy exec async');
    console.log();
  });
program
  .command('*')
  .action((env) => {
    console.log('deploying "%s"', env);
  });
program
  .command('list') // 声明hi下有一个命令叫list
  .description('list files in current working directory') // 给出list这个命令的描述
  .option('-a, --all', 'Whether to display hidden files') // 设置list这个命令的参数
  .action((options) => { // list命令的实现体
    const fs = require('fs');
    // 获取当前运行目录下的文件信息
    fs.readdir(process.cwd(), (err, files) => {
      let list = files;
      if (!options.all) { // 检查用户是否给了--all或者-a的参数，如果没有，则过滤掉那些以.开头的文件
        list = files.filter((file) => {
          return file.indexOf('.') !== 0;
        });
      }
      console.log(list.join('\n\r')); // 控制台将所有文件名打印出来
    });
  });
program.on('--help', () => {
  console.log('11111111');
  console.log('Examples');
  console.log('22222222');
});
program.parse(process.argv);
