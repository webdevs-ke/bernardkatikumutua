(function(){
    angular.module('portfolioApp')
      .factory('SchemaService', ['$document', function($document){
        function addSchema(data){
          // Remove existing schema tag before adding a new one
          var old = $document[0].head.querySelector('script[type="application/ld+json"]');
          if(old) old.remove();
  
          var script = $document[0].createElement('script');
          script.setAttribute('type', 'application/ld+json');
          script.textContent = JSON.stringify(data, null, 2);
          $document[0].head.appendChild(script);
        }
  
        return {
          setPersonSchema: function(){
            const schema = {
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Bernard Katiku Mutua",
              "jobTitle": "Full Stack Developer",
              "url": "https://bernardkatikumutua.netlify.app",
              "sameAs": [
                "https://github.com/webdevs-ke",
                "https://www.linkedin.com/in/katiku-mutua/"
              ],
              "knowsAbout": [
                "AngularJS", "Node.js", "JavaScript", "Unity", "Computer Vision", "AI Training Data", "PHP", "SQL", "Python"
              ],
              "description": "Full Stack Developer experienced in Angular, Node.js, and AI-based applications."
            };
            addSchema(schema);
          },
  
          setProjectSchema: function(proj, url){
            const schema = {
              "@context": "https://schema.org",
              "@type": "SoftwareSourceCode",
              "name": proj.title,
              "description": proj.short || proj.description,
              "url": url,
              "author": {
                "@type": "Person",
                "name": "Bernard Katiku Mutua"
              },
              "programmingLanguage": proj.tags ? proj.tags.join(', ') : 'JavaScript',
              "image": proj.image || "https://yourdomain.com/assets/images/project-placeholder.png"
            };
            addSchema(schema);
          },
  
          setAllProjectsSchema: function(projects, baseUrl){
            const schema = {
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "Bernard Katiku Mutua Portfolio Projects",
              "url": baseUrl,
              "description": "A collection of software projects developed by Bernard Katiku Mutua.",
              "author": {
                "@type": "Person",
                "name": "Bernard Katiku Mutua",
                "url": baseUrl
              },
              "itemListElement": projects.map((p, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "url": baseUrl + '#!/projects/' + p.id,
                "name": p.title,
                "description": p.short || p.description,
                "image": p.image || baseUrl + 'assets/images/project-placeholder.png'
              }))
            };
            addSchema(schema);
          }
        };
      }]);
  })();
  