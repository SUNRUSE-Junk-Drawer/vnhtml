require("fs").writeFile(
  "dist/stub.js",
  "#! /usr/bin/env node\nrequire(\"./vnhtml.min.js\")",
  function (err) {
    if (err) {
      throw err
    }
  }
)
