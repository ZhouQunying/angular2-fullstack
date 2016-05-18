/**
* Model events
*/

'use strict';

import {EventEmitter} from 'events';
import Thing from './thing.model';

const ThingEvents = new EventEmitter();
ThingEvents.setMaxListeners(0);

// Model events
const events = {
  'save': 'save',
  'remove': 'remove'
};
