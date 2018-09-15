const objectContainsKey = (object, key) => Object.prototype.hasOwnProperty.call(object, key)
const getObjectKeyValue = (object, key) => objectContainsKey(object, key) ? object[key] : null
const setObjectKeyValue = (object, key, value) => object[key] = value
const removeObjectKeyValue = (object, key) => delete object[key]

const createCloneTemplate = object => JSON.stringify(object)
const createCloneInstance = template => JSON.parse(template)

const findLabelsInStatementArray = (context, onError, labels, statements) => {
  statements.forEach((statement, i) => findLabelsInStatement(context, onError, labels, statement, statements.slice(i + 1)))
}

const findLabelsInStatement = (context, onError, labels, statement, nextStatements) => {
  if (statement.label) {
    if (objectContainsKey(labels, statement.label.normalizedName)) {
      onError(context, statement.origin.line, `The label "${statement.label.name}" is defined multiple times`)
    } else {
      setObjectKeyValue(labels, statement.label.normalizedName, {
        name: statement.label.name,
        statements: nextStatements
      })
    }
  } else if (statement.decision) {
    statement.decision.paths.forEach(path => findLabelsInStatementArray(context, onError, labels, path.then.concat(nextStatements)))
  } else if (statement.menu) {
    statement.menu.paths.forEach(path => findLabelsInStatementArray(context, onError, labels, path.then.concat(nextStatements)))
  }
}

const createState = () => ({
  flags: {},
  characters: {},
  background: null
})

const hashFlag = (normalizedFlag, flag) => `${normalizedFlag}  ${flag.normalizedValue}`
const hashFlags = flags => Object.keys(flags).map(normalizedFlag => hashFlag(normalizedFlag, flags[normalizedFlag])).sort().join(`  `)
const hashCharacter = (normalizedName, character) => `${normalizedName}  ${character.normalizedEmote}`
const hashCharacters = characters => Object.keys(characters).map(normalizedName => hashCharacter(normalizedName, characters[normalizedName])).sort().join(`  `)
const hash = (statement, flags, characters, background) => `${JSON.stringify(statement.origin.file)}@${statement.origin.line}.${statement.origin.subStatement} ${hashFlags(flags)}   ${hashCharacters(characters)}   ${background}`

const conditionMet = (condition, flags) => {
  if (!condition) {
    return true
  } else {
    const flag = getObjectKeyValue(flags, condition.flag.normalizedFlag)
    return !!flag && flag.normalizedValue == condition.flag.normalizedValue
  }
}
