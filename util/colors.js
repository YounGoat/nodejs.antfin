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

module.exports = {
	name(t) {
		return colors.yellow(t);
	},

	command(t) {
		t = t.replace(/@AF\{(\w+)(\([^)]+\)|\[[\-\w]+\])?\}/g, (match, name, values) => {
			let L = colors.dim('@AF{');
			let R = colors.dim('}');
			let N = colors.italic.bold.red(name);
			let V = values && colors.cyan(values) || '';
			return L + N + V + R;
		});
		return colors.blue(t);
	},
};