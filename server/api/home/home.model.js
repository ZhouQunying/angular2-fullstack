'use strict';

import mongoose from 'mongoose';

const HomeSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean,
});

export default mongoose.model('Home', HomeSchema);
