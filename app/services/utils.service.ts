import * as fs from 'file-system';

export class UtilsService {
 
  public static getFilename(path: string) {
    let parts = path.split('/');
    return parts[parts.length - 1];
  }

  public static documentsPath(filename: string) {
    return `${fs.knownFolders.documents().path}/${filename}`;
  }
}
