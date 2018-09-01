const normalizeName = name => name.toLowerCase().split(/\s+/).join(` `)

const combineLabels = (context, onError, a, b) => {
  if (a) {
    if (b) {
      const output = {}
      const fromA = Object.keys(a)
      const fromB = Object.keys(b)
      fromA.forEach(key => output[key] = a[key])
      const fromANormalized = fromA.map(key => normalizeName(key))
      fromB.forEach(key => {
        const index = fromANormalized.indexOf(normalizeName(key))
        if (index != -1) {
          onError(context, `unknown`, `The label "${fromA[index]}" is defined multiple times`)
        } else {
          output[key] = b[key]
        }
      })
      return output
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
    const output = {}
    output[statement.label.name] = nextStatements
    return output
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
const hashStateCharacter = character => `${character.normalizedName}  ${character.normalizedEmote}`
