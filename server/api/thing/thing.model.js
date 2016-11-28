'use strict';

import mongoose from 'mongoose';

const ThingSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean,
});

export default mongoose.model('Thing', ThingSchema);
