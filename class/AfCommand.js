/**
 * @author Youngoat@163.com
 * @create 2020-12-07
 */

'use strict';

const { osRequire } = require('noda');

const MODULE_REQUIRE = 1
	/* built-in */
	, spawn = require('child_process').spawn
	
	/* NPM */
	, colors = require('colors')
	, noda = require('noda')
	
	/* in-package */
	, myutil = noda.inRequireDir('util')
	, o = myutil.output
	;

const RE_VAR = /@AF\{(\w+)(\([^)]+\)|\[[^\]]+\])?\}/;

class AfCommand {
	constructor(options) {
		this._ = options;
	}

	async dryrun() {
		let commands = this._.commands;
		if (commands) {
			commands.forEach(command => {
				o.blue('af run', command);
			});
			return;
		}
		
		myutil.console.log(`Dry run command ${colors.yellow(this._.name)}`);
		let { commandline, argv } = await this._parse();
		if (argv) {
			o.blue.apply(null, argv);
		}
		if (commandline) {
			o.blue(commandline);
		}
		o();
	}

	async _parse() {
		let vars = {};
		let fill = async (commandtext)=> {
			do {
				let matches = commandtext.match(RE_VAR);

				// Repeat until no more pattern found.
				if (!matches) return commandtext;

				let [ pattern, name, enums ] = matches;

				if (!vars[name]) {
					// Trim braces and spaces.
					enums = enums && enums.slice(1, -1).split(',').map(value => value.trim());
					
					let options = {
						message: name,
						validate: value => /^\s*$/.test(value) ? `${name} SHOULD NOT be empty.` : true,
					};

					if (!enums || enums.length == 0) {
						vars[name] = await myutil.prompt.input(options);
					}
					else if (enums.length == 1) {
						options.default = enums[0];
						vars[name] = await myutil.prompt.input(options);
					}
					else {
						if (enums[ enums.length - 1 ] == '...') {
							enums.splice(-1, 1, { name: colors.dim('OTHERS ...'), value: '...' });
						}

						options.choices = enums.map(value => value || { name: colors.dim('-- EMPTY --'), value: '' });
						options.loop = false;
						vars[name] = await myutil.prompt.select(options);
						if (vars[name] == '...') {
							vars[name] = await myutil.prompt.input(options);
						}
					}
				}

				// Replace the pattern.
				commandtext = commandtext.replace(pattern, vars[name]);
			} while (true);
		};

		if (this._.argv) {
			let argv = this._.argv.slice(0);
			for (let i = 0; i < argv.length; i++) {
				argv[i] = await fill(argv[i]);
			}
			return { argv };
		}

		if (this._.commandline) {
			let commandline = await fill(this._.commandline);
			return { commandline };
		}
	}

	async run() {
		let { commandline, argv } = await this._parse();
		if (argv) {
			let [ command, ...args ] = argv;
			spawn(command, args, { stdio: 'inherit' });
		}
		else {
			spawn('bash', [ '-c', commandline ], { stdio: 'inherit' });
		}
	}
	
	toJson() {
		return this._;
	}
};

module.exports = AfCommand;