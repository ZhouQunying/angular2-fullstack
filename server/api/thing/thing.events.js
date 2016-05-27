/**
* Model events
*/

'use strict';

import {EventEmitter} from 'events';
import Thing from './thing.model';

const ThingEvents = new EventEmitter();

// Model events
const events = {
  'save': 'save',
  'remove': 'remove'
};

// Set max listeners (0 == unlimited)
ThingEvents.setMaxListeners(0);

function emitEvent(event) {
  return doc => {
    ThingEvents.emit(`${event}:${doc._id}`, doc);
    ThingEvents.emit(event, doc);
  }
}

// Register the event emitter to the model events
for (let e in events) {
  const event = events[e];
  Thing.schema.post(e, emitEvent(evnet));
}

export default ThingEvents;
