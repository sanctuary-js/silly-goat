'use strict';

const vm            = require ('vm');

const Future        = require ('fluture');
const fst           = require ('fluture-sanctuary-types');
const R             = require ('ramda');
const S_            = require ('sanctuary');
const $             = require ('sanctuary-def');
const Descending    = require ('sanctuary-descending');
const Identity      = require ('sanctuary-identity');
const Int           = require ('sanctuary-int');
const Z             = require ('sanctuary-type-classes');
const type          = require ('sanctuary-type-identifiers');


//    env :: Array Type
const env = S_.env.concat (fst.env, [
  $.UnaryType
    ('silly-goat/Descending')
    ('https://github.com/sanctuary-js/sanctuary-descending')
    (x => type (x) === 'sanctuary-descending/Descending@1')
    (descending => [Z.extract (descending)])
    ($.Unknown),
  $.UnaryType
    ('silly-goat/Identity')
    ('https://github.com/sanctuary-js/sanctuary-identity')
    (x => type (x) === 'sanctuary-identity/Identity@1')
    (identity => [Z.extract (identity)])
    ($.Unknown),
]);

//    opts :: { checkTypes :: Boolean, env :: Array Type }
const opts = {checkTypes: true, env};

//    S :: Module
const S = S_.create (opts);

//    def :: String -> StrMap TypeClass -> Array Type -> Function -> Function
const def = $.create (opts);

//    evaluate :: String -> Either String String
const evaluate =
def ('evaluate')
    ({})
    ([$.String, S.EitherType ($.String) ($.String)])
    (code => {
       const logs = [];
       const log = level => (...args) => {
         logs.push (level + ': ' + S.joinWith (', ') (S.map (String) (args)));
       };
       return S.map (x => S.unlines (logs) + S.show (x))
                    (S.encaseEither3 (S.prop ('message'))
                                     (S.curry3 (vm.runInNewContext))
                                     (code)
                                     ({$,
                                       Descending,
                                       Future,
                                       Identity,
                                       Int,
                                       R,
                                       S,
                                       Z,
                                       console: {error: log ('error'),
                                                 log: log ('log')}})
                                     ({timeout: 5000}));
     });

//    backticks :: String
const backticks = '```';

//    formatCodeBlock :: String -> String -> String
const formatCodeBlock =
def ('formatCodeBlock')
    ({})
    ([$.String, $.String, $.String])
    (lang => code => `${backticks}${lang}\n${code}\n${backticks}`);


module.exports = bot => {

  bot.respond (/```(?:javascript|js)?$([\s\S]*)```/m, res => {
    res.send (S.either (formatCodeBlock ('text'))
                       (formatCodeBlock ('javascript'))
                       (evaluate (res.match[1])));
  });

};
