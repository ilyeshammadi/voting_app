/**
 * Created by ilyes on 6/28/16.
 */
var app = angular.module('Voting', ['angular-loading-bar', 'infinite-scroll', 'ui.router', 'ngResource', 'ngRoute']);



app.config(['$interpolateProvider', '$httpProvider', '$routeProvider', '$resourceProvider', '$urlRouterProvider', '$locationProvider', function ($interpolateProvider, $httpProvider, $routeProvider, $resourceProvider, $urlRouterProvider, $locationProvider) {

    // Force angular to use square brackets for template tag
    // The alternative is using {% verbatim %}
    // $interpolateProvider.startSymbol('[[').endSymbol(']]');
    // CSRF Support
    // $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    // $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    ////// This only works in angular 3!
    ////// It makes dealing with Django slashes at the end of everything easier.
    //$resourceProvider.defaults.stripTrailingSlashes = false;
    //
    // $locationProvider.baseHref = userDashboard;

    $routeProvider
        .when('/', {
            templateUrl: '/partials/list.html',
            controller: 'ListPollsController'
        })
        .when('/create', {
            templateUrl: '/partials/create.html',
            controller: 'CreatePollController'
        })
        .when('/update/:id', {
            templateUrl: '/partials/update.html',
            controller: 'UpdatePollController'
        })
        .when('/:id', {
            templateUrl: '/partials/detail.html',
            controller: 'PollDetailController'
        })

        .otherwise('/');

}]);
