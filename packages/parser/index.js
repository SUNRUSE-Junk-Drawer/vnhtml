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
  context,
  onLine,
  onIndent,
  onOutdent,
  onError
})