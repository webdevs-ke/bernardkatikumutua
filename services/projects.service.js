(function(){
    angular.module('portfolioApp')
      .factory('ProjectsService', [function(){
        var projects = [
            {
                id: 1,
                title: 'Jomcon Construction LLC',
                short: 'A website for a construction company based in Nairobi CBD.',
                description: 'The Jomcon Website helps its owners plan, track, and deliver projects efficiently with real-time budget, schedule, and material tracking. Its main function is to act as a gateway to the vast market of construction projects demanded by clients. Apart from expanding the company\'s market reach, it fosters business interaction between the company owners and suppliers, other contractors, procurement officials, and anyone really, all around the world. The site uses an Apache host running a MySQL database which is queried via the PHP for CRUD operations.',
                tags: ['JavaScript', 'HTML5', 'CSS3', 'PHP', 'MySQL'],
                repo: '',
                live: 'https://jomcon.co.ke',
                image: 'assets/images/jomcon.png'
              },
              {
                id: 2,
                title: 'Yonga & Simiyu Advocates',
                short: 'An online office for a thriving law firm in Nairobi.',
                description: 'A portfolio and advertisement platform for various legal practice areas that the firm offers to its clients. The firm considers this website to be an expansion of their cross-border market reach. It also helps the firm advertise career opportunities in the legal field. The pages are rendered using PHP OOP and the animations are done via refined JavaScript and CSS code.',
                tags: ['JQuery', 'PHP', 'CSS3', 'HTML5'],
                repo: '',
                live: 'https://yongasimiyu.jomcon.co.ke/yongasimiyu/',
                image: 'assets/images/yongasimiyu.png'
              },
              {
                id: 3,
                title: 'Dev Portfolio (this site)',
                short: 'A responsive portfolio web app with JavaScript programming demos, and a contact form.',
                description: 'A modular AngularJS portfolio app for a full-stack dev built with dynamic routing, theme persistence, and reusable components. It showcases projects, skills, and a functional contact form with dark mode support.',
                tags: ['HTML', 'CSS', 'AngularJS', 'TypeScript'],
                repo: 'https://github.com/webdevs-ke/bernardkatikumutua',
                live: 'https://benkatiku.netlify.app/',
                image: 'assets/images/bkmportfolio.png'
              },
              {
                id: 4,
                title: '15-puzzle with JavaScript',
                short: 'A personal project featuring an N-puzzle variant browser game.',
                description: 'This is a pure JavaScript app aimed to explore the study of AI and Agents. The n-puzzle belongs to a class of problems that can be solved trivially by classical search approaches when the environment is small - e.g. 8-puzzle. When the environment size rises, to say 15, 24, or larger, the classical approaches are inefficient and therefore heuristic search algorithms become necessary. The project also demonstrates how the HTML5 Canvas element is a programmable bitmap that can be manipulated using JavaScript. This programmability offers UI events and animations on a bitmap. Amazing, no?',
                tags: ['JavaScript'],
                repo: 'https://github.com/webdevs-ke/N-puzzle.git',
                live: 'https://npuzzle.netlify.app/',
                image: 'assets/images/n-puzzle.png'
              }                
        ];
  
        return {
          getAll: function(){ return projects; },
          getById: function(id){ return projects.find(p => p.id === +id); }
        };
      }]);
  })();
  