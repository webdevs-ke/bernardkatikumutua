(function(){
    angular.module('portfolioApp')
      .controller('MainCtrl', ['$window', 'ProjectsService', 'SeoService', 'SchemaService', function($window, ProjectsService, SeoService, SchemaService){
        var vm = this;

        // Default SEO when landing on home
        SeoDefaults();
        function SeoDefaults(){
            document.title = 'Bernard Katiku Mutua | Full Stack Developer Portfolio';
            var meta = document.querySelector('meta[name="description"]');
            if(meta) meta.setAttribute('content', 'Portfolio of Bernard Katiku Mutua — Full Stack Developer skilled in Angular, Node.js, and modern web development.');
        }

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
          // Simple in-browser behaviour: open mailto as fallback

          var subject = encodeURIComponent('Portfolio contact from ' + vm.contact.name);
          var body = encodeURIComponent(vm.contact.message + '\n\nEmail: ' + vm.contact.email);
          $window.location.href = 'mailto:katikumut@gmail.com?subject=' + subject + '&body=' + body;
          vm.contactSent = true;
          vm.contact = {};
          form.$setPristine();
          form.$setUntouched();
        };

        SchemaService.setPersonSchema();       
        
        // Show WhatsApp/BackToTop button when user scrolls down 200px
        angular.element($window).on('scroll', function() {
            const scrollTop = $window.pageYOffset || document.documentElement.scrollTop;
            const whatsappBtn = document.querySelector('.whatsapp-float');
            const backTopBtn = document.querySelector('.back-to-top');

            if (scrollTop > 200) {
                backTopBtn.classList.add('show');
                whatsappBtn.classList.add('show');
            } else {
                backTopBtn.classList.remove('show');
                whatsappBtn.classList.remove('show');
            }
        });  

        // Smooth scroll to top when clicked
        vm.scrollToTop = function(){
            $window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          };
      }]);
  })();
  