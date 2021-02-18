/**
 * @author Youngoat@163.com
 * @create 2020-12-08
 */

'use strict';

const { kStringMaxLength } = require('buffer');
const AfCommand = require('../../class/AfCommand');

const MODULE_REQUIRE = 1
    /* built-in */
    , spawn = require('child_process').spawn
    
    /* NPM */
    , colors = require('colors')
    , columnify = require('columnify')
    , noda = require('noda')
    , date_format = require('dafo/php')
    
    /* in-package */
    , AfDb = noda.inRequire('class/AfDb')
    , AfHistory = noda.inRequire('class/AfHistory')
    , myutil = noda.inRequireDir('util')
    , o = myutil.output
    ;
 
async function view(afinstance) {
    o();
    o.H('NAME');
    o.I(myutil.colors.name(afinstance.name));

    if (afinstance.commandline) {
        o();
        o.H('COMMAND LINE');
        o.I(myutil.colors.command_line(afinstance.commandline));    
    }

    if (afinstance.argv) {
        o();
        o.H('COMMAND LINE');
        o.I(myutil.colors.command_line(afinstance.argv.join(' ')));
    }

    if (afinstance.vars) {
        o();
        o.H('VARIABLES');
        for (let name in afinstance.vars) {
            o.I(myutil.colors.var_name(name));
            o.I(myutil.colors.var_value(afinstance.vars[name]));
            o();
        }
    }
    
    o();
}

async function run(afinstance, amend) {
    if (amend) {
        let db = (new AfDb).load();
        let afcommand = await db.get(afinstance.name);
        if (!afcommand) {
            myutil.console.warn(`AntFinger command ${afinstance.name} is removed.`);
            return;
        }
        new AfCommand(afcommand).run(afinstance, true);
    }
    else {
        let afcommand = new AfCommand();
        afcommand.run(afinstance);
    }

}

async function main(ARGS) {
    const history = (new AfHistory);

    if (ARGS.clear) {
        history.clear();
        return;
    }
    else {
        history.load();
    }
    
    if (ARGS.uniq) {
        history.uniq();
        return;
    }

    if (ARGS.amend) {
        ARGS.run = true;
    }
    
    // Find history command by number.
    if (ARGS.number) {
        if (/^!(\d+)$/.test(ARGS.number)) {
            ARGS.run = true;
            ARGS.number = RegExp.$1;
        }

        let afinstances = history.all();
        
        if (ARGS.number < 0) {
            ARGS.number = afinstances.length + parseInt(ARGS.number);
        }
    
        let afinstance = afinstances[ARGS.number];
        if (!afinstance) {
            myutil.console.warn(`History index **${ARGS.number}** is out of range.`);
            return;
        }

        if (ARGS.delete) {
            await history.remove(ARGS.number);
            return;
        }

        // Amend and run.
        if (ARGS.run) {
            await run(afinstance, ARGS.amend);
        }
        
        // View.
        else {
            await view(afinstance);
        }
    }

    // Among all history commands.
    else {
        let afinstances = history.all();    
        let data = [];
        afinstances.forEach((afinstance, index) => {
            if (ARGS.name && afinstance.name != ARGS.name) return;

            let item;
            let commandline = myutil.colors.command_line(afinstance.commandline || afinstance.argv.join(' '));
            if (ARGS.run) {
                item = {
                    name  : `${index} ${commandline}`,
                    value : index,
                    short : afinstance.name,
                };
            }
            else {
                item = { index: colors.reset(index) };
                if (ARGS.date) {
                    item.date = colors.dim(date_format(afinstance.date, 'M d'));
                }
                if (ARGS.time) {
                    item.time = colors.dim(date_format(afinstance.date, 'H:i'));
                }
                item.name = myutil.colors.name(afinstance.name);
                if (ARGS.line) {
                    item.commandline = commandline;
                }
            }

            data.push(item);
        });

        // Run.
        if (ARGS.run) {
            let answer = await myutil.prompt.select({
                name     : 'History command',
                choices  : data,
                pageSize : 20,
            });
            let afinstance = afinstances[answer];
            await run(afinstance, ARGS.amend);
        }

        // List.
        else {
            let options = {
                columnSplitter: '  ',
                minWidth: 0,
                showHeaders: false,
                config: {
                    index: { align: 'right' },
                },
            };
            console.log(columnify(data, options));
        }
    }
}

module.exports = main;