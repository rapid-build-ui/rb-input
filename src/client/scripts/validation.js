/*********************
 * Validation Service
 *********************/
import type from './type.js';
import message from './validation-messages.js'

/* Helpers (all return boolean)
 **********/
const Help = {
	arrayRequired(val, params) {
		var fn, isValid, item, j, len;
		isValid = false;
		if (!val) return isValid;
		if (params.generalArray) return !!val.length;
		fn = item => {
			if (!item.selected) return;
			return isValid = true;
		};
		for (j = 0, len = val.length; j < len; j++) {
			item = val[j];
			fn(item);
		}
		return isValid;
	},

	stringRequired(val) {
		return !!val || val === 0;
	},

	arrayMaxLength(val, params, lengthKey='length') {
		var count, fn, item, j, len;
		if (!val) return false;
		if (params.generalArray)
			return val.length <= params[lengthKey];
		count = 0;
		fn = item => {
			if (!item.selected) return;
			return count++;
		};
		for (j = 0, len = val.length; j < len; j++) {
			item = val[j];
			fn(item);
		}
		return count <= params[lengthKey];
	},

	arrayMinLength(val, params, lengthKey='length') {
		var count, fn, item, j, len;
		if (!val) return false;
		if (params.generalArray)
			return val.length >= params[lengthKey];
		count = 0;
		fn = item => {
			if (!item.selected) return;
			return count++;
		};
		for (j = 0, len = val.length; j < len; j++) {
			item = val[j];
			fn(item);
		}
		return count >= params[lengthKey];
	},

	stringMaxLength(val, params, lengthKey='length') {
		var char, j, len, ref, regEx;
		if (!val) return true;
		if (params['ignoreSpecChars']) {
			if (params['specChar']) {
				ref = params['specChar'];
				for (j = 0, len = ref.length; j < len; j++) {
					char = ref[j];
					regEx = new RegExp("" + char, "g");
					val = val.replace(regEx, '');
				}
			}
			if (!params['specChar']) {
				if (params['ignoreSpecChars']) {
					val = val.replace(/\W/gi, '');
				}
			}
		}
		return val.toString().trim().length <= params[lengthKey];
	},

	stringMinLength(val, params, lengthKey='length') {
		var char, j, len, ref, regEx;
		if (!val) return true;
		if (params['ignoreSpecChars']) {
			if (params['specChar']) {
				ref = params['specChar'];
				for (j = 0, len = ref.length; j < len; j++) {
					char = ref[j];
					regEx = new RegExp("" + char, "g");
					val = val.replace(regEx, '');
				}
			}
			if (!params['specChar']) {
				if (params['ignoreSpecChars']) {
					val = val.replace(/\W/gi, '');
				}
			}
		}
		return val.toString().trim().length === 0 ||
			  type.is.object(params) ? val.toString().trim().length >= params[lengthKey] : val.toString().trim().length >= params;
	},

	setMinMaxMsgParams(params, minOrMax) {
		params.minOrMaxMsgText = minOrMax === 'min' ? 'Minimum' : 'Maximum';
		return params.minOrMaxMsgNum = minOrMax === 'min' ? params.min : params.max;
	}
}

/* API (all return boolean)
 ******/
const Validation = {
	charset1(val) {
		if (!val) return true;
		return /^[a-zA-Z0-9-',. ]+$/.test(val);
	},

	charset2(val) {
		if (!val) return true;
		return /^[a-zA-Z0-9-. _]+$/.test(val);
	},

	charset3(val) {
		if (!val) return true;
		return /^[a-zA-Z-'. ]+$/.test(val);
	},

	currency(val) {
		if (!val) return true;
		return /^[-]?\d{1,9}(\.\d{1,2})?$/.test(val);
	},


	date(val) {
		if (!val || type.is.undefined(val)) return true;
		// return dateService.isValidDate(val);
		return true; // TODO: create dateService.isValidDate()
	},

	dateRange(val, params) {
		// if ((type.is.undefined(val)) || !val || !dateService.isValidDate(val))
		if ((type.is.undefined(val)) || !val) // TODO: create dateService.isValidDate()
			return true;
		if (!params.fromDate || !params.thruDate)
			return true;
		// return dateService.withinRange(val, params.fromDate, params.thruDate);
		return true; // TODO: create dateService.withinRange()
	},

	email(val) {
		if (!val) return true;
		return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val);
	},

	fax(val) {
		return this.phone(val);
	},

	integer(val, params={}) {
		var re;
		if (!val) return true;
		re = params.positive ? /^\d*$/ : /^\-?\d*$/;
		return re.test(val);
	},

	maxLength(val, params) {
		return type.is.array(val) ?
			Help.arrayMaxLength(val, params) :
			Help.stringMaxLength(val);
	},

	minLength(val, params) {
		return type.is.array(val) ?
			{
				valid: Help.arrayMinLength(val, params),
				message: `${message['minLength']} is ${params}`
			}
			:
			{
				valid: Help.stringMinLength(val, params),
				message: `${message['minLength']} ${params}`
			}
	},

	minMaxLength(val, params) {
		var flag = true;
		var output = {}
		if (type.is.array(val)) {
			flag = Help.arrayMinLength(val, params, 'min');
			if (flag) {
				flag = Help.arrayMaxLength(val, params, 'max');
			}
		} else {
			flag = Help.stringMinLength(val, params, 'min');
			if (flag) {
				flag = Help.stringMaxLength(val, params, 'max');
			}
		}
		output.valid = flag;
		if (!flag)
			output.message = `${message['minMaxLength']} ${params.min} and ${params.max}`

		return output;
	},

	name(val) {
		if (!val) return true;
		return /^[a-zA-Z-',. ]+$/.test(val);
	},

	noDups(val, params={}) {
		if (!val) return true;
		if (!type.is.array(val)) return true;
		// return !new Collection(val).hasDups(params.exclude);
		return false; // TODO: create Collection.hasDups();
	},

	number(val, params={}) {
		var re;
		if (!val) return true;
		re = params.positive ? /^\d+\.?\d*$/ : /^\-?\d+\.?\d*$/;
		return {
					valid: re.test(val),
					message: 'not a valid number'
				}
	},

	password(val) {
		if (!val) return true;
		return val.length >= 8 && val.length <= 15 && /[A-Z]/.test(val) && /[a-z]/.test(val) && /[0-9]/.test(val) && !/['" ]+/.test(val);
	},

	phone(val) {
		if (!val) return true;
		if (/[\W]|\_/.test(val)) return false;
		return /^[0-9]{10}$/.test(val);
	},

	phoneExt(val, params={}) {
		if (!val) return true;
		if (type.is.undefined(params.length))
			params.length = 5;
		return this.maxLength(val, params);
	},

	range(val, params) {
		if (!this.number(val)) return {valid: true};
		if (!val) return {valid: true};
		return {
			valid: (this.number(val)) && (val >= params.min) && (val <= params.max),
			message: `${message['range']} ${params.min} and ${params.max}`
		}
	},

	regEx(val, params) {
		if (!val) return true;
		return {valid: val.match(params)};
	},

	required(val, params) {
		return {
					valid: type.is.array(val) ?
						Help.arrayRequired(val, params) :
						Help.stringRequired(val),
					message: `${message['required']}`
				}

	},

	validCharset(val, params) {
		var char, chars, code, i, invalids, valids;
		if (!val) return true;
		if (!type.is.string(val)) return true;
		chars = val.split('');
		valids = [9, 10, 11];
		invalids = {};
		for (i in chars) {
			char = chars[i];
			code = char.charCodeAt(0);
			if (code >= 32 && code <= 126 || valids.indexOf(code) !== -1)
				continue;
			invalids[char] = code;
		}
		invalids = Object.keys(invalids);
		params.invalids = invalids.join('');
		return !invalids.length;
	},

	zip(val) {
		if (!val) return true;
		if (this.integer(val) === false) return false;
		return this.minMaxLength(val, {
			min: 5,
			max: 5
		});
	}
}

/* Export it!
 *************/
export default Validation;