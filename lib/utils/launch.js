/**
 * Created by 枯荣<panjiankang@cai-inc.com> on 2018-12-03 15:06.
 */
const launch = require('launch-editor');
const logger = require('./logger');

exports.launch = (...args) => {
  const file = args[0];
  logger.log(`Opening ${file}...`);
  let cb = args[args.length - 1];
  if (typeof cb !== 'function') {
    cb = null;
  }
  launch(...args, (fileName, errorMessage) => {
    logger.error(`Unable to open '${fileName}'`, errorMessage);
    logger.info('Try setting the EDITOR env variable. More info: https://github.com/yyx990803/launch-editor');

    if (cb) cb(fileName, errorMessage);
  });
};
