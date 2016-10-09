#!/usr/bin/env node
'use strict';

const fs = require('fs');
const ncp = require('ncp').ncp;
ncp.limit = 16;

const CURRENT_PATH = process.cwd() + '/';
const WORKING_PATH = __dirname + '/';
const TEMPLATE_PATH = WORKING_PATH + 'template-files/';
const DATA_PATH = WORKING_PATH + 'data/';

const PACKAGE_JSON = 'package.json';
const CONFIG_DATA = 'config.ts';
const ENV_DATA = 'env';
const TEST_DATA = 'test.ts';
const ENV_LIST = ['dev', 'alpha', 'beta', 'production']

const mkdir = function(path, mask) {
	if (!mask) mask = '0744';
	return new Promise((resolve, reject) => {
		fs.mkdir(path, mask, function(err) {
			if (err) {
				if (err.code === 'EEXIST') resolve();
				else reject(err);
			} else resolve();
		})
	});
};
const readFile = function(file) {
	return new Promise((resolve, reject) => {
		fs.readFile(file, 'utf8', function (err,data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};
const writeFile = function(file, data) {
	return new Promise((resolve, reject) => {
		fs.writeFile(file, data, function (err,data) {
			if (err) {
				reject(err);
			}
			resolve(true);
		});
	});
};
const parseArgv = function(argv) {
	let argvData = {};
	argv.forEach(arg => {
		if (arg.startsWith('--') && arg.indexOf('=') > 2) {
			arg = arg.slice(2);
			const tmp = arg.split('=');
			argvData[tmp[0]] = tmp[1];
		}
	});
	return argvData;
};
const copyTemplateFiles = function(originalFolder, destinationFolder) {
	return new Promise((resolve, reject) => {
		ncp(originalFolder, destinationFolder, function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(true);
			}
		});
	});
};

let argv = process.argv.slice(2);
const project = argv[0];
let appName = project;
argv = parseArgv(argv.slice(1));
if (argv.name && argv.name.length > 0) {
	appName = argv.name;
}

const PROJECT_PATH = CURRENT_PATH + project + '/';

// Create project folder
mkdir(PROJECT_PATH)
.then(() => {
	console.log('Create porject folder success.');

	// Copy all template files
	return copyTemplateFiles(TEMPLATE_PATH, PROJECT_PATH);
})
.then(success => {
	console.log('Copy template file: ' + success);

	// Create package.json
	return readFile(DATA_PATH + PACKAGE_JSON);
})
.then(data => {
	let packageJson = JSON.parse(data);
	packageJson.name = project;
	return writeFile(PROJECT_PATH + PACKAGE_JSON, JSON.stringify(packageJson, null, 2));
})
.then(success => {
	console.log('Creating package.json: ' + success);

	// Create config.ts
	return readFile(DATA_PATH + CONFIG_DATA);
})
.then(data => {
	// Replace appName
	data = data.replace(/<%=appName%>/g, appName);
	return writeFile(PROJECT_PATH + 'src/server/config/' + CONFIG_DATA, data);
})
.then(success => {
	console.log('Creating config.ts: ' + success);

	// Create testing files
	return readFile(DATA_PATH + TEST_DATA);
})
.then(data => {
	// Replace appName
	data = data.replace(/<%=appName%>/g, appName);
	return writeFile(PROJECT_PATH + 'src/server/config/env/' + TEST_DATA, data);
})
.then(success => {
	console.log('Creating test.ts: ' + success);

	// Create all env files
	return readFile(DATA_PATH + ENV_DATA);
})
.then(data => {
	// Replace appName
	data = data.replace(/<%=appName%>/g, appName);
	// Generating all env data
	let envData = {};
	let promiseList = [];
	ENV_LIST.forEach(env => {
		envData[env] = data.replace(/<%=env%>/g, env);
		promiseList.push(writeFile(PROJECT_PATH + 'src/server/config/env/' + env + '.ts', envData[env]));
	});

	return Promise.all(promiseList);
})
.then(success => {
	console.log('Creating all env files: ' + success);
	console.log('Done!!!');
})
.catch(err => {
	console.error(err);
});
