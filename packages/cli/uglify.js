import * as fs from "fs"
import * as path from "path"
import recursiveReaddir from "recursive-readdir"
import * as uglifyJs from "uglify-js"

recursiveReaddir(`dist`, (error, files) => {
  if (error) {
    throw error
  }

  for (const file of files) {
    if (!file.endsWith(`.js`)) {
      continue
    }

    fs.readFile(
      file,
      { encoding: `utf8` },
      (error, data) => {
        if (error) {
          throw error
        }

        const uglified = uglifyJs.minify(data, {
          toplevel: true,
          compress: true,
          mangle: true
        })

        if (uglified.error) {
          throw uglified.error
        }

        fs.writeFile(file, uglified.code, error => {
          if (error) {
            throw error
          }
        })
      }
    )
  }
})
