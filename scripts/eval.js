'use strict';

const vm = require('vm');

const R = require('ramda');
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

//    evaluate :: String -> Either String String
const evaluate =
def('evaluate',
    {},
    [$.String, S.EitherType($.String, $.String)],
    code => {
      const logs = [];
      const log = (...args) => { logs.push(args.map(String).join(', ')); };
      return S.map(x => S.unlines(S.map(S.concat('log: '), logs)) +
                        S.toString(x),
                   S.encaseEither3_(S.prop('message'),
                                    vm.runInNewContext,
                                    code,
                                    {$, Int, R, S, Z, console: {log}},
                                    {timeout: 5000}));
    });

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
    res.send(S.either(formatCodeBlock('text'),
                      formatCodeBlock('javascript'),
                      evaluate(res.match[1])));
  });

};
