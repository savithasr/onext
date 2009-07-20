(function() {

    // used to prevent browser caching of .js file with main application logic --check
    var randomNumber = Math.floor( Math.random() * 999999 );
alert("Path : " );
    // URL builder helper
    function appURL(relativePath) {
      var basePath = 'http://github.com/savithasr/oracle-crm-ondemand-extension/tree/apps';
      alert("Path : " + basePath + relativePath);
      return basePath + relativePath;
    }
    
    function loadScripts(scripts) {
    
        if (typeof scripts !== 'object') {
            alert('loadScripts(scripts) without array argument');
        }
    
        if (scripts.length === 0) {
            return;
        }
        
        // pull off 1st script in array
        var scriptDefinition = scripts.shift();
    
        // build script tag
        var headElement = document.getElementsByTagName("head")[0];         
        var scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = scriptDefinition.url;
        
        var scriptLoadCompletedFunction = function() {

            // execute callback function
            if (typeof scriptDefinition.callback === 'function') {
                scriptDefinition.callback.call(this, scriptDefinition);    
            }
            
            // load the rest (tail of array) of the scripts
            loadScripts(scripts);
        };
        
        scriptElement.onload = scriptLoadCompletedFunction;
        
        // for ie
        scriptElement.onreadystatechange = function () {
            if (scriptElement.readyState == 'loaded' || scriptElement.readyState == 'complete') {
                scriptLoadCompletedFunction();
            }
        }        

        // add script tag
        headElement.appendChild(scriptElement);    
    }

    // scripts to load
    var scriptDefinitions = [
        {
            name: 'json2',
            url: 'http://www.json.org/json2.js'  
        },
        {
            name: 'firebugx',
            url: 'http://fbug.googlecode.com/svn-history/r3153/lite/branches/firebug1.1/firebugx.js',
            callback: function(scriptDefinition) { console.log('loaded ' + scriptDefinition.name);  }
        },
        {
            name: 'jquery',
            url: 'http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js',
            callback: function() { jQuery.noConflict(); }
        },
        {
            name: 'ondemand - common',
            url: appURL("/common/javascripts/ondemand_common.js") + '?' + randomNumber
        },
        {
            name: 'application',
            url: appURL('/apps/app01/javascripts/application.js') + '?' + randomNumber
        }
    ];

    loadScripts(scriptDefinitions);

})();
