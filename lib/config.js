/**
 * Created by 枯荣<panjiankang@cai-inc.com> on 2018-12-03 11:17.
 */
const fs = require('fs-extra');
const path = require('path');
const homedir = require('os').homedir();
const { get, set, unset, error, info, launch } = require('./utils');

async function config(value, options) {
  const file = path.resolve(homedir, '.kmrc');
  const configs = await fs.readJson(file);
  if (!options.delete && !options.get && !options.edit && !options.set) {
    if (options.json) {
      info('qwsdfs');
      console.debug(info);
      console.log('get JSON');
      info(JSON.stringify({
        resolvedPath: file,
        content: configs,
      }));
    } else {
      info(`Resolved path: ${file}\n`, JSON.stringify(configs, null, 2));
    }
  }

  if (options.get) {
    const values = get(configs, options.get);
    if (options.json) {
      console.log(JSON.stringify({
        values,
      }));
    } else {
      console.log(values);
    }
  }

  if (options.delete) {
    unset(configs, options.delete);
    await fs.writeFile(file, JSON.stringify(configs, null, 2), 'utf-8');
    if (options.json) {
      console.log(JSON.stringify({
        deleted: options.delete,
      }));
    } else {
      info(`You have removed the option: ${options.delete}`);
    }
  }

  if (options.edit) {
    launch(file);
  }

  if (options.set && !value) {
    throw new Error(`Make sure you define a value for the option ${options.set}`);
  }

  if (options.set && value) {
    set(configs, options.set, value);

    if (value.match('[0-9]')) {
      set(configs, options.set, parseInt(value, 10));
    }

    if (value === 'true') {
      set(configs, options.set, true);
    }

    if (value === 'false') {
      set(configs, options.set, false);
    }

    await fs.writeFile(file, JSON.stringify(configs, null, 2), 'utf-8');
    if (options.json) {
      console.log(JSON.stringify({
        updated: options.set,
      }));
    } else {
      info(`You have updated the option: ${options.set} to ${value}`);
    }
  }
}

module.exports = (...args) => {
  return config(...args).catch((err) => {
    error(err);
    if (!process.env.KM_CLI_MODE) {
      process.exit(1);
    }
  });
};

