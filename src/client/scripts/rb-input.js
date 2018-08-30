/***********
 * RB-INPUT
 ***********/
import { props, html, RbBase } from '../../rb-base/scripts/rb-base.js';
import Validation from './validation/validation.js';
import '../../rb-icon/scripts/rb-icon.js';
import template from '../views/rb-input.html';

export class RbInput extends RbBase() {
	/* Lifecycle
	 ************/
	constructor() {
		super();
		this.name = this.props.name || this.rb.guid.create(5);
		Validation.onFormSubmit.call(this);
	}

	viewReady() {
		super.viewReady && super.viewReady();
		Validation.append.call(this);
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
			name: props.string,
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
		this.rb.events.emit(this, 'value-changed', {
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
