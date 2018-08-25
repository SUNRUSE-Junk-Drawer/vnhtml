# @vnhtml/lexer

A module which performs "SAX-like" streaming lexing of vnhtml scripts.

## Example

```javascript
var lexer = require("@vnhtml/lexer")

var state = lexer.create(
  "A context for the lexing",
  function onLine(context, line, text, lexed) {
    console.log(
      "Line; context " + JSON.stringify(context)
      + ", line " + line
      + ", text " + JSON.stringify(text)
      + ", lexed " + JSON.stringify(lexed)
    )
  },
  function onIndent(context, line) {
    console.log(
      "Indent; context " + JSON.stringify(context)
      + ", line " + line
    )
  },
  function onOutdent(context, line) {
    console.log(
      "Outdent; context " + JSON.stringify(context)
      + ", line " + line
    )
  },
  function onError(context, line, message) {
    console.log(
      "Error; context " + JSON.stringify(context)
      + ", line " + line
      + ", message " + JSON.stringify(message)
    )
  },
  function onEndOfFile(context) {
    console.log("End of file")
  }
)

lexer.text(
  state,
      "James: This is example script."
  + "\nA free-text line looks like this."
  + "\nif exampleFlag exampleValue"
  + "\n  James: exampleFlag is exampleValue!"
  + "\n  James: A subsequent line."
  + "\n James: This is an error, because the outdent is inconsistent."
  + "\n  James: However, errors do not block parsing."
  + "\nJames: See?"
)

var finalLine = "\n  Characters can also be supplied one-by-one."
for (var i = 0; i < finalLine.length; i++) {
  lexer.character(state, finalLine.charAt(i))
}

lexer.endOfFile(state)
```

### Output

```
TODO
```

## Exception handling

Should any callback throw an exception, further calls to `character`, `text` and
`endOfFile` will be rejected for that lexer state.

## Examples of `onLine` `lexed`

| vnhtml                                       | `onLine` `lexed`                                                                                             |
|----------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| `Unlexable`                                  | `null`                                                                                                       |
| `Jeff:`                                      | `{ line: { characters: ["Jeff"] } }`                                                                         |
| `Jeff Jake and Phil:`                        | `{ line: { characters: ["Jeff", "Jake", "Phil"] } }`                                                         |
| `Jeff (flatly):`                             | `{ lineWithEmote: { characters: ["Jeff"], emote: "flatly" } }`                                               |
| `Jeff Jake and Phil (flatly):`               | `{ lineWithEmote: { characters: ["Jeff", "Jake", "Phil"], emote: "flatly" } }`                               |
| `Jeff: Hello, world!`                        | `{ lineWithText: { characters: ["Jeff"], text: "Hello, world!" } }`                                          |
| `Jeff Jake and Phil: Hello, world!`          | `{ lineWithText: { characters: ["Jeff", "Jake", "Phil"], text: "Hello, world!" } }`                          |
| `Jeff is bewildered`                         | `{ emote: { characters: ["Jeff"], emote: "bewildered" } }`                                                   |
| `Jeff Jake and Phil are bewildered`          | `{ emote: { characters: ["Jeff", "Jake", "Phil"], emote: "bewildered" } }`                                   |
| `Jeff leaves`                                | `{ leave: { characters: ["Jeff"] } }`                                                                        |
| `Jeff Jake and Phil leave`                   | `{ leave: { characters: ["Jeff", "Jake", "Phil"] } }`                                                        |
| `Jeff (flatly): Hello, world!`               | `{ lineWithEmoteAndText: { characters: ["Jeff"], emote: "flatly", text: "Hello, world!" } }`                 |
| `Jeff Jake and Phil (flatly): Hello, world!` | `{ lineWithEmoteAndText: { characters: ["Jeff", "Jake", "Phil"], emote: "flatly", text: "Hello, world!" } }` |
| `set exampleFlag exampleValue`               | `{ set: { flag: "exampleFlag", value: "exampleValue" } }`                                                    |
| `if exampleFlag exampleValue`                | `{ if: { flag: "exampleFlag", value: "exampleValue" } }`                                                     |
| `else if exampleFlag exampleValue`           | `{ elseIf: { flag: "exampleFlag", value: "exampleValue" } }`                                                 |
| `else`                                       | `{ else: {} }`                                                                                               |
| `menu`                                       | `{ menu: {} }`                                                                                               |
| `label exampleName`                          | `{ label: { name: "exampleName" } }`                                                                         |
| `go to exampleLabel`                         | `{ goTo: { label: "exampleLabel" } }`                                                                        |
| `exampleName in background`                  | `{ background: { name: "exampleName" } }`                                                                    |
| `include exampleName`                        | `{ include: { name: "exampleName" } }`                                                                       |
