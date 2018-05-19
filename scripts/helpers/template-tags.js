/* TEMPLATE TAGS HELPER
 ***********************/
const stripAnsi = require('strip-ansi');

// Helpers
const Helpers = {
	separate(literals, exps, opts={}) { // :string
		let separator;
		let template  = this.tag(literals, exps);
			template  = Tags.unindent`${template}`;
		let sepLength = 0;
		let lines     = template.split('\n').map(val => stripAnsi(val));
		for (const line of lines) {
			let lineLength = line.length;
			if (lineLength <= sepLength) continue;
			sepLength = lineLength + 1;
		}
		if (sepLength === 0) return template;
		separator = Array(sepLength).join('-');
		switch (opts.position) {
			case 'above': return `${separator}\n${template}`
			case 'below': return `${template}\n${separator}`
			default:      return `${separator}\n${template}\n${separator}`
		}
	},
	tag(literals, exps) { // :string
		let template = [];
		for (const [i, literal] of literals.entries()) {
			let string = exps[i] ? literal + exps[i] : literal;
			template.push(string);
		}
		template = template.join('');
		return template;
	}
}

/* API (all return string)
 ******/
const Tags = {
	unindent(literals, ...exps) {
		let template = Helpers.tag(literals, exps);
			template = template.replace(/\t/g, '');
			template = template.trim();
		return template;
	},
	/* separators
	 *************/
	overline(literals, ...exps) {
		return Helpers.separate(literals, exps, { position: 'above' });
	},
	separate(literals, ...exps) {
		return Helpers.separate(literals, exps);
	},
	underline(literals, ...exps) {
		return Helpers.separate(literals, exps, { position: 'below' });
	}
}

/* Export It!
 *************/
module.exports = Tags;