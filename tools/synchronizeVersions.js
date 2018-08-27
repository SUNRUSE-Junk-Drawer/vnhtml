import * as path from "path"
import * as fs from "fs"

const version = `0.0.17`

fs.readdir(path.join(`..`, `packages`), (error, files) => {
  if (error) {
    throw error
  }

  files.forEach(file => fs.stat(path.join(`..`, `packages`, file), (error, stats) => {
    if (error) {
      throw error
    }

    if (!stats.isDirectory()) {
      return
    }

    fs.readFile(path.join(`..`, `packages`, file, `package.json`), { encoding: `utf8` }, (error, data) => {
      if (error) {
        throw error
      }

      const json = JSON.parse(data)

      json.version = version

      const forObject = object => {
        for (const key in object) {
          if (!/^@vnhtml\/.*$/i.test(key)) {
            continue
          }

          object[key] = version
        }
      }

      forObject(json.dependencies)
      forObject(json.devDependencies)
      forObject(json.peerDependencies)

      fs.writeFile(path.join(`..`, `packages`, file, `package.json`), JSON.stringify(json, null, 2) + `\n`, error => {
        if (error) {
          throw error
        }
      })
    })
  }))
})
