'use strict';

const S = require('sanctuary');

const pkg = require('../package.json');


//    deps :: { hubot :: Array String, other :: Array String }
const deps = S.keys(pkg.dependencies).sort().reduce(($acc, name) => {
  $acc[/^hubot(-|$)/.test(name) ? 'hubot' : 'other'].push(name);
  return $acc;
}, {hubot: [], other: []});

//    version :: String -> String
const version = name => {
  const v = pkg.dependencies[name];
  return `${name}@${v === '*' ? require(`${name}/package.json`).version : v}`;
};

//    backticks :: String
const backticks = '```';

//    versions :: String
const versions =
`${backticks}
Node ${process.version}

${S.joinWith('\n', S.map(version, deps.hubot))}

${S.joinWith('\n', S.map(version, deps.other))}
${backticks}`;


module.exports = bot => {

  bot.respond(/versions/, res => { res.send(versions); });

};
