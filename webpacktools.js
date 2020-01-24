const path = require('path');
const tsConfig = require('./tsconfig');
const { resolvePath } = require('babel-plugin-module-resolver');

const getResolverAlias = projectDir => {
  const tsConfigFile = path.join(projectDir, 'tsconfig.json');
  const tsConfig = require(tsConfigFile);

  const tsConfigPaths =
    (tsConfig.compilerOptions && tsConfig.compilerOptions.paths) || {};

  // remove the "/*" at end of tsConfig paths key and values array
  let pathAlias = Object.keys(tsConfigPaths)
    .map(tsKey => {
      const pathArray = tsConfigPaths[tsKey];
      const key = tsKey.replace('/*', '');
      // make sure path starts with "./"
      const paths = pathArray.map(p => `./${p.replace('/*', '')}`);
      return { key, paths };
    })
    .reduce((obj, cur) => {
      obj[cur.key] = cur.paths; // eslint-disable-line no-param-reassign
      return obj;
    }, {});

  return pathAlias;
};

/**
 * Also add special resolving of the "src" tsconfig paths.
 * This is so "src" used within the common projects (eg within components) correctly resolves
 *
 * eg In app1 project if you import `@blah/components/Foo` which in turn imports `src/theme`
 * then for `@blah/components/Foo/Foo.tsx` existing module resolver incorrectly looks for src/theme`
 * within `app1` folder not `components`
 *
 * This now returns:`c:\git\Monorepo\components\src\theme`
 * Instead of: `c:\git\Monorepo\app1\src\theme`
 */
const fixResolvePath = projectDir => (
  sourcePath,
  currentFile,
  opts,
) => {
  const ret = resolvePath(sourcePath, currentFile, opts);
  if (!sourcePath.startsWith('~')) {
    return ret; // ignore non "src" dirs
  }
  if (!sourcePath.includes('/')) {
    sourcePath += '/index';
  }

  const aliases = getResolverAlias(projectDir);
  const sourceParts = sourcePath.split('/');
  sourceParts[0] = aliases[sourceParts[0]] || sourcePath[0];

  return path.join(
    projectDir,
    `./${sourceParts.join('/')}`,
  );
};

module.exports = {
  fixResolvePath,
  getResolverAlias,
};
