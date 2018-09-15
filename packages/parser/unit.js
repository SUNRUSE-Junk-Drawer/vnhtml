const rewire = require(`rewire`)
const index = rewire(`./index.babel.js`)

const get = name => index.__get__(name)
const set = (name, value) => {
  let replaced
  beforeEach(() => {
    replaced = index.__get__(name)
    index.__set__(name, value)
  })
  afterEach(() => {
    index.__set__(name, replaced)
  })
  return value
}

const setSpy = name => set(name, jasmine.createSpy(name))

describe(`create`, () => {
  it(`returns an object`, () => expect(index.create(`Test File`, `Test Context`, `Test On Error`, `Test On End Of File`)).toEqual(jasmine.any(Object)))
  it(`returns file, given`, () => expect(index.create(`Test File`, `Test Context`, `Test On Error`, `Test On End Of File`).file).toEqual(`Test File`))
  it(`returns statements, an empty array`, () => expect(index.create(`Test File`, `Test Context`, `Test On Error`, `Test On End Of File`).statements).toEqual([]))
  it(`returns context, given`, () => expect(index.create(`Test File`, `Test Context`, `Test On Error`, `Test On End Of File`).context).toEqual(`Test Context`))
  it(`returns onError, given`, () => expect(index.create(`Test File`, `Test Context`, `Test On Error`, `Test On End Of File`).onError).toEqual(`Test On Error`))
  it(`returns onEndOfFile, given`, () => expect(index.create(`Test File`, `Test Context`, `Test On Error`, `Test On End Of File`).onEndOfFile).toEqual(`Test On End Of File`))
  it(`returns a new object every call`, () => expect(index.create(`Test File`, `Test Context`, `Test On Error`, `Test On End Of File`)).not.toBe(index.create(`Test File`, `Test Context`, `Test On Error`, `Test On End Of File`)))
  it(`returns a different statements every call`, () => expect(index.create(`Test File`, `Test Context`, `Test On Error`, `Test On End Of File`).statements).not.toBe(index.create(`Test File`, `Test Context`, `Test On Error`, `Test On End Of File`).statements))
  it(`returns the same value every call`, () => expect(index.create(`Test File`, `Test Context`, `Test On Error`, `Test On End Of File`)).toEqual(index.create(`Test File`, `Test Context`, `Test On Error`, `Test On End Of File`)))
})

describe(`line`, () => {
  const onError = jasmine.createSpy(`onError`)
  const onEndOfFile = jasmine.createSpy(`onEndOfFile`)
  afterEach(() => {
    onError.calls.reset()
    onEndOfFile.calls.reset()
  })
  let statements
  let state
  beforeEach(() => {
    statements = [
      `Test Existing Statement A`,
      `Test Existing Statement B`,
      `Test Existing Statement C`
    ]
    state = {
      file: `Test File`,
      statements,
      context: `Test Context`,
      onError,
      onEndOfFile
    }
  })
  const run = (description, lexed, assertions) => describe(description, () => {
    let lexedCopy
    beforeEach(() => {
      lexedCopy = JSON.parse(JSON.stringify(lexed))
      index.line(state, 3897, `Test Text`, lexedCopy)
    })
    it(`does not modify the lexed statement`, () => expect(lexedCopy).toEqual(lexed))
    it(`does not replace file`, () => expect(state.file).toEqual(`Test File`))
    it(`does not replace statements`, () => expect(state.statements).toBe(statements))
    it(`does not modify context`, () => expect(state.context).toEqual(`Test Context`))
    it(`does not modify onError`, () => expect(state.onError).toBe(onError))
    it(`does not modify onEndOfFile`, () => expect(state.onEndOfFile).toBe(onEndOfFile))
    assertions()
  })
  const runSuccessful = (description, lexed, newStatements) => run(description, lexed, () => {
    it(`appends the new statements`, () => expect(statements).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything()].concat(newStatements)))
    it(`does not modify the existing statements`, () => expect(statements).toEqual([
      `Test Existing Statement A`,
      `Test Existing Statement B`,
      `Test Existing Statement C`
    ].concat(newStatements.map(newStatement => jasmine.anything()))))
    it(`does not call onError`, () => expect(onError).not.toHaveBeenCalled())
    it(`does not call onEndOfFile`, () => expect(onEndOfFile).not.toHaveBeenCalled())
  })
  const runError = (description, lexed, message) => run(description, lexed, () => {
    it(`does not modify the existing statements`, () => expect(statements).toEqual([
      `Test Existing Statement A`,
      `Test Existing Statement B`,
      `Test Existing Statement C`
    ]))
    it(`calls onError once`, () => expect(onError).toHaveBeenCalledTimes(1))
    it(`calls onError with the context`, () => expect(onError).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything()))
    it(`calls onError with the line number`, () => expect(onError).toHaveBeenCalledWith(jasmine.anything(), 3897, jasmine.anything()))
    it(`calls onError with a message stating ${JSON.stringify(message)}`, () => expect(onError).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), message))
  })
  runError(`unlexable`, null, `Unparseable; if this should be a statement, please check the documentation for a list of patterns which can be used; otherwise check indentation`)
  runSuccessful(`line`, {
    line: {
      characters: [{
        name: `Test Character Name A`,
        normalizedName: `Test Character Normalized Name A`
      }, {
        name: `Test Character Name B`,
        normalizedName: `Test Character Normalized Name B`
      }, {
        name: `Test Character Name C`,
        normalizedName: `Test Character Normalized Name C`
      }],
      text: `Test Text`
    }
  }, [{
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 0
    },
    line: {
      characters: [{
        name: `Test Character Name A`,
        normalizedName: `Test Character Normalized Name A`
      }, {
        name: `Test Character Name B`,
        normalizedName: `Test Character Normalized Name B`
      }, {
        name: `Test Character Name C`,
        normalizedName: `Test Character Normalized Name C`
      }],
      text: `Test Text`
    }
  }])
  runSuccessful(`lineWithEmote`, {
    lineWithEmote: {
      characters: [{
        name: `Test Character Name A`,
        normalizedName: `Test Character Normalized Name A`
      }, {
        name: `Test Character Name B`,
        normalizedName: `Test Character Normalized Name B`
      }, {
        name: `Test Character Name C`,
        normalizedName: `Test Character Normalized Name C`
      }],
      emote: `Test Emote`,
      normalizedEmote: `Test Normalized Emote`,
      text: `Test Text`
    }
  }, [{
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 0
    },
    emote: {
      characterName: `Test Character Name A`,
      characterNormalizedName: `Test Character Normalized Name A`,
      emote: `Test Emote`,
      normalizedEmote: `Test Normalized Emote`
    }
  }, {
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 1
    },
    emote: {
      characterName: `Test Character Name B`,
      characterNormalizedName: `Test Character Normalized Name B`,
      emote: `Test Emote`,
      normalizedEmote: `Test Normalized Emote`
    }
  }, {
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 2
    },
    emote: {
      characterName: `Test Character Name C`,
      characterNormalizedName: `Test Character Normalized Name C`,
      emote: `Test Emote`,
      normalizedEmote: `Test Normalized Emote`
    }
  }, {
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 3
    },
    line: {
      characters: [{
        name: `Test Character Name A`,
        normalizedName: `Test Character Normalized Name A`
      }, {
        name: `Test Character Name B`,
        normalizedName: `Test Character Normalized Name B`
      }, {
        name: `Test Character Name C`,
        normalizedName: `Test Character Normalized Name C`
      }],
      text: `Test Text`
    }
  }])
  runSuccessful(`emote`, {
    emote: {
      characters: [{
        name: `Test Character Name A`,
        normalizedName: `Test Character Normalized Name A`
      }, {
        name: `Test Character Name B`,
        normalizedName: `Test Character Normalized Name B`
      }, {
        name: `Test Character Name C`,
        normalizedName: `Test Character Normalized Name C`
      }],
      emote: `Test Emote`,
      normalizedEmote: `Test Normalized Emote`
    }
  }, [{
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 0
    },
    emote: {
      characterName: `Test Character Name A`,
      characterNormalizedName: `Test Character Normalized Name A`,
      emote: `Test Emote`,
      normalizedEmote: `Test Normalized Emote`
    }
  }, {
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 1
    },
    emote: {
      characterName: `Test Character Name B`,
      characterNormalizedName: `Test Character Normalized Name B`,
      emote: `Test Emote`,
      normalizedEmote: `Test Normalized Emote`
    }
  }, {
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 2
    },
    emote: {
      characterName: `Test Character Name C`,
      characterNormalizedName: `Test Character Normalized Name C`,
      emote: `Test Emote`,
      normalizedEmote: `Test Normalized Emote`
    }
  }])
  runSuccessful(`leave`, {
    leave: {
      characters: [{
        name: `Test Character Name A`,
        normalizedName: `Test Character Normalized Name A`
      }, {
        name: `Test Character Name B`,
        normalizedName: `Test Character Normalized Name B`
      }, {
        name: `Test Character Name C`,
        normalizedName: `Test Character Normalized Name C`
      }]
    }
  }, [{
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 0
    },
    leave: {
      characterName: `Test Character Name A`,
      characterNormalizedName: `Test Character Normalized Name A`
    }
  }, {
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 1
    },
    leave: {
      characterName: `Test Character Name B`,
      characterNormalizedName: `Test Character Normalized Name B`
    }
  }, {
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 2
    },
    leave: {
      characterName: `Test Character Name C`,
      characterNormalizedName: `Test Character Normalized Name C`
    }
  }])
  runSuccessful(`set`, {
    set: {
      flag: `Test Flag`,
      normalizedFlag: `Test Normalized Flag`,
      value: `Test Value`,
      normalizedValue: `Test Normalized Value`
    }
  }, [{
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 0
    },
    set: {
      flag: `Test Flag`,
      normalizedFlag: `Test Normalized Flag`,
      value: `Test Value`,
      normalizedValue: `Test Normalized Value`
    }
  }])
  xdescribe(`if`, () => { })
  xdescribe(`elseIf`, () => { })
  xdescribe(`else`, () => { })
  xdescribe(`menu`, () => { })
  runSuccessful(`label`, {
    label: {
      name: `Test Name`,
      normalizedName: `Test Normalized Name`
    }
  }, [{
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 0
    },
    label: {
      name: `Test Name`,
      normalizedName: `Test Normalized Name`
    }
  }])
  runSuccessful(`goTo`, {
    goTo: {
      label: `Test Label`,
      normalizedLabel: `Test Normalized Label`
    }
  }, [{
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 0
    },
    goTo: {
      label: `Test Label`,
      normalizedLabel: `Test Normalized Label`
    }
  }])
  runSuccessful(`background`, {
    background: {
      name: `Test Name`,
      normalizedName: `Test Normalized Name`
    }
  }, [{
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 0
    },
    background: {
      name: `Test Name`,
      normalizedName: `Test Normalized Name`
    }
  }])
  runSuccessful(`include`, {
    include: {
      name: `Test Name`,
      normalizedName: `Test Normalized Name`
    }
  }, [{
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 0
    },
    include: {
      name: `Test Name`,
      normalizedName: `Test Normalized Name`
    }
  }])
})

describe(`endOfFile`, () => {
  const onError = jasmine.createSpy(`onError`)
  const onEndOfFile = jasmine.createSpy(`onEndOfFile`)
  afterEach(() => {
    onError.calls.reset()
    onEndOfFile.calls.reset()
  })
  beforeEach(() => {
    get(`endOfFile`)({
      file: `Test File`,
      statements: `Test Statements`,
      context: `Test Context`,
      onError,
      onEndOfFile
    })
  })
  it(`does not call onError`, () => expect(onError).not.toHaveBeenCalled())
  it(`calls onEndOfFile once`, () => expect(onEndOfFile).toHaveBeenCalledTimes(1))
  it(`calls onEndOfFile with the context`, () => expect(onEndOfFile).toHaveBeenCalledWith(`Test Context`, jasmine.anything()))
  it(`calls onEndOfFile with the statements`, () => expect(onEndOfFile).toHaveBeenCalledWith(jasmine.anything(), `Test Statements`))
})
