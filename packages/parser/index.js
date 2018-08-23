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
