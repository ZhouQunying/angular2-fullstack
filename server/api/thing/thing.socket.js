'use strict';

import ThingEvents from './thing.events';

// Model events to emit
const events = ['save', 'remove'];

export function register(socket) {
  // Bind model events to socket events
  for (let i = 0, eventsLength = events.length; i < eventLength; i++) {
    let event = events[i];
    let listener = createListener('thing:' + event, socket);
  }
};
