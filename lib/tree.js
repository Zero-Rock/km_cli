/**
 * Created by 枯荣<panjiankang@cai-inc.com> on 2018-12-03 20:30.
 */
const fs = require('fs');
// const chalk = require('chalk');
// const { logger } = require('./utils');
const path = require('path');

let level = 1;
const extArr = ['.git', '.idea', '.vscode'];
function list(rootPath, filesList, targetObj, option) {
  const files = fs.readdirSync(rootPath);
  let lists = files;
  if (!option.all) {
    lists = files.filter(file => file.indexOf('.') !== 0);
  }
  lists = lists.filter(file => extArr.indexOf(file) === -1);
  if (option.ext) {
    lists = lists.filter(file => file !== option.ext);
  }
  lists.map((file) => {
    const fpath = path.resolve(rootPath, file);
    const states = fs.statSync(fpath);
    if (states.isDirectory()) {
      let item;
      if (targetObj.level) {
        level = targetObj.level + 1;
      } else {
        level = 1;
      }
      if (targetObj.children) {
        item = { name: file, children: [], level };
        targetObj.children.push(item);
      } else {
        item = { name: file, children: [], level };
        filesList.push(item);
      }
      list(fpath, filesList, item, option);
    } else if (states.isFile()) {
      if (targetObj.level) {
        level = targetObj.level + 1;
      } else {
        level = 1;
      }
      if (targetObj.children) {
        const item = { name: file, value: fpath, level };
        targetObj.children.push(item);
      } else {
        const item = { name: file, value: fpath, level };
        filesList.push(item);
      }
    }
  });
}

const geFileList = (paths, options) => {
  const filesList = [];
  const targetObj = {};
  list(paths, filesList, targetObj, options);
  return filesList;
};


const print = (data) => {
  const Len = data.length;
  data.map((item, index) => {
    const { children = [], name, level: LEVEL } = item;
    let blankStr = '';
    if (LEVEL > 1) {
      const bArr = new Array(LEVEL).fill(' ');
      blankStr = `│${bArr.join('')}`;
    }
    if (children.length) {
      if (index === Len - 1) {
        console.log(`${blankStr}└─ ${name}`);
      } else {
        console.log(`${blankStr}├─ ${name}`);
      }
      print(children);
    } else if (index === Len - 1) {
      console.log(`${blankStr}└─ ${name}`);
    } else {
      console.log(`${blankStr}├─ ${name}`);
    }
  });
};
const generateTree = (paths, option) => {
  const data = geFileList(paths, option);
  print(data);
};
module.exports = generateTree;
