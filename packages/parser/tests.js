const rewire = require(`rewire`)
const index = rewire(`./index`)

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
}

describe(`linerClassifyCharacter`, () => {
  const run = (input, output) => describe(`given "${input}"`, () => it(`returns "${output}"`, () => get(`linerClassifyCharacter`)(input)))
  run(`a`, `partOfLine`)
  run(`d`, `partOfLine`)
  run(`q`, `partOfLine`)
  run(`z`, `partOfLine`)
  run(`0`, `partOfLine`)
  run(`4`, `partOfLine`)
  run(`9`, `partOfLine`)
  run(`0`, `partOfLine`)
  run(`!`, `partOfLine`)
  run(`$`, `partOfLine`)
  run(`?`, `partOfLine`)
  run(`か`, `partOfLine`)
  run(` `, `partOfLine`)
  run(`\t`, `partOfLine`)
  run(`\r`, `newLine`)
  run(`\n`, `newLine`)
  run(`#`, `lineComment`)
})

describe(`createParser`, () => {
  it(`returns an object`, () => expect(get(`createParser`)()).toEqual(jasmine.any(Object)))
  it(`returns line, 1`, () => expect(get(`createParser`)().line).toEqual(1))
  it(`returns whiteSpaceCharacter, null`, () => expect(get(`createParser`)().whiteSpaceCharacter).toBeNull())
  it(`returns indentation, 0`, () => expect(get(`createParser`)().indentation).toEqual(0))
  it(`returns text, null`, () => expect(get(`createParser`)().text).toBeNull())
  it(`returns ignoreRestOfLine, false`, () => expect(get(`createParser`)().ignoreRestOfLine).toBe(false))
  it(`returns a new object every call`, () => expect(get(`createParser`)()).not.toBe(get(`createParser`)()))
})
