'use strict';

require('../../../bower_components/angular/angular');
import {fullstackApp} from '../app';
// // var fullstackApp = require('../app');

var lala = angular.module('fullstackApp', [
    'ui.router'
])
                .config(($stateProvider) => {
                    $stateProvider
                        .state('main', {
                            url: '/main',
                            // templateUrl: 'app/main/main.html'
                            template: '<h1>Lala</h1>'
                        })
                }) 

export {lala};