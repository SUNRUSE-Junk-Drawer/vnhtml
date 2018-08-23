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

describe(`linerCreate`, () => {
  it(`returns an object`, () => expect(get(`linerCreate`)(`Test Context`, `Test On Line`)).toEqual(jasmine.any(Object)))
  it(`returns line, 1`, () => expect(get(`linerCreate`)(`Test Context`, `Test On Line`).line).toEqual(1))
  it(`returns text, empty`, () => expect(get(`linerCreate`)(`Test Context`, `Test On Line`).text).toEqual(``))
  it(`returns ignoreRestOfLine, false`, () => expect(get(`linerCreate`)(`Test Context`, `Test On Line`).ignoreRestOfLine).toBe(false))
  it(`returns a new object every call`, () => expect(get(`linerCreate`)(`Test Context`, `Test On Line`)).not.toBe(get(`linerCreate`)(`Test Context`, `Test On Line`)))
  it(`returns a the same value every call`, () => expect(get(`linerCreate`)(`Test Context`, `Test On Line`)).toEqual(get(`linerCreate`)(`Test Context`, `Test On Line`)))
})
