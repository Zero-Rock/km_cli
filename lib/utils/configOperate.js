/**
 * Created by 枯荣<panjiankang@cai-inc.com> on 2018-12-03 11:21.
 */
exports.set = function (target, path, value) {
  const fields = path.split('.');
  let obj = target;
  const l = fields.length;
  for (let i = 0; i < l - 1; i++) {
    const key = fields[i];
    if (!obj[key]) {
      obj[key] = {};
    }
    obj = obj[key];
  }
  obj[fields[l - 1]] = value;
};

exports.get = function (target, path) {
  const fields = path.split('.');
  let obj = target;
  const l = fields.length;
  for (let i = 0; i < l - 1; i++) {
    const key = fields[i];
    if (!obj[key]) {
      return undefined;
    }
    obj = obj[key];
  }
  return obj[fields[l - 1]];
};

exports.unset = function (target, path) {
  const fields = path.split('.');
  let obj = target;
  const l = fields.length;
  const objs = [];
  for (let i = 0; i < l - 1; i++) {
    const key = fields[i];
    if (!obj[key]) {
      return;
    }
    objs.splice(0, 0, { obj, key, value: obj[key] });
    obj = obj[key];
  }
  delete obj[fields[l - 1]];
  // 清空空对象
  for (const { obj1, key, value } of objs) {
    if (!Object.keys(value).length) {
      delete obj1[key];
    }
  }
};
