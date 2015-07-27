define(["lib/jquery", "lib/jquerymobile", "lib/money", "lib/accounting"], function(jquery, jquerymobile, fx, accounting) {
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
            //console.log(data.timestamp);
            fx.timestamp = data.timestamp;
            main.loaded();
        }).fail(function() {console.log("error");});
    };
    
    main.loaded = function() {
        $.mobile.loading('hide');
        //console.log(fx.timestamp);
        var timeStamp = Date(fx.timestamp);
        $("#timeStamp").text(timeStamp.toString());
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
        $("#inputAmount").val(1);
        main.convert();
    };
    
    main.convert = function() {
        var amount = $("#inputAmount").val();
        if (!amount)
            return;
        var input = accounting.unformat(amount);
        var fromCurrency = $("#fromCurrency").val();
        if (!fromCurrency)
            return;
        main.setCookie("fromCurrency", fromCurrency);
        
        var toCurrency = $("#toCurrency").val();
        if (!toCurrency)
            return;
        main.setCookie("toCurrency", toCurrency);
        
        var output = fx.convert(input, {from: fromCurrency, to: toCurrency});
        var formatedOutput = accounting.formatMoney(output, {symbol: toCurrency, format: "%v %s"});
        $("#outputAmount").text(formatedOutput);
        var formatedInput = accounting.formatMoney(input, {symbol: fromCurrency, format: "%v %s"});
        console.log(formatedInput);
        $("#inputSummary").text(formatedInput);
        $("#equals").text("equals")
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
