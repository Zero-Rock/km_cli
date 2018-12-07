#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');

process.env.KM_CLI_MODE_DEV = true;

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
  .option('-e, --ext <path>', 'Excluded folder')
  // list命令的实现体
  .action((options) => {
    const rootPath = process.cwd();
    require('../lib/list')(rootPath, options);
  });

program
  // 声明km下有一个命令叫list
  .command('tree')
  // 给出list这个命令的描述
  .description('list files in current working directory with tree')
  // 设置list这个命令的参数
  .option('-a, --all', 'Whether to display hidden files')
  .option('-e, --ext <path>', 'Excluded folder')
  // list命令的实现体
  .action((options) => {
    const rootPath = process.cwd();
    require('../lib/tree')(rootPath, options);
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

program
  .command('init [path]')
  .description('init project directory')
  .description('generate a project from a remote template (legacy API, requires @vue/cli-init)')
  .option('-c, --clone', 'Use git clone when fetching remote template')
  .option('--offline', 'Use cached template')
  .action((value, cmd) => {
    require('../lib/init')(value, cmd);
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

