/**
 * Created by 枯荣<panjiankang@cai-inc.com> on 2018-12-03 15:11.
 */
const chalk = require('chalk');
const readline = require('readline');
const padStart = require('string.prototype.padstart');
const EventEmitter = require('events');

exports.events = new EventEmitter();

function LOG(type, tag, message) {
  console.log({ type, tag, message });
  if (process.env.KM_CLI_MODE && message) {
    exports.events.emit('log', {
      message,
      type,
      tag,
    });
  }
}

const format = (label, msg) => {
  return msg.split('\n').map((line, i) => {
    return i === 0
      ? `${label} ${line}`
      : padStart(line, chalk.reset(label).length);
  }).join('\n');
};

const chalkTag = msg => chalk.bgBlackBright.white.dim(` ${msg} `);

exports.log = (msg = '', tag = null) => {
  tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg);
  LOG('log', tag, msg);
};

exports.info = (msg, tag = null) => {
  console.log(format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg));
  LOG('info', tag, msg);
};

exports.done = (msg, tag = null) => {
  console.log(format(chalk.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ''), msg));
  LOG('done', tag, msg);
};

exports.warn = (msg, tag = null) => {
  console.warn(format(chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), chalk.yellow(msg)));
  LOG('warn', tag, msg);
};

exports.error = (msg, tag = null) => {
  console.error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg)));
  LOG('error', tag, msg);
  if (msg instanceof Error) {
    console.error(msg.stack);
    LOG('error', tag, msg.stack);
  }
};

exports.clearConsole = (title) => {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    if (title) {
      console.log(title);
    }
  }
};

// silent all logs except errors during tests and keep record
if (process.env.KM_CLI_MODE) {
  require('./_silence')('logs', exports);
}
