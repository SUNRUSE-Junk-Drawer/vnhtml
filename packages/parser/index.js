const linerCreate = (context, onLine) => ({
  line: 1,
  text: ``,
  ignoreRestOfLine: false,
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
      liner.ignoreRestOfLine = true
      break

    case `newLine`:
      if (linerTextNotEmpty(liner.text)) {
        liner.onLine(liner.context, liner.line, liner.text)
      }
      liner.line++
      liner.text = ``
      liner.ignoreRestOfLine = false
      break

    case `partOfLine`:
      if (!liner.ignoreRestOfLine) {
        liner.text += character
      }
      break
  }
}

const linerEndOfFile = liner => {
  if (linerTextNotEmpty(liner.text)) {
    liner.onLine(liner.context, liner.line, liner.text)
  }
}
