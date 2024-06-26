const pathToRegexp = require('path-to-regexp');

function compilePath(path, options) {
  const keys = [];
  const regexp = pathToRegexp(path, keys, options);
  return {keys, regexp};
}

/**
 * 把地址栏重的路径和属性中的path进行匹配，返回匹配结果
 * @param pathname 地址栏中的路径
 * @param options 属性对象
 */
function matchPath(pathname, options = {}) {
  const {path = '/', exact = false, strict = false, sensitive = false} = options;
  const {keys, regexp} = compilePath(path, {end: exact, strict, sensitive});
  const match = regexp.exec(pathname);

  if (!match) return null;

  const [url, ...groups] = match;
  const isExact = pathname === url;

  if (exact && !isExact) return null;

  return {
    path, // Route配置的路径
    url, // 正则匹配到的浏览器路径的部分
    isExact, // 是否精确匹配
    params: keys.reduce((memo, key, index) => { // 路径参数对象
      memo[key.name] = groups[index];
      return memo;
    }, {})
  };
}

export default matchPath;
