/***********
 * RB-INPUT
 ***********/
import { props, html, RbBase } from '../../rb-base/scripts/rb-base.js';
import FormControl from '../../form-control/scripts/form-control.js';
import '../../rb-icon/scripts/rb-icon.js';
import template from '../views/rb-input.html';

export class RbInput extends FormControl(RbBase()) {
	/* Lifecycle
	 ************/
	viewReady() { // :void
		super.viewReady && super.viewReady();
		this.rb.elms.focusElm = this.shadowRoot.querySelector('input');
		this.rb.elms.formControl = this.rb.elms.focusElm
	}

	/* Properties
	 *************/
	static get props() { // :object
		return {
			...super.props,
			iconKind: props.string,
			iconSource: props.string,
			iconPosition: props.string,
			inline: props.boolean,
			kind: props.string,
			label: props.string,
			placeholder: props.string,
			right: props.boolean,
			readonly: props.boolean,
			subtext: props.string,
			type: props.string,
			value: props.string,
			_blurred: props.boolean,
			_active: props.boolean,
			_dirty: props.boolean
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
