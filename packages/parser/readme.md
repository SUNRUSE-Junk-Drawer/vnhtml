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

### Line with text

#### vnhtml

```vnhtml
Jeff Jake and Phil: This is the line of dialog spoken in unison.
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
    "characters": [{
      name: "Jeff",
      normalizedName: "jeff"
    }, {
      name: "Jake",
      normalizedName: "jake"
    }, {
      name: "Phil",
      normalizedName: "phil"
    }],
    "text": "This is the line of dialog spoken in unison."
  }
}]
```

### Line with emote and text

#### vnhtml

```vnhtml
Jeff Jake and Phil (otherworldly): This is the line of dialog spoken in unison.
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
    "characterName": "Jeff",
    "characterNameNormalized": "jeff",
    "emote": "otherworldly",
    "normalizedEmote": "otherworldly"
  }
}, {
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 1
  },
  "emote": {
    "characterName": "Jake",
    "characterNameNormalized": "jake",
    "emote": "otherworldly",
    "normalizedEmote": "otherworldly"
  }
}, {
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 2
  },
  "emote": {
    "characterName": "Phil",
    "characterNameNormalized": "phil",
    "emote": "otherworldly",
    "normalizedEmote": "otherworldly"
  }
}, {
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 3
  },
  "line": {
    "characters": [{
      name: "Jeff",
      normalizedName: "jeff"
    }, {
      name: "Jake",
      normalizedName: "jake"
    }, {
      name: "Phil",
      normalizedName: "phil"
    }],
    "text": "This is the line of dialog spoken in unison."
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
    "characterName": "Jeff",
    "characterNameNormalized": "jeff",
    "emote": "otherworldly",
    "normalizedEmote": "otherworldly"
  }
}, {
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 1
  },
  "emote": {
    "characterName": "Jake",
    "characterNameNormalized": "jake",
    "emote": "otherworldly",
    "normalizedEmote": "otherworldly"
  }
}, {
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 2
  },
  "emote": {
    "characterName": "Phil",
    "characterNameNormalized": "phil",
    "emote": "otherworldly",
    "normalizedEmote": "otherworldly"
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
    "characterName": "Jeff",
    "characterNameNormalized": "jeff"
  }
}, {
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 1
  },
  "leave": {
    "characterName": "Jake",
    "characterNameNormalized": "jake"
  }
}, {
  "origin": {
    "file": "The name of the file being parsed",
    "line": 473,
    "subStatement": 2
  },
  "leave": {
    "characterName": "Phil",
    "characterNameNormalized": "phil"
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
    "normalizedFlag": "window",
    "value": "locked",
    "normalizedValue": "locked"
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
          "normalizedFlag": "window",
          "value": "unlocked",
          "normalizedValue": "unlocked"
        }
      },
      "then": [{
        "origin": {
          "file": "The name of the file being parsed",
          "line": 474,
          "subStatement": 0
        },
        "line": {
          "characters": [{
            name: "Jeff",
            normalizedName: "jeff"
          }],
          "text": "The window's locked!"
        }
      }, {
        "origin": {
          "file": "The name of the file being parsed",
          "line": 475,
          "subStatement": 0
        },
        "line": {
          "characters": [{
            name: "Jake",
            normalizedName: "jake"
          }],
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
    "characters": [{
      name: "Jeff",
      normalizedName: "jeff"
    }],
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
          "normalizedFlag": "window",
          "value": "unlocked",
          "normalizedValue": "unlocked"
        }
      },
      "then": [{
        "origin": {
          "file": "The name of the file being parsed",
          "line": 475,
          "subStatement": 0
        },
        "line": {
          "characters": [{
            name: "Jake",
            normalizedName: "jake"
          }],
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
          "normalizedFlag": "window",
          "value": "open",
          "normalizedValue": "open"
        }
      },
      "then": [{
        "origin": {
          "file": "The name of the file being parsed",
          "line": 477,
          "subStatement": 0
        },
        "line": {
          "characters": [{
            name: "Jake",
            normalizedName: "jake"
          }],
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
    "characters": [{
      name: "Jeff",
      normalizedName: "jeff"
    }],
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
          "normalizedFlag": "window",
          "value": "unlocked",
          "normalizedValue": "unlocked"
        }
      },
      "then": [{
        "origin": {
          "file": "The name of the file being parsed",
          "line": 475,
          "subStatement": 0
        },
        "line": {
          "characters": [{
            name: "Jake",
            normalizedName: "jake"
          }],
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
          "normalizedFlag": "window",
          "value": "open",
          "normalizedValue": "open"
        }
      },
      "then": [{
        "origin": {
          "file": "The name of the file being parsed",
          "line": 476,
          "subStatement": 0
        },
        "line": {
          "characters": [{
            name: "Jake",
            normalizedName: "jake"
          }],
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
          "characters": [{
            name: "Jake",
            normalizedName: "jake"
          }],
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
          "characters": [{
            name: "Jeff",
            normalizedName: "jeff"
          }],
          "text": "Why did I pick this!"
        }
      }, {
        "origin": {
          "file": "The name of the file being parsed",
          "line": 476,
          "subStatement": 0
        },
        "line": {
          "characters": [{
            name: "Jake",
            normalizedName: "jake"
          }],
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
          "characters": [{
            name: "Jeff",
            normalizedName: "jeff"
          }],
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
          "characters": [{
            name: "Jeff",
            normalizedName: "jeff"
          }],
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
    "name": "fromTheTop",
    "normalizedName": "fromthetop"
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
    "label": "fromTheTop",
    "normalizedLabel": "fromthetop"
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
    "name": "mountains",
    "normalizedName": "mountains"
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
    "name": "lengthySidequest",
    "normalizedName": "lengthysidequest"
  }
}]
```
