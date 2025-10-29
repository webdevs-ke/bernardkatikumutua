(function(){
  var ng = angular.module('portfolioApp', ['ngRoute', 'ngAnimate']);

    ng.directive('autoHideHeader', function() {
      return {
        restrict: 'A',
        link: function(scope, element) {
          let lastScroll = 0;
          window.addEventListener('scroll', () => {
            let current = window.scrollY;
            if (current > lastScroll && current > 150) {
              element.addClass('hide');
            } else {
              element.removeClass('hide');
            }
            lastScroll = current <= 0 ? 0 : current;
          });
        }
      };
    });
    
    ng.directive('fadeInOnScroll', ['$window', function($window) {
      return {
        restrict: 'A',
        link: function(scope, element) {
          function isVisible(el) {
            const rect = el[0].getBoundingClientRect();
            return rect.top < $window.innerHeight - 100; // 100px before entering view
          }

          function handleScroll() {
            if (isVisible(element)) {
              element.addClass('visible');
              $window.removeEventListener('scroll', handleScroll);
            }
          }

          $window.addEventListener('scroll', handleScroll);
          handleScroll();
        }
      };
    }]);
    
    ng.config(['$routeProvider', function($routeProvider){
      $routeProvider
        .when('/', { templateUrl: 'home.html' })
        .when('/projects', { templateUrl: 'projects.html' })
        .when('/about', { templateUrl: 'about.html' })
        .when('/contact', { templateUrl: 'contact.html' })
        .when('/projects/:id', {
          templateUrl: 'views/project-detail.html',
          controller: 'ProjectDetailCtrl',
          controllerAs: 'vm'
        })
        .otherwise({ redirectTo: '/' });
    }])
    .run(['$rootScope', function($rootScope){
      // nothing heavy here — placeholder for analytics or boot logic
    }]);
})();
