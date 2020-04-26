import {fs} from 'mz';
import * as path from 'path';
import { CodeFolderInfo, FilesByExtMap } from '../common/CodeFolder';

export class CodeFolder implements CodeFolderInfo {
  readonly totalFiles: number
  readonly path: string;
  readonly filesByExt: FilesByExtMap;

  constructor(obj: CodeFolderInfo) {
    if (!obj.path) {
      throw new Error("Empty path");
    }
    if (obj.totalFiles !== 0 && !obj.totalFiles) {
      throw new Error("Empty totalFiles");
    }
    if (!obj.filesByExt) {
      throw new Error("Empty filesByExt");
    }
    this.path = obj.path;
    this.totalFiles = obj.totalFiles;
    this.filesByExt = obj.filesByExt;
  }

  static async Analyze(folder: string): Promise<CodeFolderInfo> {
    const stat = await fs.stat(folder);
    if (!stat.isDirectory()) {
      throw new Error("Provided folder path is invalid");
    }
    const folders = [folder];
    const files: string[] = [];
    const filesByExt: FilesByExtMap = {};
    let f: string | undefined;
    while ((f = folders.pop())) {
      for (const filename of await fs.readdir(f)) {
        const file = path.join(f, filename);
        const stat = await fs.stat(file);
        if (stat.isDirectory()) {
          folders.push(file);
        }
        else if (stat.isFile()) {
          files.push(file);
          const ext = path.extname(file);
          filesByExt[ext] = (filesByExt[ext] || 0) + 1;
        }
      }
    }
    return {
      totalFiles: files.length,
      path: folder,
      filesByExt: filesByExt,
    };
  }
}