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
})
