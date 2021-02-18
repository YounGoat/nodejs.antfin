/**
 * @author Youngoat@163.com
 * @create 2020-12-14
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	, colors = require('colors')
	
	/* in-package */
	;

let MODULE = module.exports = {
	name(t) {
		return colors.yellow(t);
	},

	var_name(t) {
		return colors.italic.bold.red(t);
	},

	var_value(t) {
		return colors.cyan(t);
	},

	command(t) {
		t = t.replace(/@AF\{(\w+)(\([^)]+\)|\[[\-\w]+\])?\}/g, (match, name, values) => {
			let L = colors.dim('@AF{');
			let R = colors.dim('}');
			let N = MODULE.var_name(name);
			let V = values && MODULE.var_value(values) || '';
			return L + N + V + R;
		});
		return MODULE.command_line(t);
	},

	command_line(t) {
		return colors.blue(t);
	},
};