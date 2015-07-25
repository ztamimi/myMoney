define(["lib/jquery", "lib/jquerymobile", "lib/money"], function(jquery, jquerymobile, fx) {
    var main = {};
    
    main.init = function() {
        $.mobile.loading('show'); 

        $.getJSON(
        'https://openexchangerates.org/api/latest.json?app_id=c84270aef7644692aa702b70465b2a6c',
        function(data) {
            // Check money.js has finished loading:
            if ( typeof fx !== "undefined" && fx.rates ) {
                fx.rates = data.rates;
                fx.base = data.base;
            } else {
                // If not, apply to fxSetup global:
                var fxSetup = {
                    rates : data.rates,
                    base : data.base
                };
            }
            main.loaded();
        });
    };
    
    main.loaded = function() {
        console.log("loaded");
        $.mobile.loading('hide');
        var fromList = $("#fromCurrency");
        var toList = $("#toCurrency");

        for (key in fx.rates) {
            var fromOpt = $("<option>", {value: key}).text(key);
            var toOpt = $("<option>", {value: key}).text(key);
            fromList.append(fromOpt);
            toList.append(toOpt);
        }
        var fromCurrency = main.getCookie("fromCurrency");
        if (fromCurrency) {
            fromList.find("option[value=" + fromCurrency + "]").attr('selected', 'selected');
            fromList.selectmenu("refresh");
        }
        var toCurrency = main.getCookie("toCurrency");
        if (toCurrency) {
            toList.find("option[value=" + toCurrency + "]").attr('selected', 'selected');
            toList.selectmenu("refresh");
        }
        $("#convertBtn").on('click', main.convert);
        main.convert();
    };
    
    main.convert = function() {
        var amount = $("#inputAmount").val();
        if (!amount)
            return;
        var fromCurrency = $("#fromCurrency").val();
        if (!fromCurrency)
            return;
        main.setCookie("fromCurrency", fromCurrency);
        
        var toCurrency = $("#toCurrency").val();
        if (!toCurrency)
            return;
        main.setCookie("toCurrency", toCurrency);
        var exchange = fx.convert(amount, {from: fromCurrency, to: toCurrency});
        $("#outputAmount").text(exchange);
        $("#outputCurrency").text(toCurrency);
    };
    
    main.setCookie = function(key, value) {  
        var expires = new Date();  
        expires.setTime(expires.getTime() + 21600); //6 hours  
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();  
    };
  
    main.getCookie = function(key) {  
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');  
        return keyValue ? keyValue[2] : null;  
    };
    
    
    return main;
});
