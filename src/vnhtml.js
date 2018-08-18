
import commander from "commander"

const command = commander
  .version(`0.0.1`)
  .description(`Generates HTML/CSS visual novels from a basic scripting language`)
  .option(`-w --watch`, `recompile on changes`)
  .option(`-s --script [path]`, `the script to parse`)
  .option(`-h --html [path]`, `write a html file`)
  .option(`-z --zip [path]`, `write a zip file`)
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

switch (command.zip) {
  case false:
  case true:
    console.error(`Missing zip path`)
    process.exit(1)
}
