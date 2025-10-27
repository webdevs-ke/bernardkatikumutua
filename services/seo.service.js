(function(){
    angular.module('portfolioApp')
      .factory('SeoService', ['$document', function($document){
        function setMeta(name, content, attrType){
          var head = $document[0].head;
          var selector = attrType === 'property'
            ? `meta[property="${name}"]`
            : `meta[name="${name}"]`;
  
          var meta = head.querySelector(selector);
          if(!meta){
            meta = $document[0].createElement('meta');
            meta.setAttribute(attrType, name);
            head.appendChild(meta);
          }
          meta.setAttribute('content', content);
        }
  
        return {
          setTitle: function(title){
            $document[0].title = title;
            setMeta('og:title', title, 'property');
            setMeta('twitter:title', title, 'name');
          },
          setDescription: function(desc){
            setMeta('description', desc, 'name');
            setMeta('og:description', desc, 'property');
            setMeta('twitter:description', desc, 'name');
          },
          setImage: function(url){
            setMeta('og:image', url, 'property');
            setMeta('twitter:image', url, 'name');
          },
          setUrl: function(url){
            setMeta('og:url', url, 'property');
          },
          setDefaults: function(base){
            setMeta('og:type', 'website', 'property');
            setMeta('twitter:card', 'summary_large_image', 'name');
            setMeta('og:site_name', 'Bernard Katiku Mutua Portfolio', 'property');
            setUrl(base);
          }
        };
      }]);
  })();
  