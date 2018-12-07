/**
 * Created by 枯荣<panjiankang@cai-inc.com> on 2018-12-05 11:42.
 */
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');

const init = (value, cmd) => {
  clear();
  console.log(chalk.red(figlet.textSync('km init', { horizontalLayout: 'full' })));
  const promptList = [{
    type: 'input',
    message: '项目名称:',
    name: 'projectName',
    prefix: 'km-',
    default: 'km-cli-demo', // 默认值
  }, {
    type: 'confirm',
    message: '是否使用监听？',
    name: 'watch',
    prefix: 'km-',
  }, {
    type: 'confirm',
    message: '是否进行文件过滤？',
    name: 'filter',
    prefix: 'km-',
    suffix: '后缀',
    when(answers) { // 当watch为true的时候才会提问当前问题
      return answers.watch;
    },
  }, {
    type: 'list',
    message: '选择一种水果:',
    name: 'fruit',
    prefix: 'km-',
    choices: [
      'Aypple',
      'Pear',
      'Banana',
    ],
    default: 'Banana', // 默认值
    filter(val) { // 使用filter将回答变为小写
      return val.toLowerCase();
    },
  }, {
    type: 'rawlist',
    name: 'color',
    message: '选择一种颜色:',
    prefix: 'km-',
    choices: [
      'Red',
      'Yellow',
      'Blue',
    ],
  }];
  inquirer.prompt(promptList).then((answers) => {
    console.log(answers); // 返回的结果
  });
};
module.exports = (...args) => {
  return init(...args);
};
