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
	, AfHistory = noda.inRequire('class/AfHistory')    
	, myutil = noda.inRequireDir('util')
	, o = myutil.output
	;

const RE_VAR = /@AF\{(\w+)(\([^)]+\)|\[[^\]]+\])?\}/;

class AfCommand {
	constructor(options) {
		this._options = options;
	}

	async dryrun() {
		let commands = this._options.commands;
		if (commands) {
			commands.forEach(command => {
				o.blue('af run', command);
			});
			return;
		}
		
		myutil.console.log(`Dry run command ${colors.yellow(this._options.name)}`);
		let parsed = await this._parse();
		let { commandline, argv } = parsed;
		if (argv) {
			o.blue.apply(null, argv);
		}
		if (commandline) {
			o.blue(commandline);
		}
		o();
	}

	async _push2history(parsed) {
		const history = (new AfHistory).load();
		let afinstance = Object.assign({ name: this._options.name }, parsed);
		await history.push(afinstance);
	}
 
	/**
	 * Parse the AntFinger command.
	 * Replace the placeholders and generate real command line or argv.
	 */
	async _parse(raw) {
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
					if (raw) options.default = raw[name];

					if (!enums || enums.length == 0) {
						vars[name] = await myutil.prompt.input(options);
					}
					else if (enums.length == 1) {
						if (!raw) options.default = raw ? raw[name] : enums[0];
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

		const options = this._options;

		if (options.argv) {
			let argv = options.argv.slice(0);
			for (let i = 0; i < argv.length; i++) {
				argv[i] = await fill(argv[i]);
			}
			this._push2history({ argv, vars });
			return { argv };
		}

		if (options.commandline) {
			let commandline = await fill(options.commandline);
			this._push2history({ commandline, vars });
			return { commandline };
		}
	}

	async run(afinstance, amend = false) {
		let commandline, argv;

		if (afinstance && amend) {
			({ commandline, argv } = await this._parse(afinstance.vars));
		}
		else if (afinstance) {
			({ commandline, argv } = afinstance);
		}
		else {
			({ commandline, argv } = await this._parse());
		}
		
		if (argv) {
			let [ command, ...args ] = argv;
			spawn(command, args, { stdio: 'inherit' });
		}
		else {
			spawn('bash', [ '-c', commandline ], { stdio: 'inherit' });
		}
	}
	
	toJson() {
		return this._options;
	}
};

module.exports = AfCommand;