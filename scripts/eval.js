'use strict';

const vm            = require('vm');

const R             = require('ramda');
const S_            = require('sanctuary');
const $             = require('sanctuary-def');
const Descending    = require('sanctuary-descending');
const Int           = require('sanctuary-int');
const Z             = require('sanctuary-type-classes');
const type          = require('sanctuary-type-identifiers');


//    Language :: Type
const Language = $.EnumType('silly-goat/Language', '', ['javascript', 'text']);

//    env :: Array Type
const env = S_.env.concat([
  $.UnaryType
    ('silly-goat/Descending')
    ('https://github.com/sanctuary-js/sanctuary-descending')
    (x => type(x) === 'sanctuary-descending/Descending@1')
    (descending => [Z.extract(descending)])
    ($.Unknown),
]);

//    opts :: { checkTypes :: Boolean, env :: Array Type }
const opts = {checkTypes: true, env};

//    S :: Module
const S = S_.create(opts);

//    def :: String -> StrMap TypeClass -> Array Type -> Function -> Function
const def = $.create(opts);

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
                   S.encaseEither3(S.prop('message'),
                                   S.curry3(vm.runInNewContext),
                                   code,
                                   {$, Descending, Int, R, S, Z,
                                    console: {log}},
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
