export const create = (context, onError, onEndOfFile) => {
  return {
    statements: [],
    context,
    onError,
    onEndOfFile
  }
}
