export const create = (context, onError, onEndOfFile) => {
  return {
    statements: [],
    context,
    onError,
    onEndOfFile
  }
}

export const line = (state, line, text, lexed) => {
  if (!lexed) {
  state.onError(state.context, line, `Unparseable; if this should be a statement, please check the documentation for a list of patterns which can be used; otherwise check indentation`)
  } else {
    state.statements.push({
      line: lexed.lineWithText
    })
}
}
