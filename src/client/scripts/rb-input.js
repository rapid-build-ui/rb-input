/***********
 * RB-INPUT
 ***********/
import { PolymerElement, html } from '../../../@polymer/polymer/polymer-element.js';
import validate from './validation.js';
import template from '../views/rb-input.html';

export class RbInput extends PolymerElement {
	/* Lifecycle
	 ************/
	constructor() {
		super();
	}

	connectedCallback() {
		super.connectedCallback();
		this._focusListener = this._setFocus.bind(this);
		this._blurListener = this._removeFocus.bind(this);
		this._rbInput = this.root.querySelector('.rb-input');
		this._input = this.root.querySelector('input');
		this._input.addEventListener('focus', this._focusListener);
		this._input.addEventListener('blur', this._blurListener);

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
	_setFocus(e) {
		this._displayLabelAbove();
		this._rbInput.classList.add("active");
	}

	_removeFocus(e) {
		if (this.value == undefined || this.value.length == 0)
			this._rbInput.classList.remove("label-above");
		this._rbInput.classList.remove("active");
	}

	_valueChanged(newValue, oldValue) {

	}

	_displayLabelAbove() {
		this._rbInput.classList.add("label-above");
	}

	/* Template
	 ***********/
	static get template() { // :string
		return html template;
	}
}

customElements.define('rb-input', RbInput);
