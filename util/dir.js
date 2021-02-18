/**
 * @author Youngoat@163.com
 * @create 2020-12-15
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, os = require('os')
	, path = require('path')
	
	/* NPM */
	, SyncDir = require('qir/SyncDir')
	
	/* in-package */
	;

const HOME_PATH = path.join(os.homedir(), '.ant-finger');

module.exports = new SyncDir(HOME_PATH);