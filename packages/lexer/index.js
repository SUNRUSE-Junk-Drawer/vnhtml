const linerCreate = (context, onLine, onEndOfFile) => ({
  line: 1,
  text: ``,
  lineComment: null,
  context,
  onLine,
  onEndOfFile
})

const linerClassifyCharacter = character => {
  switch (character) {
    case `\``:
      return `lineComment`

    case `\r`:
    case `\n`:
      return `newLine`

    default:
      return `partOfLine`
  }
}

const linerTextNotEmpty = text => !!text.trim()

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
  liner.onEndOfFile(liner.context)
}

const indenterCreate = (context, onLine, onIndent, onOutdent, onError, onEndOfFile) => ({
  stack: [0],
  indentationCharacter: null,
  context,
  onLine,
  onIndent,
  onOutdent,
  onError,
  onEndOfFile
})

const indenterExtractIndentation = text => /^\s*/.exec(text)[0]

const indenterExtractText = text => text.trim()

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
    case `none`: {
      while (indenter.stack.length > 1) {
        indenter.stack.pop()
        indenter.onOutdent(indenter.context, lineNumber)
      }
      const extractedText = indenterExtractText(lineText)
      indenter.onLine(indenter.context, lineNumber, extractedText, indenterMatch(extractedText))
    } break

    case `inconsistent`: {
      indenter.onError(indenter.context, lineNumber, `Inconsistent indenting white space characters; it is likely that both spaces and tabs are being used to indent within the same file`)
    } break

    default: {
      if (!indenter.indentationCharacter) {
        indenter.indentationCharacter = type
      } else if (type != indenter.indentationCharacter) {
        indenter.onError(indenter.context, lineNumber, `Inconsistent indenting white space characters; it is likely that both spaces and tabs are being used to indent within the same file`)
        return
      }

      if (indentation.length > indenter.stack[indenter.stack.length - 1]) {
        indenter.stack.push(indentation.length)
        indenter.onIndent(indenter.context, lineNumber)
      } else {
        if (indenter.stack.indexOf(indentation.length) == -1) {
          indenter.onError(indenter.context, lineNumber, `Outdent to level not previously indented to`)
          return
        } else {
          while (indentation.length < indenter.stack[indenter.stack.length - 1]) {
            indenter.stack.pop()
            indenter.onOutdent(indenter.context, lineNumber)
          }
        }
      }
      const extractedText = indenterExtractText(lineText)
      indenter.onLine(indenter.context, lineNumber, extractedText, indenterMatch(extractedText))
    } break
  }
}

const indenterMatch = text => {
  const lineWithEmote = /^(\S+)\s*\(\s*(\S+)\s*\)\s*:$/i.exec(text)
  if (lineWithEmote) {
    return {
      lineWithEmote: {
        characters: [lineWithEmote[1]],
        emote: lineWithEmote[2]
      }
    }
  }

  const lineWithEmoteAndMultipleCharacters = /^(\S.*)\s+and\s+(\S+)\s*\(\s*(\S+)\s*\)\s*:$/i.exec(text)
  if (lineWithEmoteAndMultipleCharacters) {
    return {
      lineWithEmote: {
        characters: lineWithEmoteAndMultipleCharacters[1]
          .trim()
          .split(/\s+/)
          .concat([lineWithEmoteAndMultipleCharacters[2]]),
        emote: lineWithEmoteAndMultipleCharacters[3]
      }
    }
  }

  const line = /^(\S+)\s*:$/i.exec(text)
  if (line) {
    return {
      line: {
        characters: [line[1]]
      }
    }
  }

  const lineWithMultipleCharacters = /^(\S.*)\s+and\s+(\S+)\s*:$/i.exec(text)
  if (lineWithMultipleCharacters) {
    return {
      line: {
        characters: lineWithMultipleCharacters[1]
          .trim()
          .split(/\s+/)
          .concat([lineWithMultipleCharacters[2]])
      }
    }
  }

  const lineWithEmoteAndText = /^(\S+)\s*\(\s*(\S+)\s*\)\s*:\s*(\S.*)$/i.exec(text)
  if (lineWithEmoteAndText) {
    return {
      lineWithEmoteAndText: {
        characters: [lineWithEmoteAndText[1]],
        emote: lineWithEmoteAndText[2],
        text: lineWithEmoteAndText[3]
      }
    }
  }

  const lineWithEmoteAndMultipleCharactersAndText = /^(\S.*)\s+and\s+(\S+)\s*\(\s*(\S+)\s*\)\s*:\s*(\S.*)$/i.exec(text)
  if (lineWithEmoteAndMultipleCharactersAndText) {
    return {
      lineWithEmoteAndText: {
        characters: lineWithEmoteAndMultipleCharactersAndText[1]
          .trim()
          .split(/\s+/)
          .concat([lineWithEmoteAndMultipleCharactersAndText[2]]),
        emote: lineWithEmoteAndMultipleCharactersAndText[3],
        text: lineWithEmoteAndMultipleCharactersAndText[4]
      }
    }
  }

  const lineWithText = /^(\S+)\s*:\s*(\S.*)$/i.exec(text)
  if (lineWithText) {
    return {
      lineWithText: {
        characters: [lineWithText[1]],
        text: lineWithText[2]
      }
    }
  }

  const lineWithTextWithMultipleCharacters = /^(\S.*)\s+and\s+(\S+)\s*:\s*(\S.*)$/i.exec(text)
  if (lineWithTextWithMultipleCharacters) {
    return {
      lineWithText: {
        characters: lineWithTextWithMultipleCharacters[1]
          .trim()
          .split(/\s+/)
          .concat([lineWithTextWithMultipleCharacters[2]]),
        text: lineWithTextWithMultipleCharacters[3]
      }
    }
  }

  return null
}

const indenterEndOfFile = indenter => {
  while (indenter.stack.length > 1) {
    indenter.stack.pop()
    indenter.onOutdent(indenter.context)
  }
  indenter.onEndOfFile(indenter.context)
}

export const create = (context, onLine, onIndent, onOutdent, onError, onEndOfFile) => ({
  state: `waiting`,
  liner: linerCreate(
    indenterCreate(context, onLine, onIndent, onOutdent, onError, onEndOfFile),
    indenterLine,
    indenterEndOfFile
  )
})
