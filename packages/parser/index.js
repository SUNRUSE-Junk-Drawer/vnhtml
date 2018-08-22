const classifyCharacter = character => {
  if (character == `#`) {
    return `lineComment`
  }

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
  indentation: 0,
  text: null
})

const onLineForStatement = () => { }
