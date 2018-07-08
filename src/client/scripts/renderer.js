/***********
 * RENDERER (@skatejs/renderer-lit-html)
 ***********/
import { html, render } from '../../../lit-html/lib/lit-extended.js';

const withRenderer = (Base = HTMLElement) => class extends Base {
	renderer(root, call) {
		render(call(), root);
	}
};

export { html, withRenderer }