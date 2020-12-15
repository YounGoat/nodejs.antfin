/**
 * @author Youngoat@163.com
 * @create 2020-12-08
 */

'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    
    /* NPM */
    , colors = require('colors')
    , noda = require('noda')
    
    /* in-package */
    , AfDb = noda.inRequire('class/AfDb')
    , myutil = noda.inRequireDir('util')
    ;

async function main(ARGS) {
    const db = (new AfDb).load();
    db.rename(ARGS.old, ARGS.new);
    myutil.console.log(`Command #${ARGS.old}# already renamed with #${ARGS.new}#.`);
}

module.exports = main;