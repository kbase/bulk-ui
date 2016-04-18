export interface Folder {
    name: string;
    path: string,
    folderCount?: number;   // number of immediate children folders
    folders?: Folder[];     // recursive
    expanded?: boolean;
}
