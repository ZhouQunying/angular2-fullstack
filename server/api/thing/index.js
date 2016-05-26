'use strict';

import express from 'express';
import * as controller from './thing.controller';

const router = express.Router();

router.get('/', controller.index);
