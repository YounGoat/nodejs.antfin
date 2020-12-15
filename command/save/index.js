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
    , split = require('jinang/split')
    
    /* in-package */
    , AfDb = noda.inRequire('class/AfDb')
    , AfCommand = noda.inRequire('class/AfCommand')
    , myutil = noda.inRequireDir('util')
    ;

const VARIABLE_PLACE_HOLDER = '@@';

async function unfill(commandtext, title) {
    for (let j = 0; ; j++) {
        /**
         * Repeat until all place holders replaced.
         */
        if (commandtext.indexOf(VARIABLE_PLACE_HOLDER) == -1) break;                
        
        console.log();
        if (j == 0) {
            myutil.console.log(`-- Variable(s) In ${title} --`);
        }

        if (noda.count() == 1) {
            console.log(`In interactive mode of ${colors.blue('af run')}, variable name will be prompted.`);
            console.log(`A name may be used in two or more places.`);
        }
    
        let varname = await myutil.prompt.input({
            message: `Variable ${j} Name`,
            validate: value => {
                if (!value) {
                    return 'Variable name SHOULD NOT be empty.';
                }
                if (!/^\w+$/.test(value)) {
                    return 'ONLY word characters are allowed.';
                }
                return true;
            }
        });

        if (noda.count() == 1) {
            console.log('Set default value or available values for the variable.');
            console.log(`Prsee ${colors.yellow('<ENTER>')} directly to end, or`);
            console.log(`end with ${colors.yellow('...')} to allow inputting other value on running.`);
        }
        
        let enums = [];
        for (let k = 0; ; k++) {
            let value = (await myutil.prompt.input({
                message: `Value ${k}`,
                validate: value => /^[\w~!@%/\-.]*$/.test(value) ? true : `ONLY word characters and ${colors.yellow('~!@%/-.')} are allowed.`,
            })).trim();
            if (!value) break;

            if (value == '...') {
                /**
                 * If there is no value or only one value offered, 
                 * it is meaningless to add '...' at the end.
                 */
                if (enums.length > 1) enums.push(value);
                break;
            }

            enums.push(value);                    
        }
        
        let def = enums.length ? varname + '(' + enums.join(',') + ')' : varname;
        commandtext = commandtext.replace(VARIABLE_PLACE_HOLDER, '@AF{' + def + '}');    
    }
    return commandtext;
}

async function main(ARGS) {
    const db = (new AfDb).load();
    const afcommand = {};

    console.log();
    myutil.console.log('-- BASIC --');

    let existing = null;
    afcommand.name = ARGS.name;
    do {
        if (afcommand.name && (existing = db.get(afcommand.name))
            && !await myutil.prompt.confirm(`Overwrite existing command?`)) {
            name = null;
        }

        if (afcommand.name) {
            break;
        }

        afcommand.name = await myutil.prompt.input({ 
            message  : 'Name', 
            validate : name => /^\s*$/.test(name) ? 'Name SHOULD NOT be empty.' : true,
        });
    } while(true);

    afcommand.usage = ARGS.usage || await myutil.prompt.input({ 
        message : 'Usage', 
        default : existing && existing.usage, 
    });

    let type = await myutil.prompt.select({
        message : 'Command Type',
        choices : [ 
            { name: 'Single Command', value: 'argv' },
            { name: 'Compound Command', value: 'commandline' },
            { name: 'Combined Commands', value: 'commands' },
        ],
    });

    if (type == 'argv') {
        let argv = ARGS['--'];
        if (!argv || argv.length == 0) {
            let command = await myutil.prompt.input({
                message  : 'Command Name',
                default  : existing && existing.argv && existing.argv[0],
                validate : name => /^\s*$/.test(name) ? 'Command SHOULD NOT be empty.' : true,
            });
            argv = split(command, /\s+/, [ '"', "'" ], '\\');
        }

        if (argv.length == 1) {
            console.log();
            myutil.console.log('-- MORE ARGUMENTS --');
            console.log(`Add arguments one by one. Prsee ${colors.yellow('<ENTER>')} directly to end.`);
            console.log(`Input ${colors.yellow(VARIABLE_PLACE_HOLDER)} WHERE you want to put a variable.`);
            
            for (let i = 0; ; i++) {
                let title = `Argument ${i}`;
                let arg = (await myutil.prompt.input(title)).trim();
                if (!arg) break;
                arg = await unfill(arg, title);
                argv.push(arg);
            }
        }
        afcommand.argv = argv;
    }
    else if (type == 'commandline') {
        let commandline = ARGS.pattern;
        if (!commandline) {
            commandline = await myutil.prompt.input({
                message  : 'Command Line',
                default  : existing && existing.commandline,
                validate : value => /^\s*$/.test(value) ? 'Command Line SHOULD NOT be empty.' : true,
            });
        }
        afcommand.commandline = await unfill(commandline);
    }
    else if (type == 'commands') {
        console.log();
        myutil.console.log('-- SELECT FROM SAVED COMMANDS --');
        afcommand.commands = [];

        let choices = db.all()
            .map(afcommand2 => afcommand2.name)
            .filter(name => name != afcommand.name)
            .sort()
            ;
        choices.unshift(
            { name: colors.dim('<END>'), value: '' },
            { name: colors.dim('<INPUT BY HAND>'), value: '...'},
            new inquirer.Separator(),
        );
        
        let options = { 
            choices  ,
            loop     : false,
            pageSize : 10,
        };
        for (let i = 0; ; i++) {
            options.message = `Command ${i}`;
            let name = await myutil.prompt.select(options);
            
            if (!name) break;

            while (name == '...') {
                let names = null;
                await myutil.prompt.input({
                    message  : options.message,
                    validate : value => {
                        if (/^\s*$/.test(value)) {
                            return 'Command name SHOULD NOT be empty.';
                        }

                        if (value == afcommand.name) {
                            return 'Recursively combination is NOT ALLOWED.';
                        }

                        let afcommand2 = db.get(value);
                        if (afcommand2) {
                            name = afcommand2.name;
                            return true;
                        }
                        let afcommands = db.find(value + '*');
                        if (afcommands.length == 0 || 
                            afcommands.length == 1 && afcommands[0].name == afcommand.name) {
                            return `Command ${myutil.colors.name(value)} NOT FOUND.`;
                        }
                        else {
                            names = afcommands
                                .map(afcommand => afcommand.name)
                                .filter(name => name != afcommand.name);
                            return true;
                        }
                    },
                });
                if (names) {
                    names.push({ name: colors.dim('<OTHERS>'), value: '...' });
                    name = await myutil.prompt.select({
                        message : options.message,
                        choices : names,
                        loop    : false,
                    });
                }
            }

            afcommand.commands.push(name);
        } 
    }

    let data = new AfCommand(afcommand).toJson();
    if (db.add(data)) {
        console.log();
        myutil.console.log(`AntFinger saved!`);
    }
}

module.exports = main;