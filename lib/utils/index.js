/**
 * Created by 枯荣<panjiankang@cai-inc.com> on 2018-12-03 11:18.
 */
const { get, set, unset } = require('./configOperate');
const { launch } = require('./launch');
// const { error, info, done } = require('./logger');
const logger = require('./logger');

exports.set = set;
exports.get = get;
exports.logger = logger;
exports.unset = unset;
exports.launch = launch;
Object.assign(exports, logger);
