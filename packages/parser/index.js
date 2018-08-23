const linerCreate = (context, onLine) => ({
  line: 1,
  text: ``,
  lineComment: null,
  context,
  onLine
})

const linerClassifyCharacter = character => {
  switch (character) {
    case `#`:
      return `lineComment`

    case `\r`:
    case `\n`:
      return `newLine`

    default:
      return `partOfLine`
  }
}

const linerTextNotEmpty = text => !text.trim()

const linerCharacter = (liner, character) => {
  switch (linerClassifyCharacter(character)) {
    case `lineComment`:
      if (liner.lineComment == null) {
        liner.lineComment = character
      } else {
        liner.lineComment += character
      }
      break

    case `newLine`:
      if (linerTextNotEmpty(liner.text)) {
        liner.onLine(liner.context, liner.line, liner.text)
      }
      liner.line++
      liner.text = ``
      liner.lineComment = null
      break

    case `partOfLine`:
      if (liner.lineComment == null) {
        liner.text += character
      } else {
        liner.lineComment += character
      }
      break
  }
}

const linerEndOfFile = liner => {
  if (linerTextNotEmpty(liner.text)) {
    liner.onLine(liner.context, liner.line, liner.text)
  }
}

const indenterCreate = (context, onLine, onIndent, onOutdent, onError) => ({
  stack: [0],
  indentationCharacter: null,
  context,
  onLine,
  onIndent,
  onOutdent,
  onError
})

const indenterExtractIndentation = text => /^\s*/.exec(text)[0]

const indenterExtractText = text => text.trim(0)

const indenterCheckWhiteSpace = indentation => {
  if (!indentation) {
    return `none`
  }
  
  for (let i = 1; i < indentation.length; i++) {
    if (indentation[i] != indentation[0]) {
      return `inconsistent`
    }
  }
  
  return indentation[0]
}

const indenterLine = (indenter, lineNumber, lineText) => {
  const indentation = indenterExtractIndentation(lineText)
  const type = indenterCheckWhiteSpace(indentation)
  switch (type) {
    case `none`:
      while (indenter.stack.length > 1) {
        indenter.stack.pop()
        indenter.onOutdent(indenter.context, lineNumber)
      }
      indenter.onLine(indenter.context, lineNumber, indenterExtractText(lineText))
      break
      
    case `inconsistent`:
      indenter.onError(indenter.context, lineNumber, `Inconsistent indenting white space characters; it is likely that both spaces and tabs are being used to indent within the same file`)
      break
      
    default:
      if (!indenter.indentationCharacter) {
        indenter.indentationCharacter = type
      } else if (type != indenter.indentationCharacter) {
        indenter.onError(indenter.context, lineNumber, `Inconsistent indenting white space characters; it is likely that both spaces and tabs are being used to indent within the same file`)
        return
      }
    
      if (type.length > indenter.stack[indenter.stack.length - 1]) {
        indenter.stack.push(type.length)
        indenter.onIndent(indenter.context, lineNumber)
      } else {
        if (indenter.stack.indexOf(type.length) == -1) {
          indenter.onError(indenter.context, lineNumber, `Outdent to level not previously indented to`)
          return
        } else {
          while (type.length < indenter.stack[indenter.stack.length - 1]) {
            indenter.stack.pop()
            indenter.onOutdent(indenter.context, lineNumber)
          }
        }
      }
      indenter.onLine(indenter.context, lineNumber, indenterExtractText(lineText))
      break
  }
}