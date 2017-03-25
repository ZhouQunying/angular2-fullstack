import express from 'express';

import * as controller from './home.controller';

const router = express.Router();

router.get('/', controller.index);

export default router;
