require("fs").writeFile(
  "dist/bin.js",
  "#! /usr/bin/env node\nrequire(\"./vnhtml.min.js\")",
  function (err) {
    if (err) {
      throw err
    }
  }
)
