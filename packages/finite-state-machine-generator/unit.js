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

describe(`combineLabels`, () => {
  const onError = jasmine.createSpy(`onError`)
  let normalizeLabelMappings
  const normalizeLabel = setSpy(`normalizeLabel`)
  normalizeLabel.and.callFake(label => normalizeLabelMappings[label])
  afterEach(() => {
    onError.calls.reset()
    normalizeLabel.calls.reset()
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
          normalizeLabelMappings = {
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
        it(`calls normalizeLabel once per label`, () => expect(normalizeLabel).toHaveBeenCalledTimes(9))
        it(`calls normalizeLabel with every label`, () => {
          expect(normalizeLabel).toHaveBeenCalledWith(`testLabelA`)
          expect(normalizeLabel).toHaveBeenCalledWith(`testLabelB`)
          expect(normalizeLabel).toHaveBeenCalledWith(`testLabelC`)
          expect(normalizeLabel).toHaveBeenCalledWith(`testLabelD`)
          expect(normalizeLabel).toHaveBeenCalledWith(`testLabelE`)
          expect(normalizeLabel).toHaveBeenCalledWith(`testLabelG`)
          expect(normalizeLabel).toHaveBeenCalledWith(`testLabelH`)
          expect(normalizeLabel).toHaveBeenCalledWith(`testLabelI`)
        })
      })
      describe(`without overlap`, () => {
        beforeEach(() => {
          normalizeLabelMappings = {
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
        it(`calls normalizeLabel once per label`, () => expect(normalizeLabel).toHaveBeenCalledTimes(9))
        it(`calls normalizeLabel with every label`, () => {
          expect(normalizeLabel).toHaveBeenCalledWith(`testLabelA`)
          expect(normalizeLabel).toHaveBeenCalledWith(`testLabelB`)
          expect(normalizeLabel).toHaveBeenCalledWith(`testLabelC`)
          expect(normalizeLabel).toHaveBeenCalledWith(`testLabelD`)
          expect(normalizeLabel).toHaveBeenCalledWith(`testLabelE`)
          expect(normalizeLabel).toHaveBeenCalledWith(`testLabelG`)
          expect(normalizeLabel).toHaveBeenCalledWith(`testLabelH`)
          expect(normalizeLabel).toHaveBeenCalledWith(`testLabelI`)
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
      it(`does not call normalizeLabel`, () => expect(normalizeLabel).not.toHaveBeenCalled())
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
      it(`does not call normalizeLabel`, () => expect(normalizeLabel).not.toHaveBeenCalled())
    })
    describe(`without b`, () => {
      beforeEach(() => {
        b = null
        result = get(`combineLabels`)(`Test Context`, onError, a, b)
      })
      it(`returns null`, () => expect(result).toBeNull())
      it(`does not call onError`, () => expect(onError).not.toHaveBeenCalled())
      it(`does not call normalizeLabel`, () => expect(normalizeLabel).not.toHaveBeenCalled())
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
    }
  })
  const combineLabels = setSpy(`combineLabels`)
  combineLabels.and.callFake((context, onError, a, b) => {
    switch (a) {
      case `Test Found Labels A`:
        return `Test Combination Of Labels A and B`

      case `Test Combination Of Labels A and B`:
        return `Test Combination Of Labels A B and C`
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
})
