const classifyCharacter = character => {
  if (character.trim()) {
    return `glyph`
  }

  if (character == `\r` || character == `\n`) {
    return `newLine`
  }

  return `whiteSpace`
}

const createParser = () => ({
  line: 1,
  whiteSpaceCharacter: null,
  text: null,
  stack: [{
    indentation: -1,
    statements: [],
    expectsIndentation: 0,
    onLine: onLineForStatement
  }]
})

const onLineForStatement = () => { }
