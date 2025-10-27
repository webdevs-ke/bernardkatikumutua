(function(){
  angular.module('portfolioApp', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider){
      $routeProvider
        .when('/', { templateUrl: 'home.html' })
        .when('/projects', { templateUrl: 'projects.html' })
        .when('/about', { templateUrl: 'about.html' })
        .when('/contact', { templateUrl: 'contact.html' })
        .otherwise({ redirectTo: '/' });
    }])
    .run(['$rootScope', function($rootScope){
      // nothing heavy here — placeholder for analytics or boot logic
    }]);
})();
