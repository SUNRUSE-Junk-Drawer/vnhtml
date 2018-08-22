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

describe(`classifyCharacter`, () => {
  const run = (input, output) => describe(`given "${input}"`, () => it(`returns "${output}"`, () => get(`classifyCharacter`)(input)))
  run(`a`, `glyph`)
  run(`d`, `glyph`)
  run(`q`, `glyph`)
  run(`z`, `glyph`)
  run(`0`, `glyph`)
  run(`4`, `glyph`)
  run(`9`, `glyph`)
  run(`0`, `glyph`)
  run(`!`, `glyph`)
  run(`$`, `glyph`)
  run(`?`, `glyph`)
  run(`か`, `glyph`)
  run(` `, `whiteSpace`)
  run(`\t`, `whiteSpace`)
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
  it(`returns a new object every call`, () => expect(get(`createParser`)()).not.toBe(get(`createParser`)()))
})
