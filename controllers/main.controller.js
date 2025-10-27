(function(){
    angular.module('portfolioApp')
      .controller('MainCtrl', ['$window', 'ProjectsService', function($window, ProjectsService){
        var vm = this;

        
        vm.year = new Date().getFullYear();
        vm.projects = ProjectsService.getAll();
        vm.contact = {};
        vm.contactSent = false;
  
        // Theme toggle using localStorage
        vm.dark = ($window.localStorage.getItem('theme') === 'dark');
        applyTheme(vm.dark);
  
        vm.toggleTheme = function(){
          vm.dark = !vm.dark;
          $window.localStorage.setItem('theme', vm.dark ? 'dark' : 'light');
          applyTheme(vm.dark);
        };
  
        function applyTheme(isDark){
          var root = document.documentElement;
          if(isDark) root.classList.add('theme-dark');
          else root.classList.remove('theme-dark');
        }
  
        vm.sendContact = function(form){
          if(form.$invalid) return;
          // Simple in-browser behavior: open mailto as fallback
          var subject = encodeURIComponent('Portfolio contact from ' + vm.contact.name);
          var body = encodeURIComponent(vm.contact.message + '\n\nEmail: ' + vm.contact.email);
          $window.location.href = 'mailto:katikumut@gmail.com?subject=' + subject + '&body=' + body;
          vm.contactSent = true;
          vm.contact = {};
          form.$setPristine();
          form.$setUntouched();
        };
      }]);
  })();
  