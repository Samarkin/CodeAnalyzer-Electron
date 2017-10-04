import {remote, ipcRenderer} from 'electron';
import CodeFolder from './model/CodeFolder';
import fs = require('fs');
import path = require('path');

let getBrowseButton = () => <HTMLButtonElement> document.getElementById('browse-button');
let getSelectedFolderSpan = () => <HTMLDivElement> document.getElementById('selected-folder');
let getContentDiv = () => <HTMLSpanElement> document.getElementById('content');
let getStatusSpan = () => <HTMLSpanElement> document.getElementById('status');

function loadFiles(folder: string) {
  getSelectedFolderSpan().innerHTML = folder;
  ipcRenderer.send('folder-load', folder);
}

ipcRenderer.on('folder-loaded', function(event: Electron.IpcMessageEvent, arg: any) {
  let f = CodeFolder.Deserialize(arg);
  getContentDiv().innerText = '' + f.totalFiles + " total files";
  getStatusSpan().innerText = 'Folder open: ' + f.path;
});

ipcRenderer.on('folder-error', function(event: Electron.IpcMessageEvent, err: any) {
  getContentDiv().innerText = '';
  getStatusSpan().innerText = 'Failed to open a folder: ' + err;
});

function browseClick() {
  remote.dialog.showOpenDialog({
    properties: ['openDirectory']
  }, function (files: string[] | undefined) {
    if (!files) {
      return;
    }
    let folder = files[0];
    if (!folder) {
      return;
    }
    loadFiles(folder);
  })
}

function getFolder(filepath: string, callback: (err: NodeJS.ErrnoException, folder?: string) => void) {
  fs.stat(filepath, (err, stats) => {
    if (err) {
      callback(err);
      return;
    }
    if (!stats.isDirectory()) {
       callback(err, path.dirname(filepath));
    }
    else {
      callback(err, filepath);
    }
  });
}

// Handle files drag-n-dropped onto the browser window, so that Electron doesn't leave the page and
// load that file natively instead.
document.ondragover = document.ondrop = (event) => {
  event.preventDefault();
};

window.onload = (event) => {
  getBrowseButton().addEventListener('click', browseClick);

  getContentDiv().addEventListener('dragenter', ev => {
    getContentDiv().classList.add('dragging');
  });

  getContentDiv().addEventListener('dragleave', () => {
    getContentDiv().classList.remove('dragging');
  });

  getContentDiv().addEventListener('drop', ev => {
    ev.preventDefault();
    getContentDiv().classList.remove('dragging');
    let path = ev.dataTransfer.files[0].path;
    getFolder(path, (err, folder) => {
      if (!err && folder) {
        loadFiles(folder);
      }
    });
  });
}