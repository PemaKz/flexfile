# FlexFile

A Node.js package for handling files and folders in a directory.

## Installation
Use npm to install the package:

```bash
npm install flexfile
```

## Usage
Import the package in your Node.js project:

```javascript
const flexFile = require('flexfile');
```

### getFilesAndSubfiles
Recursively retrieves all files and subfiles in a directory.

```javascript
fileUtils.getFilesAndSubfiles({
  path: '/path/to/directory',
  allowedExtensions: ['js', 'txt'], // Optional. Specify the allowed file extensions. Default is ['js'].
  avoidFiles: ['example.js'] // Optional. Specify files to avoid. Default is an empty array.
})
  .then(files => {
    console.log(files);
  })
  .catch(error => {
    console.error(error);
  });
```
### getFilesAndFolders
Retrieves both files and folders in a directory.

```javascript
fileUtils.getFilesAndFolders({
  path: '/path/to/directory',
  allowedExtensions: ['js', 'txt'], // Optional. Specify the allowed file extensions. Default is ['js'].
  avoidFiles: ['example.js'], // Optional. Specify files to avoid. Default is an empty array.
})
  .then(result => {
    console.log('Folders:', result.folders);
    console.log('Files:', result.files);
  })
  .catch(error => {
    console.error(error);
  });
```
### getFiles
Retrieves only files in a directory.

```javascript
fileUtils.getFiles({
  path: '/path/to/directory',
  allowedExtensions: ['js', 'txt'], // Optional. Specify the allowed file extensions. Default is ['js'].
  avoidFiles: ['example.js'], // Optional. Specify files to avoid. Default is an empty array.
})
  .then(files => {
    console.log(files);
  })
  .catch(error => {
    console.error(error);
  });
```
### getFolders
Retrieves only folders in a directory.

```javascript
fileUtils.getFolders({
  path: '/path/to/directory',
  avoidFolder: ['node_modules'] // Optional. Specify folders to avoid. Default is an empty array.
})
  .then(folders => {
    console.log(folders);
  })
  .catch(error => {
    console.error(error);
  });
```
### getFoldersAndSubfolders
Recursively retrieves all folders and subfolders in a directory.

```javascript
fileUtils.getFoldersAndSubfolders({
  path: '/path/to/directory',
  avoidFolders: ['node_modules'] // Optional. Specify folders to avoid. Default is an empty array.
})
  .then(folders => {
    console.log(folders);
  })
  .catch(error => {
    console.error(error);
  });
```
## License
This project is licensed under the MIT License.