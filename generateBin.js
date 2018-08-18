require("fs").writeFile(
  "dist/bin.js",
  "#! /usr/bin/env node\nrequire(\"./vnhtml.js\")",
  function (err) {
    if (err) {
      throw err
    }
  }
)
