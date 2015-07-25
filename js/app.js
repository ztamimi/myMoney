 requirejs.config ({
     baseUrl: 'js',
     paths: {
         'jquery': 'js/jquery',
         'jquerymobile': 'js/jquerymobile'
     }
 });
 
 require(['main'], function(main) {
     main.init();
 });