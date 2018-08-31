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

describe(`normalizeName`, () => {
  const runEqual = (description, a, b) => it(description, () => expect(get(`normalizeName`)(a)).toEqual(get(`normalizeName`)(b)))
  const runInequal = (description, a, b) => it(description, () => expect(get(`normalizeName`)(a)).not.toEqual(get(`normalizeName`)(b)))
  runEqual(`normalizes case`, `Test Label`, `TeSt label`)
  runEqual(`normalizes white space type`, `Test\tLabel`, `Test Label`)
  runEqual(`normalizes white space quantity`, `Test      Label`, `Test Label`)
  runInequal(`does not normalize character choice`, `Test Label`, `Test Lebel`)
  runInequal(`does not normalize the existence of white space`, `Test Label`, `Test La bel`)
})

describe(`combineLabels`, () => {
  const onError = jasmine.createSpy(`onError`)
  let normalizeNameMappings
  const normalizeName = setSpy(`normalizeName`)
  normalizeName.and.callFake(label => normalizeNameMappings[label])
  afterEach(() => {
    onError.calls.reset()
    normalizeName.calls.reset()
  })
  let a
  let b
  let result
  describe(`with a`, () => {
    beforeEach(() => a = {
      testLabelA: `Test Label Location A`,
      testLabelB: `Test Label Location B`,
      testLabelC: `Test Label Location C`,
      testLabelD: `Test Label Location D`
    })
    describe(`with b`, () => {
      beforeEach(() => b = {
        testLabelE: `Test Label Location E`,
        testLabelF: `Test Label Location F`,
        testLabelG: `Test Label Location G`,
        testLabelH: `Test Label Location H`,
        testLabelI: `Test Label Location I`
      })
      describe(`with overlap`, () => {
        beforeEach(() => {
          normalizeNameMappings = {
            testLabelA: `Test Normalized Label A`,
            testLabelB: `Test Normalized Label B`,
            testLabelC: `Test Normalized Label C`,
            testLabelD: `Test Normalized Label D`,
            testLabelE: `Test Normalized Label E`,
            testLabelF: `Test Normalized Label D`,
            testLabelG: `Test Normalized Label G`,
            testLabelH: `Test Normalized Label B`,
            testLabelI: `Test Normalized Label I`
          }
          result = get(`combineLabels`)(`Test Context`, onError, a, b)
        })
        it(`does not modify a`, () => expect(a).toEqual({
          testLabelA: `Test Label Location A`,
          testLabelB: `Test Label Location B`,
          testLabelC: `Test Label Location C`,
          testLabelD: `Test Label Location D`
        }))
        it(`does not modify b`, () => expect(b).toEqual({
          testLabelE: `Test Label Location E`,
          testLabelF: `Test Label Location F`,
          testLabelG: `Test Label Location G`,
          testLabelH: `Test Label Location H`,
          testLabelI: `Test Label Location I`
        }))
        it(`includes every label from a`, () => {
          expect(result.testLabelA).toEqual(`Test Label Location A`)
          expect(result.testLabelB).toEqual(`Test Label Location B`)
          expect(result.testLabelC).toEqual(`Test Label Location C`)
          expect(result.testLabelD).toEqual(`Test Label Location D`)
        })
        it(`includes every label from b which is not in a`, () => {
          expect(result.testLabelE).toEqual(`Test Label Location E`)
          expect(result.testLabelG).toEqual(`Test Label Location G`)
          expect(result.testLabelI).toEqual(`Test Label Location I`)
        })
        it(`includes no further labels`, () => expect(Object.keys(result).length).toEqual(7))
        it(`calls onError once for every overlapping label`, () => expect(onError).toHaveBeenCalledTimes(2))
        it(`calls onError with the context`, () => {
          expect(onError.calls.argsFor(0)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything()])
          expect(onError.calls.argsFor(1)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything()])
        })
        xit(`calls onError with the line number`, () => { })
        it(`calls onError with a message specifying that the overlapping labels have been defined multiple times`, () => {
          expect(onError).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `The label "testLabelB" is defined multiple times`)
          expect(onError).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `The label "testLabelD" is defined multiple times`)
        })
        it(`calls normalizeName once per label`, () => expect(normalizeName).toHaveBeenCalledTimes(9))
        it(`calls normalizeName with every label`, () => {
          expect(normalizeName).toHaveBeenCalledWith(`testLabelA`)
          expect(normalizeName).toHaveBeenCalledWith(`testLabelB`)
          expect(normalizeName).toHaveBeenCalledWith(`testLabelC`)
          expect(normalizeName).toHaveBeenCalledWith(`testLabelD`)
          expect(normalizeName).toHaveBeenCalledWith(`testLabelE`)
          expect(normalizeName).toHaveBeenCalledWith(`testLabelG`)
          expect(normalizeName).toHaveBeenCalledWith(`testLabelH`)
          expect(normalizeName).toHaveBeenCalledWith(`testLabelI`)
        })
      })
      describe(`without overlap`, () => {
        beforeEach(() => {
          normalizeNameMappings = {
            testLabelA: `Test Normalized Label A`,
            testLabelB: `Test Normalized Label B`,
            testLabelC: `Test Normalized Label C`,
            testLabelD: `Test Normalized Label D`,
            testLabelE: `Test Normalized Label E`,
            testLabelF: `Test Normalized Label F`,
            testLabelG: `Test Normalized Label G`,
            testLabelH: `Test Normalized Label H`,
            testLabelI: `Test Normalized Label I`
          }
          result = get(`combineLabels`)(`Test Context`, onError, a, b)
        })
        it(`does not modify a`, () => expect(a).toEqual({
          testLabelA: `Test Label Location A`,
          testLabelB: `Test Label Location B`,
          testLabelC: `Test Label Location C`,
          testLabelD: `Test Label Location D`
        }))
        it(`does not modify b`, () => expect(b).toEqual({
          testLabelE: `Test Label Location E`,
          testLabelF: `Test Label Location F`,
          testLabelG: `Test Label Location G`,
          testLabelH: `Test Label Location H`,
          testLabelI: `Test Label Location I`
        }))
        it(`includes every label from a`, () => {
          expect(result.testLabelA).toEqual(`Test Label Location A`)
          expect(result.testLabelB).toEqual(`Test Label Location B`)
          expect(result.testLabelC).toEqual(`Test Label Location C`)
          expect(result.testLabelD).toEqual(`Test Label Location D`)
        })
        it(`includes every label from b`, () => {
          expect(result.testLabelE).toEqual(`Test Label Location E`)
          expect(result.testLabelF).toEqual(`Test Label Location F`)
          expect(result.testLabelG).toEqual(`Test Label Location G`)
          expect(result.testLabelH).toEqual(`Test Label Location H`)
          expect(result.testLabelI).toEqual(`Test Label Location I`)
        })
        it(`includes no further labels`, () => expect(Object.keys(result).length).toEqual(9))
        it(`does not call onError`, () => expect(onError).not.toHaveBeenCalled())
        it(`calls normalizeName once per label`, () => expect(normalizeName).toHaveBeenCalledTimes(9))
        it(`calls normalizeName with every label`, () => {
          expect(normalizeName).toHaveBeenCalledWith(`testLabelA`)
          expect(normalizeName).toHaveBeenCalledWith(`testLabelB`)
          expect(normalizeName).toHaveBeenCalledWith(`testLabelC`)
          expect(normalizeName).toHaveBeenCalledWith(`testLabelD`)
          expect(normalizeName).toHaveBeenCalledWith(`testLabelE`)
          expect(normalizeName).toHaveBeenCalledWith(`testLabelG`)
          expect(normalizeName).toHaveBeenCalledWith(`testLabelH`)
          expect(normalizeName).toHaveBeenCalledWith(`testLabelI`)
        })
      })
    })
    describe(`without b`, () => {
      beforeEach(() => {
        b = null
        result = get(`combineLabels`)(`Test Context`, onError, a, b)
      })
      it(`does not modify a`, () => expect(a).toEqual({
        testLabelA: `Test Label Location A`,
        testLabelB: `Test Label Location B`,
        testLabelC: `Test Label Location C`,
        testLabelD: `Test Label Location D`
      }))
      it(`returns a`, () => expect(result).toBe(a))
      it(`does not call onError`, () => expect(onError).not.toHaveBeenCalled())
      it(`does not call normalizeName`, () => expect(normalizeName).not.toHaveBeenCalled())
    })
  })
  describe(`without a`, () => {
    beforeEach(() => a = null)
    describe(`with b`, () => {
      beforeEach(() => {
        b = {
          testLabelA: `Test Label Location A`,
          testLabelB: `Test Label Location B`,
          testLabelC: `Test Label Location C`,
          testLabelD: `Test Label Location D`
        }
        result = get(`combineLabels`)(`Test Context`, onError, a, b)
      })
      it(`does not modify b`, () => expect(b).toEqual({
        testLabelA: `Test Label Location A`,
        testLabelB: `Test Label Location B`,
        testLabelC: `Test Label Location C`,
        testLabelD: `Test Label Location D`
      }))
      it(`returns b`, () => expect(result).toBe(b))
      it(`does not call onError`, () => expect(onError).not.toHaveBeenCalled())
      it(`does not call normalizeName`, () => expect(normalizeName).not.toHaveBeenCalled())
    })
    describe(`without b`, () => {
      beforeEach(() => {
        b = null
        result = get(`combineLabels`)(`Test Context`, onError, a, b)
      })
      it(`returns null`, () => expect(result).toBeNull())
      it(`does not call onError`, () => expect(onError).not.toHaveBeenCalled())
      it(`does not call normalizeName`, () => expect(normalizeName).not.toHaveBeenCalled())
    })
  })
})

describe(`findLabelsInStatementArray`, () => {
  const findLabelsInStatement = setSpy(`findLabelsInStatement`)
  findLabelsInStatement.and.callFake((context, onError, statement, nextStatements) => {
    switch (statement) {
      case `Test Statement A`:
        return `Test Found Labels A`

      case `Test Statement B`:
        return `Test Found Labels B`

      case `Test Statement C`:
        return `Test Found Labels C`

      case `Test Statement D`:
        return `Test Found Labels D`
    }
  })
  const combineLabels = setSpy(`combineLabels`)
  combineLabels.and.callFake((context, onError, a, b) => {
    switch (a) {
      case `Test Found Labels A`:
        return `Test Combination Of Labels A and B`

      case `Test Combination Of Labels A and B`:
        return `Test Combination Of Labels A B and C`

      case `Test Combination Of Labels A B and C`:
        return `Test Combination Of Labels A B C and D`
    }
  })
  afterEach(() => {
    findLabelsInStatement.calls.reset()
    combineLabels.calls.reset()
  })
  let statements
  let nextStatements
  let result
  beforeEach(() => {
    nextStatements = [
      `Test Next Statement A`,
      `Test Next Statement B`,
      `Test Next Statement C`
    ]
  })
  describe(`no statements`, () => {
    beforeEach(() => {
      statements = []
      result = get(`findLabelsInStatementArray`)(`Test Context`, `Test On Error`, statements, nextStatements)
    })
    it(`returns null`, () => expect(result).toBeNull())
    it(`does not modify statements`, () => expect(statements).toEqual([]))
    it(`does not modify nextStatements`, () => expect(nextStatements).toEqual([
      `Test Next Statement A`,
      `Test Next Statement B`,
      `Test Next Statement C`
    ]))
    it(`does not call findLabelsInStatement`, () => expect(findLabelsInStatement).not.toHaveBeenCalled())
    it(`does not call combineLabels`, () => expect(combineLabels).not.toHaveBeenCalled())
  })
  describe(`one statement`, () => {
    beforeEach(() => {
      statements = [
        `Test Statement A`
      ]
      result = get(`findLabelsInStatementArray`)(`Test Context`, `Test On Error`, statements, nextStatements)
    })
    it(`returns the labels found from the statement`, () => expect(result).toEqual(`Test Found Labels A`))
    it(`does not modify statements`, () => expect(statements).toEqual([
      `Test Statement A`
    ]))
    it(`does not modify nextStatements`, () => expect(nextStatements).toEqual([
      `Test Next Statement A`,
      `Test Next Statement B`,
      `Test Next Statement C`
    ]))
    it(`calls findLabelsInStatement once`, () => expect(findLabelsInStatement).toHaveBeenCalledTimes(1))
    it(`calls findLabelsInStatement with the context`, () => expect(findLabelsInStatement).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findLabelsInStatement with onError`, () => expect(findLabelsInStatement).toHaveBeenCalledWith(jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()))
    it(`calls findLabelsInStatement with the statement`, () => expect(findLabelsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statement A`, jasmine.anything()))
    it(`calls findLabelsInStatement with the next statements`, () => expect(findLabelsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), [
      `Test Next Statement A`,
      `Test Next Statement B`,
      `Test Next Statement C`
    ]))
    it(`does not call combineLabels`, () => expect(combineLabels).not.toHaveBeenCalled())
  })
  describe(`two statements`, () => {
    beforeEach(() => {
      statements = [
        `Test Statement A`,
        `Test Statement B`
      ]
      result = get(`findLabelsInStatementArray`)(`Test Context`, `Test On Error`, statements, nextStatements)
    })
    it(`returns the combined labels`, () => expect(result).toEqual(`Test Combination Of Labels A and B`))
    it(`does not modify statements`, () => expect(statements).toEqual([
      `Test Statement A`,
      `Test Statement B`
    ]))
    it(`does not modify nextStatements`, () => expect(nextStatements).toEqual([
      `Test Next Statement A`,
      `Test Next Statement B`,
      `Test Next Statement C`
    ]))
    it(`calls findLabelsInStatement once per statement`, () => expect(findLabelsInStatement).toHaveBeenCalledTimes(2))
    it(`calls findLabelsInStatement with the context`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatement with onError`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatement for the first statement`, () => expect(findLabelsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statement A`, [
      `Test Statement B`,
      `Test Next Statement A`,
      `Test Next Statement B`,
      `Test Next Statement C`
    ]))
    it(`calls findLabelsInStatement for the second statement`, () => expect(findLabelsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statement B`, [
      `Test Next Statement A`,
      `Test Next Statement B`,
      `Test Next Statement C`
    ]))
    it(`calls combineLabels once`, () => expect(combineLabels).toHaveBeenCalledTimes(1))
    it(`calls combineLabels with the context`, () => expect(combineLabels).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls combineLabels with onError`, () => expect(combineLabels).toHaveBeenCalledWith(jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()))
    it(`calls combineLabels with the labels extracted from the first and second statements`, () => expect(combineLabels).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Found Labels A`, `Test Found Labels B`))
  })
  describe(`three statements`, () => {
    beforeEach(() => {
      statements = [
        `Test Statement A`,
        `Test Statement B`,
        `Test Statement C`
      ]
      result = get(`findLabelsInStatementArray`)(`Test Context`, `Test On Error`, statements, nextStatements)
    })
    it(`returns the combined labels`, () => expect(result).toEqual(`Test Combination Of Labels A B and C`))
    it(`does not modify statements`, () => expect(statements).toEqual([
      `Test Statement A`,
      `Test Statement B`,
      `Test Statement C`
    ]))
    it(`does not modify nextStatements`, () => expect(nextStatements).toEqual([
      `Test Next Statement A`,
      `Test Next Statement B`,
      `Test Next Statement C`
    ]))
    it(`calls findLabelsInStatement once per statement`, () => expect(findLabelsInStatement).toHaveBeenCalledTimes(3))
    it(`calls findLabelsInStatement with the context`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(2)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatement with onError`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(2)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatement for the first statement`, () => expect(findLabelsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statement A`, [
      `Test Statement B`,
      `Test Statement C`,
      `Test Next Statement A`,
      `Test Next Statement B`,
      `Test Next Statement C`
    ]))
    it(`calls findLabelsInStatement for the second statement`, () => expect(findLabelsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statement B`, [
      `Test Statement C`,
      `Test Next Statement A`,
      `Test Next Statement B`,
      `Test Next Statement C`
    ]))
    it(`calls findLabelsInStatement for the third statement`, () => expect(findLabelsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statement C`, [
      `Test Next Statement A`,
      `Test Next Statement B`,
      `Test Next Statement C`
    ]))
    it(`calls combineLabels once per statement combination`, () => expect(combineLabels).toHaveBeenCalledTimes(2))
    it(`calls combineLabels with the context`, () => {
      expect(combineLabels.calls.argsFor(0)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(combineLabels.calls.argsFor(1)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
    })
    it(`calls combineLabels with onError`, () => {
      expect(combineLabels.calls.argsFor(0)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
      expect(combineLabels.calls.argsFor(1)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
    })
    it(`calls combineLabels with the labels extracted from the first and second statements`, () => expect(combineLabels).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Found Labels A`, `Test Found Labels B`))
    it(`calls combineLabels with the labels extracted from the first second and third statements`, () => expect(combineLabels).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Combination Of Labels A and B`, `Test Found Labels C`))
  })
  describe(`four statements`, () => {
    beforeEach(() => {
      statements = [
        `Test Statement A`,
        `Test Statement B`,
        `Test Statement C`,
        `Test Statement D`
      ]
      result = get(`findLabelsInStatementArray`)(`Test Context`, `Test On Error`, statements, nextStatements)
    })
    it(`returns the combined labels`, () => expect(result).toEqual(`Test Combination Of Labels A B C and D`))
    it(`does not modify statements`, () => expect(statements).toEqual([
      `Test Statement A`,
      `Test Statement B`,
      `Test Statement C`,
      `Test Statement D`
    ]))
    it(`does not modify nextStatements`, () => expect(nextStatements).toEqual([
      `Test Next Statement A`,
      `Test Next Statement B`,
      `Test Next Statement C`
    ]))
    it(`calls findLabelsInStatement once per statement`, () => expect(findLabelsInStatement).toHaveBeenCalledTimes(4))
    it(`calls findLabelsInStatement with the context`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(2)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatement with onError`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(2)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatement for the first statement`, () => expect(findLabelsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statement A`, [
      `Test Statement B`,
      `Test Statement C`,
      `Test Statement D`,
      `Test Next Statement A`,
      `Test Next Statement B`,
      `Test Next Statement C`
    ]))
    it(`calls findLabelsInStatement for the second statement`, () => expect(findLabelsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statement B`, [
      `Test Statement C`,
      `Test Statement D`,
      `Test Next Statement A`,
      `Test Next Statement B`,
      `Test Next Statement C`
    ]))
    it(`calls findLabelsInStatement for the third statement`, () => expect(findLabelsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statement C`, [
      `Test Statement D`,
      `Test Next Statement A`,
      `Test Next Statement B`,
      `Test Next Statement C`
    ]))
    it(`calls findLabelsInStatement for the third statement`, () => expect(findLabelsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statement D`, [
      `Test Next Statement A`,
      `Test Next Statement B`,
      `Test Next Statement C`
    ]))
    it(`calls combineLabels once per statement combination`, () => expect(combineLabels).toHaveBeenCalledTimes(3))
    it(`calls combineLabels with the context`, () => {
      expect(combineLabels.calls.argsFor(0)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(combineLabels.calls.argsFor(1)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(combineLabels.calls.argsFor(2)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
    })
    it(`calls combineLabels with onError`, () => {
      expect(combineLabels.calls.argsFor(0)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
      expect(combineLabels.calls.argsFor(1)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
      expect(combineLabels.calls.argsFor(2)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
    })
    it(`calls combineLabels with the labels extracted from the first and second statements`, () => expect(combineLabels).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Found Labels A`, `Test Found Labels B`))
    it(`calls combineLabels with the labels extracted from the first second and third statements`, () => expect(combineLabels).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Combination Of Labels A and B`, `Test Found Labels C`))
    it(`calls combineLabels with the labels extracted from the first second third and fourth statements`, () => expect(combineLabels).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Combination Of Labels A B and C`, `Test Found Labels D`))
  })
})


describe(`findLabelsInStatement`, () => {
  const findLabelsInStatementArray = setSpy(`findLabelsInStatementArray`)
  findLabelsInStatementArray.and.callFake((context, onError, statements, nextStatements) => {
    switch (statements) {
      case `Test Statements A`:
        return `Test Found Labels A`

      case `Test Statements B`:
        return `Test Found Labels B`

      case `Test Statements C`:
        return `Test Found Labels C`

      case `Test Statements D`:
        return `Test Found Labels D`
    }
  })
  const combineLabels = setSpy(`combineLabels`)
  combineLabels.and.callFake((context, onError, a, b) => {
    switch (a) {
      case `Test Found Labels A`:
        return `Test Combination Of Labels A and B`

      case `Test Combination Of Labels A and B`:
        return `Test Combination Of Labels A B and C`

      case `Test Combination Of Labels A B and C`:
        return `Test Combination Of Labels A B C and D`
    }
  })
  afterEach(() => {
    findLabelsInStatementArray.calls.reset()
    combineLabels.calls.reset()
  })
  let result
  let inputCopy
  const containsNoLabels = (description, input) => describe(description, () => {
    beforeEach(() => {
      inputCopy = JSON.parse(JSON.stringify(input))
      result = get(`findLabelsInStatement`)(`Test Context`, `Test On Error`, inputCopy, `Test Next Statements`)
    })
    it(`returns null`, () => expect(result).toBeNull())
    it(`does not modify the input`, () => expect(inputCopy).toEqual(input))
    it(`does not call findLabelsInStatementArray`, () => expect(findLabelsInStatementArray).not.toHaveBeenCalled())
    it(`does not call combineLabels`, () => expect(combineLabels).not.toHaveBeenCalled())
  })
  const containsOneArrayOfLabels = (description, input) => describe(description, () => {
    beforeEach(() => {
      inputCopy = JSON.parse(JSON.stringify(input))
      result = get(`findLabelsInStatement`)(`Test Context`, `Test On Error`, inputCopy, `Test Next Statements`)
    })
    it(`returns the labels from the statement array`, () => expect(result).toEqual(`Test Found Labels A`))
    it(`does not modify the input`, () => expect(inputCopy).toEqual(input))
    it(`calls findLabelsInStatementArray once`, () => expect(findLabelsInStatementArray).toHaveBeenCalledTimes(1))
    it(`calls findLabelsInStatementArray with the context`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findLabelsInStatementArray with onError`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()))
    it(`calls findLabelsInStatementArray with the statement array`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statements A`, jasmine.anything()))
    it(`calls findLabelsInStatementArray with the next statements`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Next Statements`))
    it(`does not call combineLabels`, () => expect(combineLabels).not.toHaveBeenCalled())
  })
  const containsTwoArraysOfLabels = (description, input) => describe(description, () => {
    beforeEach(() => {
      inputCopy = JSON.parse(JSON.stringify(input))
      result = get(`findLabelsInStatement`)(`Test Context`, `Test On Error`, inputCopy, `Test Next Statements`)
    })
    it(`returns the combined labels from the statement arrays`, () => expect(result).toEqual(`Test Combination Of Labels A and B`))
    it(`does not modify the input`, () => expect(inputCopy).toEqual(input))
    it(`calls findLabelsInStatementArray once per statement array`, () => expect(findLabelsInStatementArray).toHaveBeenCalledTimes(2))
    it(`calls findLabelsInStatementArray with the context`, () => {
      expect(findLabelsInStatementArray.calls.argsFor(0)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(1)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatementArray with onError`, () => {
      expect(findLabelsInStatementArray.calls.argsFor(0)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(1)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatementArray with the first statement array`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statements A`, jasmine.anything()))
    it(`calls findLabelsInStatementArray with the second statement array`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statements B`, jasmine.anything()))
    it(`calls findLabelsInStatementArray with the next statements`, () => {
      expect(findLabelsInStatementArray.calls.argsFor(0)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Next Statements`])
      expect(findLabelsInStatementArray.calls.argsFor(1)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Next Statements`])
    })
    it(`calls combineLabels once`, () => expect(combineLabels).toHaveBeenCalledTimes(1))
    it(`calls combineLabels with the context`, () => expect(combineLabels).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls combineLabels with onError`, () => expect(combineLabels).toHaveBeenCalledWith(jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()))
    it(`calls combineLabels with the labels from the first statement array`, () => expect(combineLabels).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Found Labels A`, jasmine.anything()))
    it(`calls combineLabels with the labels from the second statement array`, () => expect(combineLabels).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Found Labels B`))
  })
  const containsThreeArraysOfLabels = (description, input) => describe(description, () => {
    beforeEach(() => {
      inputCopy = JSON.parse(JSON.stringify(input))
      result = get(`findLabelsInStatement`)(`Test Context`, `Test On Error`, inputCopy, `Test Next Statements`)
    })
    it(`returns the combined labels from the statement arrays`, () => expect(result).toEqual(`Test Combination Of Labels A B and C`))
    it(`does not modify the input`, () => expect(inputCopy).toEqual(input))
    it(`calls findLabelsInStatementArray once per statement array`, () => expect(findLabelsInStatementArray).toHaveBeenCalledTimes(3))
    it(`calls findLabelsInStatementArray with the context`, () => {
      expect(findLabelsInStatementArray.calls.argsFor(0)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(1)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(2)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatementArray with onError`, () => {
      expect(findLabelsInStatementArray.calls.argsFor(0)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(1)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(2)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatementArray with the first statement array`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statements A`, jasmine.anything()))
    it(`calls findLabelsInStatementArray with the second statement array`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statements B`, jasmine.anything()))
    it(`calls findLabelsInStatementArray with the third statement array`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statements C`, jasmine.anything()))
    it(`calls findLabelsInStatementArray with the next statements`, () => {
      expect(findLabelsInStatementArray.calls.argsFor(0)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Next Statements`])
      expect(findLabelsInStatementArray.calls.argsFor(1)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Next Statements`])
      expect(findLabelsInStatementArray.calls.argsFor(2)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Next Statements`])
    })
    it(`calls combineLabels once per label combination`, () => expect(combineLabels).toHaveBeenCalledTimes(2))
    it(`calls combineLabels with the context`, () => {
      expect(combineLabels.calls.argsFor(0)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(combineLabels.calls.argsFor(1)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
    })
    it(`calls combineLabels with onError`, () => {
      expect(combineLabels.calls.argsFor(0)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
      expect(combineLabels.calls.argsFor(1)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
    })
    it(`calls combineLabels with the labels from the first and second statement arrays`, () => expect(combineLabels).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Found Labels A`, `Test Found Labels B`))
    it(`calls combineLabels with the labels from the first second and third statement arrays`, () => expect(combineLabels).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Combination Of Labels A and B`, `Test Found Labels C`))
  })
  const containsFourArraysOfLabels = (description, input) => describe(description, () => {
    beforeEach(() => {
      inputCopy = JSON.parse(JSON.stringify(input))
      result = get(`findLabelsInStatement`)(`Test Context`, `Test On Error`, inputCopy, `Test Next Statements`)
    })
    it(`returns the combined labels from the statement arrays`, () => expect(result).toEqual(`Test Combination Of Labels A B C and D`))
    it(`does not modify the input`, () => expect(inputCopy).toEqual(input))
    it(`calls findLabelsInStatementArray once per statement array`, () => expect(findLabelsInStatementArray).toHaveBeenCalledTimes(4))
    it(`calls findLabelsInStatementArray with the context`, () => {
      expect(findLabelsInStatementArray.calls.argsFor(0)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(1)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(2)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(3)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatementArray with onError`, () => {
      expect(findLabelsInStatementArray.calls.argsFor(0)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(1)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(2)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(3)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatementArray with the first statement array`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statements A`, jasmine.anything()))
    it(`calls findLabelsInStatementArray with the second statement array`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statements B`, jasmine.anything()))
    it(`calls findLabelsInStatementArray with the third statement array`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statements C`, jasmine.anything()))
    it(`calls findLabelsInStatementArray with the fourth statement array`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statements D`, jasmine.anything()))
    it(`calls findLabelsInStatementArray with the next statements`, () => {
      expect(findLabelsInStatementArray.calls.argsFor(0)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Next Statements`])
      expect(findLabelsInStatementArray.calls.argsFor(1)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Next Statements`])
      expect(findLabelsInStatementArray.calls.argsFor(2)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Next Statements`])
      expect(findLabelsInStatementArray.calls.argsFor(3)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Next Statements`])
    })
    it(`calls combineLabels once per label combination`, () => expect(combineLabels).toHaveBeenCalledTimes(3))
    it(`calls combineLabels with the context`, () => {
      expect(combineLabels.calls.argsFor(0)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(combineLabels.calls.argsFor(1)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(combineLabels.calls.argsFor(2)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
    })
    it(`calls combineLabels with onError`, () => {
      expect(combineLabels.calls.argsFor(0)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
      expect(combineLabels.calls.argsFor(1)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
      expect(combineLabels.calls.argsFor(2)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything()])
    })
    it(`calls combineLabels with the labels from the first and second statement arrays`, () => expect(combineLabels).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Found Labels A`, `Test Found Labels B`))
    it(`calls combineLabels with the labels from the first second and third statement arrays`, () => expect(combineLabels).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Combination Of Labels A and B`, `Test Found Labels C`))
    it(`calls combineLabels with the labels from the first second third and fourth statement arrays`, () => expect(combineLabels).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Combination Of Labels A B and C`, `Test Found Labels D`))
  })
  containsNoLabels(`line`, {
    line: {
      promptId: `Test Prompt ID`,
      characters: [`Test Character A`, `Test Character B`, `Test Character C`],
      text: `Test Text`
    }
  })
  containsNoLabels(`emote`, {
    emote: {
      character: `Test Character`,
      emote: `Test Emote`
    }
  })
  containsNoLabels(`leave`, {
    leave: {
      character: `Test Character`
    }
  })
  containsNoLabels(`set`, {
    set: {
      flag: `Test Flag`,
      value: `Test Value`
    }
  })
  describe(`decision`, () => {
    containsOneArrayOfLabels(`if`, {
      decision: {
        paths: [{
          condition: `Test Condition A`,
          then: `Test Statements A`
        }]
      }
    })
    containsTwoArraysOfLabels(`if-else`, {
      decision: {
        paths: [{
          condition: `Test Condition A`,
          then: `Test Statements A`
        }, {
          condition: `Test Condition B`,
          then: `Test Statements B`
        }]
      }
    })
    containsThreeArraysOfLabels(`if-else-else`, {
      decision: {
        paths: [{
          condition: `Test Condition A`,
          then: `Test Statements A`
        }, {
          condition: `Test Condition B`,
          then: `Test Statements B`
        }, {
          condition: `Test Condition C`,
          then: `Test Statements C`
        }]
      }
    })
    containsFourArraysOfLabels(`if-else-else-else`, {
      decision: {
        paths: [{
          condition: `Test Condition A`,
          then: `Test Statements A`
        }, {
          condition: `Test Condition B`,
          then: `Test Statements B`
        }, {
          condition: `Test Condition C`,
          then: `Test Statements C`
        }, {
          condition: `Test Condition D`,
          then: `Test Statements D`
        }]
      }
    })
  })
  describe(`menu`, () => {
    containsOneArrayOfLabels(`one option`, {
      menu: {
        promptId: `Test Prompt Id`,
        paths: [{
          label: `Test Label A`,
          then: `Test Statements A`
        }]
      }
    })
    containsTwoArraysOfLabels(`two options`, {
      menu: {
        promptId: `Test Prompt Id`,
        paths: [{
          label: `Test Label A`,
          then: `Test Statements A`
        }, {
          label: `Test Label B`,
          then: `Test Statements B`
        }]
      }
    })
    containsThreeArraysOfLabels(`three options`, {
      menu: {
        promptId: `Test Prompt Id`,
        paths: [{
          label: `Test Label A`,
          then: `Test Statements A`
        }, {
          label: `Test Label B`,
          then: `Test Statements B`
        }, {
          label: `Test Label C`,
          then: `Test Statements C`
        }]
      }
    })
    containsFourArraysOfLabels(`four options`, {
      menu: {
        promptId: `Test Prompt Id`,
        paths: [{
          label: `Test Label A`,
          then: `Test Statements A`
        }, {
          label: `Test Label B`,
          then: `Test Statements B`
        }, {
          label: `Test Label C`,
          then: `Test Statements C`
        }, {
          label: `Test Label D`,
          then: `Test Statements D`
        }]
      }
    })
  })
  describe(`label`, () => {
    beforeEach(() => {
      inputCopy = {
        label: {
          name: `testName`
        }
      }
      result = get(`findLabelsInStatement`)(`Test Context`, `Test On Error`, inputCopy, `Test Next Statements`)
    })
    it(`returns the name, with the next statements`, () => expect(result).toEqual({
      testName: `Test Next Statements`
    }))
    it(`does not modify the input`, () => expect(inputCopy).toEqual({
      label: {
        name: `testName`
      }
    }))
    it(`does not call findLabelsInStatementArray`, () => expect(findLabelsInStatementArray).not.toHaveBeenCalled())
    it(`does not call combineLabels`, () => expect(combineLabels).not.toHaveBeenCalled())
  })
  containsNoLabels(`goTo`, {
    goTo: {
      label: `Test Label`
    }
  })
  containsNoLabels(`background`, {
    background: {
      name: `Test Name`
    }
  })
})

describe(`createState`, () => {
  it(`returns an object`, () => expect(get(`createState`)()).toEqual(jasmine.any(Object)))
  it(`returns flags, an empty object`, () => expect(get(`createState`)().flags).toEqual({}))
  it(`returns characters, an empty object`, () => expect(get(`createState`)().characters).toEqual({}))
  it(`returns background, null`, () => expect(get(`createState`)().background).toBeNull({}))
  it(`returns the same value every call`, () => expect(get(`createState`)()).toEqual(get(`createState`)()))
  it(`returns a new instance every call`, () => expect(get(`createState`)()).not.toBe(get(`createState`)()))
  it(`returns a new flags every call`, () => expect(get(`createState`)().flags).not.toBe(get(`createState`)().flags))
  it(`returns a new characters every call`, () => expect(get(`createState`)().characters).not.toBe(get(`createState`)().characters))
})