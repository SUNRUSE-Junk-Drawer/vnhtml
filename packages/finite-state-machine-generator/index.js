const objectContainsKey = (object, key) => Object.prototype.hasOwnProperty.call(object, key)
const getObjectKeyValue = (object, key) => objectContainsKey(object, key) ? object[key] : null
const setObjectKeyValue = (object, key, value) => object[key] = value

const combineLabels = (context, onError, a, b) => {
  if (a) {
    if (b) {
      const combined = a.slice()
      b.forEach(label => {
        const existing = combined.find(other => other.normalizedName == label.normalizedName)
        if (existing) {
          onError(context, `unknown`, `The label "${existing.name}" is defined multiple times`)
        } else {
          combined.push(label)
        }
      })
      return combined
    } else {
      return a
    }
  } else {
    return b
  }
}

const findLabelsInStatementArray = (context, onError, statements, nextStatements) => {
  if (!statements.length) {
    return null
  }

  let output
  for (let i = 0; i < statements.length; i++) {
    const nextLabels = findLabelsInStatement(context, onError, statements[i], statements.slice(i + 1).concat(nextStatements))
    if (output) {
      output = combineLabels(context, onError, output, nextLabels)
    } else {
      output = nextLabels
    }
  }
  return output
}

const findLabelsInStatement = (context, onError, statement, nextStatements) => {
  if (statement.label) {
    return [{
      name: statement.label.name,
      normalizedName: statement.label.normalizedName,
      statements: nextStatements
    }]
  } else if (statement.decision) {
    let output = findLabelsInStatementArray(context, onError, statement.decision.paths[0].then, nextStatements)
    statement.decision.paths
      .slice(1)
      .forEach(path => {
        output = combineLabels(context, onError, output, findLabelsInStatementArray(context, onError, path.then, nextStatements))
      })
    return output
  } else if (statement.menu) {
    let output = findLabelsInStatementArray(context, onError, statement.menu.paths[0].then, nextStatements)
    statement.menu.paths
      .slice(1)
      .forEach(path => {
        output = combineLabels(context, onError, output, findLabelsInStatementArray(context, onError, path.then, nextStatements))
      })
    return output
  }
  return null
}

const createState = () => ({
  flags: [],
  characters: [],
  background: null
})

const hashStateFlag = flag => `${flag.normalizedFlag}  ${flag.normalizedValue}`
const hashStateFlags = flags => flags.map(flag => hashStateFlag(flag)).sort().join(`  `)
const hashStateCharacter = character => `${character.normalizedName}  ${character.normalizedEmote}`
const hashStateCharacters = characters => characters.map(character => hashStateCharacter(character)).sort().join(`  `)
const hashPromptState = (statement, state) => `${JSON.stringify(statement.origin.file)}@${statement.origin.line}.${statement.origin.subStatement} ${hashStateFlags(state.flags)}   ${hashStateCharacters(state.characters)}   ${state.background}`

const combinePromptStates = (a, b) => {
  if (a) {
    if (b) {
      return a.concat(b.filter(label => !a.some(other => other.hash == label.hash)))
    } else {
      return a
    }
  } else {
    return b
  }
}

const findPromptStateByHash = (promptStates, hash) => promptStates.find(promptState => promptState.hash == hash) || null
const replacePromptState = (promptStates, replacement) => promptStates.map(promptState => promptState.hash == replacement.hash ? replacement : promptState)
const promptStatesContainHash = (promptStates, hash) => promptStates.some(promptState => promptState.hash == hash)

const conditionMet = (condition, state) => {
  if (!condition) {
    return true
  } else {
    if (!state.flags.length) {
      return false
    }
    const match = state.flags.find(flag => flag.normalizedFlag == condition.flag.normalizedFlag)
    if (!match) {
      return false
    }
    return condition.flag.normalizedValue == match.normalizedValue
  }
}

const findPromptStatesInStatementArray = (context, onError, statements, state, promptStates, labels) => {
  if (statements.length) {
    return findPromptStatesInStatement(context, onError, statements[0], statements.slice(1), state, promptStates, labels)
  } else {
    return {
      promptState: null,
      promptStates
    }
  }
}

const findPromptStatesInStatement = (context, onError, statement, nextStatements, state, promptStates, labels) => {
  const hash = hashPromptState(statement, state)
  if (promptStatesContainHash(promptStates, hash)) {
    return {
      hash,
      promptStates
    }
  }

  const next = findPromptStatesInStatementArray(context, onError, nextStatements, promptStates.concat({
    hash
  }), labels)

  return {
    hash,
    promptStates: replacePromptState(next.promptStates, {
      hash,
      statement,
      state,
      next: next.hash
    })
  }
}
