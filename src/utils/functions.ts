import * as fs from 'fs';

export const deleteFile = (path: string) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log('file removed');
  });
};

export const createDirectory = (dir: string) => {
  if (!fs.existsSync(dir)) {
    return fs.mkdirSync(dir, { recursive: true });
  }
};
