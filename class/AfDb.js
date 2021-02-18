/**
 * @author Youngoat@163.com
 * @create 2020-12-07
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, fs = require('fs')
	, os = require('os')
	, path = require('path')
	
	/* NPM */
	, Ajv = require('ajv')
	, minimatch = require('minimatch')
	, noda = require('noda')
	
	/* in-package */
	, schemaAfDb = noda.inRequire('schema/AfDb')
	, myutil = noda.inRequireDir('util')
	;

const DB_FILENAME = 'afdb.json';

class AfDb {

	constructor() {
		this._db = [];
	}

	/**
	 * @param  {object}   afcommand
	 * @return {boolean}
	 */
	add(afcommand) {
		let index = this._db.findIndex(item => item.name == afcommand.name);
		if (index >= 0) {
			this._db.splice(index, 1, afcommand);
		}
		else {
			this._db.push(afcommand);
		}
		this._save();
		return true;
	}

	all() {
		return this._db.slice(0);
	}

	each(fn) {
		this._db.forEach(fn);
	}

	/**
	 * 
	 * @param {string} pattern - AfCommand name pattern
	 * @return {AfCommand[]}
	 */
	find(pattern) {
		return this._db.filter(item => minimatch(item.name, pattern));
	}

	/**
	 * Get commmand by name.
	 * @param  {string} name 
	 * @return {AfCommand}
	 */
	get(name) {
		return this._db.find(item => item.name == name);
	}

	/**
	 * Get commmand index by name.
	 * @param  {string} name 
	 * @return {AfCommand}
	 */
	getIndex(name) {
		return this._db.findIndex(item => item.name == name);
	}

	load() {
		let data = [];
		if (myutil.dir.exists(DB_FILENAME)) {
			try {
				data = JSON.parse(myutil.dir.readFile(DB_FILENAME, 'utf-8'));
			} catch (error) {
				throw `The command-database "${myutil.dir.resolve(DB_FILENAME)}" is broken.`;
			}
		}

		let ajv = new Ajv;
		if (!ajv.validate(schemaAfDb, data)) {
			console.log(ajv.errorsText());
			throw `The database "${myutil.dir.resolve(DB_FILENAME)}" is tampered.`;
		}

		this._db = data;
		return this;
	}

	remove(names) {
		if (!Array.isArray(names)) {
			names = [ names ];
		}

		names.forEach(name => {
			let index = this.getIndex(name);
			this._db.splice(index, 1);
		});
		
		this._save();
	}

	rename(oldname, newname) {
		let afcommand = this.get(oldname);
		if (!afcommand) {
			throw `Command ${oldname} not found.`;
		}
		if (this.get(newname)) {
			throw `Command name ${newname} already ocuupied.`;
		}
		afcommand.name = newname;
		this._save();
	}

	_save() {
		myutil.dir.writeFile(DB_FILENAME, JSON.stringify(this._db, null, 4));
	}

	/**
	 * 
	 * @param  {string} keyword 
	 * @return {AfCommand[]}
	 */
	search(keyword) {
		return this._db.filter(item => {
			if (item.name.indexOf(keyword) >= 0) return true;
			if (item.usage && item.usage.indexOf(keyword) >= 0) return true;
			if (item.argv && item.argv[0].indexOf(keyword) >= 0) return true;
		});
	}
}

module.exports = AfDb;