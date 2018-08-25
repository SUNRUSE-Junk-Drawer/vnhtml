# vnhtml

[![Travis](https://img.shields.io/travis/jameswilddev/vnhtml.svg)](https://travis-ci.org/jameswilddev/vnhtml)
[![license](https://img.shields.io/github/license/jameswilddev/vnhtml.svg)](https://github.com/jameswilddev/vnhtml/blob/master/license)

A basic scripting language for visual novels, which compiles to a single HTML
file.

Made as an esoteric entry to [JS13kGames](https://js13kgames.com).

## Syntax

The scripting language is designed to be human-readable and resemble a form of
stage script.

Generally, there is one statement per line:

Where a statement is a group of another, indentation is used to define structure
in a manner similar to Python.  As such, tabs and spaces cannot be mixed in the
same file.

Use a backtick (`) to start a line comment.  Everything following on the same
line will be ignored following a backtick.

### Lines and emotes

See [Art](#art) for details on how these map to files.

```vnhtml
Jeff is amazed
James: This is a line of dialog.

Jeff and Greeta are bored
James and Jeff: This is another line of dialog, but spoken in unison.

Jeff Greeta and Fred are bewildered
James Jeff and Jess: This is another line of dialog, but spoken in unison by three people.

James (contemplative): So this is the same as an emote, then a line?

James and Jeff (agreeing): Uh-huh.

James Jeff and Jess (flat): Sure looks that way.

Jeff leaves

Greeta and Fred leave

James Jess and Bart leave

Greg:
  Dialog can additionally be placed on a following line, like this.
  It's useful when there is a lot, or a line break is desired in a specific place.
```

### Backgrounds

See [Art](#art) for details on how this maps to a file.

```vnhtml
office in background
```

### Flags

Flags are global multiple-choice values which can be set and checked throughout
the script.

```vnhtml
flag window locked closed opened

if window locked
  James: This will be shown as "window" defaults to "locked".
  James: You can put multiple statements in here by indenting multiple lines.
else if window closed
  James: This won't be shown.
else
  James: Nor will this.

set window closed

if window locked
  James: This won't be shown.
else if window closed
  James: This will be shown as "window" has been changed to "closed".
else
  James: This won't be shown.

set window opened

if window locked
  James: This won't be shown.
else if window closed
  James: Nor will this.
else
  James: This will be shown as none of the above statements are true.

if window locked
  James: This won't be shown.
else if window closed
  James: Nor will this.

James: Note that if no statement matches, the block is skipped.
```

### Menus

Menus are shown as multiple-choice lists.

```vnhtml
menu This is the title for your menu.
  Label for the first option.
    James: Good choice.
  Label for the second option.
    James: I could take it or leave it.
  Label for the third option.
    James: Definitely should have taken the first option.
```

### Labels

```vnhtml
James: This example script uses a label to loop back.

label loop

James: This is the first line of the looped dialog.
James: This is the second line of the looped dialog.

menu Go around again?
  Yes!  Again, again!
    go to loop
  No
    James: Thank goodness, I was getting dizzy.
```

### Include

```vnhtml
menu Go on a lengthy sidequest?
  Yes, even if it's so long it belongs in its own script
    include lengthySidequest.vnh
  No
    James: That's alright!
```

## Art

All artwork is held locally to the script, as SVG files.

SVG's "viewbox" functionality is used to expand artwork to fit in the center of
the screen, as large as possible without cropping or changing the aspect ratio.

This means that areas outside the "canvas" may be visible with unusually tall or
wide monitors.

### Characters

A folder must exist in the same directory as the main script called
`/characters/{name}/{emote}`.  Inside it must be the following files:

<dl>
<dt>base.svg</dt>
<dd>Neither speaking nor blinking.</dd>

<dt>speaking.svg</dt>
<dd>Layered on top while speaking.</dd>

<dt>blinking.svg</dt>
<dd>Layered on top while blinking.</dd>
</dl>

For example:

```vnhtml
Jeff is angry
```

Would load:

- `/characters/Jeff/angry/base.svg`
- `/characters/Jeff/angry/speaking.svg`
- `/characters/Jeff/angry/blinking.svg`

### Backgrounds

A folder must exist in the same directory as the main script called
`backgrounds`.  Inside it must be a file for every used background.

For example:

```vnhtml
office in background
```

Would load:

- `/backgrounds/office.svg`

### Technical details on file name matching

All files will be search for case insensitively, regardless of your operating
system.

Slashes will be converted to the native format.
