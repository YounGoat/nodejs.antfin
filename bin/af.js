#!/usr/bin/env node

/**
 * @author youngoat@163.com
 * @create 2020-11-23
 */

'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    
    /* NPM */
    , commandos = require('commandos')
    , noda = require('noda')
    
    /* in-package */
    , myutil = noda.inRequireDir('util')
	;

let argv = process.argv.slice(2);
commandos.run(argv, {
    name: 'af',
    commandDir: noda.inResolve('command'),
    alias: [ 
        [ 'last', [ 'history', '--run', '--number=-1' ] ],
        [ [ '\\!*' ], [ 'history', '--run', '$0' ] ],
        [ '*', [ 'run', '$0' ] ]
    ],
    afterRun(data) {
        let { result, error, name, argv } = data;
        if (error) {
            myutil.console.error(error.message || error);
            process.exitCode = error.code || 1;
        }
    },
});