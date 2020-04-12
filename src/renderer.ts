import {remote, ipcRenderer, OpenDialogReturnValue} from 'electron';
import {CodeFolder, CodeFolderInfo} from './model/CodeFolder';
import * as fs from 'fs';
import * as path from 'path';

let getBrowseButton = () => <HTMLButtonElement> document.getElementById('browse-button');
let getSelectedFolderSpan = () => <HTMLDivElement> document.getElementById('selected-folder');
let getContentDiv = () => <HTMLSpanElement> document.getElementById('content');
let getStatusSpan = () => <HTMLSpanElement> document.getElementById('status');
let getOverlayDiv = () => <HTMLDivElement> document.getElementById('overlay');

function loadFiles(folder: string) {
  getSelectedFolderSpan().innerHTML = folder;
  ipcRenderer.send('folder-load', folder);
  getOverlayDiv().classList.remove('hidden');
}

ipcRenderer.on('folder-loaded', function(event: Electron.IpcRendererEvent, arg: CodeFolderInfo) {
  let f = new CodeFolder(arg);
  getContentDiv().innerText = '' + f.totalFiles + " total files";
  getStatusSpan().innerText = 'Folder open: ' + f.path;
  getOverlayDiv().classList.add('hidden');
});

ipcRenderer.on('folder-error', function(event: Electron.IpcRendererEvent, err: any) {
  getContentDiv().innerText = '';
  getStatusSpan().innerText = 'Failed to open a folder: ' + err;
  getOverlayDiv().classList.add('hidden');
});

function browseClick() {
  remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
    properties: ['openDirectory']
  }).then(function (v: OpenDialogReturnValue) {
    if (v.canceled) {
      return;
    }
    let folder = v.filePaths[0];
    if (!folder) {
      return;
    }
    loadFiles(folder);
  })
}

function getFolder(filepath: string, callback: (err?: NodeJS.ErrnoException, folder?: string) => void) {
  fs.stat(filepath, (err, stats) => {
    if (err) {
      callback(err);
      return;
    }
    if (!stats.isDirectory()) {
       callback(undefined, path.dirname(filepath));
    }
    else {
      callback(undefined, filepath);
    }
  });
}

// Handle files drag-n-dropped onto the browser window, so that Electron doesn't leave the page and
// load that file natively instead.
document.ondragover = document.ondrop = (event) => {
  event.preventDefault();
};

window.onload = () => {
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
    if (!ev.dataTransfer) {
      return;
    }
    let path = ev.dataTransfer.files[0].path;
    getFolder(path, (err, folder) => {
      if (!err && folder) {
        loadFiles(folder);
      }
    });
  });
}