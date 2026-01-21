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
              },
              {
                id: 5,
                title: 'Rental Property Listing Website',
                short: 'A real estate listing website for vacant rental homes within Nairobi Metro area.',
                description: 'A comprehensive, robust, and media-rich website built using the Angular Framework for the frontend and PHP/MySQL for the backend API endpoints. The goal of the project is to present a stress-free rental home acquisition process for Nairobi renters as well as an easy to use online advertisement platform for Nairobi landlords. A property manager or owner is able to upload pictures or videos of their vacant rental, as well as the accompanying info pertaining to house type, location, monthly charges, and descriptive metadata. This info is presented to potential renters via the Angular website in a fast, beautiful, and modern format. The website also features Google Adsesnse advertisement for monetization',
                tags: ['Angular v20+, TypeScript, PHP, MySQL, REST APIs'],
                repo: 'https://github.com/webdevs-ke/nairobirents',
                live: 'https://nairobirents.netlify.app/',
                image: 'assets/images/nairobirents.png'
              },
              {
                id: 6,
                title: 'ngDB RDBMS for Angular PWAs',
                short: 'A client-side based RDBMS for use with Angular PWAs.',
                description: 'This project is borne out of a challenge from PesaPal LLC for a junior developer role. The challenge is to create an RDBMS that features the common CRUD operations, SQL statement parsing and execution, an REPL mode, and a demo app to demonstrate the use of the RDBMS. As expected, the project is also created in Angular v20+ framework because it is a prominent tool for creating all sorts of frontend applications. The app is designed on top of the modern browsers\'s IndexedDB storage system which offers JSON format storage of data. The object stores in this system can hold gigabytes of data depending on available disk space. It can also store files as blobs, all without a backend. The project description is very, very interesting as it demonstrates solid programming practice. It is built using layers of Angular services including IndexedDbService, DatabaseService, SqlEngineService (which uses a custom parser, and Abstract Syntax Tree generator). The interface features a SQL Console REPL mode that allows a developer to run commands just like regular SQL to manage the RDBMS apps. It also contains a library app demo to demonstrate the creation and use of a library database created using the RDBMS. This application is continually being built.',
                tags: ['Angular v20+, TypeScript, IndexedDB'],
                repo: 'https://github.com/webdevs-ke/embedded-db-rdbms',
                live: 'https://ngrdbms.netlify.app/',
                image: 'assets/images/ngdbUI.jpg'
              }                
        ];
  
        return {
          getAll: function(){ return projects; },
          getById: function(id){ return projects.find(p => p.id === +id); }
        };
      }]);
  })();
  