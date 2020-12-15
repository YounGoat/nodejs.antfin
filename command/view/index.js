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
    , o = myutil.output
    ;

async function main(ARGS) {
    const db = (new AfDb).load();
    
    let afcommand = db.get(ARGS.name);
    if (!afcommand) {
        throw `Command ${ARGS.name} not found.`;
    }
    
    if (1) {
        o();
        o.H('NAME');
        o.I(myutil.colors.command('af'), myutil.colors.name(afcommand.name));
    }
    
    if (afcommand.usage) {
        o();
        o.H('USAGE');
        o.I(afcommand.usage);
    }

    if (afcommand.argv) {
        o();
        o.H('ARGV');
        afcommand.argv.forEach((arg, i) => {
            o.I(colors.yellow(i), myutil.colors.command(arg));
        });
    }
    
    if (afcommand.commandline) {
        o();
        o.H('COMMAND LINE');
        o.I(myutil.colors.command(afcommand.commandline));
    }

    if (afcommand.shells) {
        o();
        o.H('SHELLS');
        afcommand.shells.forEach((shell, i) => {
            if (process.env.SHELL == shell) {
                o.I('*', shell);
            }
            else {
                o.I(i, shell);
            }
        });
    }

    if (afcommand.commands) {
        o();
        o.H('SUB COMMANDS');
        afcommand.commands.forEach((command, i) => {
            o.I(colors.yellow(i), myutil.colors.name(command));
        });
        o.I(colors.dim('The sub commands will be executed one by one.'));
    }

    o();
}

module.exports = main;