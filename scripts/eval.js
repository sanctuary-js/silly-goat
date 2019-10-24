'use strict';

const vm            = require ('vm');

const Future        = require ('fluture');
const R             = require ('ramda');
const {create}      = require ('sanctuary');
const $             = require ('sanctuary-def');
const Descending    = require ('sanctuary-descending');
const Identity      = require ('sanctuary-identity');
const Int           = require ('sanctuary-int');
const Z             = require ('sanctuary-type-classes');
const type          = require ('sanctuary-type-identifiers');
const Useless       = require ('sanctuary-useless');
const Useless$pkg   = require ('sanctuary-useless/package.json');


//    $Useless :: Type
const $Useless = $.NullaryType
  ('Useless')
  ('https://github.com/sanctuary-js/sanctuary-useless/tree/v' +
   Useless$pkg.version)
  ([])
  (x => type (x) === Useless.constructor['@@type']);

//    env :: Array Type
const env = $.env.concat ([$Useless]);

//    opts :: { checkTypes :: Boolean, env :: Array Type }
const opts = {checkTypes: true, env};

//    S :: Module
const S = create (opts);

//    def :: String -> StrMap TypeClass -> Array Type -> Function -> Function
const def = $.create (opts);

//    evaluate :: String -> Either String String
const evaluate =
def ('evaluate')
    ({})
    ([$.String, $.Either ($.String) ($.String)])
    (code => {
       const logs = [];
       const log = level => (...args) => {
         logs.push (level + ': ' + S.joinWith (', ') (S.map (String) (args)));
       };
       return S.bimap (S.prop ('message'))
                      (x => S.unlines (logs) + S.show (x))
                      (S.encase (S.curry3 (vm.runInNewContext)
                                          (code)
                                          ({$,
                                            Descending,
                                            Future,
                                            Identity,
                                            Int,
                                            R,
                                            S,
                                            Useless,
                                            Z,
                                            console: {error: log ('error'),
                                                      log: log ('log')}}))
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
