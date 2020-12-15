/**
 * @author Youngoat@163.com
 * @create 2020-12-08
 */

'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    
    /* NPM */
    , colors = require('colors')
    , inquirer = require('inquirer')
    , noda = require('noda')
    
    /* in-package */
    , AfDb = noda.inRequire('class/AfDb')
    , myutil = noda.inRequireDir('util')
    ;

async function main(ARGS) {
    const db = (new AfDb).load();
    
    let afcommands = null;
    if (ARGS.name) {
        afcommands = db.find(ARGS.name);
    }
    else if (ARGS.search) {
        afcommands = db.search(ARGS.search);
    }
    else {
        afcommands = db.all();
    }

    let names = afcommands.map(item => item.name);
    if (afcommands.length == 0) {
        myutil.console.warn(`No command matches "${ARGS.search}".`);
    }
    else if (!ARGS.force) {
        if (names.length == 1) {
            if (!await myutil.prompt.confirm(`Remove command ${names[0]}?`)) {
                names.slice(0, 1);
            }
        }
        else {
            names = await myutil.prompt.checkbox({
                message  : 'To be removed',
                choices  : names,
                loop     : false,
                pageSize : 20,
            });
        }
    }

    if (names.length == 0) {
        myutil.console.log('No command removed.')
    }
    else {
        db.remove(names);
        myutil.console.log(`${names.length} commands removed.`);
    }
}

module.exports = main;