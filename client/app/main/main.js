'use strict';

import fullstackApp from '../app';
import MainController from './main.controller';

export default fullstackApp.config($stateProvider => {
        $stateProvider
            .state('main', {
                url: '/main',
                templateUrl: 'app/main/main.html',
                controller: 'MainController'
            })
    })