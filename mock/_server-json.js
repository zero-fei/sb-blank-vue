const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');
const isFunction = require('lodash.isfunction');
const isArray = require('lodash.isarray');
const isObject = require('isobject');
const request = require('request');

// 递归获取文件夹中的json文件
function getJsonFilesInDirectory(dir, filters) {
  let files = [];
  try {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory() && file.match(/^[^.].*/)) {
        files = files.concat(getJsonFilesInDirectory(filePath, filters));
      } else if (file.match(/.json$/)) {
        if (file.match(/^.~/)) {
          // 删除临时文件
          fs.unlinkSync(filePath);
        } else {
          files.push(filePath);
        }
      } else if (file.match(/.js$/)) {
        const func = require(filePath); // eslint-disable-line
        if (func && (isFunction(func) || isArray(func))) {
          filters.push(func);
        }
      }
    });
  } catch (e) {
    console.info('err:', e);
  }
  return files;
}

// 获取mock/json文件夹中的所有json文件，每个文件为绝对路径
const filters = [];
const JSON_ROOT_DIRECTORY = path.join(__dirname + '/json'); // eslint-disable-line
const jsonsFiles = getJsonFilesInDirectory(JSON_ROOT_DIRECTORY, filters);
const urlMap = {};
jsonsFiles.map((file) => {
  // eslint-disable-line
  const json = require(file); // eslint-disable-line
  for (const key in json) {
    if (Object.hasOwnProperty.call(json, key)) {
      let originalUrl = `${getFileUrl(file, true)}/${key}`.replace(/[\/]+/g, '/'); // eslint-disable-line
      // 添加'forward'目录规则，修改url
      if (originalUrl.includes('forward')) {
        const temp = originalUrl.split('/');
        originalUrl = `/${temp[1]}/${temp[temp.length - 1]}`;
      }
      const redirectUrl = `${getFileUrl(file, false)}/${key}`.replace(/[\/]+/g, '/'); // eslint-disable-line
      urlMap[originalUrl] = redirectUrl;
    }
  }
});

function getFileUrl(file, isOrigin) {
  const filePaths = file
    .replace(JSON_ROOT_DIRECTORY, '')
    .replace('.json', '')
    .split(path.sep);
  let url;
  if (isOrigin) {
    url = `/${process.env.jsonServerPrefix || 'api'}/${filePaths.splice(0, filePaths.length - 1).join('/')}`;
  } else {
    url = `/jsonserver/${filePaths.join('/')}`;
  }
  url = url.replace(/[\/]+/g, '/'); // eslint-disable-line
  return url;
}

// 根据配置转发请求
function hook(options, req, bodyOperation, callback) {
  if (req.headers.flag === 1) {
    return false;
  }
  request(
    {
      ...options,
      headers: { ...options.headers, flag: 1 },
      form: options.params || { ...req.body }
    },
    (error, response) => {
      console.info('请求失败：', error);
      if (bodyOperation) {
        callback(error, bodyOperation(error, response));
      } else {
        return false;
      }
    }
  );
  return true;
}

function applyJsonServer(server) {
  server.use((req, res, next) => {
    const callback = function(error, response) {
      if (!error && response) {
        for (const key in response.headers) {
          if (Object.hasOwnProperty.call(response.headers, key)) res.setHeader(key, response.headers[key]);
        }
        res.statusCode = response.statusCode;
        res.send(response.body);
      } else {
        res.send(error);
      }
    };
    if (
      filters.some((filter) => {
        // eslint-disable-line
        if (isFunction(filter)) {
          // 函数扩展逻辑
          return filter(req, res, next, callback);
        } else if (isArray(filter)) {
          // 配置模式逻辑
          const item = filter.filter(
            (items) => items.url && req.url.match(items.url) && items.method === req.method
          )[0];
          if (item) {
            const { options, method, bodyOperation } = item;
            let params = isFunction(options) ? options(req).params || undefined : undefined;
            const option = isFunction(options) ? options(req).url || options(req) : options;
            let newOptions = {};
            if (isObject(option)) {
              let { url } = option;
              params = isFunction(url) ? url(req).params || undefined : undefined;
              url = isFunction(url) ? url(req).url || url(req) : url;
              newOptions = { ...options, url, params };
            } else {
              newOptions = {
                url: option,
                method
              };
            }
            return hook(newOptions, req, bodyOperation, callback);
          }
        }
      })
    ) {
      return;
    }

    // 根据json server路由规则匹配url并作重定向
    let relatedKey = '';
    const url = req.url.replace(/[\/]+/g, '/'); // eslint-disable-line
    for (const urlKey in urlMap) {
      if (
        Object.prototype.hasOwnProperty.call(urlMap, urlKey) &&
        url.indexOf(urlKey) === 0 &&
        relatedKey.length < urlKey.length
      ) {
        relatedKey = urlKey;
      }
    }
    if (relatedKey) {
      req.url = url.replace(relatedKey, urlMap[relatedKey]);
    } else if (req.url.indexOf('//') >= 0) {
      req.url = req.url.replace(/[\/]+/g, '/'); // eslint-disable-line
    }
    next();
  });
  // 根据json file定义路由
  jsonsFiles.map((file) => {
    // eslint-disable-line
    const routers = jsonServer.router(file);
    server.use(getFileUrl(file, false), routers);
  });
}

module.exports = applyJsonServer;
