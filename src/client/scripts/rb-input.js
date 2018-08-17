/***********
 * RB-INPUT
 ***********/
import { props, withComponent } from '../../../skatejs/dist/esnext/index.js';
import { html, withRenderer } from './renderer.js';
import EventService from './event-service.js';
import Validation from './validation/validation.js';
import type from './type.js';

import validationMessages from './validation/messages.js';
import '../../rb-icon/scripts/rb-icon.js';
import template from '../views/rb-input.html';

export class RbInput extends withComponent(withRenderer()) {
	/* Lifecycle
	 ************/
	constructor() {
		super();
		this.rbEvent = EventService.call(this);
		Validation.onFormSubmit.call(this);
	}

	viewReady() {
		Validation.append.call(this)
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
			name: Object.assign({}, props.string, {
				default: Math.round((Math.random() * 36 ** 5)).toString(36)
			}),
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

	_onchange(e) {
		if (!this._hiddenInput) return;
		this._hiddenInput.value = this.value;
	}

	async _oninput(e) { // TODO: add debouncing
		const oldVal = this.value;
		const newVal = e.target.value;
		this.value = newVal;
		if (!this._dirty && newVal !== oldVal)
			return this._dirty = true;
		if (!this._blurred) return;

		await Validation.validate.call(this);
	}
	async _onblur(e) {
		this._active = false;
		if (!this._dirty) return;
		this._blurred = true;
		this.value = e.target.value;
		await Validation.validate.call(this);
	}

	/* Template
	 ***********/
	render({ props }) { // :string
		return html template;
	}
}

customElements.define('rb-input', RbInput);
