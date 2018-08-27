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
      statements,
      context: `Test Context`,
      onError,
      onEndOfFile
    }
  })
  describe(`unlexable`, () => {
    beforeEach(() => index.line(state, 3897, `Test Text`, null))
    it(`does not modify statements`, () => expect(statements).toEqual([
      `Test Existing Statement A`,
      `Test Existing Statement B`,
      `Test Existing Statement C`
    ]))
    it(`does not replace statements`, () => expect(state.statements).toBe(statements))
    it(`does not modify context`, () => expect(state.context).toEqual(`Test Context`))
    it(`does not modify onError`, () => expect(state.onError).toBe(onError))
    it(`does not modify onEndOfFile`, () => expect(state.onEndOfFile).toBe(onEndOfFile))
    it(`calls onError once`, () => expect(onError).toHaveBeenCalledTimes(1))
    it(`calls onError with the context`, () => expect(onError).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything()))
    it(`calls onError with the line number`, () => expect(onError).toHaveBeenCalledWith(jasmine.anything(), 3897, jasmine.anything()))
    it(`calls onError with a message informing the user that the statement was unparseable`, () => expect(onError).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Unparseable; if this should be a statement, please check the documentation for a list of patterns which can be used; otherwise check indentation`))
    it(`does not call onEndOfFile`, () => expect(onEndOfFile).not.toHaveBeenCalled())
  })
  xdescribe(`line`, () => { })
  xdescribe(`lineWithEmote`, () => { })
  xdescribe(`lineWithText`, () => { })
  xdescribe(`lineWithEmoteAndText`, () => { })
  xdescribe(`emote`, () => { })
  xdescribe(`leave`, () => { })
  xdescribe(`set`, () => { })
  xdescribe(`if`, () => { })
  xdescribe(`elseIf`, () => { })
  xdescribe(`else`, () => { })
  xdescribe(`menu`, () => { })
  xdescribe(`label`, () => { })
  xdescribe(`goTo`, () => { })
  xdescribe(`background`, () => { })
  xdescribe(`include`, () => { })
})
