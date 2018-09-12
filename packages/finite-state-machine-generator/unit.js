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
  it(`adds no further properties`, () => expect(Object.keys(object).length).toEqual(4))
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
  let statementACopy
  let stateA
  let stateACopy
  let resultA
  let statementBCopy
  let stateB
  let stateBCopy
  let resultB
  const hashStateFlags = setSpy(`hashStateFlags`)
  const hashStateCharacters = setSpy(`hashStateCharacters`)
  afterEach(() => {
    hashStateFlags.calls.reset()
    hashStateCharacters.calls.reset()
  })
  const run = (description, statementA, hashedStateFlagsA, hashedStateCharactersA, normalizedStateBackgroundA, statementB, hashedStateFlagsB, hashedStateCharactersB, normalizedStateBackgroundB, then) => describe(description, () => {
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
      statementACopy = JSON.parse(JSON.stringify(statementA))
      statementBCopy = JSON.parse(JSON.stringify(statementB))
      stateA = {
        flags: `Test Flags A`,
        characters: `Test Characters A`,
        background: normalizedStateBackgroundA
      }
      stateACopy = JSON.parse(JSON.stringify(stateA))
      stateB = {
        flags: `Test Flags B`,
        characters: `Test Characters B`,
        background: normalizedStateBackgroundB
      }
      stateBCopy = JSON.parse(JSON.stringify(stateB))

      resultA = get(`hashPromptState`)(statementACopy, stateA)
      resultB = get(`hashPromptState`)(statementBCopy, stateB)
    })
    it(`does not modify the first statement`, () => expect(statementACopy).toEqual(statementA))
    it(`does not modify the second statement`, () => expect(statementBCopy).toEqual(statementB))
    it(`does not modify the first state`, () => expect(stateA).toEqual(stateACopy))
    it(`does not modify the second state`, () => expect(stateB).toEqual(stateBCopy))
    it(`calls hashStateFlags twice`, () => expect(hashStateFlags).toHaveBeenCalledTimes(2))
    it(`calls hashStateFlags with the first state's flags`, () => expect(hashStateFlags).toHaveBeenCalledWith(`Test Flags A`))
    it(`calls hashStateFlags with the second state's flags`, () => expect(hashStateFlags).toHaveBeenCalledWith(`Test Flags B`))
    it(`calls hashStateCharacters twice`, () => expect(hashStateCharacters).toHaveBeenCalledTimes(2))
    it(`calls hashStateCharacters with the first state's flags`, () => expect(hashStateCharacters).toHaveBeenCalledWith(`Test Characters A`))
    it(`calls hashStateCharacters with the second state's flags`, () => expect(hashStateCharacters).toHaveBeenCalledWith(`Test Characters B`))
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
    it(`does not modify the first set of prompt states`, () => expect(aCopy).toEqual(a))
    it(`does not modify the second set of prompt states`, () => expect(bCopy).toEqual(b))
    then()
  })
  run(`all null`, null, null, () => {
    it(`returns null`, () => expect(result).toBeNull())
  })
  run(`first set of prompt states only`, [{
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
    it(`returns the first set of prompt states`, () => expect(result).toEqual([{
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
  run(`second set of prompt states only`, null, [{
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
    it(`returns the second set of prompt states`, () => expect(result).toEqual([{
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
  run(`two sets of prompt states without overlap`, [{
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
    it(`returns the prompt states from the first set`, () => {
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
    it(`returns the prompt states from the second set`, () => {
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
    it(`returns no further prompt states`, () => expect(result.length).toEqual(9))
  })
  run(`two sets of prompt states with overlap`, [{
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
    it(`returns the prompt states from the first set`, () => {
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
    it(`returns the prompt states from the second set (excluding those which are also from the first set)`, () => {
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
    it(`returns no further prompt states`, () => expect(result.length).toEqual(7))
  })
})

describe(`findPromptStateByHash`, () => {
  const run = (description, promptStates, hash, expectedResult) => describe(description, () => {
    let actualResult
    let promptStatesCopy
    beforeEach(() => {
      promptStatesCopy = JSON.parse(JSON.stringify(promptStates))
      actualResult = get(`findPromptStateByHash`)(promptStatesCopy, hash)
    })
    it(`does not modify the given prompt states`, () => expect(promptStatesCopy).toEqual(promptStates))
    it(`returns the expected result`, () => expect(actualResult).toEqual(expectedResult))
  })
  run(`no prompt states`, [], `Test Hash`, null)
  run(`no matching prompt state`, [{
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
  }], `Test Hash E`, null)
  run(`a matching prompt state`, [{
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
  }], `Test Hash C`, {
      hash: `Test Hash C`,
      statement: `Test Statement C`,
      state: `Test State C`
    })
})

describe(`replacePromptState`, () => {
  let promptStates
  let replacement
  let result
  beforeEach(() => {
    promptStates = [{
      hash: `Test Hash A`,
      misc: `Test Misc A`
    }, {
      hash: `Test Hash B`,
      misc: `Test Misc B`
    }, {
      hash: `Test Hash C`,
      misc: `Test Misc C`
    }, {
      hash: `Test Hash D`,
      misc: `Test Misc D`
    }, {
      hash: `Test Hash E`,
      misc: `Test Misc E`
    }]
    replacement = {
      hash: `Test Hash D`,
      misc: `Test Misc F`
    }
    result = get(`replacePromptState`)(promptStates, replacement)
  })
  it(`does not modify the prompt states`, () => expect(promptStates).toEqual([{
    hash: `Test Hash A`,
    misc: `Test Misc A`
  }, {
    hash: `Test Hash B`,
    misc: `Test Misc B`
  }, {
    hash: `Test Hash C`,
    misc: `Test Misc C`
  }, {
    hash: `Test Hash D`,
    misc: `Test Misc D`
  }, {
    hash: `Test Hash E`,
    misc: `Test Misc E`
  }]))
  it(`does not modify the replacement`, () => expect(replacement).toEqual({
    hash: `Test Hash D`,
    misc: `Test Misc F`
  }))
  it(`returns an array`, () => expect(result).toEqual(jasmine.any(Array)))
  it(`includes every prompt state with a different hash`, () => {
    expect(result).toContain({
      hash: `Test Hash A`,
      misc: `Test Misc A`
    })
    expect(result).toContain({
      hash: `Test Hash B`,
      misc: `Test Misc B`
    })
    expect(result).toContain({
      hash: `Test Hash C`,
      misc: `Test Misc C`
    })
    expect(result).toContain({
      hash: `Test Hash E`,
      misc: `Test Misc E`
    })
  })
  it(`includes the given prompt state`, () => expect(result).toContain({
    hash: `Test Hash D`,
    misc: `Test Misc F`
  }))
  it(`includes no further prompt states`, () => expect(result.length).toEqual(5))
})

describe(`promptStatesContainHash`, () => {
  const run = (description, promptStates, hash, expectedResult) => describe(description, () => {
    let actualResult
    let promptStatesCopy
    beforeEach(() => {
      promptStatesCopy = JSON.parse(JSON.stringify(promptStates))
      actualResult = get(`promptStatesContainHash`)(promptStatesCopy, hash)
    })
    it(`does not modify the given prompt states`, () => expect(promptStatesCopy).toEqual(promptStates))
    it(`returns the expected result`, () => expect(actualResult).toBe(expectedResult))
  })
  run(`no prompt states`, [], `Test Hash`, false)
  run(`no matching prompt state`, [{
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
  }], `Test Hash E`, false)
  run(`a matching prompt state`, [{
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
  }], `Test Hash C`, true)
})

describe(`conditionMet`, () => {
  let conditionCopy
  let stateCopy
  let result
  const run = (description, condition, state, then) => describe(description, () => {
    beforeEach(() => {
      conditionCopy = JSON.parse(JSON.stringify(condition))
      stateCopy = JSON.parse(JSON.stringify(state))
      result = get(`conditionMet`)(conditionCopy, stateCopy)
    })
    it(`does not modify the condition`, () => expect(conditionCopy).toEqual(condition))
    it(`does not modify the state`, () => expect(stateCopy).toEqual(state))
    then()
  })
  const runMatching = (description, condition, state) => run(description, condition, state, () => {
    it(`returns true`, () => expect(result).toBe(true))
  })
  const runNotMatching = (description, condition, state) => run(description, condition, state, () => {
    it(`returns false`, () => expect(result).toBe(false))
  })
  runMatching(`null`, null, `Test State`, () => { })
  describe(`flag`, () => {
    const flagCondition = {
      flag: {
        flag: `Test Condition Flag`,
        normalizedFlag: `Test Normalized Condition Flag`,
        value: `Test Condition Value`,
        normalizedValue: `Test Normalized Condition Value`
      }
    }
    runMatching(`when the flag and value match`, flagCondition, {
      flags: [{
        flag: `Test Flag A`,
        normalizedFlag: `Test Normalized Flag A`,
        value: `Test Value A`,
        normalizedValue: `Test Normalized Value A`
      }, {
        flag: `Test Flag B`,
        normalizedFlag: `Test Normalized Flag B`,
        value: `Test Value B`,
        normalizedValue: `Test Normalized Value B`
      }, {
        flag: `Test Flag C`,
        normalizedFlag: `Test Normalized Condition Flag`,
        value: `Test Value C`,
        normalizedValue: `Test Normalized Condition Value`
      }, {
        flag: `Test Flag D`,
        normalizedFlag: `Test Normalized Flag D`,
        value: `Test Value D`,
        normalizedValue: `Test Normalized Value D`
      }],
      characters: `Test Characters`,
      background: `Test Background`
    })
    runNotMatching(`when the flag does not match`, flagCondition, {
      flags: [{
        flag: `Test Flag A`,
        normalizedFlag: `Test Normalized Flag A`,
        value: `Test Value A`,
        normalizedValue: `Test Normalized Value A`
      }, {
        flag: `Test Flag B`,
        normalizedFlag: `Test Normalized Flag B`,
        value: `Test Value B`,
        normalizedValue: `Test Normalized Value B`
      }, {
        flag: `Test Flag C`,
        normalizedFlag: `Test Other Normalized Condition Flag`,
        value: `Test Value C`,
        normalizedValue: `Test Normalized Condition Value`
      }, {
        flag: `Test Flag D`,
        normalizedFlag: `Test Normalized Flag D`,
        value: `Test Value D`,
        normalizedValue: `Test Normalized Value D`
      }],
      characters: `Test Characters`,
      background: `Test Background`
    })
    runNotMatching(`when the value does not match`, flagCondition, {
      flags: [{
        flag: `Test Flag A`,
        normalizedFlag: `Test Normalized Flag A`,
        value: `Test Value A`,
        normalizedValue: `Test Normalized Value A`
      }, {
        flag: `Test Flag B`,
        normalizedFlag: `Test Normalized Flag B`,
        value: `Test Value B`,
        normalizedValue: `Test Normalized Value B`
      }, {
        flag: `Test Flag C`,
        normalizedFlag: `Test Normalized Condition Flag`,
        value: `Test Value C`,
        normalizedValue: `Test Other Normalized Condition Value`
      }, {
        flag: `Test Flag D`,
        normalizedFlag: `Test Normalized Flag D`,
        value: `Test Value D`,
        normalizedValue: `Test Normalized Value D`
      }],
      characters: `Test Characters`,
      background: `Test Background`
    })
    runNotMatching(`when neither the flag nor value match`, flagCondition, {
      flags: [{
        flag: `Test Flag A`,
        normalizedFlag: `Test Normalized Flag A`,
        value: `Test Value A`,
        normalizedValue: `Test Normalized Value A`
      }, {
        flag: `Test Flag B`,
        normalizedFlag: `Test Normalized Flag B`,
        value: `Test Value B`,
        normalizedValue: `Test Normalized Value B`
      }, {
        flag: `Test Flag C`,
        normalizedFlag: `Test Other Normalized Condition Flag`,
        value: `Test Value C`,
        normalizedValue: `Test Other Normalized Condition Value`
      }, {
        flag: `Test Flag D`,
        normalizedFlag: `Test Normalized Flag D`,
        value: `Test Value D`,
        normalizedValue: `Test Normalized Value D`
      }],
      characters: `Test Characters`,
      background: `Test Background`
    })
    runNotMatching(`when there are no flags`, flagCondition, {
      flags: [],
      characters: `Test Characters`,
      background: `Test Background`
    })
    runMatching(`when multiple flags have the same value, but only one has the correct flag`, flagCondition, {
      flags: [{
        flag: `Test Flag A`,
        normalizedFlag: `Test Normalized Flag A`,
        value: `Test Value A`,
        normalizedValue: `Test Normalized Value A`
      }, {
        flag: `Test Flag B`,
        normalizedFlag: `Test Normalized Flag B`,
        value: `Test Value B`,
        normalizedValue: `Test Normalized Condition Value`
      }, {
        flag: `Test Flag C`,
        normalizedFlag: `Test Normalized Condition Flag`,
        value: `Test Value C`,
        normalizedValue: `Test Normalized Condition Value`
      }, {
        flag: `Test Flag D`,
        normalizedFlag: `Test Normalized Flag D`,
        value: `Test Value D`,
        normalizedValue: `Test Normalized Condition Value`
      }],
      characters: `Test Characters`,
      background: `Test Background`
    })
  })
})

describe(`findPromptStatesInStatementArray`, () => {
  let statementsCopy
  let result
  const findPromptStatesInStatement = setSpy(`findPromptStatesInStatement`)
  findPromptStatesInStatement.and.returnValue(`Test Recursed States`)
  afterEach(() => findPromptStatesInStatement.calls.reset())
  const run = (description, statements, then) => describe(description, () => {
    beforeEach(() => {
      statementsCopy = JSON.parse(JSON.stringify(statements))
      result = get(`findPromptStatesInStatementArray`)(`Test Context`, `Test On Error`, statementsCopy, `Test State`, `Test Prompt States`, `Test Labels`)
    })
    it(`does not modify the given statements`, () => expect(statementsCopy).toEqual(statements))
    then()
  })
  run(`no statements`, [], () => {
    it(`does not call findPromptStatesInStatement`, () => expect(findPromptStatesInStatement).not.toHaveBeenCalled())
    it(`returns an object`, () => expect(result).toEqual(jasmine.any(Object)))
    it(`returns a null prompt state`, () => expect(result.promptState).toBeNull())
    it(`returns the given prompt states`, () => expect(result.promptStates).toEqual(`Test Prompt States`))
  })
  run(`one statement`, [`Test Statement A`], () => {
    it(`calls findPromptStatesInStatement once`, () => expect(findPromptStatesInStatement).toHaveBeenCalledTimes(1))
    it(`calls findPromptStatesInStatement with the given context`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStatesInStatement with the given onError`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStatesInStatement with the first given statement`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statement A`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStatesInStatement with the next given statements`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), [], jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStatesInStatement with the given state`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test State`, jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStatesInStatement with the given prompt states`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Prompt States`, jasmine.anything()))
    it(`calls findPromptStatesInStatement with the given labels`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Labels`))
    it(`returns the result of findPromptStatesInStatement`, () => expect(result).toEqual(`Test Recursed States`))
  })
  run(`two statements`, [`Test Statement A`, `Test Statement B`], () => {
    it(`calls findPromptStatesInStatement once`, () => expect(findPromptStatesInStatement).toHaveBeenCalledTimes(1))
    it(`calls findPromptStatesInStatement with the given context`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStatesInStatement with the given onError`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStatesInStatement with the first given statement`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statement A`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStatesInStatement with the next given statements`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement B`], jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStatesInStatement with the given state`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test State`, jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStatesInStatement with the given prompt states`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Prompt States`, jasmine.anything()))
    it(`calls findPromptStatesInStatement with the given labels`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Labels`))
    it(`returns the result of findPromptStatesInStatement`, () => expect(result).toEqual(`Test Recursed States`))
  })
  run(`three statements`, [`Test Statement A`, `Test Statement B`, `Test Statement C`], () => {
    it(`calls findPromptStatesInStatement once`, () => expect(findPromptStatesInStatement).toHaveBeenCalledTimes(1))
    it(`calls findPromptStatesInStatement with the given context`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStatesInStatement with the given onError`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStatesInStatement with the first given statement`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Statement A`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStatesInStatement with the next given statements`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Statement B`, `Test Statement C`], jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStatesInStatement with the given state`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test State`, jasmine.anything(), jasmine.anything()))
    it(`calls findPromptStatesInStatement with the given prompt states`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Prompt States`, jasmine.anything()))
    it(`calls findPromptStatesInStatement with the given labels`, () => expect(findPromptStatesInStatement).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Labels`))
    it(`returns the result of findPromptStatesInStatement`, () => expect(result).toEqual(`Test Recursed States`))
  })
})

describe(`findPromptStatesInStatement`, () => {
  const hashPromptState = setSpy(`hashPromptState`)
  hashPromptState.and.returnValue(`Test Hashed Prompt State`)
  const promptStatesContainHash = setSpy(`promptStatesContainHash`)
  const findPromptStatesInStatementArray = setSpy(`findPromptStatesInStatementArray`)
  const replacePromptState = setSpy(`replacePromptState`)
  afterEach(() => {
    hashPromptState.calls.reset()
    promptStatesContainHash.calls.reset()
    findPromptStatesInStatementArray.calls.reset()
    replacePromptState.calls.reset()
  })
  let statement
  let promptStates
  beforeEach(() => {
    statement = {
      origin: `Test Origin`,
      line: {
        characters: `Test Characters`,
        text: `Test Text`
      }
    }
    promptStates = [`Test Prompt State A`, `Test Prompt State B`, `Test Prompt State C`]
  })
  describe(`when the hash already exists in the prompt states`, () => {
    let result
    beforeEach(() => {
      promptStatesContainHash.and.returnValue(true)
      result = get(`findPromptStatesInStatement`)(`Test Context`, `Test On Error`, statement, `Test Next Statements`, `Test State`, promptStates, `Test Labels`)
    })
    it(`hashes one prompt state`, () => expect(hashPromptState).toHaveBeenCalledTimes(1))
    it(`hashes the given statement`, () => expect(hashPromptState).toHaveBeenCalledWith({
      origin: `Test Origin`,
      line: {
        characters: `Test Characters`,
        text: `Test Text`
      }
    }, jasmine.anything()))
    it(`hashes the given state`, () => expect(hashPromptState).toHaveBeenCalledWith(jasmine.anything(), `Test State`))
    it(`checks whether one set of prompt states contains a hash`, () => expect(promptStatesContainHash).toHaveBeenCalledTimes(1))
    it(`checks whether the given set of prompt states contains a hash`, () => expect(promptStatesContainHash).toHaveBeenCalledWith([`Test Prompt State A`, `Test Prompt State B`, `Test Prompt State C`], jasmine.anything()))
    it(`checks whether a set of prompt states contains the hash of the given prompt state`, () => expect(promptStatesContainHash).toHaveBeenCalledWith(jasmine.anything(), `Test Hashed Prompt State`))
    it(`does not find prompt states in a statement array`, () => expect(findPromptStatesInStatementArray).not.toHaveBeenCalled())
    it(`does not replace prompt states`, () => expect(replacePromptState).not.toHaveBeenCalled())
    it(`returns an object`, () => expect(result).toEqual(jasmine.any(Object)))
    it(`returns the hash`, () => expect(result.hash).toEqual(`Test Hashed Prompt State`))
    it(`returns the given prompt states`, () => expect(result.promptStates).toEqual([`Test Prompt State A`, `Test Prompt State B`, `Test Prompt State C`]))
    it(`does not modify the given statement`, () => expect(statement).toEqual({
      origin: `Test Origin`,
      line: {
        characters: `Test Characters`,
        text: `Test Text`
      }
    }))
    it(`does not modify the given prompt states`, () => expect(promptStates).toEqual([`Test Prompt State A`, `Test Prompt State B`, `Test Prompt State C`]))
  })
  describe(`when the hash does not yet exist in the prompt states`, () => {
    let result
    let foundPromptStatesInStatementArray
    beforeEach(() => {
      promptStatesContainHash.and.returnValue(false)
      foundPromptStatesInStatementArray = {
        hash: `Test Found Prompt States In Statement Array Hash`,
        promptStates: `Test Found Prompt States In Statement Array Prompt States`
      }
      findPromptStatesInStatementArray.and.returnValue(foundPromptStatesInStatementArray)
      result = get(`findPromptStatesInStatement`)(`Test Context`, `Test On Error`, statement, `Test Next Statements`, `Test State`, promptStates, `Test Labels`)
    })
    it(`hashes one prompt state`, () => expect(hashPromptState).toHaveBeenCalledTimes(1))
    it(`hashes the given statement`, () => expect(hashPromptState).toHaveBeenCalledWith({
      origin: `Test Origin`,
      line: {
        characters: `Test Characters`,
        text: `Test Text`
      }
    }, jasmine.anything()))
    it(`hashes the given state`, () => expect(hashPromptState).toHaveBeenCalledWith(jasmine.anything(), `Test State`))
    it(`checks whether one set of prompt states contains a hash`, () => expect(promptStatesContainHash).toHaveBeenCalledTimes(1))
    it(`checks whether the given set of prompt states contains a hash`, () => expect(promptStatesContainHash).toHaveBeenCalledWith([`Test Prompt State A`, `Test Prompt State B`, `Test Prompt State C`], jasmine.anything()))
    it(`checks whether a set of prompt states contains the hash of the given prompt state`, () => expect(promptStatesContainHash).toHaveBeenCalledWith(jasmine.anything(), `Test Hashed Prompt State`))
    it(`finds prompt states in one statement array`, () => expect(findPromptStatesInStatementArray).toHaveBeenCalledTimes(1))
    it(`finds prompt states in one statement array using the context`, () => expect(findPromptStatesInStatementArray).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`finds prompt states in one statement array using the error handler`, () => expect(findPromptStatesInStatementArray).toHaveBeenCalledWith(jasmine.anything(), `Test On Error`, jasmine.anything(), jasmine.anything(), jasmine.anything()))
    it(`finds prompt states in one statement array using the next statements`, () => expect(findPromptStatesInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Next Statements`, jasmine.anything(), jasmine.anything()))
    it(`finds prompt states in one statement array using the given prompt states, with a placeholder for one representing the current statement`, () => expect(findPromptStatesInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), [`Test Prompt State A`, `Test Prompt State B`, `Test Prompt State C`, { hash: `Test Hashed Prompt State` }], jasmine.anything()))
    it(`finds prompt states in one statement array using the given labels`, () => expect(findPromptStatesInStatementArray).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), jasmine.anything(), jasmine.anything(), `Test Labels`))
    it(`replaces a prompt state in one set of prompt states`, () => expect(replacePromptState).toHaveBeenCalledTimes(1))
    it(`replaces a prompt state in the prompt states found in the statement array`, () => expect(replacePromptState).toHaveBeenCalledWith(`Test Found Prompt States In Statement Array Prompt States`, jasmine.anything()))
    it(`replaces with a prompt state constructed using the generated hash, given statement, the state and returned hash`, () => expect(replacePromptState).toHaveBeenCalledWith(jasmine.anything(), {
      hash: `Test Hashed Prompt State`,
      statement: {
        origin: `Test Origin`,
        line: {
          characters: `Test Characters`,
          text: `Test Text`
        }
      },
      state: `Test State`,
      next: `Test Found Prompt States In Statement Array Hash`
    }))
    xit(`returns an object`, () => expect(result).toEqual(jasmine.any(Object)))
    it(`does not modify the given statement`, () => expect(statement).toEqual({
      origin: `Test Origin`,
      line: {
        characters: `Test Characters`,
        text: `Test Text`
      }
    }))
    it(`does not modify the given prompt states`, () => expect(promptStates).toEqual([`Test Prompt State A`, `Test Prompt State B`, `Test Prompt State C`]))
    it(`does not modify the prompt states found in the statement array`, () => expect(foundPromptStatesInStatementArray).toEqual({
      hash: `Test Found Prompt States In Statement Array Hash`,
      promptStates: `Test Found Prompt States In Statement Array Prompt States`
    }))
  })
})
