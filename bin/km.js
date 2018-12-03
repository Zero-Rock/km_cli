#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const exec = require('child_process').exec;

process.env.KM_CLI_MODE_DEV = true;
exec('echo "git is interesting >>111.json "', (error, stdout, stderr) => {
  if (error !== null) {
    console.log(`exec error: ${error}`);
    console.log({ error, stdout, stderr });
  }
});

program
  .version(require('../package').version)
  .usage('<command> [options]');

// 输出帮助信息
program.on('--help', () => {
  console.log();
  console.log(`Run ${chalk.cyan('km <command> --help')} for detailed usage of given command.`);
  console.log();
});

program.commands.forEach(c => c.on('--help', () => console.log()));
// 输入位置命令时，输出帮助信息
program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp();
    console.log(`  ${chalk.red(`Unknown command ${chalk.bold.yellow(cmd)}`)}`);
    console.log();
  });
program
  // 声明km下有一个命令叫list
  .command('list')
  // 给出list这个命令的描述
  .description('list files in current working directory')
  // 设置list这个命令的参数
  .option('-a, --all', 'Whether to display hidden files')
  // list命令的实现体
  .action((options) => {
    const fs = require('fs');
    // 获取当前运行目录下的文件信息
    fs.readdir(process.cwd(), (err, files) => {
      let list = files;
      // 检查用户是否给了--all或者-a的参数，如果没有，则过滤掉那些以.开头的文件
      if (!options.all) {
        list = files.filter((file) => {
          return file.indexOf('.') !== 0;
        });
      }
      // 控制台将所有文件名打印出来
      console.log(chalk.red(list.join('\n\r')));
    });
  });

program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g, --get <path>', 'get value from option')
  .option('-s, --set <path> <value>', 'set option value')
  .option('-d, --delete <path>', 'delete option from config')
  .option('-e, --edit', 'open config with default editor')
  .option('--json', 'outputs JSON result only')
  .action((value, cmd) => {
    require('../lib/config')(value, cleanArgs(cmd));
  });

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
program.parse(process.argv);
function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
}


function cleanArgs(cmd) {
  const args = {};
  cmd.options.forEach((o) => {
    const key = camelize(o.long.replace(/^--/, ''));
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key];
    }
  });
  return args;
}

