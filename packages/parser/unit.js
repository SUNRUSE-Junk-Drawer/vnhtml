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
  xdescribe(`line`, () => { })
  xdescribe(`lineWithEmote`, () => { })
  runSuccessful(`lineWithText`, {
    lineWithText: {
      characters: [`Jeff`, `Jake`, `Phil`],
      text: `Hello, world!`
    }
  }, [{
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 0
    },
    line: {
      characters: [`Jeff`, `Jake`, `Phil`],
      text: `Hello, world!`
    }
  }])
  runSuccessful(`lineWithEmoteAndText`, {
    lineWithEmoteAndText: {
      characters: [`Jeff`, `Jake`, `Phil`],
      emote: `Disenchanted`,
      text: `Hello, world!`
    }
  }, [{
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 0
    },
    emote: {
      character: `Jeff`,
      emote: `Disenchanted`
    }
  }, {
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 1
    },
    emote: {
      character: `Jake`,
      emote: `Disenchanted`
    }
  }, {
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 2
    },
    emote: {
      character: `Phil`,
      emote: `Disenchanted`
    }
  }, {
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 3
    },
    line: {
      characters: [`Jeff`, `Jake`, `Phil`],
      text: `Hello, world!`
    }
  }])
  runSuccessful(`emote`, {
    emote: {
      characters: [`Jeff`, `Jake`, `Phil`],
      emote: `Disenchanted`
    }
  }, [{
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 0
    },
    emote: {
      character: `Jeff`,
      emote: `Disenchanted`
    }
  }, {
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 1
    },
    emote: {
      character: `Jake`,
      emote: `Disenchanted`
    }
  }, {
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 2
    },
    emote: {
      character: `Phil`,
      emote: `Disenchanted`
    }
  }])
  runSuccessful(`leave`, {
    leave: {
      characters: [`Jeff`, `Jake`, `Phil`]
    }
  }, [{
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 0
    },
    leave: {
      character: `Jeff`
    }
  }, {
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 1
    },
    leave: {
      character: `Jake`
    }
  }, {
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 2
    },
    leave: {
      character: `Phil`
    }
  }])
  runSuccessful(`set`, {
    set: {
      flag: `window`,
      value: `locked`
    }
  }, [{
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 0
    },
    set: {
      flag: `window`,
      value: `locked`
    }
  }])
  xdescribe(`if`, () => { })
  xdescribe(`elseIf`, () => { })
  xdescribe(`else`, () => { })
  xdescribe(`menu`, () => { })
  runSuccessful(`label`, {
    label: {
      name: `fromTheTop`
    }
  }, [{
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 0
    },
    label: {
      name: `fromTheTop`
    }
  }])
  runSuccessful(`goTo`, {
    goTo: {
      label: `fromTheTop`
    }
  }, [{
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 0
    },
    goTo: {
      label: `fromTheTop`
    }
  }])
  runSuccessful(`background`, {
    background: {
      name: `mountains`
    }
  }, [{
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 0
    },
    background: {
      name: `mountains`
    }
  }])
  runSuccessful(`include`, {
    include: {
      name: `aTestScript`
    }
  }, [{
    origin: {
      file: `Test File`,
      line: 3897,
      subStatement: 0
    },
    include: {
      name: `aTestScript`
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
