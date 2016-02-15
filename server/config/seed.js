/**
* Populate DB with sample data on server start
*/

'use strict';

import User from '../api/user/user.model';

User.find({}).removeAsync()
    .then(() => {
        User.createAsync({
            name: 'Test User',
            password: 'test',
            email: 'email@email.com'
        }, {
            role: 'admin',
            name: 'admin',
            password: 'admin',
            email: 'email@email.com'
        })
        .then(() => {
            console.log('finished populate users');
        });
    })