export interface FilesByExtMap {
  [ext: string] : number|undefined;
}

export interface CodeFolderInfo {
  readonly totalFiles: number;
  readonly path: string;
  readonly filesByExt: FilesByExtMap;
}
