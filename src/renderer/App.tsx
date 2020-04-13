import {remote, ipcRenderer} from 'electron';
import {CodeFolderInfo} from '../common/CodeFolder';
import * as React from 'react';
import { Box, Button, CircularProgress, Dialog, TextField, Typography } from '@material-ui/core';
import './App.css';
import { StatusBar } from './StatusBar';
import { DragAndDrop } from './DragAndDrop';
import { DropBox } from './DropBox';
import * as fs from '../common/async-fs';
import * as path from 'path';

interface AppState {
  selectedFolder?: string;
  statusText?: string;
  isLoading?: boolean;
  folderInfo?: CodeFolderInfo|null;
}

export default class App extends React.Component<{}, AppState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {};
  }

  componentDidMount(): void {
    ipcRenderer.on('folder-loaded', this.handleFolderLoaded);
    ipcRenderer.on('folder-error', this.handleFolderError);
    this.setState({statusText: 'Welcome'});
  }

  componentWillUnmount(): void {
    ipcRenderer.off('folder-loaded', this.handleFolderLoaded);
    ipcRenderer.off('folder-error', this.handleFolderError);
  }

  handleFolderLoaded = (event: Electron.IpcRendererEvent, arg: CodeFolderInfo): void => {
    this.setState({
      statusText: 'Folder open: ' + arg.path,
      folderInfo: arg,
      isLoading: false,
    });
  }

  handleFolderError = (event: Electron.IpcRendererEvent, err: unknown): void => {
    this.setState({
      statusText: 'Failed to open a folder: ' + err,
      folderInfo: null,
      isLoading: false,
    });
  }

  handleBrowseClick = async (): Promise<void> => {
    const v = await remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
      properties: ['openDirectory'],
    });
    if (v.canceled) {
      return;
    }
    const folder = v.filePaths[0];
    if (!folder) {
      return;
    }
    this.loadFiles(folder);
  }

  loadFiles(folder: string): void {
    this.setState({
      selectedFolder: folder,
      isLoading: true,
    });
    ipcRenderer.send('folder-load', folder);
  }

  async getFolderName(filepath: string): Promise<string> {
    const stats = await fs.stat(filepath);
    return stats.isDirectory() ? filepath : path.dirname(filepath);
  }

  onDrop = async (file: File): Promise<void> => {
    const folderName = await this.getFolderName(file.path);
    this.loadFiles(folderName);
  }

  render(): React.ReactNode {
    const {selectedFolder, isLoading, folderInfo, statusText} = this.state;
    return <>
      <DragAndDrop/>
      <Dialog open={isLoading === true}>
        <CircularProgress/>
      </Dialog>
      <Box display="flex" flexDirection="column" height='100%'>
        <Box display="flex" flex="row" width="100%">
          <Box flexGrow={1}>
            <TextField fullWidth value={selectedFolder} disabled/>
          </Box>
          <Button variant="contained" color="primary" onClick={this.handleBrowseClick}>
            Browse
          </Button>
        </Box>
        <Box flexGrow={1}>
          <DropBox onDrop={this.onDrop}>
            {folderInfo 
              ? <Typography>{`${folderInfo.totalFiles} total files`}</Typography>
              : <Typography>Drop something here</Typography>
            }
          </DropBox>
        </Box>
        <StatusBar text={statusText}/>
      </Box>
    </>;
  }
}