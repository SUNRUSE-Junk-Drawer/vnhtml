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

it(`imports uuid/v4`, () => expect(get(`_uuid`)).toBe(require(`uuid`)))

describe(`create`, () => {
  it(`returns an object`, () => expect(index.create(`Test Context`, `Test On Error`, `Test On End Of File`)).toEqual(jasmine.any(Object)))
  it(`returns statements, an empty array`, () => expect(index.create(`Test Context`, `Test On Error`, `Test On End Of File`).statements).toEqual([]))
  it(`returns context, given`, () => expect(index.create(`Test Context`, `Test On Error`, `Test On End Of File`).context).toEqual(`Test Context`))
  it(`returns onError, given`, () => expect(index.create(`Test Context`, `Test On Error`, `Test On End Of File`).onError).toEqual(`Test On Error`))
  it(`returns onEndOfFile, given`, () => expect(index.create(`Test Context`, `Test On Error`, `Test On End Of File`).onEndOfFile).toEqual(`Test On End Of File`))
  it(`returns a new object every call`, () => expect(index.create(`Test Context`, `Test On Error`, `Test On End Of File`)).not.toBe(index.create(`Test Context`, `Test On Error`, `Test On End Of File`)))
  it(`returns a different statements every call`, () => expect(index.create(`Test Context`, `Test On Error`, `Test On End Of File`).statements).not.toBe(index.create(`Test Context`, `Test On Error`, `Test On End Of File`).statements))
  it(`returns the same value every call`, () => expect(index.create(`Test Context`, `Test On Error`, `Test On End Of File`)).toEqual(index.create(`Test Context`, `Test On Error`, `Test On End Of File`)))
})

describe(`line`, () => {
  const onError = jasmine.createSpy(`onError`)
  const onEndOfFile = jasmine.createSpy(`onEndOfFile`)
  const uuidv4 = jasmine.createSpy(`uuid/v4`)
  uuidv4.and.returnValue(`Test V4 UUID`)
  set(`_uuid`, { v4: uuidv4 })
  afterEach(() => {
    onError.calls.reset()
    onEndOfFile.calls.reset()
    uuidv4.calls.reset()
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
    it(`does not replace statements`, () => expect(state.statements).toBe(statements))
    it(`does not modify context`, () => expect(state.context).toEqual(`Test Context`))
    it(`does not modify onError`, () => expect(state.onError).toBe(onError))
    it(`does not modify onEndOfFile`, () => expect(state.onEndOfFile).toBe(onEndOfFile))
    assertions()
  })
  const runSuccessful = (description, lexed, newStatements, generatesV4Uuid) => run(description, lexed, () => {
    it(`appends the new statements`, () => expect(statements).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything()].concat(newStatements)))
    it(`does not modify the existing statements`, () => expect(statements).toEqual([
      `Test Existing Statement A`,
      `Test Existing Statement B`,
      `Test Existing Statement C`
    ].concat(newStatements.map(newStatement => jasmine.anything()))))
    it(`does not call onError`, () => expect(onError).not.toHaveBeenCalled())
    it(`does not call onEndOfFile`, () => expect(onEndOfFile).not.toHaveBeenCalled())
    if (generatesV4Uuid) {
      it(`generates one V4 UUID`, () => expect(uuidv4).toHaveBeenCalledTimes(1))
    } else {
      it(`does not generate a V4 UUID`, () => expect(uuidv4).not.toHaveBeenCalled())
    }
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
    it(`does not generate a V4 UUID`, () => expect(uuidv4).not.toHaveBeenCalled())
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
    line: {
      promptId: `Test V4 UUID`,
      characters: [`Jeff`, `Jake`, `Phil`],
      text: `Hello, world!`
    }
  }], true)
  runSuccessful(`lineWithEmoteAndText`, {
    lineWithEmoteAndText: {
      characters: [`Jeff`, `Jake`, `Phil`],
      emote: `Disenchanted`,
      text: `Hello, world!`
    }
  }, [{
    emote: {
      character: `Jeff`,
      emote: `Disenchanted`
    }
  }, {
    emote: {
      character: `Jake`,
      emote: `Disenchanted`
    }
  }, {
    emote: {
      character: `Phil`,
      emote: `Disenchanted`
    }
  }, {
    line: {
      promptId: `Test V4 UUID`,
      characters: [`Jeff`, `Jake`, `Phil`],
      text: `Hello, world!`
    }
  }], true)
  runSuccessful(`emote`, {
    emote: {
      characters: [`Jeff`, `Jake`, `Phil`],
      emote: `Disenchanted`
    }
  }, [{
    emote: {
      character: `Jeff`,
      emote: `Disenchanted`
    }
  }, {
    emote: {
      character: `Jake`,
      emote: `Disenchanted`
    }
  }, {
    emote: {
      character: `Phil`,
      emote: `Disenchanted`
    }
  }], false)
  runSuccessful(`leave`, {
    leave: {
      characters: [`Jeff`, `Jake`, `Phil`]
    }
  }, [{
    leave: {
      character: `Jeff`
    }
  }, {
    leave: {
      character: `Jake`
    }
  }, {
    leave: {
      character: `Phil`
    }
  }], false)
  runSuccessful(`set`, {
    set: {
      flag: `window`,
      value: `locked`
    }
  }, [{
    set: {
      flag: `window`,
      value: `locked`
    }
  }], false)
  xdescribe(`if`, () => { })
  xdescribe(`elseIf`, () => { })
  xdescribe(`else`, () => { })
  xdescribe(`menu`, () => { })
  runSuccessful(`label`, {
    label: {
      name: `fromTheTop`
    }
  }, [{
    label: {
      name: `fromTheTop`
    }
  }], false)
  runSuccessful(`goTo`, {
    goTo: {
      label: `fromTheTop`
    }
  }, [{
    goTo: {
      label: `fromTheTop`
    }
  }], false)
  runSuccessful(`background`, {
    background: {
      name: `mountains`
    }
  }, [{
    background: {
      name: `mountains`
    }
  }], false)
  runSuccessful(`include`, {
    include: {
      name: `aTestScript`
    }
  }, [{
    include: {
      name: `aTestScript`
    }
  }], false)
})
