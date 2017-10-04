import {fs} from 'mz';

export default class CodeFolder {
  private _totalFiles: number
  private _path: string;

  private constructor() {
  }

  static Deserialize(obj: any) {
    let result = new CodeFolder();
    if (!obj._path) {
      throw new Error("Empty _path");
    }
    result._path = obj._path;
    if (obj._totalFiles !== 0 && !obj._totalFiles) {
      throw new Error("Empty _totalFiles");
    }
    result._totalFiles = obj._totalFiles;
    return result;
  }

  static async Analyze(folder: string): Promise<CodeFolder> {
    let stat = await fs.stat(folder);
    if (!stat.isDirectory()) {
      throw new Error("Provided folder path is invalid");
    }
    let result = new CodeFolder();
    let files = await fs.readdir(folder);
    result._totalFiles = files.length;
    result._path = folder;
    return result;
  }

  get totalFiles(): number {
    return this._totalFiles;
  }

  get path(): string {
    return this._path;
  }
}