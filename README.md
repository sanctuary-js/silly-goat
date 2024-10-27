# silly-goat

silly-goat is a [Hubot][1] chat bot for the [Sanctuary][2] room on [Gitter][3].

### Commands

  - `/versions`: list Node version and dependency versions

### JavaScript evaluation

When [@silly-goat][4] is mentioned in a message containing a JavaScript code
block, silly-goat evaluates the code and bleats the result.

In Markdown, a JavaScript code block looks like this:

    ```javascript
    S.map(S.inc, [1, 2, 3])
    ```

`js` may be used in place of `javascript`, or the language may be left
unspecified.


[1]: https://hubot.github.com/
[2]: https://gitter.im/sanctuary-js/sanctuary
[3]: https://gitter.im/
[4]: https://github.com/silly-goat
