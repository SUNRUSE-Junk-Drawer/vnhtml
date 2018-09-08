# @vnhtml/parser

A module which takes raw statements from
[@vnhtml/lexer](https://www.npmjs.com/package/@vnhtml/lexer) and converts them
into a hierarchical abstract syntax tree.

## Example

```javascript
var lexer = require("@vnhtml/lexer")
var parser = require("@vnhtml/parser")

var parserState = parser.create(
  "The name of the file being parsed",
  "A context for the parsing",
  function onError(context, line, message) {
    console.log(
      "Error; context " + JSON.stringify(context)
      + ", line " + line
      + ", message " + JSON.stringify(message)
    )
  },
  function onEndOfFile(context, parsed) {
    console.log("End of file; context " + JSON.stringify(context) + ", collected:")
    console.log(JSON.stringify(parsed, null, 2))
  }
)

var lexerState = lexer.create(parserState, parser.line, parser.indent, parser.outdent, nop, parser.endOfFile)
lexer.text(lexerState, `TODO`)
lexer.endOfFile(lexerState)

function nop() {}
```

### Output

```
TODO
```

## Exception handling

Should any callback throw an exception, further calls to `line`, `indent`,
`outdent`, `error` and `endOfFile` will be rejected for that parser state.

## Examples of `statements`

Any statement which waits for user input (lines, menus) will include a V4 UUID
called "promptId".

### Line

#### vnhtml

```vnhtml
Jeff Jake and Phil:
  We're speaking in unison to bring you the good news!
  You can include any number of lines of dialog like this,
  and they'll be put together into a single statement.
```

#### Statements

```json
[{
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 0
  },
  "line": {
    "promptId": "48363e91-0a73-476b-884a-241cb57387c0",
    "characters": ["Jeff", "Jake", "Phil"],
    "text": "We're speaking in unison to bring you the good news!\nYou can include any number of lines of dialog like this,\nand they'll be put together into a single statement."
  }
}]
```

### Line with emote

#### vnhtml

```vnhtml
Jeff Jake and Phil (otherworldly):
  We're speaking in unison to bring you the good news!
  You can include any number of lines of dialog like this,
  and they'll be put together into a single statement.
```

#### Statements

```json
[{
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 0
  },
  "emote": {
    "character": "Jeff",
    "emote": "otherworldly"
  }
}, {
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 1
  },
  "emote": {
    "character": "Jake",
    "emote": "otherworldly"
  }
}, {
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 2
  },
  "emote": {
    "character": "Phil",
    "emote": "otherworldly"
  }
}, {
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 3
  },
  "line": {
    "promptId": "48363e91-0a73-476b-884a-241cb57387c0",
    "characters": ["Jeff", "Jake", "Phil"],
    "text": "We're speaking in unison to bring you the good news!\nYou can include any number of lines of dialog like this,\nand they'll be put together into a single statement."
  }
}]
```

### Line with text

#### vnhtml

```vnhtml
Jeff Jake and Phil: This takes less vertical space, however.
```

#### Statements

```json
[{
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 0
  },
  "line": {
    "promptId": "48363e91-0a73-476b-884a-241cb57387c0",
    "characters": ["Jeff", "Jake", "Phil"],
    "text": "This takes less vertical space, however."
  }
}]
```

### Line with emote and text

#### vnhtml

```vnhtml
Jeff Jake and Phil (otherworldly): This takes less vertical space, however.
```

#### Statements

```json
[{
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 0
  },
  "emote": {
    "character": "Jeff",
    "emote": "otherworldly"
  }
}, {
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 1
  },
  "emote": {
    "character": "Jake",
    "emote": "otherworldly"
  }
}, {
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 2
  },
  "emote": {
    "character": "Phil",
    "emote": "otherworldly"
  }
}, {
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 3
  },
  "line": {
    "promptId": "48363e91-0a73-476b-884a-241cb57387c0",
    "characters": ["Jeff", "Jake", "Phil"],
    "text": "This takes less vertical space, however."
  }
}]
```

### Emote

#### vnhtml

```vnhtml
Jeff Jake and Phil are otherworldly
```

#### Statements

```json
[{
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 0
  },
  "emote": {
    "character": "Jeff",
    "emote": "otherworldly"
  }
}, {
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 1
  },
  "emote": {
    "character": "Jake",
    "emote": "otherworldly"
  }
}, {
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 2
  },
  "emote": {
    "character": "Phil",
    "emote": "otherworldly"
  }
}]
```

### Leave

#### vnhtml

```vnhtml
Jeff Jake and Phil leave
```

#### Statements

```json
[{
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 0
  },
  "leave": {
    "character": "Jeff"
  }
}, {
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 1
  },
  "leave": {
    "character": "Jake"
  }
}, {
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 2
  },
  "leave": {
    "character": "Phil"
  }
}]
```

### Set flag

#### vnhtml

```vnhtml
set window locked
```

#### Statements

```json
[{
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 0
  },
  "set": {
    "flag": "window",
    "value": "locked
  }
}]
```

### If

#### vnhtml

```vnhtml
if window unlocked
  Jeff: The window's locked!
  Jake: You sure?
```

#### Statements

```json
[{
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 0
  },
  "decision": {
    "paths": [{
      "origin": {
        "file": "The name of the file being parsed",
        "line": 473,
        "subStatement": 0
      },
      "condition": {
        "flag": {
          "flag": "window",
          "value": "unlocked"
        }
      },
      "then": [{
        "origin": {
          "file": "The name of the file being parsed",
          "line": 474,
          "subStatement": 0
        },
        "line": {
          "characters": ["Jeff"],
          "text": "The window's locked!"
        }
      }, {
        "origin": {
          "file": "The name of the file being parsed",
          "line": 475,
          "subStatement": 0
        },
        "line": {
          "characters": ["Jake"],
          "text": "You sure?"
        }
      }]
    }]
  }
}]
```

### Else if

#### vnhtml

```vnhtml
Jeff: The window's locked!
if window unlocked
  Jake: You sure?
else if window open
  Jake: I implied locked *closed*.
```

#### Statements

```json
[{
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 0
  },
  "line": {
    "characters": ["Jeff"],
    "text": "The window's locked!"
  }
}, {
  "origin": {
    "file": "The name of the file being parsed",
    "line": 474,
    "subStatement": 0
  },
  "decision": {
    "paths": [{
      "origin": {
        "file": "The name of the file being parsed",
        "line": 474,
        "subStatement": 0
      },
      "condition": {
        "flag": {
          "flag": "window",
          "value": "unlocked"
        }
      },
      "then": [{
        "origin": {
          "file": "The name of the file being parsed",
          "line": 475,
          "subStatement": 0
        },
        "line": {
          "characters": ["Jake"],
          "text": "You sure?"
        }
      }]
    }, {
      "origin": {
        "file": "The name of the file being parsed",
        "line": 476,
        "subStatement": 0
      },
      "condition": {
        "flag": {
          "flag": "window",
          "value": "open"
        }
      },
      "then": [{
        "origin": {
          "file": "The name of the file being parsed",
          "line": 477,
          "subStatement": 0
        },
        "line": {
          "characters": ["Jake"],
          "text": "I implied locked *closed*."
        }
      }]
    }]
  }
}]
```

### Else

#### vnhtml

```vnhtml
Jeff: The window's locked!
if window unlocked
  Jake: You sure?
else if window open
  Jake: I implied locked *closed*.
else
  Jake: Looks right from here.
```

#### Statements

```json
[{
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 0
  },
  "line": {
    "characters": ["Jeff"],
    "text": "The window's locked!"
  }
}, {
  "origin": {
    "file": "The name of the file being parsed",
    "line": 474,
    "subStatement": 0
  },
  "decision": {
    "paths": [{
      "origin": {
        "file": "The name of the file being parsed",
        "line": 474,
        "subStatement": 0
      },
      "condition": {
        "flag": {
          "flag": "window",
          "value": "unlocked"
        }
      },
      "then": [{
        "origin": {
          "file": "The name of the file being parsed",
          "line": 475,
          "subStatement": 0
        },
        "line": {
          "characters": ["Jake"],
          "text": "You sure?"
        }
      }]
    }, {
      "origin": {
        "file": "The name of the file being parsed",
        "line": 475,
        "subStatement": 0
      },
      "condition": {
        "flag": {
          "flag": "window",
          "value": "open"
        }
      },
      "then": [{
        "origin": {
          "file": "The name of the file being parsed",
          "line": 476,
          "subStatement": 0
        },
        "line": {
          "characters": ["Jake"],
          "text": "I implied locked *closed*."
        }
      }]
    }, {
      "origin": {
        "file": "The name of the file being parsed",
        "line": 477,
        "subStatement": 0
      },
      "condition": null,
      "then": [{
        "origin": {
          "file": "The name of the file being parsed",
          "line": 478,
          "subStatement": 0
        },
        "line": {
          "characters": ["Jake"],
          "text": "Looks right from here."
        }
      }]
    }]
  }
}]
```

### Menu

#### vnhtml

```vnhtml
menu
  Coffee
    Jeff: Why did I pick this!
    Jake: You'll have a right headache...
  Cake
    Jeff: Bad for me, but so good.
  Fruit Salad
    Jake: Not bad!
```

#### Statements

```json
[{
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 0
  },
  "menu": {
    "promptId": "48363e91-0a73-476b-884a-241cb57387c0",
    "paths": [{
      "origin": {
        "file": "The name of the file being parsed",
        "line": 474,
        "subStatement": 0
      },
      "label": "Coffee",
      "then": [{
        "origin": {
          "file": "The name of the file being parsed",
          "line": 475,
          "subStatement": 0
        },
        "line": {
          "characters": ["Jeff"],
          "text": "Why did I pick this!"
        }
      }, {
        "origin": {
          "file": "The name of the file being parsed",
          "line": 476,
          "subStatement": 0
        },
        "line": {
          "characters": ["Jake"],
          "text": "You'll have a right headache..."
        }
      }]
    }, {
      "label": "Cake",
      "then": [{
        "origin": {
          "file": "The name of the file being parsed",
          "line": 477,
          "subStatement": 0
        },
        "line": {
          "characters": ["Jeff"],
          "text": "Bad for me, but so good."
        }
      }]
    }, {
      "label": "Fruit Salad",
      "then": [{
        "origin": {
          "file": "The name of the file being parsed",
          "line": 478,
          "subStatement": 0
        },
        "line": {
          "characters": ["Jeff"],
          "text": "Not bad!"
        }
      }]
    }]
  }
}]
```

### Label

#### vnhtml

```vnhtml
label fromTheTop
```

#### Statements

```json
[{
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 0
  },
  "label": {
    "name": "fromTheTop"
  }
}]
```

### Go To

#### vnhtml

```vnhtml
go to fromTheTop
```

#### Statements

```json
[{
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 0
  },
  "goTo": {
    "label": "fromTheTop"
  }
}]
```

### Background

#### vnhtml

```vnhtml
mountains in background
```

#### Statements

```json
[{
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 0
  },
  "background": {
    "name": "mountains"
  }
}]
```

### Include

#### vnhtml

```vnhtml
include lengthySidequest
```

#### Statements

```json
[{
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 0
  },
  "include": {
    "name": "lengthySidequest"
  }
}]
```
