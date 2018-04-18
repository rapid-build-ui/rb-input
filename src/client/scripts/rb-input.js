/***********
 * RB-INPUT
 ***********/
import { PolymerElement, html } from '../../../@polymer/polymer/polymer-element.js';
import validate from './validation.js';
import template from '../views/rb-input.html';
import type from './type.js';
import validationMessages from './validation-messages.js';


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

		if (this.value != undefined && this.value.length > 0)
			this._displayLabelAbove();
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
				value: {}
			},
			dirty: {
				type: Boolean,
				value: false
			},
			blured: {
				type: Boolean,
				value: false
			},
			valid: {
				type: Boolean,
				value: true
			}

		}
	}

	/* Computed Bindings
	 ********************/
	_right(right) { // :string
		return right ? 'right' : null;
	}

	/* Event Handlers
	 *****************/
	 //on focus
	_onFocus(e) {
		this._displayLabelAbove();
		this._rbInput.classList.add("active");
	}

	//on blur
	_onBlur(e) {
		if (this.value == undefined || this.value.length == 0)
			this._rbInput.classList.remove("label-above");
		this._rbInput.classList.remove("active");

		if (this.dirty){
			this.blured = true;
			this._validate()
		}
	}

	_valueChanged(newValue, oldValue) {
		if (newValue != oldValue)
			this.dirty = true

		if (!this.blured) return;

		if (this.dirty)
			this._validate()
	}

	_displayLabelAbove() {
		this._rbInput.classList.add("label-above");
	}

	_validate() {
		let valid = true;
		for (const [i, item] of eval(this.validation).entries()) {
			if (!item) break;
			if (!valid) break;

			if (type.is.function(item)){ //custom validation
				var funcOut = item(this.value);
				valid = funcOut.valid
				if (!valid)
					this._subtext = funcOut.message;
			}
			else if (type.is.object(item)) { //validation with params object
				let key = Object.keys(item)[0]
				valid = validate[key](this.value, item[key]);
				if (!valid)
					this._subtext = validationMessages[key] + item[key]
			}
			else {//simple validation
				valid = validate[item](this.value);
				if (!valid)
					this._subtext = validationMessages[item]
			}



		}
		if (valid) this._subtext = this.subtext;
		if (!valid) return this._rbInput.classList.add("error");
		this._rbInput.classList.remove("error");
	}

	_validateCustom() {

	}

	/* Template
	 ***********/
	static get template() { // :string
		return html template;
	}
}

customElements.define('rb-input', RbInput);
