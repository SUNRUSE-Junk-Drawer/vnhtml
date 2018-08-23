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
  return value
}

const setSpy = name => set(name, jasmine.createSpy(name))

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
  it(`returns context, given`, () => expect(get(`linerCreate`)(`Test Context`, `Test On Line`).context).toEqual(`Test Context`))
  it(`returns onLine, given`, () => expect(get(`linerCreate`)(`Test Context`, `Test On Line`).onLine).toEqual(`Test On Line`))
  it(`returns a new object every call`, () => expect(get(`linerCreate`)(`Test Context`, `Test On Line`)).not.toBe(get(`linerCreate`)(`Test Context`, `Test On Line`)))
  it(`returns a the same value every call`, () => expect(get(`linerCreate`)(`Test Context`, `Test On Line`)).toEqual(get(`linerCreate`)(`Test Context`, `Test On Line`)))
})

describe(`linerTextNotEmpty`, () => {
  const run = (input, output) => describe(`given "${input}"`, () => it(`returns ${output}`, () => get(`linerTextNotEmpty`)(input)))
  run(``, false)
  run(` `, false)
  run(`\t`, false)
  run(`   \t     \t  `, false)
  run(`a`, true)
  run(` a`, true)
  run(`\ta`, true)
  run(`   \t     \t  a`, true)
  run(`awdhk\tauwdh iyi`, true)
  run(` awdhk\tauwdh iyi`, true)
  run(`\tawdhk\tauwdh iyi`, true)
  run(`   \t     \t  awdhk auwdh iyi`, true)
  run(`awdhk\tauwdh iyi `, true)
  run(`awdhk\tauwdh iyi\t`, true)
  run(`awdhk\tauwdh iyi   \t     \t  `, true)
  run(` awdhk\tauwdh iyi `, true)
  run(` awdhk\tauwdh iyi\t`, true)
  run(` awdhk\tauwdh iyi   \t     \t  `, true)
  run(`\tawdhk\tauwdh iyi `, true)
  run(`\tawdhk\tauwdh iyi\t`, true)
  run(`\tawdhk\tauwdh iyi   \t     \t  `, true)
  run(`  \t \t  \t  awdhk\tauwdh iyi `, true)
  run(`  \t \t  \t  awdhk\tauwdh iyi\t`, true)
  run(`  \t \t  \t  awdhk\tauwdh iyi   \t     \t  `, true)
})
