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

const createParser = () => ({
  line: 1,
  whiteSpaceCharacter: null,
  indentation: 0,
  text: null,
  ignoreRestOfLine: false
})

const onLineForStatement = () => { }
