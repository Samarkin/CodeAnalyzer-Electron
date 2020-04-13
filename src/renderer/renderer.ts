import {remote, ipcRenderer, OpenDialogReturnValue} from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { CodeFolderInfo } from '../common/CodeFolder';

const getBrowseButton = (): HTMLButtonElement => document.getElementById('browse-button') as HTMLButtonElement;
const getSelectedFolderSpan = (): HTMLButtonElement => document.getElementById('selected-folder') as HTMLButtonElement;
const getContentDiv = (): HTMLSpanElement => document.getElementById('content') as HTMLSpanElement;
const getStatusSpan = (): HTMLSpanElement => document.getElementById('status') as HTMLSpanElement;
const getOverlayDiv = (): HTMLDivElement => document.getElementById('overlay')as HTMLDivElement;

function loadFiles(folder: string): void {
  getSelectedFolderSpan().innerHTML = folder;
  ipcRenderer.send('folder-load', folder);
  getOverlayDiv().classList.remove('hidden');
}

ipcRenderer.on('folder-loaded', function (event: Electron.IpcRendererEvent, arg: CodeFolderInfo) {
  getContentDiv().innerText = '' + arg.totalFiles + " total files";
  getStatusSpan().innerText = 'Folder open: ' + arg.path;
  getOverlayDiv().classList.add('hidden');
});

ipcRenderer.on('folder-error', function (event: Electron.IpcRendererEvent, err: any) {
  getContentDiv().innerText = '';
  getStatusSpan().innerText = 'Failed to open a folder: ' + err;
  getOverlayDiv().classList.add('hidden');
});

function browseClick(): void {
  remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
    properties: ['openDirectory'],
  }).then(function (v: OpenDialogReturnValue) {
    if (v.canceled) {
      return;
    }
    const folder = v.filePaths[0];
    if (!folder) {
      return;
    }
    loadFiles(folder);
  });
}

function getFolder(filepath: string, callback: (err?: NodeJS.ErrnoException, folder?: string) => void): void {
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
document.ondragover = document.ondrop = (event): void => {
  event.preventDefault();
};

window.onload = (): void => {
  getBrowseButton().addEventListener('click', browseClick);

  getContentDiv().addEventListener('dragenter', () => {
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
    const path = ev.dataTransfer.files[0].path;
    getFolder(path, (err, folder) => {
      if (!err && folder) {
        loadFiles(folder);
      }
    });
  });
};