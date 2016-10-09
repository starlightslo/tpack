/// <reference path="../../../../typings/tsd.d.ts" />
'use strict';

const fs = require('fs');

class Utils {
	static ensureExists(path, mask) {
		return new Promise((resolve, reject) => {
			fs.mkdir(path, mask, function(err) {
				if (err) {
					if (err.code == 'EEXIST') resolve();
					else reject(err);
				} else resolve();
			})
		});
	}

	static generateRandomString(length: number) {
		return require("randomstring").generate(length);
	}
}

export { Utils }