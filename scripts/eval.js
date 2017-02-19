'use strict';

const vm = require('vm');

const S = require('sanctuary');
const $ = require('sanctuary-def');
const Int = require('sanctuary-int');
const Z = require('sanctuary-type-classes');


//    Language :: Type
const Language = $.EnumType('silly-goat/Language', '', ['javascript', 'text']);

//    checkTypes :: Boolean
const checkTypes = true;

//    env :: Array Type
const env = Z.concat(S.env, [Language]);

//    def :: String -> StrMap TypeClass -> Array Type -> Function -> Function
const def = $.create({checkTypes, env});

//    evaluate :: String -> Either Error Any
const evaluate =
def('evaluate',
    {},
    [$.String, S.EitherType($.Error, $.Any)],
    S.encaseEither3_(S.I,
                     vm.runInNewContext,
                     S.__,
                     {$, Int, S, Z},
                     {timeout: 5000}));

//    backticks :: String
const backticks = '```';

//    formatCodeBlock :: String -> String -> String
const formatCodeBlock =
def('formatCodeBlock',
    {},
    [Language, $.String, $.String],
    (lang, code) => `${backticks}${lang}\n${code}\n${backticks}`);


module.exports = bot => {

  bot.respond(/```(?:javascript|js)?$([\s\S]*)```/m, res => {
    res.send(S.either(S.compose(formatCodeBlock('text'), S.prop('message')),
                      S.compose(formatCodeBlock('javascript'), S.toString),
                      evaluate(res.match[1])));
  });

};
