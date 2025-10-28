(function(){
    angular.module('portfolioApp')
      .controller('ProjectDetailCtrl', ['$routeParams', '$location', 'ProjectsService', 'SeoService', 'SchemaService', function($routeParams, $location, ProjectsService, SeoService, SchemaService){

        var vm = this;
        var id = $routeParams.id;
        vm.proj = ProjectsService.getById(id);

        var baseUrl = $location.absUrl().split('#')[0];
        SeoService.setDefaults(baseUrl);

        if(vm.proj){
            var pageTitle = vm.proj.title + ' | Bernard Katiku Mutua Portfolio';
            var pageDesc = vm.proj.short || vm.proj.description || 'Project by Bernard Katiku Mutua';       
            var image = vm.proj.image || baseUrl + 'assets/images/jomcon.png';
            var url = baseUrl + '#!/projects/' + id;

            SeoService.setTitle(pageTitle);
            SeoService.setDescription(pageDesc);
            SeoService.setImage(image);
            SeoService.setUrl(url);

            SchemaService.setProjectSchema(vm.proj, url);
          } else {
            SeoService.setTitle('Project Not Found | Bernard Katiku Mutua');
            SeoService.setDescription('Requested project not found in Bernard Katiku Mutua portfolio.');
          }

      }]);
  })();
  