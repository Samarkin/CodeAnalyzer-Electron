import * as path from 'path';
const appName = 'CodeAnalyzer';

before(function() {
  const rootPath = path.join(__dirname, '../..');
  const distPath = path.join(rootPath, 'dist');
  var electronPath: string;
  var packagePath: string;
  if (process.platform === 'darwin') {
    const appRoot = path.join(distPath, `${appName}-${process.platform}-${process.arch}/${appName}.app`);
    electronPath = path.join(appRoot, `Contents/MacOS/${appName}`);
    packagePath = path.join(appRoot, 'Contents/Resources/app');
  }
  else {
    throw Error(`No implementation for platform '${process.platform}'`);
  }
  this.electronAppOptions = {
    path: electronPath,
    args: [packagePath]
  };
})