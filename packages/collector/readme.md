# @vnhtml/collector

A module which takes raw statements from
[@vnhtml/lexer](https://www.npmjs.com/package/@vnhtml/lexer) and lists every:

- Included script.
- Background.
- Character, with a list of their emotes.
- Flag, with a list of their values.

## Example

```javascript
var lexer = require("@vnhtml/lexer")
var collector = require("@vnhtml/collector")

var collectorState = collector.create(
  "A context for the collection",
  function onEndOfFile(context, collected) {
    console.log("End of file; context " + JSON.stringify(context) + ", collected:")
    console.log(JSON.stringify(collected, null, 2))
  }
)

var lexerState = lexer.create(collectorState, collector.line, nop, nop, nop, parser.endOfFile)
lexer.text(lexerState, `TODO`)
lexer.endOfFile(lexerState)

function nop() {}
```

### Output

```
End of file; context "A context for the collection", collected:
{
  "includes": [{
    "name": "testIncludedScriptA"
  }, {
    "name": "testIncludedScriptB"
  }],
  "backgrounds": [{
    "name": "testBackgroundA"
  }, {
    "name": "testBackgroundB"
  }, {
    "name": "testBackgroundC"
  }, {
    "name": "testBackgroundD"
  }],
  "characters": [{
    "name": "testCharacterA",
    "emotes": ["testEmoteA", "testEmoteC"]
  }, {
    "name": "testCharacterB",
    "emotes": ["testEmoteC"]
  }, {
    "name": "testCharacterC",
    "emotes": ["testEmoteB", "testEmoteC"]
  }],
  "flags": [{
    "name": "testFlagA",
    "values": ["testValueA", "testValueB"]
  }, {
    "name": "testFlagB",
    "values": ["testValueA", "testValueC", "testValueD"]
  }, {
    "name": "testFlagC",
    "values": ["testValueC"]
  }, {
    "name": "testFlagD",
    "values": ["testValueA", "testValueE"]
  }]
}
```
