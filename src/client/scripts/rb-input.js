/***********
 * RB-INPUT
 ***********/
import { PolymerElement, html } from '../../../@polymer/polymer/polymer-element.js';
import validate from './validation.js';
import template from '../views/rb-input.html';
import type from './type.js';
import validationMessages from './validation-messages.js';
import '../../rb-icon/scripts/rb-icon.js';

export class RbInput extends PolymerElement {
	/* Lifecycle
	 ************/
	constructor() {
		super();
	}

	connectedCallback() {
		super.connectedCallback();
		this._focusListener = this._onFocus.bind(this);
		this._blurListener = this._onBlur.bind(this);
		this._rbInput = this.root.querySelector('.rb-input');
		this._input = this.root.querySelector('input');
		this._input.addEventListener('focus', this._focusListener);
		this._input.addEventListener('blur', this._blurListener);
		this._subtext = this.subtext;

		if (!!this.label)
			this._rbInput.classList.add("with-label");

		if ((this.value != undefined && this.value.length > 0) || !!this.placeholder)
			this._displayLabelAbove();

		if (!!this.placeholder)
			this._addPlaceholder()
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._input.removeEventListener('focus', this._focusListener);
	}

	/* Properties
	 *************/
	static get properties() {
		return {
			kind: {
				type: String,
				value: 'default'
			},
			label: {
				type: String
			},
			value: {
				type: String,
				notify: true,
				observer: '_valueChanged'
			},
			disabled: {
				type: Boolean,
				value: false
			},
			right: {
				type: Boolean,
				value: false
			},
			subtext: {
				type: String
			},
			validation: {
				type: Object,
			},
			dirty: {
				type: Boolean,
				value: false
			},
			blured: {
				type: Boolean,
				value: false
			},
			placeholder: {
				type: String
			},
			icon: {
				type: String
			},
			iconSource: {
				type: String
			},
			iconPosition: {
				type: String
			},
			inline: {
				type: Boolean,
				value: false
			},
			type: {
				type: String,
				value: 'text'
			}
		}
	}

	/* Computed Bindings
	 ********************/
	_right(right) { // :string
		return right ? 'right' : null;
	}

	_inline(inline) {
		return inline ? 'inline' : null;
	}


	_setSubtext(subtext) { // :string
		return subtext ? 'subtext' : null;
	}

	_iconPosition(position, icon) {
		console.log(!!icon, !!position)
		if (!!this.icon && !!position)
			return 'icon-left';

		if (!!this.icon)
			return 'icon-right';
	}

	/* Event Handlers
	 *****************/
	_onFocus(e) {
		this._displayLabelAbove();
		this._rbInput.classList.add("active");
	}

	_onBlur(e) {
		if (!!this.placeholder)
			return;
		if (this.value == undefined || this.value.length == 0)
			this._rbInput.classList.remove("label-above");
		this._rbInput.classList.remove("active");

		if (this.dirty){
			this.blured = true;
			this._validate()
		}
	}

	_valueChanged(newValue, oldValue) {
		if (!newValue && (this.root.activeElement !== this._input))
			this._rbInput.classList.remove("label-above");
		else if (!!newValue)
			this._displayLabelAbove()

		if (newValue != oldValue)
			this.dirty = true

		if (!this.blured) return;

		if (this.dirty)
			this._validate()
	}

	_displayLabelAbove() {
		if (!this._rbInput) return;
		this._rbInput.classList.add("label-above");
	}

	_addPlaceholder() {
		this._input.setAttribute('placeholder', this.placeholder);
	}

	async _validate() {
		if (!this.validation) return;
		let valid = true;
		for (const [i, validator] of eval(this.validation).entries()) {
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
		if (valid) this._subtext = this.subtext;
		if (!valid) return this._rbInput.classList.add("error");
		this._rbInput.classList.remove("error");
	}

	_validateSimple(validator) {
		let out = validate[validator](this.value);
		if (!out.valid)
			this._subtext = out.message;
		return out.valid;
	}

	_validateObject(validator) {
		let key = Object.keys(validator)[0]
		let out = validate[key](this.value, validator[key]);
		if (!out.valid)
			this._subtext = out.message;

		return out.valid;
	}

	async _validateCustom(validator) {
		let funcOutput = await validator(this.value);
		let valid = funcOutput.valid
		if (!valid) this._subtext = funcOutput.message;
		return valid;
	}

	/* Template
	 ***********/
	static get template() { // :string
		return html template;
	}
}

customElements.define('rb-input', RbInput);
