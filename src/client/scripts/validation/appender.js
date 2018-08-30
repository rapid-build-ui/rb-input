
import Validation from './validation.js';


const appender = function() {
	this._input = this.shadowRoot.querySelector('input');
	this._form = this.closest('form');
	if (!this._form) return;
	this._hiddenInput = document.createElement('input');
	this._hiddenInput.setAttribute('hidden', true);
	this._hiddenInput.setAttribute('name', this._input.name);
	this._form.appendChild(this._hiddenInput);

	this._hiddenInput.addEventListener('invalid', (event) => {
		event.preventDefault();
	});
}


/* Export it!
 *************/
export default appender;