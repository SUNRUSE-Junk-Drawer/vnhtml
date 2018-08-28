# @vnhtml/parser finite state machine

The finite state machine which consumes the lexer output stream needs to be
quite complex to be able to handle every statement as expected.

It becomes quite significantly entangled, and cannot be clearly graphed.

## Default behaviour

This behaviour can be considered "default".  Individual statements can override
it, but if no exception is made, these statements are handled as followed.

The following statements do not have any "special" functionality regarding state
changes; they are just part of whatever block is being parsed.

- lineWithText
- lineWithEmoteAndText
- emote
- leave
- set
- label
- goTo
- background
- include

The following statements will trigger a state switch.

| Statement     | State                          |
|---------------|--------------------------------|
| line          | expectingIndentForLine         |
| lineWithEmote | expectingIndentForLine         |
| menu          | expectingIndentForMenu         |
| if            | expectingIndentForIf           |
| else          | expectingIndentForIgnoredBlock |
| elseIf        | expectingIndentForIgnoredBlock |

"else"/"elseIf" should additionally raise an error (as there is no preceding
"if" statement).

Indents will switch to the "ignoredBlock" state, while outdents will return to
the "parent" state.

## States

### expectingStatements

No changes to the default behaviour.

### expectingIndentForLine

If an indent occurs, switch to readingTextForLine.
Otherwise, raise an error (a line has no text), but parse as default.

### readingTextForLine

Every piece of raw text is added to the current line's text.  No statements are
parsed.

Indents/outdents are counted and used to prepend tabs to lines.

An outdent back to the level at which expectingIndentForLine was entered returns
to expectingStatements.

### expectingIndentForMenu

If an indent occurs, switch to readingOptionForMenu.
Otherwise, raise an error (a menu has no options), but parse as default.

### readingOptionForMenu

A new option is added to the menu being parsed, with the raw text as the label.
The state is now expectingIndentForMenuOption.

### expectingIndentForMenuOption

If an indent occurs, switch to "expectingStatements".
If an outdent occurs, switch back to the parent state.
Otherwise, switch back to and handle as though readingOptionForMenu.

### expectingIndentForIf

If an indent occurs, switch to "expectingStatements"; the parent state will be
"expectingStatementOrElse".
Otherwise, raise an error (an if statement has no statements), but parse as
default.

### expectingStatementOrElse

If the "elseIf" statement is encountered:

- Should the flag/value pair already appear in the current "chain", raise an
  error (as the block is unreachable) and switch to
  "expectingIndentForIgnoredBlock".
- Otherwise, switch to "expectingIndentForIf".

If the "else" statement is encounted, switch to "expectingIndentForElse".

### expectingIndentForElse

If an indent occurs, switch to "expectingStatements"; the parent state will be
"expectingStatement".
Otherwise, raise an error (an else statement has no statements), but parse as
default.

### expectingIndentForIgnoredBlock

If an indent occurs, switch to "ignoredBlock"; the parent state will be
"expectingStatement".
Otherwise, switch to "expectingStatements" and parse as default.

### ignoredBlock

Count the number of indents/outdents, but otherwise do not process statements.
Return to the parent state when outdented beyond the initial level.
