import * as electronPath from 'electron';
import * as path from 'path';

before(function () {
  this.electronAppOptions = {
    path: electronPath,
    args: [path.join(__dirname, '..', '..', 'out')],
  };
});