/*********************
 * VALIDATION SERVICE
 *********************/
import { props } from '../../../rb-base/scripts/rb-base.js';
import type from '../../../rb-base/scripts/type-service.js';
import validate from './validators.js'

const Validation = superClass => class extends superClass {
	/* Lifecycle
	 ************/
	viewReady() {
		super.viewReady && super.viewReady();
		if (!this.validation.length) return;
		this._onFormSubmit()
		this._addHiddenInput()
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (!this.validation.length) return;
		this._removeHiddenInput();
	}

	/* Properties
	 *************/
	static get props() {
		return {
			...super.props,
			_eMsg: props.string,
			_valid: Object.assign({}, props.boolean, {
				default: true
			}),
			validation: Object.assign({}, props.array, {
				// support for custom functions
				deserialize(val) { return eval(val); }
			})
		}
	}

	async validate() { // :void
		if (!this.validation.length) return;
		let valid = true;
		for (const validator of this.validation) {
			if (!validator) break;
			if (!valid) break;
			switch(true) {
				case type.is.function(validator):
					valid = await this._validateCustom.call(this, validator)
					break;
				case type.is.object(validator):
					valid = this._validateObject.call(this, validator);
					break;
				default:
					valid = this._validateSimple(validator);
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

	_onFormSubmit() {
		this._form = this.closest('form');
		if (!this._form) return;

		this._form.addEventListener('submit', (event) => {
			if (!this.validation) return;
			validate.call(this);
			if (this._form.checkValidity()) return
			event.preventDefault()
		});
	}

	_validateSimple(validator) { // :boolean
		const out = validate[validator](this.value);
		if (!out.valid) {
			this._eMsg = out.message;
			this._input.setCustomValidity(out.message)
			if (!!this._form) this._form.checkValidity()
		}
		return out.valid;
	}

	_validateObject(validator) { // :boolean
		const key = Object.keys(validator)[0]
		const out = validate[key](this.value, validator[key]);
		if (!out.valid) {
			this._eMsg = out.message;
			this._input.setCustomValidity(out.message)
		}
		return out.valid;
	}

	async _validateCustom(validator) { // :boolean (validator is function)
		let out = await validator(this.value);
		if (!out.valid) {
			this._eMsg = out.message;
			this._input.setCustomValidity(out.message)
		}
		return out.valid;
	}

	_addHiddenInput() {
		this._input = this.shadowRoot.querySelector('input');
		this._form = this.closest('form');
		if (!this._form) return;
		this._hiddenInput = document.createElement('input');
		this._hiddenInput.setAttribute('hidden', true);
		this._hiddenInput.setAttribute('name', this.name);
		this._form.appendChild(this._hiddenInput);

		this._hiddenInput.addEventListener('invalid', (event) => {
			event.preventDefault();
		});
	}

	_removeHiddenInput() {
		if (!this._hiddenInput) return;
		this._hiddenInput.remove()
	}
}
/* Export it!
 *************/
export default Validation;