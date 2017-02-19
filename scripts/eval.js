'use strict';

const vm = require('vm');

const S = require('sanctuary');
const $ = require('sanctuary-def');
const Int = require('sanctuary-int');
const Z = require('sanctuary-type-classes');


//    evaluate :: String -> Either Error Any
const evaluate = S.encaseEither3_(
  S.I,
  vm.runInNewContext,
  S.__,
  {$: $, Int: Int, S: S, Z: Z},
  {timeout: 5000}
);

//    backticks :: String
const backticks = '```';

//    formatCodeBlock :: String -> String -> String
const formatCodeBlock =
S.curry2((lang, code) => `${backticks}${lang}\n${code}\n${backticks}`);


module.exports = bot => {

  bot.respond(/```(?:javascript|js)?$([\s\S]*)```/m, res => {
    res.send(S.either(S.compose(formatCodeBlock('text'), S.prop('message')),
                      S.compose(formatCodeBlock('javascript'), S.toString),
                      evaluate(res.match[1])));
  });

};
