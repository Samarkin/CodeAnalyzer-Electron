const electronPath = require('electron')
const path = require('path')

before(function() {
  this.electronAppOptions = {
    path: electronPath,
    args: [path.join(__dirname, '../..')]
  };
})