(function(){
    angular.module('portfolioApp')
      .controller('ProjectDetailCtrl', ['$routeParams', 'ProjectsService', function($routeParams, ProjectsService){
        var vm = this;
        var id = $routeParams.id;
        vm.proj = ProjectsService.getById(id);
      }]);
  })();
  