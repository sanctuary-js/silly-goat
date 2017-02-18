'use strict';

var S = require('sanctuary');

var pkg = require('../package.json');


var deps = S.keys(pkg.dependencies).sort().reduce(function($acc, name) {
  $acc[/^hubot(-|$)/.test(name) ? 'hubot' : 'other'].push(name);
  return $acc;
}, {hubot: [], other: []});

function version(name) {
  return name + '@' + require(name + '/package.json').version;
}

var versions =
  '```text\nNode ' + process.version + '\n\n' +
  S.unlines(S.map(version, deps.hubot)) + '\n' +
  S.unlines(S.map(version, deps.other)) + '```';


module.exports = function(bot) {

  bot.respond(/versions/, function(res) {
    res.send(versions);
  });

};
