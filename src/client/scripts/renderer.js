/***********
 * RENDERER (@skatejs/renderer-lit-html)
 ***********/
import { html, render } from '../../../lit-html/lib/lit-extended.js';

const withRenderer = (Base = HTMLElement) => class extends Base {
	renderer(root, call) {
		render(call(), root);
		// custom only executed after initial render
		if (this.isViewReady || !this.isConnected) return;
		this.isViewReady = true;
		this.viewReady && this.viewReady();
	}
};

export { html, withRenderer }