/**
 * Created by 枯荣<panjiankang@cai-inc.com> on 2018-12-03 11:17.
 */
const fs = require('fs-extra');
const path = require('path');
const homedir = require('os').homedir();
const { get, set, unset, launch, logger } = require('./utils');

const { error, info, done } = logger;

async function config(value, options) {
  const file = path.resolve(homedir, '.kmrc');
  const isexit = await fs.pathExists(file);
  if (!isexit) {
    await fs.ensureFile(file);
    await fs.writeFile(file, JSON.stringify({}, null, 2), 'utf-8');
  }
  const configs = await fs.readJson(file);
  if (!options.delete && !options.get && !options.edit && !options.set) {
    if (options.json) {
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
      info(JSON.stringify({
        values,
      }));
    } else {
      info(values);
    }
  }

  if (options.delete) {
    unset(configs, options.delete);
    await fs.writeFile(file, JSON.stringify(configs, null, 2), 'utf-8');
    if (options.json) {
      info(JSON.stringify({
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
    error(`Make sure you define a value for the option ${options.set}`);
    return false;
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
      info(JSON.stringify({
        updated: options.set,
      }));
    } else {
      done(`You have updated the option: ${options.set} to ${value}`);
    }
  }
}

module.exports = (...args) => {
  return config(...args).catch((err) => {
    error(err);
    if (!process.env.KM_CLI_MODE_DEV) {
      process.exit(1);
    }
  });
};

