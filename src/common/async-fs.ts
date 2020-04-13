import * as fs from 'fs';

export type PathLike = fs.PathLike;
export type Stats = fs.Stats;

export function stat(path: PathLike): Promise<Stats> {
  return new Promise<Stats>(function (resolve, reject) {
    fs.stat(path, (err, stats) => {
      if (err) reject(err);
      else resolve(stats);
    });
  });
}