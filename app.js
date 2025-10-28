(function(){
  var ng = angular.module('portfolioApp', ['ngRoute']);
    ng.directive('autoHideHeader', function() {
      return {
        restrict: 'A',
        link: function(scope, element) {
          let lastScroll = 0;
          window.addEventListener('scroll', () => {
            let current = window.scrollY;
            if (current > lastScroll && current > 100) {
              element.addClass('hide');
            } else {
              element.removeClass('hide');
            }
            lastScroll = current <= 0 ? 0 : current;
          });
        }
      };
    });
    
    ng.config(['$routeProvider', function($routeProvider){
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
