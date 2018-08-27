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
