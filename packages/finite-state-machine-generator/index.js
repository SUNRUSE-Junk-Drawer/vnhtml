const normalizeName = name => (name || ``).toLowerCase().split(/\s+/).join(` `)

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
      normalizedName: normalizeName(statement.label.name),
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
const hashPromptState = (promptId, state) => `${promptId}   ${hashStateFlags(state.flags)}   ${hashStateCharacters(state.characters)}   ${normalizeName(state.background)}`

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

const conditionMet = (condition, state) => {
  if (!condition) {
    return true
  } else {
    if (!state.flags.length) {
      return false
    }
    const normalizedFlag = normalizeName(condition.flag.flag)
    const match = state.flags.find(flag => flag.normalizedFlag == normalizedFlag)
    if (!match) {
      return false
    }
    return normalizeName(condition.flag.value) == match.normalizedValue
  }
}

const findPromptStateCombinationsInStatementArray = (context, onError, statements, states, labels) => {
  if (statements.length) {
    return findPromptStateCombinationsInStatement(context, onError, statements[0], statements.slice(1), states, labels)
  } else {
    return states
  }
}

const findPromptStateCombinationsInStatement = null
