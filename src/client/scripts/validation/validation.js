/*********************
 * VALIDATION SERVICE
 *********************/
import validators from './validators.js'
import appender from './appender.js'
import type from '../../../rb-base/scripts/type-service.js';

const Validation = {
	test: validators,
	append: appender,
	validate: _validate,
	onFormSubmit: _onFormSubmit
}

async function _validate() { // :void
	if (!this.validation.length) return;
	let valid = true;
	for (const validator of this.validation) {
		if (!validator) break;
		if (!valid) break;
		switch(true) {
			case type.is.function(validator):
				valid = await _validateCustom.call(this, validator)
				break;
			case type.is.object(validator):
				valid = _validateObject.call(this, validator);
				break;
			default:
				valid = _validateSimple.call(this, validator);
		}
	}
	if (valid) {
		this._eMsg = '';
		this._input.setCustomValidity("")
	}

	this._valid = valid;

	if (!this._hiddenInput) return;

	if (valid) {
		this._hiddenInput.setCustomValidity('')
	} else {
		this._hiddenInput.setCustomValidity('invalid')
	}

}

function _onFormSubmit() {
	this._form = this.closest('form');
	if (!this._form) return;

	this._form.addEventListener('submit', (event) => {
		if (!this.validation) return;
		Validation.validate.call(this);
		if (this._form.checkValidity()) return
		event.preventDefault()
	});
}

function _validateSimple(validator) { // :boolean
	const out = Validation.test[validator](this.value);
	if (!out.valid) {
		this._eMsg = out.message;
		this._input.setCustomValidity(out.message)
		if (!!this._form) this._form.checkValidity()
	}
	return out.valid;
}

function _validateObject(validator) { // :boolean
	const key = Object.keys(validator)[0]
	const out = Validation.test[key](this.value, validator[key]);
	if (!out.valid) {
		this._eMsg = out.message;
		this._input.setCustomValidity(out.message)
	}
	return out.valid;
}

async function _validateCustom(validator) { // :boolean (validator is function)
	let out = await validator(this.value);
	if (!out.valid) {
		this._eMsg = out.message;
		this._input.setCustomValidity(out.message)
	}
	return out.valid;
}

/* Export it!
 *************/
export default Validation;