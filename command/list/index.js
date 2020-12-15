/**
 * @author Youngoat@163.com
 * @create 2020-12-08
 */

'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    
    /* NPM */
    , colors = require('colors')
    , columnify = require('columnify')
    , noda = require('noda')
    
    /* in-package */
    , AfDb = noda.inRequire('class/AfDb')
    , myutil = noda.inRequireDir('util')
    ;

function main(ARGS) {
    const db = (new AfDb).load();
    let afcommands = [];

    if (ARGS.name) {
        afcommands = db.find(ARGS.name);
    }
    else if (ARGS.search) {
        afcommands = db.search(ARGS.search);
    }
    else {
        afcommands = db.all();
    }

    if (ARGS.order) {
        afcommands = afcommands.sort((a, b) => {
            if (a.name > b.name) return  1;
            if (a.name < b.name) return -1;
        });
    }

    let data = [];
    afcommands.forEach(afcommand => {
        data.push({
            name  : myutil.colors.name(afcommand.name),
            usage : afcommand.usage || afcommand.argv && colors.green(afcommand.argv[0], '...') || colors.dim('EMPTY'),
        });
    });

    let options = {
        columnSplitter: '  ',
        minWidth: 0,
        showHeaders: true,
    };
    console.log(columnify(data, options));
}

module.exports = main;