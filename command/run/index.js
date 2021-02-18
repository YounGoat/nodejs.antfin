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
    , AfCommand = noda.inRequire('class/AfCommand')
    , AfDb = noda.inRequire('class/AfDb')
    , myutil = noda.inRequireDir('util')
    ;

/**
 * Execute an AntFinger command.
 * @param {AfCommand} afcommand 
 * @param {object}    ARGS 
 * @param {AfDb}      db 
 * @param {AfHistory} history
 */
async function exec(afcommand, ARGS, db) {
    if (afcommand.commands) {
        for (let i = 0; i < afcommand.commands.length; i++) {
            let subcommand = db.get(afcommand.commands[i]);
            await exec(subcommand, ARGS);
        }
        return;
    }

    let afc = new AfCommand(afcommand);
    let afinstance = null;
    if (ARGS.dryrun) {
        afinstance = await afc.dryrun();
    }
    else {
        afinstance = await afc.run();
    }
}

async function main(ARGS) {
    const db = (new AfDb).load();

    let afcommands = [];
    if (ARGS.name) {
        let one = db.get(ARGS.name);
        if (one) {
            afcommands = [ one ];
        }
        else {
            afcommands = db.find(/^[\w\-\_]+$/.test(ARGS.name) ? ARGS.name + '*' : ARGS.name);
        }
    }
    else if (ARGS.search) {
        afcommands = db.search(ARGS.search);
    }
    else {
        afcommands = db.all();
    }
    
    if (afcommands.length == 0) {
        throw { message: `No matching command found.`, code: 127 };
    }
    else if (afcommands.length == 1) {
        await exec(afcommands[0], ARGS, db);
    }
    else {
        let names = afcommands.map(item => item.name);
        let selected = await myutil.prompt.select({
            name     : 'AntFinger command',
            choices  : names, 
            pageSize : 20,
        });
        await exec(db.get(selected), ARGS, db);
    }
}

module.exports = main;


