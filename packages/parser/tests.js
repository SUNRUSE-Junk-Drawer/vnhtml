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
  it(`returns lineComment, null`, () => expect(get(`linerCreate`)(`Test Context`, `Test On Line`).lineComment).toBeNull())
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

describe(`linerCharacter`, () => {
  const linerClassifyCharacter = setSpy(`linerClassifyCharacter`)
  const linerTextNotEmpty = setSpy(`linerTextNotEmpty`)
  const onLine = jasmine.createSpy(`onLine`)
  afterEach(() => {
    linerClassifyCharacter.calls.reset()
    linerTextNotEmpty.calls.reset()
    onLine.calls.reset()
  })
  let liner
  beforeEach(() => liner = {
    line: 2368,
    text: `Test Text`,
    context: `Test Context`,
    onLine
  })

  describe(`when not inside a line comment`, () => {
    beforeEach(() => liner.lineComment = null)
    describe(`when given a line comment`, () => {
      beforeEach(() => {
        linerClassifyCharacter.and.returnValue(`lineComment`)
        get(`linerCharacter`)(liner, `Test Character`)
      })
      it(`does not change line`, () => expect(liner.line).toEqual(2368))
      it(`does not change text`, () => expect(liner.text).toEqual(`Test Text`))
      it(`starts a line comment`, () => expect(liner.lineComment).toEqual(`Test Character`))
      it(`does not change the context`, () => expect(liner.context).toEqual(`Test Context`))
      it(`does not change onLine`, () => expect(liner.onLine).toBe(onLine))
      it(`calls linerClassifyCharacter once`, () => expect(linerClassifyCharacter).toHaveBeenCalledTimes(1))
      it(`calls linerClassifyCharacter with the given character`, () => expect(linerClassifyCharacter).toHaveBeenCalledWith(`Test Character`))
      it(`does not call linerTextNotEmpty`, () => expect(linerTextNotEmpty).not.toHaveBeenCalled())
      it(`does not call onLine`, () => expect(onLine).not.toHaveBeenCalled())
    })

    describe(`when given a new line`, () => {
      beforeEach(() => linerClassifyCharacter.and.returnValue(`newLine`))
      describe(`when the accumulated text is empty`, () => {
        beforeEach(() => {
          linerTextNotEmpty.and.returnValue(false)
          get(`linerCharacter`)(liner, `Test Character`)
        })
        it(`increments line`, () => expect(liner.line).toEqual(2369))
        it(`empties text`, () => expect(liner.text).toEqual(``))
        it(`does not start a line comment`, () => expect(liner.lineComment).toBeNull())
        it(`does not change the context`, () => expect(liner.context).toEqual(`Test Context`))
        it(`does not change onLine`, () => expect(liner.onLine).toBe(onLine))
        it(`calls linerClassifyCharacter once`, () => expect(linerClassifyCharacter).toHaveBeenCalledTimes(1))
        it(`calls linerClassifyCharacter with the given character`, () => expect(linerClassifyCharacter).toHaveBeenCalledWith(`Test Character`))
        it(`calls linerTextNotEmpty once`, () => expect(linerTextNotEmpty).toHaveBeenCalledTimes(1))
        it(`calls linerTextNotEmpty with the text`, () => expect(linerTextNotEmpty).toHaveBeenCalledWith(`Test Text`))
        it(`does not call onLine`, () => expect(onLine).not.toHaveBeenCalled())
      })

      describe(`when the accumulated text is not empty`, () => {
        beforeEach(() => {
          linerTextNotEmpty.and.returnValue(true)
          get(`linerCharacter`)(liner, `Test Character`)
        })
        it(`increments line`, () => expect(liner.line).toEqual(2369))
        it(`empties text`, () => expect(liner.text).toEqual(``))
        it(`does not start a line comment`, () => expect(liner.lineComment).toBeNull())
        it(`does not change the context`, () => expect(liner.context).toEqual(`Test Context`))
        it(`does not change onLine`, () => expect(liner.onLine).toBe(onLine))
        it(`calls linerClassifyCharacter once`, () => expect(linerClassifyCharacter).toHaveBeenCalledTimes(1))
        it(`calls linerClassifyCharacter with the given character`, () => expect(linerClassifyCharacter).toHaveBeenCalledWith(`Test Character`))
        it(`calls linerTextNotEmpty once`, () => expect(linerTextNotEmpty).toHaveBeenCalledTimes(1))
        it(`calls linerTextNotEmpty with the text`, () => expect(linerTextNotEmpty).toHaveBeenCalledWith(`Test Text`))
        it(`calls onLine once`, () => expect(onLine).toHaveBeenCalledTimes(1))
        it(`calls onLine with the context`, () => expect(onLine).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything()))
        it(`calls onLine with the line number`, () => expect(onLine).toHaveBeenCalledWith(jasmine.anything(), 2368, jasmine.anything()))
        it(`calls onLine with the text`, () => expect(onLine).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Text`))
      })
    })

    describe(`when given a part of line`, () => {
      beforeEach(() => {
        linerClassifyCharacter.and.returnValue(`partOfLine`)
        get(`linerCharacter`)(liner, `Test Character`)
      })
      it(`does not change line`, () => expect(liner.line).toEqual(2368))
      it(`appends it to the end of text`, () => expect(liner.text).toEqual(`Test TextTest Character`))
      it(`does not start a line comment`, () => expect(liner.lineComment).toBeNull())
      it(`does not change the context`, () => expect(liner.context).toEqual(`Test Context`))
      it(`does not change onLine`, () => expect(liner.onLine).toBe(onLine))
      it(`calls linerClassifyCharacter once`, () => expect(linerClassifyCharacter).toHaveBeenCalledTimes(1))
      it(`calls linerClassifyCharacter with the given character`, () => expect(linerClassifyCharacter).toHaveBeenCalledWith(`Test Character`))
      it(`does not call linerTextNotEmpty`, () => expect(linerTextNotEmpty).not.toHaveBeenCalled())
      it(`does not call onLine`, () => expect(onLine).not.toHaveBeenCalled())
    })
  })

  describe(`when in a line comment`, () => {
    beforeEach(() => liner.lineComment = `Test Line Comment`)
    describe(`when given a line comment`, () => {
      beforeEach(() => {
        linerClassifyCharacter.and.returnValue(`lineComment`)
        get(`linerCharacter`)(liner, `Test Character`)
      })
      it(`does not change line`, () => expect(liner.line).toEqual(2368))
      it(`does not change text`, () => expect(liner.text).toEqual(`Test Text`))
      it(`appends it to the end of the line comment`, () => expect(liner.lineComment).toEqual(`Test Line CommentTest Character`))
      it(`does not change the context`, () => expect(liner.context).toEqual(`Test Context`))
      it(`does not change onLine`, () => expect(liner.onLine).toBe(onLine))
      it(`calls linerClassifyCharacter once`, () => expect(linerClassifyCharacter).toHaveBeenCalledTimes(1))
      it(`calls linerClassifyCharacter with the given character`, () => expect(linerClassifyCharacter).toHaveBeenCalledWith(`Test Character`))
      it(`does not call linerTextNotEmpty`, () => expect(linerTextNotEmpty).not.toHaveBeenCalled())
      it(`does not call onLine`, () => expect(onLine).not.toHaveBeenCalled())
    })

    describe(`when given a new line`, () => {
      beforeEach(() => linerClassifyCharacter.and.returnValue(`newLine`))
      describe(`when the accumulated text is empty`, () => {
        beforeEach(() => {
          linerTextNotEmpty.and.returnValue(false)
          get(`linerCharacter`)(liner, `Test Character`)
        })
        it(`increments line`, () => expect(liner.line).toEqual(2369))
        it(`empties text`, () => expect(liner.text).toEqual(``))
        it(`ends the line comment`, () => expect(liner.lineComment).toBeNull())
        it(`does not change the context`, () => expect(liner.context).toEqual(`Test Context`))
        it(`does not change onLine`, () => expect(liner.onLine).toBe(onLine))
        it(`calls linerClassifyCharacter once`, () => expect(linerClassifyCharacter).toHaveBeenCalledTimes(1))
        it(`calls linerClassifyCharacter with the given character`, () => expect(linerClassifyCharacter).toHaveBeenCalledWith(`Test Character`))
        it(`calls linerTextNotEmpty once`, () => expect(linerTextNotEmpty).toHaveBeenCalledTimes(1))
        it(`calls linerTextNotEmpty with the text`, () => expect(linerTextNotEmpty).toHaveBeenCalledWith(`Test Text`))
        it(`does not call onLine`, () => expect(onLine).not.toHaveBeenCalled())
      })

      describe(`when the accumulated text is not empty`, () => {
        beforeEach(() => {
          linerTextNotEmpty.and.returnValue(true)
          get(`linerCharacter`)(liner, `Test Character`)
        })
        it(`increments line`, () => expect(liner.line).toEqual(2369))
        it(`empties text`, () => expect(liner.text).toEqual(``))
        it(`ends the line comment`, () => expect(liner.lineComment).toBeNull())
        it(`does not change the context`, () => expect(liner.context).toEqual(`Test Context`))
        it(`does not change onLine`, () => expect(liner.onLine).toBe(onLine))
        it(`calls linerClassifyCharacter once`, () => expect(linerClassifyCharacter).toHaveBeenCalledTimes(1))
        it(`calls linerClassifyCharacter with the given character`, () => expect(linerClassifyCharacter).toHaveBeenCalledWith(`Test Character`))
        it(`calls linerTextNotEmpty once`, () => expect(linerTextNotEmpty).toHaveBeenCalledTimes(1))
        it(`calls linerTextNotEmpty with the text`, () => expect(linerTextNotEmpty).toHaveBeenCalledWith(`Test Text`))
        it(`calls onLine once`, () => expect(onLine).toHaveBeenCalledTimes(1))
        it(`calls onLine with the context`, () => expect(onLine).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything()))
        it(`calls onLine with the line number`, () => expect(onLine).toHaveBeenCalledWith(jasmine.anything(), 2368, jasmine.anything()))
        it(`calls onLine with the text`, () => expect(onLine).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Text`))
      })
    })

    describe(`when given a part of line`, () => {
      beforeEach(() => {
        linerClassifyCharacter.and.returnValue(`partOfLine`)
        get(`linerCharacter`)(liner, `Test Character`)
      })
      it(`does not change line`, () => expect(liner.line).toEqual(2368))
      it(`does not change text`, () => expect(liner.text).toEqual(`Test Text`))
      it(`appends it to the end of the line comment`, () => expect(liner.lineComment).toEqual(`Test Line CommentTest Character`))
      it(`does not change the context`, () => expect(liner.context).toEqual(`Test Context`))
      it(`does not change onLine`, () => expect(liner.onLine).toBe(onLine))
      it(`calls linerClassifyCharacter once`, () => expect(linerClassifyCharacter).toHaveBeenCalledTimes(1))
      it(`calls linerClassifyCharacter with the given character`, () => expect(linerClassifyCharacter).toHaveBeenCalledWith(`Test Character`))
      it(`does not call linerTextNotEmpty`, () => expect(linerTextNotEmpty).not.toHaveBeenCalled())
      it(`does not call onLine`, () => expect(onLine).not.toHaveBeenCalled())
    })
  })
})

describe(`linerEndOfFile`, () => {
  const linerClassifyCharacter = setSpy(`linerClassifyCharacter`)
  const linerTextNotEmpty = setSpy(`linerTextNotEmpty`)
  const onLine = jasmine.createSpy(`onLine`)
  afterEach(() => {
    linerClassifyCharacter.calls.reset()
    linerTextNotEmpty.calls.reset()
    onLine.calls.reset()
  })
  let liner
  beforeEach(() => liner = {
    line: 2368,
    text: `Test Text`,
    context: `Test Context`,
    onLine
  })

  describe(`when not in a line comment`, () => {
    beforeEach(() => liner.lineComment = null)

    describe(`when the accumulated text is empty`, () => {
      beforeEach(() => {
        linerTextNotEmpty.and.returnValue(false)
        get(`linerEndOfFile`)(liner)
      })
      it(`does not call linerClassifyCharacter`, () => expect(linerClassifyCharacter).not.toHaveBeenCalled())
      it(`calls linerTextNotEmpty once`, () => expect(linerTextNotEmpty).toHaveBeenCalledTimes(1))
      it(`calls linerTextNotEmpty with the text`, () => expect(linerTextNotEmpty).toHaveBeenCalledWith(`Test Text`))
      it(`does not call onLine`, () => expect(onLine).not.toHaveBeenCalled())
    })

    describe(`when the accumulated text is not empty`, () => {
      beforeEach(() => {
        linerTextNotEmpty.and.returnValue(true)
        get(`linerEndOfFile`)(liner)
      })
      it(`does not call linerClassifyCharacter`, () => expect(linerClassifyCharacter).not.toHaveBeenCalled())
      it(`calls linerTextNotEmpty once`, () => expect(linerTextNotEmpty).toHaveBeenCalledTimes(1))
      it(`calls linerTextNotEmpty with the text`, () => expect(linerTextNotEmpty).toHaveBeenCalledWith(`Test Text`))
      it(`calls onLine once`, () => expect(onLine).toHaveBeenCalledTimes(1))
      it(`calls onLine with the context`, () => expect(onLine).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything()))
      it(`calls onLine with the line number`, () => expect(onLine).toHaveBeenCalledWith(jasmine.anything(), 2368, jasmine.anything()))
      it(`calls onLine with the text`, () => expect(onLine).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Text`))
    })
  })

  describe(`when in a line comment`, () => {
    beforeEach(() => liner.lineComment = `Test Line Comment`)

    describe(`when the accumulated text is empty`, () => {
      beforeEach(() => {
        linerTextNotEmpty.and.returnValue(false)
        get(`linerEndOfFile`)(liner)
      })
      it(`does not call linerClassifyCharacter`, () => expect(linerClassifyCharacter).not.toHaveBeenCalled())
      it(`calls linerTextNotEmpty once`, () => expect(linerTextNotEmpty).toHaveBeenCalledTimes(1))
      it(`calls linerTextNotEmpty with the text`, () => expect(linerTextNotEmpty).toHaveBeenCalledWith(`Test Text`))
      it(`does not call onLine`, () => expect(onLine).not.toHaveBeenCalled())
    })

    describe(`when the accumulated text is not empty`, () => {
      beforeEach(() => {
        linerTextNotEmpty.and.returnValue(true)
        get(`linerEndOfFile`)(liner)
      })
      it(`does not call linerClassifyCharacter`, () => expect(linerClassifyCharacter).not.toHaveBeenCalled())
      it(`calls linerTextNotEmpty once`, () => expect(linerTextNotEmpty).toHaveBeenCalledTimes(1))
      it(`calls linerTextNotEmpty with the text`, () => expect(linerTextNotEmpty).toHaveBeenCalledWith(`Test Text`))
      it(`calls onLine once`, () => expect(onLine).toHaveBeenCalledTimes(1))
      it(`calls onLine with the context`, () => expect(onLine).toHaveBeenCalledWith(`Test Context`, jasmine.anything(), jasmine.anything()))
      it(`calls onLine with the line number`, () => expect(onLine).toHaveBeenCalledWith(jasmine.anything(), 2368, jasmine.anything()))
      it(`calls onLine with the text`, () => expect(onLine).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), `Test Text`))
    })
  })
})

describe(`indenterCreate`, () => {
  it(`returns an object`, () => expect(get(`indenterCreate`)(`Test Context`, `Test On Line`, `Test On Indent`, `Test On Outdent`, `Test On Error`)).toEqual(jasmine.any(Object)))
  it(`returns stack, an array containing zero`, () => expect(get(`indenterCreate`)(`Test Context`, `Test On Line`, `Test On Indent`, `Test On Outdent`, `Test On Error`).stack).toEqual([0]))
  it(`returns context, given`, () => expect(get(`indenterCreate`)(`Test Context`, `Test On Line`, `Test On Indent`, `Test On Outdent`, `Test On Error`).context).toEqual(`Test Context`))
  it(`returns onLine, given`, () => expect(get(`indenterCreate`)(`Test Context`, `Test On Line`, `Test On Indent`, `Test On Outdent`, `Test On Error`).onLine).toEqual(`Test On Line`))
  it(`returns onIndent, given`, () => expect(get(`indenterCreate`)(`Test Context`, `Test On Line`, `Test On Indent`, `Test On Outdent`, `Test On Error`).onIndent).toEqual(`Test On Indent`))
  it(`returns onOutdent, given`, () => expect(get(`indenterCreate`)(`Test Context`, `Test On Line`, `Test On Indent`, `Test On Outdent`, `Test On Error`).onOutdent).toEqual(`Test On Outdent`))
  it(`returns onError, given`, () => expect(get(`indenterCreate`)(`Test Context`, `Test On Line`, `Test On Indent`, `Test On Outdent`, `Test On Error`).onError).toEqual(`Test On Error`))
  it(`returns a new object every call`, () => expect(get(`indenterCreate`)(`Test Context`, `Test On Line`, `Test On Indent`, `Test On Outdent`, `Test On Error`)).not.toBe(get(`indenterCreate`)(`Test Context`, `Test On Line`, `Test On Indent`, `Test On Outdent`, `Test On Error`)))
  it(`returns a new stack every call`, () => expect(get(`indenterCreate`)(`Test Context`, `Test On Line`, `Test On Indent`, `Test On Outdent`, `Test On Error`).stack).not.toBe(get(`indenterCreate`)(`Test Context`, `Test On Line`, `Test On Indent`, `Test On Outdent`, `Test On Error`).stack))
  it(`returns the same value every call`, () => expect(get(`indenterCreate`)(`Test Context`, `Test On Line`, `Test On Indent`, `Test On Outdent`, `Test On Error`)).toEqual(get(`indenterCreate`)(`Test Context`, `Test On Line`, `Test On Indent`, `Test On Outdent`, `Test On Error`)))
})