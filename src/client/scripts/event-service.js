/*************************************************
 * EVENT SERVICE
 *************************************************
 * How To Use (import then call in constructor):
 - import EventService from './event-service.js';
 - this.rbEvent = EventService.call(this);
 *************************************************/
import { emit } from '../../../skatejs/dist/esnext/emit.js';

const Helpers = {
	getEvents(event) { // :string[]
		return event.replace(/\s+/g,' ').split(' ');
	},
	handleEventListener(action, target, event, callback) { // :void
		action = action === 'add' ? 'addEventListener' : 'removeEventListener';
		if (!Array.isArray(target)) return target[action](event, callback);
		if (!target.length) return;
		for (const elm of target) elm[action](event, callback);
	}
};

const EventService = function() { // :{} (this = consumer's module)
	/* Private
	 **********/
	const Events = {};

	/* Public API
	 *************/
	return {
		add: (target, namespace, event, cbName) => { // :void (space separated events)
			const events = Helpers.getEvents(event);
			for (let event of events) {
				if (!Events[namespace]) Events[namespace] = {};
				if (!Events[namespace][event]) Events[namespace][event] = {};
				if (!Events[namespace][event][cbName]) // bind to module
					Events[namespace][event][cbName] =
						target === this ? this[cbName] : this[cbName].bind(this);
				const callback = Events[namespace][event][cbName];
				Helpers.handleEventListener('add', target, event, callback);
			}
			// console.log(Events)
		},
		remove: (target, namespace, event, cbName) => { // :void (space separated events)
			const events = Helpers.getEvents(event);
			for (let event of events) {
				if (!Events[namespace]) return;
				if (!Events[namespace][event]) return;
				if (!Events[namespace][event][cbName]) return;
				const callback = Events[namespace][event][cbName];
				delete Events[namespace][event][cbName];
				if (!Object.keys(Events[namespace][event]).length) delete Events[namespace][event];
				if (!Object.keys(Events[namespace]).length) delete Events[namespace];
				Helpers.handleEventListener('remove', target, event, callback);
			}
			// console.log(Events)
		},
		emit: (target, event, opts={}) => { // :boolean
			return emit(target, event, opts); // returns elm.dispatchEvent(e)
		},
		getEvents: () => { // :{}
			return Events;
		}
	};
};

/* Export it!
 *************/
export default EventService;