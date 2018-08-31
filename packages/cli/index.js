#! /usr/bin/env node

import commander from "commander"

const command = commander
  .version(`0.0.19`)
  .description(`Generates HTML/CSS visual novels from a basic scripting language`)
  .option(`-w --watch`, `recompile on changes`)
  .option(`-s --script [path]`, `the script to parse`)
  .option(`-h --html [path]`, `write a html file`)
  .option(`-hsl --html-size-limit [bytes]`, `specifies a size limit for the html file`)
  .option(`-z --zip [path]`, `write a zip file`)
  .option(`-zsl --zip-size-limit [bytes]`, `specifies a size limit for the zip file`)
  .parse(process.argv)

switch (command.script) {
  case undefined:
    if (!command.args.length) {
      console.error(`Missing script path`)
      process.exit(1)
    } else if (command.args.length > 1) {
      console.error(`Multiple script paths: ${command.args.map(arg => JSON.stringify(arg)).join(`, `)}`)
      process.exit(1)
    }
    command.script = command.args[0]
    break

  case false:
  case true:
    console.error(`Missing script path`)
    process.exit(1)

  default:
    if (command.args.length) {
      console.error(`Unexpected arguments: ${command.args.map(arg => JSON.stringify(arg)).join(`, `)}`)
      process.exit(1)
    }
}

switch (command.html) {
  case false:
  case true:
    console.error(`Missing html path`)
    process.exit(1)
}

switch (command.htmlSizeLimit) {
  case undefined:
    break

  case false:
  case true:
    console.error(`Missing html size limit`)
    process.exit(1)

  default:
    if (!/^\d+$/.test(command.htmlSizeLimit)) {
      console.error(`Non-integer html size limit`)
      process.exit(1)
    }

    command.htmlSizeLimit = parseInt(command.htmlSizeLimit)
}

switch (command.zip) {
  case false:
  case true:
    console.error(`Missing zip path`)
    process.exit(1)
}

switch (command.zipSizeLimit) {
  case undefined:
    break

  case false:
  case true:
    console.error(`Missing zip size limit`)
    process.exit(1)

  default:
    if (!/^\d+$/.test(command.zipSizeLimit)) {
      console.error(`Non-integer zip size limit`)
      process.exit(1)
    }

    command.zipSizeLimit = parseInt(command.zipSizeLimit)
}
