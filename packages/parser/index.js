export const create = (file, context, onError, onEndOfFile) => {
  return {
    file,
    statements: [],
    context,
    onError,
    onEndOfFile
  }
}

export const line = (state, line, text, lexed) => {
  if (!lexed) {
    state.onError(state.context, line, `Unparseable; if this should be a statement, please check the documentation for a list of patterns which can be used; otherwise check indentation`)
  } else if (lexed.line) {
    state.statements.push({
      origin: {
        file: state.file,
        line,
        subStatement: 0
      },
      line: {
        characters: lexed.line.characters,
        text: lexed.line.text
      }
    })
  } else if (lexed.lineWithEmote) {
    lexed.lineWithEmote.characters.forEach((character, i) => state.statements.push({
      origin: {
        file: state.file,
        line,
        subStatement: i
      },
      emote: {
        characterName: character.name,
        characterNormalizedName: character.normalizedName,
        emote: lexed.lineWithEmote.emote,
        normalizedEmote: lexed.lineWithEmote.normalizedEmote
      }
    }))
    state.statements.push({
      origin: {
        file: state.file,
        line,
        subStatement: lexed.lineWithEmote.characters.length
      },
      line: {
        characters: lexed.lineWithEmote.characters,
        text: lexed.lineWithEmote.text
      }
    })
  } else if (lexed.emote) {
    lexed.emote.characters.forEach((character, i) => state.statements.push({
      origin: {
        file: state.file,
        line,
        subStatement: i
      },
      emote: {
        characterName: character.name,
        characterNormalizedName: character.normalizedName,
        emote: lexed.emote.emote,
        normalizedEmote: lexed.emote.normalizedEmote
      }
    }))
  } else if (lexed.leave) {
    lexed.leave.characters.forEach((character, i) => state.statements.push({
      origin: {
        file: state.file,
        line,
        subStatement: i
      },
      leave: {
        characterName: character.name,
        characterNormalizedName: character.normalizedName,
      }
    }))
  } else if (lexed.label) {
    state.statements.push({
      origin: {
        file: state.file,
        line,
        subStatement: 0
      },
      label: lexed.label
    })
  } else if (lexed.goTo) {
    state.statements.push({
      origin: {
        file: state.file,
        line,
        subStatement: 0
      },
      goTo: lexed.goTo
    })
  } else if (lexed.background) {
    state.statements.push({
      origin: {
        file: state.file,
        line,
        subStatement: 0
      },
      background: lexed.background
    })
  } else if (lexed.include) {
    state.statements.push({
      origin: {
        file: state.file,
        line,
        subStatement: 0
      },
      include: lexed.include
    })
  } else {
    state.statements.push({
      origin: {
        file: state.file,
        line,
        subStatement: 0
      },
      set: lexed.set
    })
  }
}

export const endOfFile = state => state.onEndOfFile(state.context, state.statements)
