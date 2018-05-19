/********************************
 * TRAVIS CONTINUOUS BUILD STEPS
 ********************************/
const util     = require('util');
const request  = require('request');
const post     = util.promisify(request.post);
const template = require('../../helpers/template-tags');

/* Loggers
 **********/
const log   = console.log.bind(console);
const info  = console.info.bind(console);
const error = console.error.bind(console);

/* Steps
 ********/
const Steps = paths => { // :{}
	return {
		triggerShowcaseBuild(TRAVIS_TOKEN, REPO_NAME) { // :Promise{} (runs asynchronously)
			info();
			info(template.underline`begin showcase build trigger`.toUpperCase().alert);
			const url  = 'https://api.travis-ci.org/repo/rapid-build-ui%2Frapid-build-ui.io/requests';
			const opts = {
				url,
				json: true,
				headers: {
					'travis-api-version': 3,
					'authorization': `token ${TRAVIS_TOKEN}`
				},
				body: {
					request: {
						branch:  'continuous',
						message: `REBUILD TRIGGERED FROM - ${REPO_NAME}`
					}
				}
			};
			return post(opts).then(results => {
				info(`✔ showcase build triggered`.toUpperCase().success);
				return results;
			}).catch(e => {
				error(template.underline`error: triggering showcase build`.toUpperCase().error);
				error(e);
				process.exit(1);
				return e;
			});
		}
	};
};

/* Export It!
 *************/
module.exports = Steps;
