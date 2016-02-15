/**
* Populate DB with sample data on server start
*/

'use strict';

import User from '../api/user/user.model';

User.find({}).removeAsync()
    .then(() => {
        User.createAsync({
            name: 'Test User',
            password: 'test'
        }, {
            role: 'admin',
            name: 'admin',
            password: 'admin'
        })
        .then(() => {
            console.log('finished populate users');
        });
    })