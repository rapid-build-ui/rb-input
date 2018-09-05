/***********
 * RB-INPUT
 ***********/
import { props, html, RbBase } from '../../rb-base/scripts/rb-base.js';
import Validation from './validation/validation.js';
import '../../rb-icon/scripts/rb-icon.js';
import template from '../views/rb-input.html';

export class RbInput extends Validation(RbBase()) {
	/* Lifecycle
	 ************/
	constructor() {
		super();
		this.name = this.props.name || this.rb.guid.create(5);
	}

	/* Properties
	 *************/
	static get props() {
		return {
			...super.props,
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
			_blurred: props.boolean,
			_active: props.boolean,
			_dirty: props.boolean,

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

		await this.validate();
	}
	async _onblur(e) {
		this._active = false;
		if (!this._dirty) return;
		this._blurred = true;
		this.value = e.target.value;
		await this.validate();
	}

	/* Template
	 ***********/
	render({ props }) { // :string
		return html template;
	}
}

customElements.define('rb-input', RbInput);
