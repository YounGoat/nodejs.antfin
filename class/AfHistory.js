/**
 * @author Youngoat@163.com
 * @create 2020-12-07
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, assert = require('assert')
	
	/* NPM */
	, Ajv = require('ajv')
	, minimatch = require('minimatch')
	, noda = require('noda')
	
	/* in-package */
	, schemaAfHistory = noda.inRequire('schema/AfHistory')
	, myutil = noda.inRequireDir('util')
	;

const HISTORY_FILENAME = 'history.json';
const HISTORY_MAX_LENGTH = 1000;

class AfHistory {

	constructor() {
		this._history = null;
	}

	all() {
		return this._history;
	}

	clear() {
		this._history = [];
		this._save();
	}

	/**
	 * 
	 * @param {string} pattern - AfCommand name pattern
	 * @return {object[]}
	 */
	find(pattern) {
		return this._history.filter(item => minimatch(item.name, pattern));
	}

	load() {
		let data = [];
		if (myutil.dir.exists(HISTORY_FILENAME)) {
			try {
				data = JSON.parse(myutil.dir.readFile(HISTORY_FILENAME, 'utf-8'));
			} catch (error) {
				throw `The history-database "${myutil.dir.resolve(HISTORY_FILENAME)}" is broken.`;
			}
		}

		let ajv = new Ajv;
		if (!ajv.validate(schemaAfHistory, data)) {
			console.log(ajv.errorsText());
			throw `The history-database "${myutil.dir.resolve(HISTORY_FILENAME)}" is tampered.`;
		}

		data.forEach(afinstance => {
			afinstance.date = new Date(afinstance.date);
		});

		this._history = data;
		return this;
	}	

	/**
	 * @param {string}   data.name
	 * @param {string}  [data.commandline]
	 * @param {string}  [data.argv]
	 * @param {object}  [data.vars]
	 */
	push(data) {
		data.date = new Date();
		this._history.push(data);
		this._save();
	}

	remove(number) {
		this._history.splice(number, 1);
		this._save();
	}

	uniq() {
		if (!this._history) {
			this.load();
		}
		
		let uniqued = [];
		let L = this._history.length;
		for (let i = 0; i < L; i++) {
			let current = this._history[i];
			let found = uniqued.find(item => {
				if (item.name != current.name) return false;
				try {
					assert.deepStrictEqual(item.vars, current.vars);
				} catch (error) {
					return false;
				}
				return true;
			});
			if (!found) uniqued.push(current);
		}

		myutil.console.log(`**${L - uniqued.length}** duplicated history command(s) deleted.`);

		this._history = uniqued;
		this._save();
	}

	_save() {
		const _history = this._history;
		while (_history.length > HISTORY_MAX_LENGTH) _history.shift();
		myutil.dir.writeFile(HISTORY_FILENAME, JSON.stringify(_history, null, 4));
	}
}

module.exports = AfHistory;