/**
 * @author Youngoat@163.com
 * @create 2020-12-11
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	, colors = require('colors')
	, cloneObject = require('jinang/cloneObject')
	
	/* in-package */
	;

let myStyles = {
	// Head
	H(title) {
		return colors.bold(title);
	},

	// Indent
	I() {
		return [ '\t', ... arguments ];
	}
};

let colorsStyles = cloneObject(colors.styles, name => {
	return [ name, function() {
		return colors[name].apply(colors, arguments);
	} ];
});

function output() {
	console.log.apply(null, arguments);
}
output._decorators = [];

function build(decorators) {
	let fn = function() {
		let args = Array.from(arguments);
		decorators.forEach(decorator => {
			if (decorator.length == 1) {
				args = args.map(decorator);
			}
			else {
				let ret = decorator.apply(null, args);
				args = Array.isArray(ret) ? ret : [ ret ];
			}
		});		
		console.log.apply(null, args);
	};
	fn._decorators = decorators;
	fn.__proto__ = output;
	return fn;
}

function defineGetters(o, styles) {
	let props = {};
	for (let name in styles) {
		props[name] = { 
			get: function() {
				let decorators = this._decorators.concat(styles[name]);
				return build(decorators);
			},
		};
	}
	return Object.defineProperties(o, props);
}

defineGetters(output, colorsStyles);
defineGetters(output, myStyles);

module.exports = output;
	