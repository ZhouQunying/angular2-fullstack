'use strict';

import '../../bower_components/angular/angular';
import '../../bower_components/angular-ui-router/release/angular-ui-router';
// require('../../bower_components/angular/angular');
// require('../../bower_components/angular-ui-router/release/angular-ui-router');
import {lala} from './main/main';
// var lala = require('./main/main');

var fullstackApp = angular.module('fullstackApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'validation.match'
])
// .config(($stateProvider) => {
//                     $stateProvider
//                         .state('main', {
//                             url: '/main',
//                             templateUrl: 'app/main/main.html'
//                         })
//                 }) 

export {fullstackApp};
    // .config(($stateProvider) => {
    //         $stateProvider
    //             .state('main', {
    //                 url: '/main',
    //                 templateUrl: 'app/main/main.html'
    //             })
    //     })  

    // .config(($urlRouterProvider, $locationProvider) => {
    //     // $locationProvider
    //     //     .state('main', {
    //     //         url: '/main',
    //     //         // templateUrl: 'main/main.html'
    //     //         template: '<h1>Main</h1>'
    //     //     })

    //     // $urlRouterProvider.otherwist('/');
    // })