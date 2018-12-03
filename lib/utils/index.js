/**
 * Created by 枯荣<panjiankang@cai-inc.com> on 2018-12-03 11:18.
 */
const { get, set, unset } = require('./configOperate');
const { launch } = require('./launch');
const { error, info } = require('./logger');

exports.set = set;
exports.get = get;
exports.error = error;
exports.info = info;
exports.unset = unset;
exports.launch = launch;
exports.launch = launch;
// Object.assign(exports, logger);
