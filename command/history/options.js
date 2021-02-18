'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	
	/* in-package */
	;

module.exports = {
	"explicit": true,
	"groups": [
		[
			'--help -h NOT ASSIGNABLE',
		],
		[
			'--uniq NOT ASSIGNABLE',
		],
		[
			'--clear -c [*:=* clear] NOT ASSIGNABLE',
		],
		[
			'--run [*:=* run] NOT ASSIGNABLE',
			'--amend [*:=* amend] NOT ASSIGNABLE',
			'--number [*:~* ^\\!?\\d+$] NOT NULL',
		],
		[
			'--date -D NOT ASSIGNABLE',
			'--time -T NOT ASSIGNABLE',
			'--line -L NOT ASSIGNABLE DEFAULT(true)',
		],
		[
			'--name [*] NOT NULL',
		],
		[
			'--number [*:~* \\d+] NOT NULL',
			'--delete -d [*:=* delete] NOT ASSIGNABLE REQUIRED',
		],
	]

};