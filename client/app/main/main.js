'use strict';

import MainController from './main.controller';

export default fullstackApp.config(($stateProvider) => {
        $stateProvider
            .state('main', {
                url: '/main',
                templateUrl: 'app/main/main.html',
                controller: 'MainController'
            });

        // $locationProvider.html5Mode(true);
    })