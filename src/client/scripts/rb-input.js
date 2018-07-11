/***********
 * RB-INPUT
 ***********/
import { props, withComponent } from '../../../skatejs/dist/esnext/index.js';
import { html, withRenderer } from './renderer.js';
import EventService from './event-service.js';
import validate from './validation.js';
import type from './type.js';
import validationMessages from './validation-messages.js';
import '../../rb-icon/scripts/rb-icon.js';
import template from '../views/rb-input.html';

export class RbInput extends withComponent(withRenderer()) {
	/* Lifecycle
	 ************/
	constructor() {
		super();
		this.rbEvent = EventService.call(this);
	}

	/* Properties
	 *************/
	static get props() {
		return {
			disabled: props.boolean,
			icon: props.string,
			iconSource: props.string,
			iconPosition: props.string,
			inline: props.boolean,
			kind: props.string,
			label: props.string,
			placeholder: props.string,
			right: props.boolean,
			subtext: props.string,
			type: props.string,
			value: props.string,
			validation: Object.assign({}, props.array, {
				// support for custom functions
				deserialize(val) { return eval(val); }
			}),
			_eMsg: props.string,
			_blurred: props.boolean,
			_active: props.boolean,
			_dirty: props.boolean,
			_valid: Object.assign({}, props.boolean, {
				default: true
			})
		}
	}

	/* Observer
	 ***********/
	updating(prevProps) { // :void
		if (prevProps.value === this.value) return;
		this.rbEvent.emit(this, 'value-changed', {
			detail: { value: this.value }
		});
	}

	/* Event Handlers
	 *****************/
	_onfocus(e) {
		this._active = true;
	}
	async _oninput(e) { // TODO: add debouncing
		const oldVal = this.value;
		const newVal = e.target.value;
		this.value = newVal;
		if (!this._dirty && newVal !== oldVal)
			return this._dirty = true;
		if (!this._blurred) return;
		if (!this.validation.length) return;
		await this._validate();
	}
	async _onblur(e) {
		this._active = false;
		if (!this._dirty) return;
		this._blurred = true;
		this.value = e.target.value;
		if (!this.validation.length) return;
		await this._validate();
	}

	/* Validation
	 *************/
	async _validate() { // :void
		let valid = true;
		for (const validator of this.validation) {
			if (!validator) break;
			if (!valid) break;
			switch(true) {
				case type.is.function(validator):
					valid = await this._validateCustom(validator)
					break;
				case type.is.object(validator):
					valid = this._validateObject(validator);
					break;
				default:
					valid = this._validateSimple(validator);
			}
		}
		if (valid) this._eMsg = '';
		this._valid = valid;
	}

	_validateSimple(validator) { // :boolean
		const out = validate[validator](this.value);
		if (!out.valid) this._eMsg = out.message;
		return out.valid;
	}

	_validateObject(validator) { // :boolean
		const key = Object.keys(validator)[0]
		const out = validate[key](this.value, validator[key]);
		if (!out.valid) this._eMsg = out.message;
		return out.valid;
	}

	async _validateCustom(validator) { // :boolean (validator is function)
		let out = await validator(this.value);
		if (!out.valid) this._eMsg = out.message;
		return out.valid;
	}

	/* Template
	 ***********/
	render({ props }) { // :string
		return html template;
	}
}

customElements.define('rb-input', RbInput);
