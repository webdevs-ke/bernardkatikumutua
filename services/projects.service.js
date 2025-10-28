(function(){
    angular.module('portfolioApp')
      .factory('ProjectsService', [function(){
        var projects = [
            {
                id: 1,
                title: 'BuildTrack — Construction PM',
                short: 'Project management tool for construction teams.',
                description: 'BuildTrack helps contractors plan, track, and deliver projects efficiently with real-time budget, schedule, and material tracking. Features include Gantt charts, crew assignment, and progress analytics dashboard.',
                tags: ['AngularJS', 'Node.js', 'MongoDB'],
                repo: 'https://github.com/yourname/buildtrack',
                live: '',
                image: 'assets/images/jomcon.png'
              },
              {
                id: 2,
                title: 'Billiards 3D (Unity)',
                short: 'Android 3D billiards game with realistic physics.',
                description: 'A mobile 3D billiards simulation built with Unity featuring accurate physics, smooth camera controls, and AI opponents. Includes custom cue controls and multiplayer mode.',
                tags: ['Unity', 'C#', 'Android'],
                repo: 'https://github.com/yourname/billiards3d',
                live: '',
                image: 'assets/images/billiards.png'
              },
              {
                id: 3,
                title: 'Dev Portfolio (this site)',
                short: 'A responsive portfolio template with theme toggle and contact form.',
                description: 'A modular AngularJS portfolio built with dynamic routing, theme persistence, and reusable components. Showcases projects, skills, and a functional contact form with dark mode support.',
                tags: ['HTML', 'CSS', 'AngularJS'],
                repo: '',
                live: '',
                image: 'assets/images/portfolio.png'
              }              
        ];
  
        return {
          getAll: function(){ return projects; },
          getById: function(id){ return projects.find(p => p.id === +id); }
        };
      }]);
  })();
  