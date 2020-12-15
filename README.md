#	ant-finger
__Manage your favorite command lines.__

[![total downloads of ant-finger](https://img.shields.io/npm/dt/ant-finger.svg)](https://www.npmjs.com/package/ant-finger)
[![ant-finger's License](https://img.shields.io/npm/l/ant-finger.svg)](https://www.npmjs.com/package/ant-finger)
[![latest version of ant-finger](https://img.shields.io/npm/v/ant-finger.svg)](https://www.npmjs.com/package/ant-finger)
[![coverage status of github.com/YounGoat/nodejs.antfin](https://coveralls.io/repos/github/YounGoat/nodejs.antfin/badge.svg?branch=master)](https://coveralls.io/github/YounGoat/nodejs.antfin2?branch=master)
[![build status of github.com/YounGoat/nodejs.antfin](https://travis-ci.org/YounGoat/nodejs.antfin.svg?branch=master)](https://travis-ci.org/YounGoat/nodejs.antfin)
[![star github.com/YounGoat/nodejs.antfin](https://img.shields.io/github/stars/YounGoat/nodejs.antfin.svg?style=social&label=Star)](https://github.com/YounGoat/nodejs.antfin/stargazers)

This tool will create a command named "af" which means "ant fingers". It helps you manage your favorite commands, and apply them easily on demand.

##	Links

*	[CHANGE LOG](./CHANGELOG.md)
*	[Homepage](https://github.com/YounGoat/nodejs.antfin)

##	Get Started

```bash
npm install -g ant-finger 
# Install the tool.
# A global command `af` will be created.

af help <SUB_COMMAND>
# Show help info of specified sub command.

af list
# List all saved commands.

af remove
# Remove saved command(s).

af rename
# Rename saved command.

af run [ <NAME> ]
af run [ --name ] <NAME>
# Run saved command.

af save [ <COMMAND> <ARGS> ]
# Save your favorite command.
```
