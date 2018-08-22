const classifyCharacter = character => {
  if (character.trim()) {
    return `glyph`
  }

  if (character == `\r` || character == `\n`) {
    return `newLine`
  }

  return `whiteSpace`
}
