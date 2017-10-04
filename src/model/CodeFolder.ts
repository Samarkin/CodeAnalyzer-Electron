import {fs} from 'mz';

export interface CodeFolderInfo {
  readonly totalFiles: number;
  readonly path: string;
}

export class CodeFolder implements CodeFolderInfo {
  readonly totalFiles: number
  readonly path: string;

  constructor(obj: CodeFolderInfo) {
    if (!obj.path) {
      throw new Error("Empty _path");
    }
    if (obj.totalFiles !== 0 && !obj.totalFiles) {
      throw new Error("Empty _totalFiles");
    }
    this.path = obj.path;
    this.totalFiles = obj.totalFiles;
  }

  static async Analyze(folder: string): Promise<CodeFolderInfo> {
    let stat = await fs.stat(folder);
    if (!stat.isDirectory()) {
      throw new Error("Provided folder path is invalid");
    }
    let files = await fs.readdir(folder);
    return {
      totalFiles: files.length,
      path: folder
    }
  }
}