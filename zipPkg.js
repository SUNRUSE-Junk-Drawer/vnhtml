import * as fs from "fs"
import * as path from "path"
import recursiveReaddir from "recursive-readdir"
import archiver from "archiver"

recursiveReaddir(`dist`, (error, files) => {
  if (error) {
    throw error
  }

  for (const file of files) {
    if (file.endsWith(`.js`)) {
      continue
    }

    if (file.endsWith(`.zip`)) {
      continue
    }

    const archive = archiver(`zip`)
    archive.file(file, { name: path.relative(`dist`, file) })
    const output = fs.createWriteStream(`${file}.zip`)
    output.on(`error`, error => {
      throw error
    })
    output.on(`close`, () => {
      fs.unlink(file, error => {
        if (error) {
          throw error
        }
      })
    })
    archive.pipe(output)
    archive.on(`warning`, error => console.warn(error))
    archive.on(`error`, error => {
      throw error
    })
    archive.finalize()
  }
})
