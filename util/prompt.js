/**
 * @author Youngoat@163.com
 * @create 2020-12-09
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	, inquirer = require('inquirer')
	
	/* in-package */
	, console = require('console')
	;


module.exports = {
	checkbox(options) {
		if (Array.isArray(options)) {
			options = { choices: options };
		}
		options.name = 'FOOBAR';
		options.type = 'checkbox';
		return inquirer.prompt(options).then(answer => answer[options.name]);
	},

	confirm(options) {
		if (typeof options == 'string') {
			options = { message: options };
		}
		options.name = 'FOOBAR';
		options.type = 'confirm';
		return inquirer.prompt(options).then(answer => answer[options.name]);
	},

	input(options) {
		if (typeof options == 'string') {
			options = { message: options };
		}
		options.name = 'FOOBAR';
		options.type = 'input';
		return inquirer.prompt(options).then(answer => answer[options.name]);
	},

	select(options) {
		if (Array.isArray(options)) {
			options = { choices: options };
		}
		options.name = 'FOOBAR';
		options.type = 'list';
		return inquirer.prompt(options).then(answer => answer[options.name]);
	},
};
		