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
  it(`returns empty given null`, () => expect(get(`normalizeName`)(null)).toEqual(``))
})

describe(`combineLabels`, () => {
  const onError = jasmine.createSpy(`onError`)
  afterEach(() => onError.calls.reset())
  let aCopy
  let bCopy
  let result
  const run = (description, a, b, then) => describe(description, () => {
    beforeEach(() => {
      aCopy = JSON.parse(JSON.stringify(a))
      bCopy = JSON.parse(JSON.stringify(b))
      result = get(`combineLabels`)(`Test Context`, onError, aCopy, bCopy)
    })
    it(`does not modify the first set of labels`, () => expect(aCopy).toEqual(a))
    it(`does not modify the second set of labels`, () => expect(bCopy).toEqual(b))
    then()
  })
  run(`all null`, null, null, () => {
    it(`does not raise an error`, () => expect(onError).not.toHaveBeenCalled())
    it(`returns null`, () => expect(result).toBeNull())
  })
  run(`first set of labels only`, [{
    name: `Test Name A`,
    normalizedName: `Test Normalized Name A`,
    statements: `Test Statements A`
  }, {
    name: `Test Name B`,
    normalizedName: `Test Normalized Name B`,
    statements: `Test Statements B`
  }, {
    name: `Test Name C`,
    normalizedName: `Test Normalized Name C`,
    statements: `Test Statements C`
  }, {
    name: `Test Name D`,
    normalizedName: `Test Normalized Name D`,
    statements: `Test Statements D`
  }], null, () => {
    it(`does not raise an error`, () => expect(onError).not.toHaveBeenCalled())
    it(`returns the first set of labels`, () => expect(result).toEqual([{
      name: `Test Name A`,
      normalizedName: `Test Normalized Name A`,
      statements: `Test Statements A`
    }, {
      name: `Test Name B`,
      normalizedName: `Test Normalized Name B`,
      statements: `Test Statements B`
    }, {
      name: `Test Name C`,
      normalizedName: `Test Normalized Name C`,
      statements: `Test Statements C`
    }, {
      name: `Test Name D`,
      normalizedName: `Test Normalized Name D`,
      statements: `Test Statements D`
    }]))
  })
  run(`second set of labels only`, null, [{
    name: `Test Name A`,
    normalizedName: `Test Normalized Name A`,
    statements: `Test Statements A`
  }, {
    name: `Test Name B`,
    normalizedName: `Test Normalized Name B`,
    statements: `Test Statements B`
  }, {
    name: `Test Name C`,
    normalizedName: `Test Normalized Name C`,
    statements: `Test Statements C`
  }, {
    name: `Test Name D`,
    normalizedName: `Test Normalized Name D`,
    statements: `Test Statements D`
  }], () => {
    it(`does not raise an error`, () => expect(onError).not.toHaveBeenCalled())
    it(`returns the second set of labels`, () => expect(result).toEqual([{
      name: `Test Name A`,
      normalizedName: `Test Normalized Name A`,
      statements: `Test Statements A`
    }, {
      name: `Test Name B`,
      normalizedName: `Test Normalized Name B`,
      statements: `Test Statements B`
    }, {
      name: `Test Name C`,
      normalizedName: `Test Normalized Name C`,
      statements: `Test Statements C`
    }, {
      name: `Test Name D`,
      normalizedName: `Test Normalized Name D`,
      statements: `Test Statements D`
    }]))
  })
  run(`two sets of labels without overlap`, [{
    name: `Test Name A`,
    normalizedName: `Test Normalized Name A`,
    statements: `Test Statements A`
  }, {
    name: `Test Name B`,
    normalizedName: `Test Normalized Name B`,
    statements: `Test Statements B`
  }, {
    name: `Test Name C`,
    normalizedName: `Test Normalized Name C`,
    statements: `Test Statements C`
  }, {
    name: `Test Name D`,
    normalizedName: `Test Normalized Name D`,
    statements: `Test Statements D`
  }], [{
    name: `Test Name E`,
    normalizedName: `Test Normalized Name E`,
    statements: `Test Statements E`
  }, {
    name: `Test Name F`,
    normalizedName: `Test Normalized Name F`,
    statements: `Test Statements F`
  }, {
    name: `Test Name G`,
    normalizedName: `Test Normalized Name G`,
    statements: `Test Statements G`
  }, {
    name: `Test Name H`,
    normalizedName: `Test Normalized Name H`,
    statements: `Test Statements H`
  }, {
    name: `Test Name I`,
    normalizedName: `Test Normalized Name I`,
    statements: `Test Statements I`
  }], () => {
    it(`does not raise an error`, () => expect(onError).not.toHaveBeenCalled())
    it(`returns the labels from the first set`, () => {
      expect(result).toContain({
        name: `Test Name A`,
        normalizedName: `Test Normalized Name A`,
        statements: `Test Statements A`
      })
      expect(result).toContain({
        name: `Test Name B`,
        normalizedName: `Test Normalized Name B`,
        statements: `Test Statements B`
      })
      expect(result).toContain({
        name: `Test Name C`,
        normalizedName: `Test Normalized Name C`,
        statements: `Test Statements C`
      })
      expect(result).toContain({
        name: `Test Name D`,
        normalizedName: `Test Normalized Name D`,
        statements: `Test Statements D`
      })
    })
    it(`returns the labels from the second set`, () => {
      expect(result).toContain({
        name: `Test Name E`,
        normalizedName: `Test Normalized Name E`,
        statements: `Test Statements E`
      })
      expect(result).toContain({
        name: `Test Name F`,
        normalizedName: `Test Normalized Name F`,
        statements: `Test Statements F`
      })
      expect(result).toContain({
        name: `Test Name G`,
        normalizedName: `Test Normalized Name G`,
        statements: `Test Statements G`
      })
      expect(result).toContain({
        name: `Test Name H`,
        normalizedName: `Test Normalized Name H`,
        statements: `Test Statements H`
      })
      expect(result).toContain({
        name: `Test Name I`,
        normalizedName: `Test Normalized Name I`,
        statements: `Test Statements I`
      })
    })
    it(`returns no further labels`, () => expect(result.length).toEqual(9))
  })
  run(`two sets of labels with overlap`, [{
    name: `Test Name A`,
    normalizedName: `Test Normalized Name A`,
    statements: `Test Statements A`
  }, {
    name: `Test Name B`,
    normalizedName: `Test Normalized Name B`,
    statements: `Test Statements B`
  }, {
    name: `Test Name C`,
    normalizedName: `Test Normalized Name C`,
    statements: `Test Statements C`
  }, {
    name: `Test Name D`,
    normalizedName: `Test Normalized Name D`,
    statements: `Test Statements D`
  }], [{
    name: `Test Name E`,
    normalizedName: `Test Normalized Name E`,
    statements: `Test Statements E`
  }, {
    name: `Test Name F`,
    normalizedName: `Test Normalized Name D`,
    statements: `Test Statements F`
  }, {
    name: `Test Name G`,
    normalizedName: `Test Normalized Name G`,
    statements: `Test Statements G`
  }, {
    name: `Test Name H`,
    normalizedName: `Test Normalized Name B`,
    statements: `Test Statements H`
  }, {
    name: `Test Name I`,
    normalizedName: `Test Normalized Name I`,
    statements: `Test Statements I`
  }], () => {
    it(`raises one error per overlapping label`, () => expect(onError).toHaveBeenCalledTimes(2))
    it(`raises errors using the context`, () => {
      expect(onError.calls.argsFor(0)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything()])
      expect(onError.calls.argsFor(1)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything()])
    })
    xit(`raises errors using the line number`, () => { })
    it(`raises errors with messages explaining to the end-user that the same label has been defined multiple times`, () => {
      expect(onError).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `The label "Test Name B" is defined multiple times`)
      expect(onError).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `The label "Test Name D" is defined multiple times`)
    })
    it(`returns the labels from the first set`, () => {
      expect(result).toContain({
        name: `Test Name A`,
        normalizedName: `Test Normalized Name A`,
        statements: `Test Statements A`
      })
      expect(result).toContain({
        name: `Test Name B`,
        normalizedName: `Test Normalized Name B`,
        statements: `Test Statements B`
      })
      expect(result).toContain({
        name: `Test Name C`,
        normalizedName: `Test Normalized Name C`,
        statements: `Test Statements C`
      })
      expect(result).toContain({
        name: `Test Name D`,
        normalizedName: `Test Normalized Name D`,
        statements: `Test Statements D`
      })
    })
    it(`returns the labels from the second set (excluding those which are also from the first set)`, () => {
      expect(result).toContain({
        name: `Test Name E`,
        normalizedName: `Test Normalized Name E`,
        statements: `Test Statements E`
      })
      expect(result).toContain({
        name: `Test Name G`,
        normalizedName: `Test Normalized Name G`,
        statements: `Test Statements G`
      })
      expect(result).toContain({
        name: `Test Name I`,
        normalizedName: `Test Normalized Name I`,
        statements: `Test Statements I`
      })
    })
    it(`returns no further labels`, () => expect(result.length).toEqual(7))
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
  const normalizeName = setSpy(`normalizeName`)
  normalizeName.and.returnValue(`Test Normalized Label Name`)
  afterEach(() => {
    findLabelsInStatementArray.calls.reset()
    combineLabels.calls.reset()
    normalizeName.calls.reset()
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
    it(`does not call normalizeName`, () => expect(normalizeName).not.toHaveBeenCalled())
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
    it(`does not call normalizeName`, () => expect(normalizeName).not.toHaveBeenCalled())
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
    it(`does not call normalizeName`, () => expect(normalizeName).not.toHaveBeenCalled())
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
    it(`does not call normalizeName`, () => expect(normalizeName).not.toHaveBeenCalled())
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
    it(`does not call normalizeName`, () => expect(normalizeName).not.toHaveBeenCalled())
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
          name: `Test Label Name`
        }
      }
      result = get(`findLabelsInStatement`)(`Test Context`, `Test On Error`, inputCopy, `Test Next Statements`)
    })
    it(`returns the name, with the next statements`, () => expect(result).toEqual([{
      name: `Test Label Name`,
      normalizedName: `Test Normalized Label Name`,
      statements: `Test Next Statements`
    }]))
    it(`does not modify the input`, () => expect(inputCopy).toEqual({
      label: {
        name: `Test Label Name`
      }
    }))
    it(`does not call findLabelsInStatementArray`, () => expect(findLabelsInStatementArray).not.toHaveBeenCalled())
    it(`does not call combineLabels`, () => expect(combineLabels).not.toHaveBeenCalled())
    it(`calls normalizeName once`, () => expect(normalizeName).toHaveBeenCalledTimes(1))
    it(`calls normalizeName with the label's name`, () => expect(normalizeName).toHaveBeenCalledWith(`Test Label Name`))
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
  it(`returns flags, an empty array`, () => expect(get(`createState`)().flags).toEqual([]))
  it(`returns characters, an empty array`, () => expect(get(`createState`)().characters).toEqual([]))
  it(`returns background, null`, () => expect(get(`createState`)().background).toBeNull({}))
  it(`returns the same value every call`, () => expect(get(`createState`)()).toEqual(get(`createState`)()))
  it(`returns a new instance every call`, () => expect(get(`createState`)()).not.toBe(get(`createState`)()))
  it(`returns a new flags every call`, () => expect(get(`createState`)().flags).not.toBe(get(`createState`)().flags))
  it(`returns a new characters every call`, () => expect(get(`createState`)().characters).not.toBe(get(`createState`)().characters))
})

describe(`hashStateFlag`, () => {
  it(`hashes the same when the normalized values are same`, () => expect(get(`hashStateFlag`)({
    flag: `Test Flag A`,
    normalizedFlag: `Test Normalized Flag`,
    value: `Test Value A`,
    normalizedValue: `Test Normalized Value`
  })).toEqual(get(`hashStateFlag`)({
    flag: `Test Flag B`,
    normalizedFlag: `Test Normalized Flag`,
    value: `Test Value B`,
    normalizedValue: `Test Normalized Value`
  })))
  it(`hashes differently should the normalized flag change`, () => expect(get(`hashStateFlag`)({
    flag: `Test Flag A`,
    normalizedFlag: `Test Normalized Flag A`,
    value: `Test Value A`,
    normalizedValue: `Test Normalized Value`
  })).not.toEqual(get(`hashStateFlag`)({
    flag: `Test Flag B`,
    normalizedFlag: `Test Normalized Flag B`,
    value: `Test Value B`,
    normalizedValue: `Test Normalized Value`
  })))
  it(`hashes differently should the normalized value change`, () => expect(get(`hashStateFlag`)({
    flag: `Test Flag A`,
    normalizedFlag: `Test Normalized Flag`,
    value: `Test Value A`,
    normalizedValue: `Test Normalized Value A`
  })).not.toEqual(get(`hashStateFlag`)({
    flag: `Test Flag B`,
    normalizedFlag: `Test Normalized Flag`,
    value: `Test Value B`,
    normalizedValue: `Test Normalized Value B`
  })))
  it(`separates the flag and value`, () => expect(get(`hashStateFlag`)({
    flag: `Test Flag A`,
    normalizedFlag: `Test Normalized Flag A`,
    value: `Test Value A`,
    normalizedValue: `Test Normalized Value`
  })).not.toEqual(get(`hashStateFlag`)({
    flag: `Test Flag B`,
    normalizedFlag: `Test Normalized Flag`,
    value: `Test Value B`,
    normalizedValue: `A Test Normalized Value`
  })))
  it(`separates the value and flag`, () => expect(get(`hashStateFlag`)({
    flag: `Test Flag A`,
    normalizedFlag: `A Test Normalized Flag`,
    value: `Test Value A`,
    normalizedValue: `Test Normalized Value`
  })).not.toEqual(get(`hashStateFlag`)({
    flag: `Test Flag B`,
    normalizedFlag: `Test Normalized Flag A`,
    value: `Test Value B`,
    normalizedValue: `Test Normalized Value`
  })))
  it(`still sorts by normalized flag`, () => {
    const hashes = [{
      flag: `Test Flag`,
      normalizedFlag: `Test Normalized Flag C`,
      value: `Test Value`,
      normalizedValue: `Test Normalized Value D`
    }, {
      flag: `Test Flag`,
      normalizedFlag: `Test Normalized Flag A`,
      value: `Test Value`,
      normalizedValue: `Test Normalized Value B`
    }, {
      flag: `Test Flag`,
      normalizedFlag: `Test Normalized Flag D`,
      value: `Test Value`,
      normalizedValue: `Test Normalized Value C`
    }, {
      flag: `Test Flag`,
      normalizedFlag: `Test Normalized Flag B`,
      value: `Test Value`,
      normalizedValue: `Test Normalized Value A`
    }].map(flag => get(`hashStateFlag`)(flag))
    const sortedHashes = hashes.slice().sort()
    const sortedIndices = sortedHashes.map(hash => hashes.indexOf(hash))
    expect(sortedIndices).toEqual([1, 3, 0, 2])
  })
})

describe(`hashStateFlags`, () => {
  let unhashedA
  let unhashedACopy
  let unhashedB
  let unhashedBCopy
  let resultA
  let resultB
  const hashStateFlag = setSpy(`hashStateFlag`)
  afterEach(() => hashStateFlag.calls.reset())
  const run = (description, hashedA, hashedB, then) => describe(description, () => {
    beforeEach(() => {
      unhashedA = hashedA.map((hashed, i) => `Test Unhashed A ${i}`)
      unhashedACopy = unhashedA.slice()
      unhashedB = hashedB.map((hashed, i) => `Test Unhashed B ${i}`)
      unhashedBCopy = unhashedB.slice()
      hashStateFlag.and.callFake(flag => {
        const match = /^Test Unhashed ([A-Z]) (\d+)$/.exec(flag)
        switch (match[1]) {
          case `A`:
            return hashedA[match[2]]
          case `B`:
            return hashedB[match[2]]
        }
      })
      resultA = get(`hashStateFlags`)(unhashedA)
      resultB = get(`hashStateFlags`)(unhashedB)
    })
    it(`calls hashStateFlag once per flag`, () => expect(hashStateFlag).toHaveBeenCalledTimes(hashedA.length + hashedB.length))
    it(`calls hashStateFlag for every flag from the first set`, () => unhashedACopy.forEach(unhashed => expect(hashStateFlag).toHaveBeenCalledWith(unhashed)))
    it(`calls hashStateFlag for every flag from the second set`, () => unhashedBCopy.forEach(unhashed => expect(hashStateFlag).toHaveBeenCalledWith(unhashed)))
    it(`does not modify the first set of flags`, () => expect(unhashedA).toEqual(unhashedACopy))
    it(`does not modify the second set of flags`, () => expect(unhashedB).toEqual(unhashedBCopy))
    then()
  })
  const runMatching = (description, hashedA, hashedB) => run(description, hashedA, hashedB, () => {
    it(`returns matching values`, () => expect(resultA).toEqual(resultB))
  })
  const runNotMatching = (description, hashedA, hashedB) => run(description, hashedA, hashedB, () => {
    it(`returns differing values`, () => expect(resultA).not.toEqual(resultB))
  })
  runMatching(`returns the same value when there are no flags`, [], [])
  runMatching(`returns the same value when there is one flag which hashes identically`, [`Test Hashed Flag A`], [`Test Hashed Flag A`])
  runNotMatching(`returns a different value when there is one flag which hashes differently`, [`Test Hashed Flag A`], [`Test Hashed Flag B`])
  runMatching(`returns the same value when there are two flags which hash identically`, [`Test Hashed Flag A`, `Test Hashed Flag B`], [`Test Hashed Flag A`, `Test Hashed Flag B`])
  runMatching(`returns the same value when there are two flags which hash identically, regardless of order`, [`Test Hashed Flag A`, `Test Hashed Flag B`], [`Test Hashed Flag B`, `Test Hashed Flag A`])
  runNotMatching(`returns a different value when there are two flags, the first of which hashes differently`, [`Test Hashed Flag A`, `Test Hashed Flag B`], [`Test Hashed Flag C`, `Test Hashed Flag B`])
  runNotMatching(`returns a different value when there are two flags, the second of which hashes differently`, [`Test Hashed Flag A`, `Test Hashed Flag B`], [`Test Hashed Flag A`, `Test Hashed Flag C`])
  runMatching(`returns the same value when there are three flags which hash identically`, [`Test Hashed Flag A`, `Test Hashed Flag B`, `Test Hashed Flag C`], [`Test Hashed Flag A`, `Test Hashed Flag B`, `Test Hashed Flag C`])
  runMatching(`returns the same value when there are three flags which hash identically, regardless of order`, [`Test Hashed Flag A`, `Test Hashed Flag B`, `Test Hashed Flag C`], [`Test Hashed Flag C`, `Test Hashed Flag A`, `Test Hashed Flag B`])
  runNotMatching(`returns a different value when there are three flags, the first of which hashes differently`, [`Test Hashed Flag A`, `Test Hashed Flag B`, `Test Hashed Flag C`], [`Test Hashed Flag D`, `Test Hashed Flag B`, `Test Hashed Flag C`])
  runNotMatching(`returns a different value when there are three flags, the second of which hashes differently`, [`Test Hashed Flag A`, `Test Hashed Flag B`, `Test Hashed Flag C`], [`Test Hashed Flag A`, `Test Hashed Flag D`, `Test Hashed Flag C`])
  runNotMatching(`returns a different value when there are three flags, the third of which hashes differently`, [`Test Hashed Flag A`, `Test Hashed Flag B`, `Test Hashed Flag C`], [`Test Hashed Flag A`, `Test Hashed Flag B`, `Test Hashed Flag D`])
  runNotMatching(`returns a different value when comparing one flag to none`, [`Test Hashed Flag A`], [])
  runNotMatching(`returns a different value when comparing two flags to none`, [`Test Hashed Flag A`, `Test Hashed Flag B`], [])
  runNotMatching(`returns a different value when comparing three flags to none`, [`Test Hashed Flag A`, `Test Hashed Flag B`, `Test Hashed Flag C`], [])
  runNotMatching(`returns a different value when comparing one flag to two, even if the first matches`, [`Test Hashed Flag A`], [`Test Hashed Flag A`, `Test Hashed Flag B`])
  runNotMatching(`returns a different value when comparing one flag to two, even if the second matches`, [`Test Hashed Flag B`], [`Test Hashed Flag A`, `Test Hashed Flag B`])
  runNotMatching(`returns a different value when comparing one flag to three, even if the first matches`, [`Test Hashed Flag A`], [`Test Hashed Flag A`, `Test Hashed Flag B`, `Test Hashed Flag C`])
  runNotMatching(`returns a different value when comparing one flag to three, even if the second matches`, [`Test Hashed Flag B`], [`Test Hashed Flag A`, `Test Hashed Flag B`, `Test Hashed Flag C`])
  runNotMatching(`returns a different value when comparing one flag to three, even if the third matches`, [`Test Hashed Flag C`], [`Test Hashed Flag A`, `Test Hashed Flag B`, `Test Hashed Flag C`])
  runNotMatching(`returns a different value when comparing two flags to three, even if the first two match`, [`Test Hashed Flag A`, `Test Hashed Flag B`], [`Test Hashed Flag A`, `Test Hashed Flag B`, `Test Hashed Flag C`])
  runNotMatching(`returns a different value when comparing two flags to three, even if the last two match`, [`Test Hashed Flag B`, `Test Hashed Flag C`], [`Test Hashed Flag A`, `Test Hashed Flag B`, `Test Hashed Flag C`])
  runNotMatching(`separates flag hashes well`, [`Test Hashed Flag A`, `Test Hashed Flag B`], [`Test Hashed Flag AT`, `est Hashed Flag B`])
  runNotMatching(`separates flag hashes well (reverse)`, [`Test Hashed Flag A`, `Test Hashed Flag B`], [`est Hashed Flag A`, `Test Hashed Flag BT`])
  runNotMatching(`separates flag hashes well with spaces`, [`Test Hashed Flag A`, `Test Hashed Flag B`], [`Test Hashed Flag A T`, `est Hashed Flag B`])
  runNotMatching(`separates flag hashes well with spaces (reverse)`, [`Test Hashed Flag A`, `Test Hashed Flag B`], [`est Hashed Flag A`, `Test Hashed Flag B T`])
})

describe(`hashStateCharacter`, () => {
  it(`hashes the same when the normalized values are same`, () => expect(get(`hashStateCharacter`)({
    name: `Test Name A`,
    normalizedName: `Test Normalized Name`,
    emote: `Test Emote A`,
    normalizedEmote: `Test Normalized Emote`
  })).toEqual(get(`hashStateCharacter`)({
    name: `Test Name B`,
    normalizedName: `Test Normalized Name`,
    emote: `Test Emote B`,
    normalizedEmote: `Test Normalized Emote`
  })))
  it(`hashes differently should the normalized name change`, () => expect(get(`hashStateCharacter`)({
    name: `Test Name A`,
    normalizedName: `Test Normalized Name A`,
    emote: `Test Emote A`,
    normalizedEmote: `Test Normalized Emote`
  })).not.toEqual(get(`hashStateCharacter`)({
    name: `Test Name B`,
    normalizedName: `Test Normalized Name B`,
    emote: `Test Emote B`,
    normalizedEmote: `Test Normalized Emote`
  })))
  it(`hashes differently should the normalized emote change`, () => expect(get(`hashStateCharacter`)({
    name: `Test Name A`,
    normalizedName: `Test Normalized Name`,
    emote: `Test Emote A`,
    normalizedEmote: `Test Normalized Emote A`
  })).not.toEqual(get(`hashStateCharacter`)({
    name: `Test Name B`,
    normalizedName: `Test Normalized Name`,
    emote: `Test Emote B`,
    normalizedEmote: `Test Normalized Emote B`
  })))
  it(`separates the name and emote`, () => expect(get(`hashStateCharacter`)({
    name: `Test Name A`,
    normalizedName: `Test Normalized Name A`,
    emote: `Test Emote A`,
    normalizedEmote: `Test Normalized Emote`
  })).not.toEqual(get(`hashStateCharacter`)({
    name: `Test Name B`,
    normalizedName: `Test Normalized Name`,
    emote: `Test Emote B`,
    normalizedEmote: `A Test Normalized Emote`
  })))
  it(`separates the emote and name`, () => expect(get(`hashStateCharacter`)({
    name: `Test Name A`,
    normalizedName: `A Test Normalized Name`,
    emote: `Test Emote A`,
    normalizedEmote: `Test Normalized Emote`
  })).not.toEqual(get(`hashStateCharacter`)({
    name: `Test Name B`,
    normalizedName: `Test Normalized Name A`,
    emote: `Test Emote B`,
    normalizedEmote: `Test Normalized Emote`
  })))
  it(`still sorts by normalized name`, () => {
    const hashes = [{
      name: `Test Name`,
      normalizedName: `Test Normalized Name C`,
      emote: `Test Emote`,
      normalizedEmote: `Test Normalized Emote D`
    }, {
      name: `Test Name`,
      normalizedName: `Test Normalized Name A`,
      emote: `Test Emote`,
      normalizedEmote: `Test Normalized Emote B`
    }, {
      name: `Test Name`,
      normalizedName: `Test Normalized Name D`,
      emote: `Test Emote`,
      normalizedEmote: `Test Normalized Emote C`
    }, {
      name: `Test Name`,
      normalizedName: `Test Normalized Name B`,
      emote: `Test Emote`,
      normalizedEmote: `Test Normalized Emote A`
    }].map(name => get(`hashStateCharacter`)(name))
    const sortedHashes = hashes.slice().sort()
    const sortedIndices = sortedHashes.map(hash => hashes.indexOf(hash))
    expect(sortedIndices).toEqual([1, 3, 0, 2])
  })
})

describe(`hashStateCharacters`, () => {
  let unhashedA
  let unhashedACopy
  let unhashedB
  let unhashedBCopy
  let resultA
  let resultB
  const hashStateCharacter = setSpy(`hashStateCharacter`)
  afterEach(() => hashStateCharacter.calls.reset())
  const run = (description, hashedA, hashedB, then) => describe(description, () => {
    beforeEach(() => {
      unhashedA = hashedA.map((hashed, i) => `Test Unhashed A ${i}`)
      unhashedACopy = unhashedA.slice()
      unhashedB = hashedB.map((hashed, i) => `Test Unhashed B ${i}`)
      unhashedBCopy = unhashedB.slice()
      hashStateCharacter.and.callFake(character => {
        const match = /^Test Unhashed ([A-Z]) (\d+)$/.exec(character)
        switch (match[1]) {
          case `A`:
            return hashedA[match[2]]
          case `B`:
            return hashedB[match[2]]
        }
      })
      resultA = get(`hashStateCharacters`)(unhashedA)
      resultB = get(`hashStateCharacters`)(unhashedB)
    })
    it(`calls hashStateCharacter once per character`, () => expect(hashStateCharacter).toHaveBeenCalledTimes(hashedA.length + hashedB.length))
    it(`calls hashStateCharacter for every character from the first set`, () => unhashedACopy.forEach(unhashed => expect(hashStateCharacter).toHaveBeenCalledWith(unhashed)))
    it(`calls hashStateCharacter for every character from the second set`, () => unhashedBCopy.forEach(unhashed => expect(hashStateCharacter).toHaveBeenCalledWith(unhashed)))
    it(`does not modify the first set of characters`, () => expect(unhashedA).toEqual(unhashedACopy))
    it(`does not modify the second set of characters`, () => expect(unhashedB).toEqual(unhashedBCopy))
    then()
  })
  const runMatching = (description, hashedA, hashedB) => run(description, hashedA, hashedB, () => {
    it(`returns matching values`, () => expect(resultA).toEqual(resultB))
  })
  const runNotMatching = (description, hashedA, hashedB) => run(description, hashedA, hashedB, () => {
    it(`returns differing values`, () => expect(resultA).not.toEqual(resultB))
  })
  runMatching(`returns the same value when there are no characters`, [], [])
  runMatching(`returns the same value when there is one character which hashes identically`, [`Test Hashed Character A`], [`Test Hashed Character A`])
  runNotMatching(`returns a different value when there is one character which hashes differently`, [`Test Hashed Character A`], [`Test Hashed Character B`])
  runMatching(`returns the same value when there are two characters which hash identically`, [`Test Hashed Character A`, `Test Hashed Character B`], [`Test Hashed Character A`, `Test Hashed Character B`])
  runMatching(`returns the same value when there are two characters which hash identically, regardless of order`, [`Test Hashed Character A`, `Test Hashed Character B`], [`Test Hashed Character B`, `Test Hashed Character A`])
  runNotMatching(`returns a different value when there are two characters, the first of which hashes differently`, [`Test Hashed Character A`, `Test Hashed Character B`], [`Test Hashed Character C`, `Test Hashed Character B`])
  runNotMatching(`returns a different value when there are two characters, the second of which hashes differently`, [`Test Hashed Character A`, `Test Hashed Character B`], [`Test Hashed Character A`, `Test Hashed Character C`])
  runMatching(`returns the same value when there are three characters which hash identically`, [`Test Hashed Character A`, `Test Hashed Character B`, `Test Hashed Character C`], [`Test Hashed Character A`, `Test Hashed Character B`, `Test Hashed Character C`])
  runMatching(`returns the same value when there are three characters which hash identically, regardless of order`, [`Test Hashed Character A`, `Test Hashed Character B`, `Test Hashed Character C`], [`Test Hashed Character C`, `Test Hashed Character A`, `Test Hashed Character B`])
  runNotMatching(`returns a different value when there are three characters, the first of which hashes differently`, [`Test Hashed Character A`, `Test Hashed Character B`, `Test Hashed Character C`], [`Test Hashed Character D`, `Test Hashed Character B`, `Test Hashed Character C`])
  runNotMatching(`returns a different value when there are three characters, the second of which hashes differently`, [`Test Hashed Character A`, `Test Hashed Character B`, `Test Hashed Character C`], [`Test Hashed Character A`, `Test Hashed Character D`, `Test Hashed Character C`])
  runNotMatching(`returns a different value when there are three characters, the third of which hashes differently`, [`Test Hashed Character A`, `Test Hashed Character B`, `Test Hashed Character C`], [`Test Hashed Character A`, `Test Hashed Character B`, `Test Hashed Character D`])
  runNotMatching(`returns a different value when comparing one character to none`, [`Test Hashed Character A`], [])
  runNotMatching(`returns a different value when comparing two characters to none`, [`Test Hashed Character A`, `Test Hashed Character B`], [])
  runNotMatching(`returns a different value when comparing three characters to none`, [`Test Hashed Character A`, `Test Hashed Character B`, `Test Hashed Character C`], [])
  runNotMatching(`returns a different value when comparing one character to two, even if the first matches`, [`Test Hashed Character A`], [`Test Hashed Character A`, `Test Hashed Character B`])
  runNotMatching(`returns a different value when comparing one character to two, even if the second matches`, [`Test Hashed Character B`], [`Test Hashed Character A`, `Test Hashed Character B`])
  runNotMatching(`returns a different value when comparing one character to three, even if the first matches`, [`Test Hashed Character A`], [`Test Hashed Character A`, `Test Hashed Character B`, `Test Hashed Character C`])
  runNotMatching(`returns a different value when comparing one character to three, even if the second matches`, [`Test Hashed Character B`], [`Test Hashed Character A`, `Test Hashed Character B`, `Test Hashed Character C`])
  runNotMatching(`returns a different value when comparing one character to three, even if the third matches`, [`Test Hashed Character C`], [`Test Hashed Character A`, `Test Hashed Character B`, `Test Hashed Character C`])
  runNotMatching(`returns a different value when comparing two characters to three, even if the first two match`, [`Test Hashed Character A`, `Test Hashed Character B`], [`Test Hashed Character A`, `Test Hashed Character B`, `Test Hashed Character C`])
  runNotMatching(`returns a different value when comparing two characters to three, even if the last two match`, [`Test Hashed Character B`, `Test Hashed Character C`], [`Test Hashed Character A`, `Test Hashed Character B`, `Test Hashed Character C`])
  runNotMatching(`separates character hashes well`, [`Test Hashed Character A`, `Test Hashed Character B`], [`Test Hashed Character AT`, `est Hashed Character B`])
  runNotMatching(`separates character hashes well (reverse)`, [`Test Hashed Character A`, `Test Hashed Character B`], [`est Hashed Character A`, `Test Hashed Character BT`])
  runNotMatching(`separates character hashes well with spaces`, [`Test Hashed Character A`, `Test Hashed Character B`], [`Test Hashed Character A T`, `est Hashed Character B`])
  runNotMatching(`separates character hashes well with spaces (reverse)`, [`Test Hashed Character A`, `Test Hashed Character B`], [`est Hashed Character A`, `Test Hashed Character B T`])
})

describe(`hashPromptState`, () => {
  let stateA
  let stateACopy
  let resultA
  let stateB
  let stateBCopy
  let resultB
  const hashStateFlags = setSpy(`hashStateFlags`)
  const hashStateCharacters = setSpy(`hashStateCharacters`)
  const normalizeName = setSpy(`normalizeName`)
  afterEach(() => {
    hashStateFlags.calls.reset()
    hashStateCharacters.calls.reset()
    normalizeName.calls.reset()
  })
  const run = (description, promptIdA, hashedStateFlagsA, hashedStateCharactersA, normalizedStateBackgroundA, promptIdB, hashedStateFlagsB, hashedStateCharactersB, normalizedStateBackgroundB, then) => describe(description, () => {
    beforeEach(() => {
      hashStateFlags.and.callFake(flags => {
        switch (flags) {
          case `Test Flags A`:
            return hashedStateFlagsA
          case `Test Flags B`:
            return hashedStateFlagsB
        }
      })
      hashStateCharacters.and.callFake(characters => {
        switch (characters) {
          case `Test Characters A`:
            return hashedStateCharactersA
          case `Test Characters B`:
            return hashedStateCharactersB
        }
      })
      normalizeName.and.callFake(name => {
        switch (name) {
          case `Test Background A`:
            return normalizedStateBackgroundA
          case `Test Background B`:
            return normalizedStateBackgroundB
        }
      })
      stateA = {
        flags: `Test Flags A`,
        characters: `Test Characters A`,
        background: `Test Background A`
      }
      stateACopy = JSON.parse(JSON.stringify(stateA))
      stateB = {
        flags: `Test Flags B`,
        characters: `Test Characters B`,
        background: `Test Background B`
      }
      stateBCopy = JSON.parse(JSON.stringify(stateB))

      resultA = get(`hashPromptState`)(promptIdA, stateA)
      resultB = get(`hashPromptState`)(promptIdB, stateB)
    })
    it(`does not modify the first state`, () => expect(stateA).toEqual(stateACopy))
    it(`does not modify the second state`, () => expect(stateB).toEqual(stateBCopy))
    it(`calls hashStateFlags twice`, () => expect(hashStateFlags).toHaveBeenCalledTimes(2))
    it(`calls hashStateFlags with the first state's flags`, () => expect(hashStateFlags).toHaveBeenCalledWith(`Test Flags A`))
    it(`calls hashStateFlags with the second state's flags`, () => expect(hashStateFlags).toHaveBeenCalledWith(`Test Flags B`))
    it(`calls hashStateCharacters twice`, () => expect(hashStateCharacters).toHaveBeenCalledTimes(2))
    it(`calls hashStateCharacters with the first state's flags`, () => expect(hashStateCharacters).toHaveBeenCalledWith(`Test Characters A`))
    it(`calls hashStateCharacters with the second state's flags`, () => expect(hashStateCharacters).toHaveBeenCalledWith(`Test Characters B`))
    it(`calls normalizeName twice`, () => expect(normalizeName).toHaveBeenCalledTimes(2))
    it(`calls normalizeName with the first state's background`, () => expect(normalizeName).toHaveBeenCalledWith(`Test Background A`))
    it(`calls normalizeName with the second state's background`, () => expect(normalizeName).toHaveBeenCalledWith(`Test Background B`))
    then()
  })
  const runMatching = (description, promptIdA, hashedStateFlagsA, hashedStateCharactersA, normalizedStateBackgroundA, promptIdB, hashedStateFlagsB, hashedStateCharactersB, normalizedStateBackgroundB) => run(description, promptIdA, hashedStateFlagsA, hashedStateCharactersA, normalizedStateBackgroundA, promptIdB, hashedStateFlagsB, hashedStateCharactersB, normalizedStateBackgroundB, () => {
    it(`returns matching hashes`, () => expect(resultA).toEqual(resultB))
  })
  const runNotMatching = (description, promptIdA, hashedStateFlagsA, hashedStateCharactersA, normalizedStateBackgroundA, promptIdB, hashedStateFlagsB, hashedStateCharactersB, normalizedStateBackgroundB) => run(description, promptIdA, hashedStateFlagsA, hashedStateCharactersA, normalizedStateBackgroundA, promptIdB, hashedStateFlagsB, hashedStateCharactersB, normalizedStateBackgroundB, () => {
    it(`returns differing hashes`, () => expect(resultA).not.toEqual(resultB))
  })
  runMatching(`everything matches`, `Test PromptId`, `Test Hashed State Flags`, `Test Hashed Character Flags`, `Test Normalized Background`, `Test PromptId`, `Test Hashed State Flags`, `Test Hashed Character Flags`, `Test Normalized Background`)
  runNotMatching(`promptId does not match`, `Test PromptId A`, `Test Hashed State Flags`, `Test Hashed Character Flags`, `Test Normalized Background`, `Test PromptId B`, `Test Hashed State Flags`, `Test Hashed Character Flags`, `Test Normalized Background`)
  runNotMatching(`state flags do not match`, `Test PromptId`, `Test Hashed State Flags A`, `Test Hashed Character Flags`, `Test Normalized Background`, `Test PromptId`, `Test Hashed State Flags B`, `Test Hashed Character Flags`, `Test Normalized Background`)
  runNotMatching(`character flags do not match`, `Test PromptId`, `Test Hashed State Flags`, `Test Hashed Character Flags A`, `Test Normalized Background`, `Test PromptId`, `Test Hashed State Flags`, `Test Hashed Character Flags B`, `Test Normalized Background`)
  runNotMatching(`backgrounds do not match`, `Test PromptId`, `Test Hashed State Flags`, `Test Hashed Character Flags`, `Test Normalized Background A`, `Test PromptId`, `Test Hashed State Flags`, `Test Hashed Character Flags`, `Test Normalized Background B`)
})

describe(`combinePromptStates`, () => {
  let aCopy
  let bCopy
  let result
  const run = (description, a, b, then) => describe(description, () => {
    beforeEach(() => {
      aCopy = JSON.parse(JSON.stringify(a))
      bCopy = JSON.parse(JSON.stringify(b))
      result = get(`combinePromptStates`)(aCopy, bCopy)
    })
    it(`does not modify the first set of prompt/state combinations`, () => expect(aCopy).toEqual(a))
    it(`does not modify the second set of prompt/state combinations`, () => expect(bCopy).toEqual(b))
    then()
  })
  run(`all null`, null, null, () => {
    it(`returns null`, () => expect(result).toBeNull())
  })
  run(`first set of prompt/state combinations only`, [{
    hash: `Test Hash A`,
    statement: `Test Statement A`,
    state: `Test State A`
  }, {
    hash: `Test Hash B`,
    statement: `Test Statement B`,
    state: `Test State B`
  }, {
    hash: `Test Hash C`,
    statement: `Test Statement C`,
    state: `Test State C`
  }, {
    hash: `Test Hash D`,
    statement: `Test Statement D`,
    state: `Test State D`
  }], null, () => {
    it(`returns the first set of prompt/state combinations`, () => expect(result).toEqual([{
      hash: `Test Hash A`,
      statement: `Test Statement A`,
      state: `Test State A`
    }, {
      hash: `Test Hash B`,
      statement: `Test Statement B`,
      state: `Test State B`
    }, {
      hash: `Test Hash C`,
      statement: `Test Statement C`,
      state: `Test State C`
    }, {
      hash: `Test Hash D`,
      statement: `Test Statement D`,
      state: `Test State D`
    }]))
  })
  run(`second set of prompt/state combinations only`, null, [{
    hash: `Test Hash A`,
    statement: `Test Statement A`,
    state: `Test State A`
  }, {
    hash: `Test Hash B`,
    statement: `Test Statement B`,
    state: `Test State B`
  }, {
    hash: `Test Hash C`,
    statement: `Test Statement C`,
    state: `Test State C`
  }, {
    hash: `Test Hash D`,
    statement: `Test Statement D`,
    state: `Test State D`
  }], () => {
    it(`returns the second set of prompt/state combinations`, () => expect(result).toEqual([{
      hash: `Test Hash A`,
      statement: `Test Statement A`,
      state: `Test State A`
    }, {
      hash: `Test Hash B`,
      statement: `Test Statement B`,
      state: `Test State B`
    }, {
      hash: `Test Hash C`,
      statement: `Test Statement C`,
      state: `Test State C`
    }, {
      hash: `Test Hash D`,
      statement: `Test Statement D`,
      state: `Test State D`
    }]))
  })
  run(`two sets of prompt/state combinations without overlap`, [{
    hash: `Test Hash A`,
    statement: `Test Statement A`,
    state: `Test State A`
  }, {
    hash: `Test Hash B`,
    statement: `Test Statement B`,
    state: `Test State B`
  }, {
    hash: `Test Hash C`,
    statement: `Test Statement C`,
    state: `Test State C`
  }, {
    hash: `Test Hash D`,
    statement: `Test Statement D`,
    state: `Test State D`
  }], [{
    hash: `Test Hash E`,
    statement: `Test Statement E`,
    state: `Test State E`
  }, {
    hash: `Test Hash F`,
    statement: `Test Statement F`,
    state: `Test State F`
  }, {
    hash: `Test Hash G`,
    statement: `Test Statement G`,
    state: `Test State G`
  }, {
    hash: `Test Hash H`,
    statement: `Test Statement H`,
    state: `Test State H`
  }, {
    hash: `Test Hash I`,
    statement: `Test Statement I`,
    state: `Test State I`
  }], () => {
    it(`returns the prompt/state combinations from the first set`, () => {
      expect(result).toContain({
        hash: `Test Hash A`,
        statement: `Test Statement A`,
        state: `Test State A`
      })
      expect(result).toContain({
        hash: `Test Hash B`,
        statement: `Test Statement B`,
        state: `Test State B`
      })
      expect(result).toContain({
        hash: `Test Hash C`,
        statement: `Test Statement C`,
        state: `Test State C`
      })
      expect(result).toContain({
        hash: `Test Hash D`,
        statement: `Test Statement D`,
        state: `Test State D`
      })
    })
    it(`returns the prompt/state combinations from the second set`, () => {
      expect(result).toContain({
        hash: `Test Hash E`,
        statement: `Test Statement E`,
        state: `Test State E`
      })
      expect(result).toContain({
        hash: `Test Hash F`,
        statement: `Test Statement F`,
        state: `Test State F`
      })
      expect(result).toContain({
        hash: `Test Hash G`,
        statement: `Test Statement G`,
        state: `Test State G`
      })
      expect(result).toContain({
        hash: `Test Hash H`,
        statement: `Test Statement H`,
        state: `Test State H`
      })
      expect(result).toContain({
        hash: `Test Hash I`,
        statement: `Test Statement I`,
        state: `Test State I`
      })
    })
    it(`returns no further prompt/state combinations`, () => expect(result.length).toEqual(9))
  })
  run(`two sets of prompt/state combinations with overlap`, [{
    hash: `Test Hash A`,
    statement: `Test Statement A`,
    state: `Test State A`
  }, {
    hash: `Test Hash B`,
    statement: `Test Statement B`,
    state: `Test State B`
  }, {
    hash: `Test Hash C`,
    statement: `Test Statement C`,
    state: `Test State C`
  }, {
    hash: `Test Hash D`,
    statement: `Test Statement D`,
    state: `Test State D`
  }], [{
    hash: `Test Hash E`,
    statement: `Test Statement E`,
    state: `Test State E`
  }, {
    hash: `Test Hash D`,
    statement: `Test Statement F`,
    state: `Test State F`
  }, {
    hash: `Test Hash G`,
    statement: `Test Statement G`,
    state: `Test State G`
  }, {
    hash: `Test Hash B`,
    statement: `Test Statement H`,
    state: `Test State H`
  }, {
    hash: `Test Hash I`,
    statement: `Test Statement I`,
    state: `Test State I`
  }], () => {
    it(`returns the prompt/state combinations from the first set`, () => {
      expect(result).toContain({
        hash: `Test Hash A`,
        statement: `Test Statement A`,
        state: `Test State A`
      })
      expect(result).toContain({
        hash: `Test Hash B`,
        statement: `Test Statement B`,
        state: `Test State B`
      })
      expect(result).toContain({
        hash: `Test Hash C`,
        statement: `Test Statement C`,
        state: `Test State C`
      })
      expect(result).toContain({
        hash: `Test Hash D`,
        statement: `Test Statement D`,
        state: `Test State D`
      })
    })
    it(`returns the prompt/state combinations from the second set (excluding those which are also from the first set)`, () => {
      expect(result).toContain({
        hash: `Test Hash E`,
        statement: `Test Statement E`,
        state: `Test State E`
      })
      expect(result).toContain({
        hash: `Test Hash G`,
        statement: `Test Statement G`,
        state: `Test State G`
      })
      expect(result).toContain({
        hash: `Test Hash I`,
        statement: `Test Statement I`,
        state: `Test State I`
      })
    })
    it(`returns no further prompt/state combinations`, () => expect(result.length).toEqual(7))
  })
})

describe(`findPromptStateCombinationsInStatementArray`, () => {
  let statementsCopy
  let result
  const findPromptStateCombinationsInStatement = setSpy(`findPromptStateCombinationsInStatement`)
  findPromptStateCombinationsInStatement.and.returnValue(`Test Recursed States`)
  afterEach(() => findPromptStateCombinationsInStatement.calls.reset())
  const run = (description, statements, then) => describe(description, () => {
    beforeEach(() => {
      statementsCopy = JSON.parse(JSON.stringify(statements))
      result = get(`findPromptStateCombinationsInStatementArray`)(`Test Context`, `Test On Error`, statementsCopy, `Test States`, `Test Labels`)
    })
    it(`does not modify the given statements`, () => expect(statementsCopy).toEqual(statements))
    then()
  })
  run(`no statements`, [], () => {
    it(`does not call findPromptStateCombinationsInStatement`, () => expect(findPromptStateCombinationsInStatement).not.toHaveBeenCalled())
    it(`returns the given states`, () => expect(result).toEqual(`Test States`))
  })
  run(`one statement`, [`Test Statement A`], () => { 
    it(`calls findPromptStateCombinationsInStatement once`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledTimes(1))
    it(`calls findPromptStateCombinationsInStatement with the given context`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStateCombinationsInStatement with the given onError`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledWith(jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStateCombinationsInStatement with the first given statement`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statement A`, jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStateCombinationsInStatement with the next given statements`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), [], jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStateCombinationsInStatement with the given states`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test States`, jasmine.anything()))
    it(`calls findPromptStateCombinationsInStatement with the given labels`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Labels`))
    it(`returns the result of findPromptStateCombinationsInStatement`, () => expect(result).toEqual(`Test Recursed States`))
  })
  run(`two statements`, [`Test Statement A`, `Test Statement B`], () => { 
    it(`calls findPromptStateCombinationsInStatement once`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledTimes(1))
    it(`calls findPromptStateCombinationsInStatement with the given context`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStateCombinationsInStatement with the given onError`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledWith(jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStateCombinationsInStatement with the first given statement`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statement A`, jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStateCombinationsInStatement with the next given statements`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement B`], jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStateCombinationsInStatement with the given states`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test States`, jasmine.anything()))
    it(`calls findPromptStateCombinationsInStatement with the given labels`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Labels`))
    it(`returns the result of findPromptStateCombinationsInStatement`, () => expect(result).toEqual(`Test Recursed States`))
  })
  run(`three statements`, [`Test Statement A`, `Test Statement B`, `Test Statement C`], () => { 
    it(`calls findPromptStateCombinationsInStatement once`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledTimes(1))
    it(`calls findPromptStateCombinationsInStatement with the given context`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStateCombinationsInStatement with the given onError`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledWith(jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStateCombinationsInStatement with the first given statement`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statement A`, jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStateCombinationsInStatement with the next given statements`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement B`, `Test Statement C`], jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStateCombinationsInStatement with the given states`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test States`, jasmine.anything()))
    it(`calls findPromptStateCombinationsInStatement with the given labels`, () => expect(findPromptStateCombinationsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Labels`))
    it(`returns the result of findPromptStateCombinationsInStatement`, () => expect(result).toEqual(`Test Recursed States`))
  })
})
