/**
 * Created by 枯荣<panjiankang@cai-inc.com> on 2018-12-03 19:53.
 */
const fs = require('fs');
const chalk = require('chalk');
const { logger } = require('./utils');

const asyncReaddir = path => new Promise((resolve, reject) => {
  fs.readdir(path, (err, files) => {
    if (err) {
      reject(err);
    } else {
      resolve(files);
    }
  });
});

async function list(rootPath, option) {
  const files = await asyncReaddir(rootPath);
  let lists = files;
  if (!option.all) {
    lists = files.filter(file => file.indexOf('.') !== 0);
  }
  // 控制台将所有文件名打印出来
  console.log(chalk.yellow(lists.join('\n\r')));
}
module.exports = (...args) => {
  return list(...args).catch((err) => {
    logger.error(err);
  });
};
