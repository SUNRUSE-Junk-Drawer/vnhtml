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

describe(`objectContainsKey`, () => {
  const run = (description, object, key, expectedResult) => describe(description, () => {
    let objectCopy
    let actualResult
    beforeEach(() => {
      objectCopy = JSON.parse(JSON.stringify(object))
      actualResult = get(`objectContainsKey`)(objectCopy, key)
    })
    it(`does not modify the given object`, () => expect(objectCopy).toEqual(object))
    it(`returns ${expectedResult}`, () => expect(actualResult).toEqual(expectedResult))
  })

  const runClash = (key, then) => [{
    name: `null`,
    value: null
  }, {
    name: `zero`,
    value: 0
  }, {
    name: `false`,
    value: false
  }, {
    name: `an empty string`,
    value: ``
  }, {
    name: `truthy`,
    value: `Test Clashing Truthy Value`
  }].forEach(clash => describe(`given an object in which ${key} is ${clash.name}`, () => {
    const object = {
      "Test Key Referring To Null": null,
      "Test Key Referring To Zero": 0,
      "Test Key Referring To False": false,
      "Test Key Referring To A Truthy Value": `Test Truthy Value`,
      "Test Key Referring To An Empty String": ``
    }
    object[key] = clash.value
    run(`look-up of non-existent key`, object, `Test Non-Existent Key`, false)
    run(`look-up of key with a value of null`, object, `Test Key Referring To Null`, true)
    run(`look-up of key with a value of empty string`, object, `Test Key Referring To An Empty String`, true)
    run(`look-up of key with a value of zero`, object, `Test Key Referring To Zero`, true)
    run(`look-up of key with a value of false`, object, `Test Key Referring To False`, true)
    run(`look-up of key with a truthy value`, object, `Test Key Referring To A Truthy Value`, true)
    then(object)
  }))

  runClash(`hasOwnProperty`, object => {
    run(`Look-up of hasOwnProperty`, object, `hasOwnProperty`, true)
    run(`Look-up of constructor`, object, `constructor`, false)
  })
  runClash(`constructor`, object => {
    run(`Look-up of hasOwnProperty`, object, `hasOwnProperty`, false)
    run(`Look-up of constructor`, object, `constructor`, true)
  })

  describe(`given an object which does not contain keys which clash with those defined on the object prototype`, () => {
    const object = {
      "Test Key Referring To Null": null,
      "Test Key Referring To Zero": 0,
      "Test Key Referring To False": false,
      "Test Key Referring To A Truthy Value": `Test Truthy Value`,
      "Test Key Referring To An Empty String": ``
    }
    run(`Look-up of hasOwnProperty`, object, `hasOwnProperty`, false)
    run(`Look-up of constructor`, object, `constructor`, false)
    run(`Look-up of non-existent key`, object, `Test Non-Existent Key`, false)
    run(`Look-up of key with a value of null`, object, `Test Key Referring To Null`, true)
    run(`Look-up of key with a value of empty string`, object, `Test Key Referring To An Empty String`, true)
    run(`Look-up of key with a value of zero`, object, `Test Key Referring To Zero`, true)
    run(`Look-up of key with a value of false`, object, `Test Key Referring To False`, true)
    run(`Look-up of key with a truthy value`, object, `Test Key Referring To A Truthy Value`, true)
  })
})

describe(`getObjectKeyValue`, () => {
  const run = (description, object, key, expectedResult) => describe(description, () => {
    let objectCopy
    let actualResult
    beforeEach(() => {
      objectCopy = JSON.parse(JSON.stringify(object))
      actualResult = get(`getObjectKeyValue`)(objectCopy, key)
    })
    it(`does not modify the given object`, () => expect(objectCopy).toEqual(object))
    it(`returns ${expectedResult}`, () => expect(actualResult).toEqual(expectedResult))
  })

  const runClash = (key, then) => [{
    name: `null`,
    value: null
  }, {
    name: `zero`,
    value: 0
  }, {
    name: `false`,
    value: false
  }, {
    name: `an empty string`,
    value: ``
  }, {
    name: `truthy`,
    value: `Test Clashing Truthy Value`
  }].forEach(clash => describe(`given an object in which ${key} is ${clash.name}`, () => {
    const object = {
      "Test Key Referring To Null": null,
      "Test Key Referring To Zero": 0,
      "Test Key Referring To False": false,
      "Test Key Referring To A Truthy Value": `Test Truthy Value`,
      "Test Key Referring To An Empty String": ``
    }
    object[key] = clash.value
    run(`look-up of non-existent key`, object, `Test Non-Existent Key`, null)
    run(`look-up of key with a value of null`, object, `Test Key Referring To Null`, null)
    run(`look-up of key with a value of empty string`, object, `Test Key Referring To An Empty String`, ``)
    run(`look-up of key with a value of zero`, object, `Test Key Referring To Zero`, 0)
    run(`look-up of key with a value of false`, object, `Test Key Referring To False`, false)
    run(`look-up of key with a truthy value`, object, `Test Key Referring To A Truthy Value`, `Test Truthy Value`)
    then(object, clash.value)
  }))

  runClash(`hasOwnProperty`, (object, value) => {
    run(`Look-up of hasOwnProperty`, object, `hasOwnProperty`, value)
    run(`Look-up of constructor`, object, `constructor`, null)
  })
  runClash(`constructor`, (object, value) => {
    run(`Look-up of hasOwnProperty`, object, `hasOwnProperty`, null)
    run(`Look-up of constructor`, object, `constructor`, value)
  })

  describe(`given an object which does not contain keys which clash with those defined on the object prototype`, () => {
    const object = {
      "Test Key Referring To Null": null,
      "Test Key Referring To Zero": 0,
      "Test Key Referring To False": false,
      "Test Key Referring To A Truthy Value": `Test Truthy Value`,
      "Test Key Referring To An Empty String": ``
    }
    run(`Look-up of hasOwnProperty`, object, `hasOwnProperty`, null)
    run(`Look-up of constructor`, object, `constructor`, null)
    run(`Look-up of non-existent key`, object, `Test Non-Existent Key`, null)
    run(`Look-up of key with a value of null`, object, `Test Key Referring To Null`, null)
    run(`Look-up of key with a value of empty string`, object, `Test Key Referring To An Empty String`, ``)
    run(`Look-up of key with a value of zero`, object, `Test Key Referring To Zero`, 0)
    run(`Look-up of key with a value of false`, object, `Test Key Referring To False`, false)
    run(`Look-up of key with a truthy value`, object, `Test Key Referring To A Truthy Value`, `Test Truthy Value`)
  })
})

describe(`setObjectKeyValue`, () => {
  describe(`object`, () => {
    describe(`where the property does not exist`, () => {
      let object
      beforeEach(() => {
        object = {
          "Test Existing Key A": 3243,
          "Test Existing Key B": 298,
          "Test Existing Key C": 482
        }
        get(`setObjectKeyValue`)(object, `Test New Key`, `Test New Value`)
      })
      it(`does not modify existing properties`, () => {
        expect(object[`Test Existing Key A`]).toEqual(3243)
        expect(object[`Test Existing Key B`]).toEqual(298)
        expect(object[`Test Existing Key C`]).toEqual(482)
      })
      it(`sets the specified property`, () => expect(object[`Test New Key`]).toEqual(`Test New Value`))
      it(`adds no further properties`, () => expect(Object.keys(object).length).toEqual(4))
    })
    describe(`where the property already exists`, () => {
      let object
      beforeEach(() => {
        object = {
          "Test Existing Key A": 3243,
          "Test Existing Key B": 298,
          "Test Existing Key C": 482
        }
        get(`setObjectKeyValue`)(object, `Test Existing Key B`, `Test New Value`)
      })
      it(`does not modify existing properties`, () => {
        expect(object[`Test Existing Key A`]).toEqual(3243)
        expect(object[`Test Existing Key C`]).toEqual(482)
      })
      it(`sets the specified property`, () => expect(object[`Test Existing Key B`]).toEqual(`Test New Value`))
      it(`adds no further properties`, () => expect(Object.keys(object).length).toEqual(3))
    })
  })
  describe(`array`, () => {
    describe(`where the property does not exist`, () => {
      let array
      beforeEach(() => {
        array = []
        array[5] = 48927
        array[11] = 763
        array[21] = 8361
        get(`setObjectKeyValue`)(array, 14, `Test New Value`)
      })
      it(`does not modify existing properties`, () => {
        expect(array[5]).toEqual(48927)
        expect(array[11]).toEqual(763)
        expect(array[21]).toEqual(8361)
      })
      it(`sets the specified property`, () => expect(array[14]).toEqual(`Test New Value`))
      it(`adds no further properties`, () => {
        const range = (from, to) => { for (let i = from; i <= to; i++) expect(array[i]).toBeUndefined() }
        range(-25, 4)
        range(6, 10)
        range(12, 13)
        range(15, 20)
        range(22, 25)
      })
    })
    describe(`where the property already exists`, () => {
      let array
      beforeEach(() => {
        array = []
        array[5] = 48927
        array[11] = 763
        array[21] = 8361
        get(`setObjectKeyValue`)(array, 11, `Test New Value`)
      })
      it(`does not modify existing properties`, () => {
        expect(array[5]).toEqual(48927)
        expect(array[21]).toEqual(8361)
      })
      it(`sets the specified property`, () => expect(array[11]).toEqual(`Test New Value`))
      it(`adds no further properties`, () => {
        const range = (from, to) => { for (let i = from; i <= to; i++) expect(array[i]).toBeUndefined() }
        range(-25, 4)
        range(6, 10)
        range(12, 20)
        range(22, 25)
      })
    })
  })
})

describe(`removeObjectKeyValue`, () => {
  describe(`where the property does not exist`, () => {
    let object
    beforeEach(() => {
      object = {
        "Test Existing Key A": 3243,
        "Test Existing Key B": 298,
        "Test Existing Key C": 482
      }
      get(`removeObjectKeyValue`)(object, `Test Existing Key D`)
    })
    it(`does not modify other properties`, () => {
      expect(object[`Test Existing Key A`]).toEqual(3243)
      expect(object[`Test Existing Key B`]).toEqual(298)
      expect(object[`Test Existing Key C`]).toEqual(482)
    })
    it(`includes no further properties`, () => expect(Object.keys(object).length).toEqual(3))
  })
  describe(`where the property exists`, () => {
    let object
    beforeEach(() => {
      object = {
        "Test Existing Key A": 3243,
        "Test Existing Key B": 298,
        "Test Existing Key C": 482
      }
      get(`removeObjectKeyValue`)(object, `Test Existing Key B`)
    })
    it(`does not modify other properties`, () => {
      expect(object[`Test Existing Key A`]).toEqual(3243)
      expect(object[`Test Existing Key C`]).toEqual(482)
    })
    it(`includes no further properties`, () => expect(Object.keys(object).length).toEqual(2))
  })
})

describe(`createCloneTemplate/createCloneInstance`, () => {
  let original
  let originalCopy
  let template
  beforeEach(() => {
    original = {
      a: `Test A`,
      b: [`Test B`, {
        a: `Test C`,
        b: [`Test D`, {
          a: `Test E`,
          b: [`Test F`, `Test G`, `Test H`],
          c: `Test I`
        }, `Test J`],
        c: `Test K`
      }, `Test L`],
      c: `Test M`
    }
    originalCopy = JSON.parse(JSON.stringify(original))
    template = get(`createCloneTemplate`)(originalCopy)
  })
  describe(`no clones`, () => {
    it(`does not modify the given object`, () => expect(originalCopy).toEqual(original))
  })
  describe(`one clone`, () => {
    let clone
    beforeEach(() => clone = get(`createCloneInstance`)(template))
    it(`does not modify the given object`, () => expect(originalCopy).toEqual(original))
    it(`clones to the same value`, () => expect(clone).toEqual(original))
    it(`clones to distinct objects and arrays`, () => expect(clone.b[1].b[1].b).not.toBe(original.b[1].b[1].b))
  })
  describe(`two clones`, () => {
    let cloneA
    let cloneB
    beforeEach(() => {
      cloneA = get(`createCloneInstance`)(template)
      cloneB = get(`createCloneInstance`)(template)
    })
    it(`does not modify the given object`, () => expect(originalCopy).toEqual(original))
    it(`clones to the same value the first time`, () => expect(cloneA).toEqual(original))
    it(`clones to distinct objects and arrays the first time`, () => expect(cloneA.b[1].b[1].b).not.toBe(original.b[1].b[1].b))
    it(`clones to the same value the second time`, () => expect(cloneB).toEqual(original))
    it(`clones to distinct objects and arrays the second time`, () => expect(cloneB.b[1].b[1].b).not.toBe(original.b[1].b[1].b))
  })
})

describe(`findLabelsInStatementArray`, () => {
  const findLabelsInStatement = setSpy(`findLabelsInStatement`)
  afterEach(() => findLabelsInStatement.calls.reset())
  let statementsCopy
  const run = (description, statements, then) => describe(description, () => {
    beforeEach(() => {
      statementsCopy = JSON.parse(JSON.stringify(statements))
      get(`findLabelsInStatementArray`)(`Test Context`, `Test On Error`, `Test Labels`, statementsCopy)
    })
    it(`does not modify the given statements`, () => expect(statementsCopy).toEqual(statements))
    then()
  })
  run(`with no statements`, [], () => {
    it(`does not call findLabelsInStatement`, () => expect(findLabelsInStatement).not.toHaveBeenCalled())
  })
  run(`with one statement`, [`Test Statement A`], () => {
    it(`calls findLabelsInStatement once`, () => expect(findLabelsInStatement).toHaveBeenCalledTimes(1))
    it(`calls findLabelsInStatement with the given context`, () => expect(findLabelsInStatement).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findLabelsInStatement with the given onError`, () => expect(findLabelsInStatement).toHaveBeenCalledWith(jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findLabelsInStatement with the given labels`, () => expect(findLabelsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything(), jasmine.anything()))
    it(`calls findLabelsInStatement with the first given statement`, () => expect(findLabelsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Statement A`, jasmine.anything()))
    it(`calls findLabelsInStatement with the subsequent statements`, () => expect(findLabelsInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), []))
  })
  run(`with two statements`, [`Test Statement A`, `Test Statement B`], () => {
    it(`calls findLabelsInStatement twice`, () => expect(findLabelsInStatement).toHaveBeenCalledTimes(2))
    it(`calls findLabelsInStatement with the given context`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatement with the given onError`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatement with the given labels`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatement with the first statement for each call`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Statement A`, jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Statement B`, jasmine.anything()])
    })
    it(`calls findLabelsInStatement with the subsequent statements for each call`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement B`]])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), []])
    })
  })
  run(`with three statements`, [`Test Statement A`, `Test Statement B`, `Test Statement C`], () => {
    it(`calls findLabelsInStatement three times`, () => expect(findLabelsInStatement).toHaveBeenCalledTimes(3))
    it(`calls findLabelsInStatement with the given context`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(2)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatement with the given onError`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(2)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatement with the given labels`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(2)).toEqual([jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatement with the first statement for each call`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Statement A`, jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Statement B`, jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(2)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Statement C`, jasmine.anything()])
    })
    it(`calls findLabelsInStatement with the subsequent statements for each call`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement B`, `Test Statement C`]])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement C`]])
      expect(findLabelsInStatement.calls.argsFor(2)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), []])
    })
  })
  run(`with four statements`, [`Test Statement A`, `Test Statement B`, `Test Statement C`, `Test Statement D`], () => {
    it(`calls findLabelsInStatement four times`, () => expect(findLabelsInStatement).toHaveBeenCalledTimes(4))
    it(`calls findLabelsInStatement with the given context`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(2)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(3)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatement with the given onError`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(2)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(3)).toEqual([jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatement with the given labels`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(2)).toEqual([jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(3)).toEqual([jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything(), jasmine.anything()])
    })
    it(`calls findLabelsInStatement with the first statement for each call`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Statement A`, jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Statement B`, jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(2)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Statement C`, jasmine.anything()])
      expect(findLabelsInStatement.calls.argsFor(3)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Statement D`, jasmine.anything()])
    })
    it(`calls findLabelsInStatement with the subsequent statements for each call`, () => {
      expect(findLabelsInStatement.calls.argsFor(0)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement B`, `Test Statement C`, `Test Statement D`]])
      expect(findLabelsInStatement.calls.argsFor(1)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement C`, `Test Statement D`]])
      expect(findLabelsInStatement.calls.argsFor(2)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement D`]])
      expect(findLabelsInStatement.calls.argsFor(3)).toEqual([jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), []])
    })
  })
})

describe(`findLabelsInStatement`, () => {
  const onError = jasmine.createSpy(`onError`)
  const objectContainsKey = setSpy(`objectContainsKey`)
  const setObjectKeyValue = setSpy(`setObjectKeyValue`)
  const findLabelsInStatementArray = setSpy(`findLabelsInStatementArray`)
  afterEach(() => {
    onError.calls.reset()
    objectContainsKey.calls.reset()
    setObjectKeyValue.calls.reset()
    findLabelsInStatementArray.calls.reset()
  })
  const run = (description, statement, setup, then) => describe(description, () => {
    let statementCopy
    const nextStatements = [`Test Next Statement A`, `Test Next Statement B`, `Test Next Statement C`]
    let nextStatementsCopy
    beforeEach(() => {
      statementCopy = JSON.parse(JSON.stringify(statement))
      nextStatementsCopy = JSON.parse(JSON.stringify(nextStatements))
      setup()
      get(`findLabelsInStatement`)(`Test Context`, onError, `Test Labels`, statementCopy, nextStatementsCopy)
    })
    it(`does not modify the statement`, () => expect(statementCopy).toEqual(statement))
    it(`does not modify the next statements`, () => expect(nextStatementsCopy).toEqual(nextStatements))
    then()
  })
  const containsNoLabels = (description, statement) => run(description, statement, () => { }, () => {
    it(`does not report an error`, () => expect(onError).not.toHaveBeenCalled())
    it(`does not check if an object contains a key`, () => expect(objectContainsKey).not.toHaveBeenCalled())
    it(`does not set key values in objects`, () => expect(setObjectKeyValue).not.toHaveBeenCalled())
    it(`does not find labels in statement arrays`, () => expect(findLabelsInStatementArray).not.toHaveBeenCalled())
  })
  const containsOneArrayOfLabels = (description, statement) => run(description, statement, () => { }, () => {
    it(`does not report an error`, () => expect(onError).not.toHaveBeenCalled())
    it(`does not check if an object contains a key`, () => expect(objectContainsKey).not.toHaveBeenCalled())
    it(`does not set key values in objects`, () => expect(setObjectKeyValue).not.toHaveBeenCalled())
    it(`finds labels in one statement array`, () => expect(findLabelsInStatementArray).toHaveBeenCalledTimes(1))
    it(`finds labels using the given context`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`finds labels using the given on error`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), onError, jasmine.anything(), jasmine.anything()))
    it(`finds labels using the given labels`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything()))
    it(`finds labels using the statement array concatenated with the next statements`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement A A`, `Test Statement A B`, `Test Statement A C`, `Test Statement A D`, `Test Next Statement A`, `Test Next Statement B`, `Test Next Statement C`]))
  })
  const containsTwoArraysOfLabels = (description, statement) => run(description, statement, () => { }, () => {
    it(`does not report an error`, () => expect(onError).not.toHaveBeenCalled())
    it(`does not check if an object contains a key`, () => expect(objectContainsKey).not.toHaveBeenCalled())
    it(`does not set key values in objects`, () => expect(setObjectKeyValue).not.toHaveBeenCalled())
    it(`finds labels in two statement arrays`, () => expect(findLabelsInStatementArray).toHaveBeenCalledTimes(2))
    it(`finds labels using the given context`, () => {
      expect(findLabelsInStatementArray.calls.argsFor(0)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(1)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
    })
    it(`finds labels using the given on error`, () => {
      expect(findLabelsInStatementArray.calls.argsFor(0)).toEqual([jasmine.anything(), onError, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(1)).toEqual([jasmine.anything(), onError, jasmine.anything(), jasmine.anything()])
    })
    it(`finds labels using the given labels`, () => {
      expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything())
      expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything())
    })
    it(`finds labels using the first statement array concatenated with the next statements`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement A A`, `Test Statement A B`, `Test Statement A C`, `Test Statement A D`, `Test Next Statement A`, `Test Next Statement B`, `Test Next Statement C`]))
    it(`finds labels using the second statement array concatenated with the next statements`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement B A`, `Test Statement B B`, `Test Next Statement A`, `Test Next Statement B`, `Test Next Statement C`]))
  })
  const containsThreeArraysOfLabels = (description, statement) => run(description, statement, () => { }, () => {
    it(`does not report an error`, () => expect(onError).not.toHaveBeenCalled())
    it(`does not check if an object contains a key`, () => expect(objectContainsKey).not.toHaveBeenCalled())
    it(`does not set key values in objects`, () => expect(setObjectKeyValue).not.toHaveBeenCalled())
    it(`finds labels in three statement arrays`, () => expect(findLabelsInStatementArray).toHaveBeenCalledTimes(3))
    it(`finds labels using the given context`, () => {
      expect(findLabelsInStatementArray.calls.argsFor(0)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(1)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(2)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
    })
    it(`finds labels using the given on error`, () => {
      expect(findLabelsInStatementArray.calls.argsFor(0)).toEqual([jasmine.anything(), onError, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(1)).toEqual([jasmine.anything(), onError, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(2)).toEqual([jasmine.anything(), onError, jasmine.anything(), jasmine.anything()])
    })
    it(`finds labels using the given labels`, () => {
      expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything())
      expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything())
      expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything())
    })
    it(`finds labels using the first statement array concatenated with the next statements`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement A A`, `Test Statement A B`, `Test Statement A C`, `Test Statement A D`, `Test Next Statement A`, `Test Next Statement B`, `Test Next Statement C`]))
    it(`finds labels using the second statement array concatenated with the next statements`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement B A`, `Test Statement B B`, `Test Next Statement A`, `Test Next Statement B`, `Test Next Statement C`]))
    it(`finds labels using the third statement array concatenated with the next statements`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement C A`, `Test Statement C B`, `Test Statement C C`, `Test Statement C D`, `Test Next Statement A`, `Test Next Statement B`, `Test Next Statement C`]))
  })
  const containsFourArraysOfLabels = (description, statement) => run(description, statement, () => { }, () => {
    it(`does not report an error`, () => expect(onError).not.toHaveBeenCalled())
    it(`does not check if an object contains a key`, () => expect(objectContainsKey).not.toHaveBeenCalled())
    it(`does not set key values in objects`, () => expect(setObjectKeyValue).not.toHaveBeenCalled())
    it(`finds labels in four statement arrays`, () => expect(findLabelsInStatementArray).toHaveBeenCalledTimes(4))
    it(`finds labels using the given context`, () => {
      expect(findLabelsInStatementArray.calls.argsFor(0)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(1)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(2)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(3)).toEqual([`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything()])
    })
    it(`finds labels using the given on error`, () => {
      expect(findLabelsInStatementArray.calls.argsFor(0)).toEqual([jasmine.anything(), onError, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(1)).toEqual([jasmine.anything(), onError, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(2)).toEqual([jasmine.anything(), onError, jasmine.anything(), jasmine.anything()])
      expect(findLabelsInStatementArray.calls.argsFor(3)).toEqual([jasmine.anything(), onError, jasmine.anything(), jasmine.anything()])
    })
    it(`finds labels using the given labels`, () => {
      expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything())
      expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything())
      expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything())
      expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Labels`, jasmine.anything())
    })
    it(`finds labels using the first statement array concatenated with the next statements`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement A A`, `Test Statement A B`, `Test Statement A C`, `Test Statement A D`, `Test Next Statement A`, `Test Next Statement B`, `Test Next Statement C`]))
    it(`finds labels using the second statement array concatenated with the next statements`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement B A`, `Test Statement B B`, `Test Next Statement A`, `Test Next Statement B`, `Test Next Statement C`]))
    it(`finds labels using the third statement array concatenated with the next statements`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement C A`, `Test Statement C B`, `Test Statement C C`, `Test Statement C D`, `Test Next Statement A`, `Test Next Statement B`, `Test Next Statement C`]))
    it(`finds labels using the fourth statement array concatenated with the next statements`, () => expect(findLabelsInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement D A`, `Test Statement D B`, `Test Statement D C`, `Test Next Statement A`, `Test Next Statement B`, `Test Next Statement C`]))
  })
  containsNoLabels(`line`, {
    origin: {
      file: `Test File`,
      line: 2387,
      subStatement: 783
    },
    line: {
      characters: [`Test Character A`, `Test Character B`, `Test Character C`],
      text: `Test Text`
    }
  })
  containsNoLabels(`emote`, {
    origin: {
      file: `Test File`,
      line: 2387,
      subStatement: 783
    },
    emote: {
      characterName: `Test Character Name`,
      characterNormalizedName: `Test Character Normalized Name`,
      emote: `Test Emote`,
      normalizedEmote: `Test Normalized Emote`
    }
  })
  containsNoLabels(`leave`, {
    origin: {
      file: `Test File`,
      line: 2387,
      subStatement: 783
    },
    leave: {
      characterName: `Test Character Name`,
      characterNormalizedName: `Test Character Normalized Name`
    }
  })
  containsNoLabels(`set`, {
    origin: {
      file: `Test File`,
      line: 2387,
      subStatement: 783
    },
    set: {
      flag: `Test Flag`,
      normalizedFlag: `Test Normalized Flag`,
      value: `Test Value`,
      normalizedValue: `Test Normalized Value`
    }
  })
  describe(`decision`, () => {
    containsOneArrayOfLabels(`if`, {
      origin: {
        file: `Test File`,
        line: 2387,
        subStatement: 783
      },
      decision: {
        paths: [{
          origin: `Test Origin A`,
          condition: `Test Condition A`,
          then: [`Test Statement A A`, `Test Statement A B`, `Test Statement A C`, `Test Statement A D`]
        }]
      }
    })
    containsTwoArraysOfLabels(`if-else`, {
      origin: {
        file: `Test File`,
        line: 2387,
        subStatement: 783
      },
      decision: {
        paths: [{
          origin: `Test Origin A`,
          condition: `Test Condition A`,
          then: [`Test Statement A A`, `Test Statement A B`, `Test Statement A C`, `Test Statement A D`]
        }, {
          origin: `Test Origin B`,
          condition: `Test Condition B`,
          then: [`Test Statement B A`, `Test Statement B B`]
        }]
      }
    })
    containsThreeArraysOfLabels(`if-else-else`, {
      origin: {
        file: `Test File`,
        line: 2387,
        subStatement: 783
      },
      decision: {
        paths: [{
          origin: `Test Origin A`,
          condition: `Test Condition A`,
          then: [`Test Statement A A`, `Test Statement A B`, `Test Statement A C`, `Test Statement A D`]
        }, {
          origin: `Test Origin B`,
          condition: `Test Condition B`,
          then: [`Test Statement B A`, `Test Statement B B`]
        }, {
          origin: `Test Origin C`,
          condition: `Test Condition C`,
          then: [`Test Statement C A`, `Test Statement C B`, `Test Statement C C`, `Test Statement C D`]
        }]
      }
    })
    containsFourArraysOfLabels(`if-else-else-else`, {
      origin: {
        file: `Test File`,
        line: 2387,
        subStatement: 783
      },
      decision: {
        paths: [{
          origin: `Test Origin A`,
          condition: `Test Condition A`,
          then: [`Test Statement A A`, `Test Statement A B`, `Test Statement A C`, `Test Statement A D`]
        }, {
          origin: `Test Origin B`,
          condition: `Test Condition B`,
          then: [`Test Statement B A`, `Test Statement B B`]
        }, {
          origin: `Test Origin C`,
          condition: `Test Condition C`,
          then: [`Test Statement C A`, `Test Statement C B`, `Test Statement C C`, `Test Statement C D`]
        }, {
          origin: `Test Origin D`,
          condition: `Test Condition D`,
          then: [`Test Statement D A`, `Test Statement D B`, `Test Statement D C`]
        }]
      }
    })
  })
  describe(`menu`, () => {
    containsOneArrayOfLabels(`one option`, {
      origin: {
        file: `Test File`,
        line: 2387,
        subStatement: 783
      },
      menu: {
        paths: [{
          origin: `Test Origin A`,
          label: `Test Label A`,
          then: [`Test Statement A A`, `Test Statement A B`, `Test Statement A C`, `Test Statement A D`]
        }]
      }
    })
    containsTwoArraysOfLabels(`two options`, {
      origin: {
        file: `Test File`,
        line: 2387,
        subStatement: 783
      },
      menu: {
        paths: [{
          origin: `Test Origin A`,
          label: `Test Label A`,
          then: [`Test Statement A A`, `Test Statement A B`, `Test Statement A C`, `Test Statement A D`]
        }, {
          origin: `Test Origin B`,
          label: `Test Label B`,
          then: [`Test Statement B A`, `Test Statement B B`]
        }]
      }
    })
    containsThreeArraysOfLabels(`three options`, {
      origin: {
        file: `Test File`,
        line: 2387,
        subStatement: 783
      },
      menu: {
        paths: [{
          origin: `Test Origin A`,
          label: `Test Label A`,
          then: [`Test Statement A A`, `Test Statement A B`, `Test Statement A C`, `Test Statement A D`]
        }, {
          origin: `Test Origin B`,
          label: `Test Label B`,
          then: [`Test Statement B A`, `Test Statement B B`]
        }, {
          origin: `Test Origin C`,
          label: `Test Label C`,
          then: [`Test Statement C A`, `Test Statement C B`, `Test Statement C C`, `Test Statement C D`]
        }]
      }
    })

    containsFourArraysOfLabels(`four options`, {
      origin: {
        file: `Test File`,
        line: 2387,
        subStatement: 783
      },
      menu: {
        paths: [{
          origin: `Test Origin A`,
          label: `Test Label A`,
          then: [`Test Statement A A`, `Test Statement A B`, `Test Statement A C`, `Test Statement A D`]
        }, {
          origin: `Test Origin B`,
          label: `Test Label B`,
          then: [`Test Statement B A`, `Test Statement B B`]
        }, {
          origin: `Test Origin C`,
          label: `Test Label C`,
          then: [`Test Statement C A`, `Test Statement C B`, `Test Statement C C`, `Test Statement C D`]
        }, {
          origin: `Test Origin D`,
          label: `Test Label D`,
          then: [`Test Statement D A`, `Test Statement D B`, `Test Statement D C`]
        }]
      }
    })
  })
  describe(`label`, () => {
    run(`which has already been defined`, {
      origin: {
        file: `Test File`,
        line: 2387,
        subStatement: 783
      },
      label: {
        name: `Test Label Name`,
        normalizedName: `Test Normalized Label Name`
      }
    }, () => objectContainsKey.and.returnValue(true), () => {
      it(`reports one error`, () => expect(onError).toHaveBeenCalledTimes(1))
      it(`reports the error using the given context`, () => expect(onError).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything()))
      it(`reports the error using the line number`, () => expect(onError).toHaveBeenCalledWith(jasmine.anything(), 2387, jasmine.anything()))
      it(`reports the error with a meaningful message`, () => expect(onError).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `The label "Test Label Name" is defined multiple times`))
      it(`checks if one object contains a key`, () => expect(objectContainsKey).toHaveBeenCalledTimes(1))
      it(`checks if the given labels contain a key`, () => expect(objectContainsKey).toHaveBeenCalledWith(`Test Labels`, jasmine.anything()))
      it(`checks if the given labels contain the normalized label name`, () => expect(objectContainsKey).toHaveBeenCalledWith(jasmine.anything(), `Test Normalized Label Name`))
      it(`does not set key values in objects`, () => expect(setObjectKeyValue).not.toHaveBeenCalled())
      it(`does not find labels in statement arrays`, () => expect(findLabelsInStatementArray).not.toHaveBeenCalled())
    })
    run(`which has not previously been defined`, {
      origin: {
        file: `Test File`,
        line: 2387,
        subStatement: 783
      },
      label: {
        name: `Test Label Name`,
        normalizedName: `Test Normalized Label Name`
      }
    }, () => objectContainsKey.and.returnValue(false), () => {
      it(`does not report an error`, () => expect(onError).not.toHaveBeenCalled())
      it(`checks if one object contains a key`, () => expect(objectContainsKey).toHaveBeenCalledTimes(1))
      it(`checks if the given labels contain a key`, () => expect(objectContainsKey).toHaveBeenCalledWith(`Test Labels`, jasmine.anything()))
      it(`checks if the given labels contain the normalized label name`, () => expect(objectContainsKey).toHaveBeenCalledWith(jasmine.anything(), `Test Normalized Label Name`))
      it(`sets one key/value in an object`, () => expect(setObjectKeyValue).toHaveBeenCalledTimes(1))
      it(`sets one key/value in the given labels`, () => expect(setObjectKeyValue).toHaveBeenCalledWith(`Test Labels`, jasmine.anything(), jasmine.anything()))
      it(`sets the normalized label name`, () => expect(setObjectKeyValue).toHaveBeenCalledWith(jasmine.anything(), `Test Normalized Label Name`, jasmine.anything()))
      it(`sets an object`, () => expect(setObjectKeyValue).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.any(Object)))
      it(`sets name to the label's unnormalized name`, () => expect(setObjectKeyValue).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.objectContaining({ name: `Test Label Name` })))
      it(`sets statements to the next statements`, () => expect(setObjectKeyValue).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.objectContaining({ statements: [`Test Next Statement A`, `Test Next Statement B`, `Test Next Statement C`] })))
      it(`does not find labels in statement arrays`, () => expect(findLabelsInStatementArray).not.toHaveBeenCalled())
    })
  })
  containsNoLabels(`goTo`, {
    origin: {
      file: `Test File`,
      line: 2387,
      subStatement: 783
    },
    goTo: {
      label: `Test Label`,
      normalizedLabel: `Test Normalized Label`
    }
  })
  containsNoLabels(`background`, {
    origin: {
      file: `Test File`,
      line: 2387,
      subStatement: 783
    },
    background: {
      name: `Test Name`,
      normalizedName: `Test Normalized Name`
    }
  })
})

describe(`createState`, () => {
  it(`returns an object`, () => expect(get(`createState`)()).toEqual(jasmine.any(Object)))
  it(`returns flags, an empty object`, () => expect(get(`createState`)().flags).toEqual({}))
  it(`returns characters, an empty oobject`, () => expect(get(`createState`)().characters).toEqual({}))
  it(`returns background, null`, () => expect(get(`createState`)().background).toBeNull({}))
  it(`returns the same value every call`, () => expect(get(`createState`)()).toEqual(get(`createState`)()))
  it(`returns a new instance every call`, () => expect(get(`createState`)()).not.toBe(get(`createState`)()))
  it(`returns a new flags every call`, () => expect(get(`createState`)().flags).not.toBe(get(`createState`)().flags))
  it(`returns a new characters every call`, () => expect(get(`createState`)().characters).not.toBe(get(`createState`)().characters))
})

describe(`hashFlag`, () => {
  it(`hashes the same when the normalized values are same`, () => expect(get(`hashFlag`)(`Test Normalized Flag`, {
    flag: `Test Flag A`,
    value: `Test Value A`,
    normalizedValue: `Test Normalized Value`
  })).toEqual(get(`hashFlag`)(`Test Normalized Flag`, {
    flag: `Test Flag B`,
    value: `Test Value B`,
    normalizedValue: `Test Normalized Value`
  })))
  it(`hashes differently should the normalized flag change`, () => expect(get(`hashFlag`)(`Test Normalized Flag A`, {
    flag: `Test Flag A`,
    value: `Test Value A`,
    normalizedValue: `Test Normalized Value`
  })).not.toEqual(get(`hashFlag`)(`Test Normalized Flag B`, {
    flag: `Test Flag B`,
    value: `Test Value B`,
    normalizedValue: `Test Normalized Value`
  })))
  it(`hashes differently should the normalized value change`, () => expect(get(`hashFlag`)(`Test Normalized Flag`, {
    flag: `Test Flag A`,
    value: `Test Value A`,
    normalizedValue: `Test Normalized Value A`
  })).not.toEqual(get(`hashFlag`)(`Test Normalized Flag`, {
    flag: `Test Flag B`,
    value: `Test Value B`,
    normalizedValue: `Test Normalized Value B`
  })))
  it(`separates the flag and value`, () => expect(get(`hashFlag`)(`Test Normalized Flag A`, {
    flag: `Test Flag A`,
    value: `Test Value A`,
    normalizedValue: `Test Normalized Value`
  })).not.toEqual(get(`hashFlag`)(`Test Normalized Flag`, {
    flag: `Test Flag B`,
    value: `Test Value B`,
    normalizedValue: `A Test Normalized Value`
  })))
  it(`separates the value and flag`, () => expect(get(`hashFlag`)(`A Test Normalized Flag`, {
    flag: `Test Flag A`,
    value: `Test Value A`,
    normalizedValue: `Test Normalized Value`
  })).not.toEqual(get(`hashFlag`)(`Test Normalized Flag A`, {
    flag: `Test Flag B`,
    value: `Test Value B`,
    normalizedValue: `Test Normalized Value`
  })))
  it(`still sorts by normalized flag`, () => {
    const hashes = [{
      normalizedFlag: `Test Normalized Flag C`,
      flag: {
        flag: `Test Flag`,
        value: `Test Value`,
        normalizedValue: `Test Normalized Value D`
      }
    }, {
      normalizedFlag: `Test Normalized Flag A`,
      flag: {
        flag: `Test Flag`,
        value: `Test Value`,
        normalizedValue: `Test Normalized Value B`
      }
    }, {
      normalizedFlag: `Test Normalized Flag D`,
      flag: {
        flag: `Test Flag`,
        value: `Test Value`,
        normalizedValue: `Test Normalized Value C`
      }
    }, {
      normalizedFlag: `Test Normalized Flag B`,
      flag: {
        flag: `Test Flag`,
        value: `Test Value`,
        normalizedValue: `Test Normalized Value A`
      }
    }].map(flag => get(`hashFlag`)(flag.normalizedFlag, flag.flag))
    const sortedHashes = hashes.slice().sort()
    const sortedIndices = sortedHashes.map(hash => hashes.indexOf(hash))
    expect(sortedIndices).toEqual([1, 3, 0, 2])
  })
})

describe(`hashFlags`, () => {
  let unhashedA
  let unhashedACopy
  let unhashedB
  let unhashedBCopy
  let resultA
  let resultB
  const hashFlag = setSpy(`hashFlag`)
  afterEach(() => hashFlag.calls.reset())
  const run = (description, hashedA, hashedB, then) => describe(description, () => {
    beforeEach(() => {
      unhashedA = {}
      hashedA.forEach((hashed, i) => unhashedA[`Test Unhashed Key A ${i}`] = `Test Unhashed Value A ${i}`)
      unhashedACopy = JSON.parse(JSON.stringify(unhashedA))
      unhashedB = {}
      hashedB.forEach((hashed, i) => unhashedB[`Test Unhashed Key B ${i}`] = `Test Unhashed Value B ${i}`)
      unhashedBCopy = JSON.parse(JSON.stringify(unhashedB))
      hashFlag.and.callFake(flag => {
        const match = /^Test Unhashed Key ([A-Z]) (\d+)$/.exec(flag)
        switch (match[1]) {
          case `A`:
            return hashedA[match[2]]
          case `B`:
            return hashedB[match[2]]
        }
      })
      resultA = get(`hashFlags`)(unhashedA)
      resultB = get(`hashFlags`)(unhashedB)
    })
    it(`calls hashFlag once per flag`, () => expect(hashFlag).toHaveBeenCalledTimes(hashedA.length + hashedB.length))
    it(`calls hashFlag for every flag from the first set`, () => hashedA.forEach((hashed, i) => expect(hashFlag).toHaveBeenCalledWith(`Test Unhashed Key A ${i}`, `Test Unhashed Value A ${i}`)))
    it(`calls hashFlag for every flag from the second set`, () => hashedB.forEach((hashed, i) => expect(hashFlag).toHaveBeenCalledWith(`Test Unhashed Key B ${i}`, `Test Unhashed Value B ${i}`)))
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

describe(`hashCharacter`, () => {
  it(`hashes the same when the normalized values are same`, () => expect(get(`hashCharacter`)(`Test Normalized Name`, {
    name: `Test Name A`,
    emote: `Test Emote A`,
    normalizedEmote: `Test Normalized Emote`
  })).toEqual(get(`hashCharacter`)(`Test Normalized Name`, {
    name: `Test Name B`,
    emote: `Test Emote B`,
    normalizedEmote: `Test Normalized Emote`
  })))
  it(`hashes differently should the normalized name change`, () => expect(get(`hashCharacter`)(`Test Normalized Name A`, {
    name: `Test Name A`,
    emote: `Test Emote A`,
    normalizedEmote: `Test Normalized Emote`
  })).not.toEqual(get(`hashCharacter`)(`Test Normalized Name B`, {
    name: `Test Name B`,
    emote: `Test Emote B`,
    normalizedEmote: `Test Normalized Emote`
  })))
  it(`hashes differently should the normalized emote change`, () => expect(get(`hashCharacter`)(`Test Normalized Name`, {
    name: `Test Name A`,
    emote: `Test Emote A`,
    normalizedEmote: `Test Normalized Emote A`
  })).not.toEqual(get(`hashCharacter`)(`Test Normalized Name`, {
    name: `Test Name B`,
    emote: `Test Emote B`,
    normalizedEmote: `Test Normalized Emote B`
  })))
  it(`separates the name and emote`, () => expect(get(`hashCharacter`)(`Test Normalized Name A`, {
    name: `Test Name A`,
    emote: `Test Emote A`,
    normalizedEmote: `Test Normalized Emote`
  })).not.toEqual(get(`hashCharacter`)(`Test Normalized Name`, {
    name: `Test Name B`,
    emote: `Test Emote B`,
    normalizedEmote: `A Test Normalized Emote`
  })))
  it(`separates the emote and name`, () => expect(get(`hashCharacter`)(`A Test Normalized Name`, {
    name: `Test Name A`,
    emote: `Test Emote A`,
    normalizedEmote: `Test Normalized Emote`
  })).not.toEqual(get(`hashCharacter`)(`Test Normalized Name A`, {
    name: `Test Name B`,
    emote: `Test Emote B`,
    normalizedEmote: `Test Normalized Emote`
  })))
  it(`still sorts by normalized name`, () => {
    const hashes = [{
      normalizedName: `Test Normalized Name C`,
      character: {
        name: `Test Name`,
        emote: `Test Emote`,
        normalizedEmote: `Test Normalized Emote D`
      }
    }, {
      normalizedName: `Test Normalized Name A`,
      character: {
        name: `Test Name`,
        emote: `Test Emote`,
        normalizedEmote: `Test Normalized Emote B`
      }
    }, {
      normalizedName: `Test Normalized Name D`,
      character: {
        name: `Test Name`,
        emote: `Test Emote`,
        normalizedEmote: `Test Normalized Emote C`
      }
    }, {
      normalizedName: `Test Normalized Name B`,
      character: {
        name: `Test Name`,
        emote: `Test Emote`,
        normalizedEmote: `Test Normalized Emote A`
      }
    }].map(character => get(`hashCharacter`)(character.normalizedName, character))
    const sortedHashes = hashes.slice().sort()
    const sortedIndices = sortedHashes.map(hash => hashes.indexOf(hash))
    expect(sortedIndices).toEqual([1, 3, 0, 2])
  })
})

describe(`hashCharacters`, () => {
  let unhashedA
  let unhashedACopy
  let unhashedB
  let unhashedBCopy
  let resultA
  let resultB
  const hashCharacter = setSpy(`hashCharacter`)
  afterEach(() => hashCharacter.calls.reset())
  const run = (description, hashedA, hashedB, then) => describe(description, () => {
    beforeEach(() => {
      unhashedA = {}
      hashedA.forEach((hashed, i) => unhashedA[`Test Unhashed Key A ${i}`] = `Test Unhashed Value A ${i}`)
      unhashedACopy = JSON.parse(JSON.stringify(unhashedA))
      unhashedB = {}
      hashedB.forEach((hashed, i) => unhashedB[`Test Unhashed Key B ${i}`] = `Test Unhashed Value B ${i}`)
      unhashedBCopy = JSON.parse(JSON.stringify(unhashedB))
      hashCharacter.and.callFake(character => {
        const match = /^Test Unhashed Key ([A-Z]) (\d+)$/.exec(character)
        switch (match[1]) {
          case `A`:
            return hashedA[match[2]]
          case `B`:
            return hashedB[match[2]]
        }
      })
      resultA = get(`hashCharacters`)(unhashedA)
      resultB = get(`hashCharacters`)(unhashedB)
    })
    it(`calls hashCharacter once per character`, () => expect(hashCharacter).toHaveBeenCalledTimes(hashedA.length + hashedB.length))
    it(`calls hashCharacter for every character from the first set`, () => hashedA.forEach((hashed, i) => expect(hashCharacter).toHaveBeenCalledWith(`Test Unhashed Key A ${i}`, `Test Unhashed Value A ${i}`)))
    it(`calls hashCharacter for every character from the second set`, () => hashedB.forEach((hashed, i) => expect(hashCharacter).toHaveBeenCalledWith(`Test Unhashed Key B ${i}`, `Test Unhashed Value B ${i}`)))
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

describe(`hash`, () => {
  let statementACopy
  let resultA
  let statementBCopy
  let resultB
  const hashFlags = setSpy(`hashFlags`)
  const hashCharacters = setSpy(`hashCharacters`)
  afterEach(() => {
    hashFlags.calls.reset()
    hashCharacters.calls.reset()
  })
  const run = (description, statementA, hashedFlagsA, hashedCharactersA, normalizedBackgroundA, statementB, hashedFlagsB, hashedCharactersB, normalizedBackgroundB, then) => describe(description, () => {
    beforeEach(() => {
      hashFlags.and.callFake(flags => {
        switch (flags) {
          case `Test Flags A`:
            return hashedFlagsA
          case `Test Flags B`:
            return hashedFlagsB
        }
      })
      hashCharacters.and.callFake(characters => {
        switch (characters) {
          case `Test Characters A`:
            return hashedCharactersA
          case `Test Characters B`:
            return hashedCharactersB
        }
      })
      statementACopy = JSON.parse(JSON.stringify(statementA))
      statementBCopy = JSON.parse(JSON.stringify(statementB))

      resultA = get(`hash`)(statementACopy, `Test Flags A`, `Test Characters A`, normalizedBackgroundA)
      resultB = get(`hash`)(statementBCopy, `Test Flags B`, `Test Characters B`, normalizedBackgroundB)
    })
    it(`does not modify the first statement`, () => expect(statementACopy).toEqual(statementA))
    it(`does not modify the second statement`, () => expect(statementBCopy).toEqual(statementB))
    it(`calls hashFlags twice`, () => expect(hashFlags).toHaveBeenCalledTimes(2))
    it(`calls hashFlags with the first state's flags`, () => expect(hashFlags).toHaveBeenCalledWith(`Test Flags A`))
    it(`calls hashFlags with the second state's flags`, () => expect(hashFlags).toHaveBeenCalledWith(`Test Flags B`))
    it(`calls hashCharacters twice`, () => expect(hashCharacters).toHaveBeenCalledTimes(2))
    it(`calls hashCharacters with the first state's flags`, () => expect(hashCharacters).toHaveBeenCalledWith(`Test Characters A`))
    it(`calls hashCharacters with the second state's flags`, () => expect(hashCharacters).toHaveBeenCalledWith(`Test Characters B`))
    then()
  })
  const runMatching = (description, statementA, hashedStateFlagsA, hashedStateCharactersA, normalizedStateBackgroundA, statementB, hashedStateFlagsB, hashedStateCharactersB, normalizedStateBackgroundB) => run(description, statementA, hashedStateFlagsA, hashedStateCharactersA, normalizedStateBackgroundA, statementB, hashedStateFlagsB, hashedStateCharactersB, normalizedStateBackgroundB, () => {
    it(`returns matching hashes`, () => expect(resultA).toEqual(resultB))
  })
  const runNotMatching = (description, statementA, hashedStateFlagsA, hashedStateCharactersA, normalizedStateBackgroundA, statementB, hashedStateFlagsB, hashedStateCharactersB, normalizedStateBackgroundB) => run(description, statementA, hashedStateFlagsA, hashedStateCharactersA, normalizedStateBackgroundA, statementB, hashedStateFlagsB, hashedStateCharactersB, normalizedStateBackgroundB, () => {
    it(`returns differing hashes`, () => expect(resultA).not.toEqual(resultB))
  })
  runMatching(`everything matches`, { origin: { file: `Test File`, line: 7982, subStatement: 873 }, miscKey: `Test Misc Value` }, `Test Hashed State Flags`, `Test Hashed Character Flags`, `Test Normalized Background`, { origin: { file: `Test File`, line: 7982, subStatement: 873 }, miscKey: `Test Misc Value` }, `Test Hashed State Flags`, `Test Hashed Character Flags`, `Test Normalized Background`)
  runMatching(`irrelevant parts of the statement do not match`, { origin: { file: `Test File`, line: 7982, subStatement: 873 }, miscKey: `Test Misc Value A` }, `Test Hashed State Flags`, `Test Hashed Character Flags`, `Test Normalized Background`, { origin: { file: `Test File`, line: 7982, subStatement: 873 }, miscKey: `Test Misc Value B` }, `Test Hashed State Flags`, `Test Hashed Character Flags`, `Test Normalized Background`)
  runNotMatching(`origin file does not match`, { origin: { file: `Test File A`, line: 7982, subStatement: 873 }, miscKey: `Test Misc Value` }, `Test Hashed State Flags`, `Test Hashed Character Flags`, `Test Normalized Background`, { origin: { file: `Test File B`, line: 7982, subStatement: 873 }, miscKey: `Test Misc Value` }, `Test Hashed State Flags`, `Test Hashed Character Flags`, `Test Normalized Background`)
  runNotMatching(`origin line does not match`, { origin: { file: `Test File`, line: 7987, subStatement: 873 }, miscKey: `Test Misc Value` }, `Test Hashed State Flags`, `Test Hashed Character Flags`, `Test Normalized Background`, { origin: { file: `Test File`, line: 7982, subStatement: 873 }, miscKey: `Test Misc Value` }, `Test Hashed State Flags`, `Test Hashed Character Flags`, `Test Normalized Background`)
  runNotMatching(`origin subStatement does not match`, { origin: { file: `Test File`, line: 7982, subStatement: 877 }, miscKey: `Test Misc Value` }, `Test Hashed State Flags`, `Test Hashed Character Flags`, `Test Normalized Background`, { origin: { file: `Test File`, line: 7982, subStatement: 873 }, miscKey: `Test Misc Value` }, `Test Hashed State Flags`, `Test Hashed Character Flags`, `Test Normalized Background`)
  runNotMatching(`state flags do not match`, { origin: { file: `Test File`, line: 7982, subStatement: 873 }, miscKey: `Test Misc Value` }, `Test Hashed State Flags A`, `Test Hashed Character Flags`, `Test Normalized Background`, { origin: { file: `Test File`, line: 7982, subStatement: 873 }, miscKey: `Test Misc Value` }, `Test Hashed State Flags B`, `Test Hashed Character Flags`, `Test Normalized Background`)
  runNotMatching(`character flags do not match`, { origin: { file: `Test File`, line: 7982, subStatement: 873 }, miscKey: `Test Misc Value` }, `Test Hashed State Flags`, `Test Hashed Character Flags A`, `Test Normalized Background`, { origin: { file: `Test File`, line: 7982, subStatement: 873 }, miscKey: `Test Misc Value` }, `Test Hashed State Flags`, `Test Hashed Character Flags B`, `Test Normalized Background`)
  runNotMatching(`backgrounds do not match`, { origin: { file: `Test File`, line: 7982, subStatement: 873 }, miscKey: `Test Misc Value` }, `Test Hashed State Flags`, `Test Hashed Character Flags`, `Test Normalized Background A`, { origin: { file: `Test File`, line: 7982, subStatement: 873 }, miscKey: `Test Misc Value` }, `Test Hashed State Flags`, `Test Hashed Character Flags`, `Test Normalized Background B`)
})

describe(`conditionMet`, () => {
  const getObjectKeyValue = setSpy(`getObjectKeyValue`)
  afterEach(() => getObjectKeyValue.calls.reset())
  let conditionCopy
  let result
  const run = (description, condition, setup, then) => describe(description, () => {
    beforeEach(() => {
      conditionCopy = JSON.parse(JSON.stringify(condition))
      setup()
      result = get(`conditionMet`)(conditionCopy, `Test Flags`)
    })
    it(`does not modify the condition`, () => expect(conditionCopy).toEqual(condition))
    then()
  })
  const runMatching = (description, condition, setup, then) => run(description, condition, setup, () => {
    it(`returns true`, () => expect(result).toBe(true))
    then()
  })
  const runNotMatching = (description, condition, setup, then) => run(description, condition, setup, () => {
    it(`returns false`, () => expect(result).toBe(false))
    then()
  })
  runMatching(`null`, null, () => { }, () => {
    it(`does not get key/values from objects`, () => expect(getObjectKeyValue).not.toHaveBeenCalled())
  })
  describe(`flag`, () => {
    const flagCondition = {
      flag: {
        flag: `Test Condition Flag`,
        normalizedFlag: `Test Normalized Condition Flag`,
        value: `Test Condition Value`,
        normalizedValue: `Test Normalized Condition Value`
      }
    }
    runNotMatching(`when the flag is not set`, flagCondition, () => getObjectKeyValue.and.returnValue(null), () => {
      it(`gets one key/value from an object`, () => expect(getObjectKeyValue).toHaveBeenCalledTimes(1))
      it(`gets one key/value from the given flags`, () => expect(getObjectKeyValue).toHaveBeenCalledWith(`Test Flags`, jasmine.anything()))
      it(`gets the flag from the given flags`, () => expect(getObjectKeyValue).toHaveBeenCalledWith(jasmine.anything(), `Test Normalized Condition Flag`))
    })
    let extractedFlag
    runNotMatching(`when the flag is set with a different value`, flagCondition, () => {
      extractedFlag = {
        flag: `Test Flag`,
        value: `Test Flag Value`,
        normalizedValue: `Test Normalized Flag Value`
      }
      getObjectKeyValue.and.returnValue(extractedFlag)
    }, () => {
      it(`does not modify the extracted flag`, () => expect(extractedFlag).toEqual({
        flag: `Test Flag`,
        value: `Test Flag Value`,
        normalizedValue: `Test Normalized Flag Value`
      }))
      it(`gets one key/value from an object`, () => expect(getObjectKeyValue).toHaveBeenCalledTimes(1))
      it(`gets one key/value from the given flags`, () => expect(getObjectKeyValue).toHaveBeenCalledWith(`Test Flags`, jasmine.anything()))
      it(`gets the flag from the given flags`, () => expect(getObjectKeyValue).toHaveBeenCalledWith(jasmine.anything(), `Test Normalized Condition Flag`))
    })
    runMatching(`when the flag is set with a different value`, flagCondition, () => {
      extractedFlag = {
        flag: `Test Flag`,
        value: `Test Flag Value`,
        normalizedValue: `Test Normalized Condition Value`
      }
      getObjectKeyValue.and.returnValue(extractedFlag)
    }, () => {
      it(`does not modify the extracted flag`, () => expect(extractedFlag).toEqual({
        flag: `Test Flag`,
        value: `Test Flag Value`,
        normalizedValue: `Test Normalized Condition Value`
      }))
      it(`gets one key/value from an object`, () => expect(getObjectKeyValue).toHaveBeenCalledTimes(1))
      it(`gets one key/value from the given flags`, () => expect(getObjectKeyValue).toHaveBeenCalledWith(`Test Flags`, jasmine.anything()))
      it(`gets the flag from the given flags`, () => expect(getObjectKeyValue).toHaveBeenCalledWith(jasmine.anything(), `Test Normalized Condition Flag`))
    })
  })
})
