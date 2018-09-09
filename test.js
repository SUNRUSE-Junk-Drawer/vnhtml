var lexer = require("./packages/lexer/index.babel.js")
var parser = require("./packages/parser/index.babel.js")
var fs = require("fs")

var parserState = parser.create(
  "The name of the file being parsed",
  "A context for the parsing",
  onError,
  function onEndOfFile(context, parsed) {
    console.log("End of file; context " + JSON.stringify(context) + ", collected:")
    console.log(JSON.stringify(parsed, null, 2))
  }
)

var lexerState = lexer.create(parserState, parser.line, parser.indent, parser.outdent, onError, parser.endOfFile)
fs.readFile("./example.vnh", { encoding: "utf8" }, function (err, data) {
  if (err) {
    throw err
  }
  lexer.text(lexerState, data)
  lexer.endOfFile(lexerState)
})

function onError(context, line, message) {
  console.log(
    "Error; context " + JSON.stringify(context)
    + ", line " + line
    + ", message " + JSON.stringify(message)
  )
}
