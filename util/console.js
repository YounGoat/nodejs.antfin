/**
 * @author Youngoat@163.com
 * @create 2020-12-08
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	, colors = require('colors')
	
	/* in-package */
	;

const TOLEXT    = '[ AntFinger ]';
const TOL       = colors.dim(TOLEXT);
const TOLINDENT = ' '.repeat(TOLEXT.length + 1);
	
/**
 * Render text if `renderer` offered, then
 * output with specified console function.
 * @param {*}  args 
 * @param {*}  action
 * @param {*} [renderer] 
 */
function _output(args, action, renderer) {
	args = Array.from(args).map(arg => {
		/**
		 * Highlight.
		 */
		arg = arg.replace(
			/\*\*([^#]+)\*\*/g,
			(match, Keyword) => colors.bold(Keyword)
		);

		/**
		 * Keyword.
		 */
		arg = arg.replace(
			/#([^#]+)#/g,
			(match, Keyword) => colors.underline(Keyword)
		);

		/**
		 * End-of-line.
		 */
		arg = arg.replace(
			/([\r\n]+)/g,
			(match, eol) => eol + TOLINDENT
		);

		if (renderer) {
			arg = renderer(arg);
		}

		return arg;
	});
	args.unshift(TOL);
	console[action].apply(console, args);
}

module.exports = {
	TOL,

	error() {
		_output(arguments, 'error', colors.red);
	},

	log() {
		_output(arguments, 'log');
	},
	
	warn() {
		_output(arguments, 'warn', colors.yellow);
	}
};