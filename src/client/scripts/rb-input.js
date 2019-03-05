/***********
 * RB-INPUT
 ***********/
import { RbBase, props, html } from '../../rb-base/scripts/rb-base.js';
import FormControl             from '../../form-control/scripts/form-control.js';
import Converter               from '../../rb-base/scripts/public/props/converters.js';
import View                    from '../../rb-base/scripts/public/view/directives.js';
import template                from '../views/rb-input.html';
import '../../rb-icon/scripts/rb-icon.js';
import '../../rb-popover/scripts/rb-popover.js';

export class RbInput extends FormControl(RbBase()) {
	/* Lifecycle
	 ************/
	viewReady() { // :void
		super.viewReady && super.viewReady();
		Object.assign(this.rb.elms, {
			focusElm:    this.shadowRoot.querySelector('input'),
			formControl: this.shadowRoot.querySelector('input')
		});
		this._initSlotStates(); // see rb-base: private/mixins/slot.js
	}

	/* Properties
	 *************/
	static get props() { // :object
		return {
			...super.props,
			inline: props.boolean,
			kind: props.string,
			label: props.string,
			placeholder: props.string,
			right: props.boolean,
			subtext: props.string,
			type: props.string,
			value: props.string,
			_blurred: props.boolean,
			_active: props.boolean,
			_dirty: props.boolean,
			iconFlip: props.string,
			iconKind: props.string,
			iconSpeed: props.number,
			iconRotate: props.number,
			iconSource: props.string,
			iconPosition: props.string,
			iconBurst: Object.assign({}, props.boolean, {
				deserialize: Converter.valueless
			}),
			iconPulse: Object.assign({}, props.boolean, {
				deserialize: Converter.valueless
			}),
			iconSpin: Object.assign({}, props.boolean, {
				deserialize: Converter.valueless
			}),
			readonly: Object.assign({}, props.boolean, {
				deserialize: Converter.valueless
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
	render({ props, state }) { // :string
		return html template;
	}
}

customElements.define('rb-input', RbInput);
