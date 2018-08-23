# vnhtml packages

These packages, under the @vnhtml NPM namespace, are designed to be combined as
follows:

<pre>
@vnhtml/lexer
 |'-> @vnhtml/pretty-printer
 |'-> @vnhtml/collector -------> (load dependencies)
  '-> @vnhtml/parser                              |
       '-> @vnhtml/finite-state-machine-generator |
            '-> @vnhtml/html-generator <---------'
</pre>

The following are stand-alone applications:

- @vnhtml/cli
