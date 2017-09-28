import {remote} from 'electron';

let getBrowseButton = function () : HTMLButtonElement { return <HTMLButtonElement> document.getElementById('browse-button'); }
let getSelectedFolderSpan = function() : HTMLSpanElement { return <HTMLDivElement> document.getElementById('selected-folder'); }

function loadFiles(folder: string) {
  getSelectedFolderSpan().innerHTML = folder;
}

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

window.onload = (event) => {
  getBrowseButton().addEventListener('click', () => browseClick());
}