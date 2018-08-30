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

describe(`normalizeLabel`, () => {
  const runEqual = (description, a, b) => it(description, () => expect(get(`normalizeLabel`)(a)).toEqual(get(`normalizeLabel`)(b)))
  const runInequal = (description, a, b) => it(description, () => expect(get(`normalizeLabel`)(a)).not.toEqual(get(`normalizeLabel`)(b)))
  runEqual(`normalizes case`, `Test Label`, `TeSt label`)
  runEqual(`normalizes white space type`, `Test\tLabel`, `Test Label`)
  runEqual(`normalizes white space quantity`, `Test      Label`, `Test Label`)
  runInequal(`does not normalize character choice`, `Test Label`, `Test Lebel`)
  runInequal(`does not normalize the existence of white space`, `Test Label`, `Test La bel`)
})
