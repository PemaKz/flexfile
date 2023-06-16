const {readdir} = require('node:fs/promises')
const {join} =require('node:path')

module.exports = {
  getFilesAndSubfiles({ path, allowedExtensions = ['js'], avoidFiles = [] }){
    return new Promise(async (resolve, reject) => {
      try{
        const allFiles = await walk(path)
        let flatted = flatArray(allFiles)
        do {
          flatted = flatArray(flatted)
        } while (flatted.some(Array.isArray))
        let files = []
        for(let file of flatted){
          const fileBaseName = file.replace(path, ``).replace(/\\/g, '/').slice(1)
          const fileExtension = fileBaseName.split('.').pop()
          const fileWithoutExtension = fileBaseName.split('.').slice(0, -1).join('.')
          if(!allowedExtensions.includes('*')) {
            if(!allowedExtensions.includes(fileExtension)) continue
          }
          if(avoidFiles.includes(fileBaseName)) continue
          files.push(fileWithoutExtension || fileBaseName)
        }
        resolve(files)
      } catch (err) {
        reject(err)
      }
    })
  },
  getFilesAndFolders({ path, allowedExtensions = ['js'], avoidFiles = [] }){
    return new Promise(async (resolve, reject) => {
      try{
        let folders = []
        let files = []
        const filesInfo = await readdir(path, { withFileTypes: true })
        for(let file of filesInfo){
          if(file.isDirectory()) {
            folders.push(file.name)
            continue;
          } 
          const fileExtension = file.name.split('.').pop()
          if(!allowedExtensions.includes('*')) {
            if(!allowedExtensions.includes(fileExtension)) continue
          }
          if(avoidFiles.includes(file.name)) continue
            files.push(file.name)
        }
        resolve({ folders, files })
      } catch(e){
        reject(e)
      }
    })
  },
  getFiles({ path, allowedExtensions = ['js'], avoidFiles = [] }){
    return new Promise(async (resolve, reject) => {
      try{
        const filesInfo =  (await readdir(path, { withFileTypes: true }))
        let files = []
        for(let file of filesInfo){
          if(file.isDirectory()) continue;
          const fileExtension = file.name.split('.').pop()
          if(!allowedExtensions.includes('*')) {
            if(!allowedExtensions.includes(fileExtension)) continue
          }
          if(avoidFiles.includes(file.name)) continue
            files.push(file.name)
        }
        resolve(files)
      } catch (err) {
        reject(err)
      }
    })
  },
  getFolders({ path, avoidFolder = [] }){
    return new Promise(async (resolve, reject) => {
      try{
        const foldersInfo =  (await readdir(path, { withFileTypes: true }))
        let folders = []
        for(let folder of foldersInfo){
          if(!folder.isDirectory()) continue;
          if(avoidFolder.includes(folder.name)) continue
          folders.push(folder.name)
        }
        resolve(folders)
      } catch (err) {
        reject(err)
      }
    })
  },
  getFoldersAndSubfolders({ path, avoidFolders = [] }){
    return new Promise(async (resolve, reject) => {
      try{
        let folders = []
        folders.push({
          fetched: false,
          path,
        })
        do{
          for(let folder of folders){
            if(!folder.fetched){
              const fetchFolders = await this.getFolders({ path: folder.path, avoidFolder: avoidFolders })
              folder.fetched = true
              for(let fetchFolder of fetchFolders){
                folders.push({
                  fetched: false,
                  path: join(folder.path, fetchFolder)
                })
              }
            }
          }
        } while (folders.filter(folder => !folder.fetched).length > 0)
        resolve(folders.map(folder => folder.path.replace(path, ``).replace(/\\/g, '/').slice(1)).filter(folder => folder))
      } catch (err) {
        reject(err)
      }
    })
  }
}

const flatArray = (arr) => arr.reduce((acc, val) => acc.concat(val), [])

const walk = async (dirPath) => Promise.all(
  await readdir(dirPath, { withFileTypes: true }).then((entries) => entries.map((entry) => {
    const childPath = join(dirPath, entry.name)
    return entry.isDirectory() ? walk(childPath) : childPath
  })),
)

const walkFolders = async (dirPath) => Promise.all(
  await readdir(dirPath, { withFileTypes: true }).then((entries) => entries.map((entry) => {
    const childPath = join(dirPath, entry.name)
    return entry.isDirectory() ? walkFolders(childPath) : childPath
  }
  )),
)