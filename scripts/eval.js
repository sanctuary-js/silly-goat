'use strict';

var vm = require('vm');

var S = require('sanctuary');
var $ = require('sanctuary-def');
var Int = require('sanctuary-int');
var Z = require('sanctuary-type-classes');


//  evaluate :: String -> Either Error Any
var evaluate = S.encaseEither3_(
  S.I,
  vm.runInNewContext,
  S.__,
  {$: $, Int: Int, S: S, Z: Z},
  {timeout: 5000}
);

//  formatCodeBlock :: String -> String -> String
var formatCodeBlock = S.curry2(function(lang, code) {
  return '```' + lang + '\n' + code + '\n```';
});


module.exports = function(bot) {

  bot.respond(/```(javascript|js)$([\s\S]*)```/m, function(res) {
    res.send(S.either(S.compose(formatCodeBlock('text'), S.prop('message')),
                      S.compose(formatCodeBlock('javascript'), S.toString),
                      evaluate(res.match[2])));
  });

};
