const normalizeLabel = label => label.toLowerCase().split(/\s+/).join(` `)

const combineLabels = (context, onError, a, b) => {
  if (a) {
    if (b) {
      const output = {}
      const fromA = Object.keys(a)
      const fromB = Object.keys(b)
      fromA.forEach(key => output[key] = a[key])
      const fromANormalized = fromA.map(key => normalizeLabel(key))
      fromB.forEach(key => {
        const index = fromANormalized.indexOf(normalizeLabel(key))
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

const findLabelsInStatement = null
