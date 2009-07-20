(function() {

function OnDemandLib() {}

OnDemandLib.prototype.admin = {
    userName: 'MERCKTEST_CTE01/Bischofe',
    password: 'Accenture55'
};

//
//  Charles's JavaScript Library for CRM On Demand R16 --savitha
//
//  All the things that are fun to do.
//
//  Revision history
//
//  1.01:   2009 05 13  First Release
//  1.02:   2009 05 16  Convert text buttons from simple <a> to <div> with
//                      on mouse click to avoid formatting issues with IE
//  1.03:   2009 05 22  Added ability to delete buttons
//  1.04:   2009 05 xx  Code contributed by Duane Nelson
//  2.01:   2009 06 03  Branch by Charles, add login function from Chris Stuart
//


//  ////////////////////////////////////////////////////////////////////////
//
//  ROUTINE: hide_detailchild_applet()
//
//  This code is used to hide the web applet that holds the java script
//  Assumes we are the last one on a detail form.  If not, edit third line below.
//
//  ////////////////////////////////////////////////////////////////////////
OnDemandLib.prototype.hide_detailchild_applet = function() {
    var pn = document.getElementById("ChildAppletDiv");
    var tables = pn.getElementsByTagName("table");
    tables[tables.length - 1].style.display = "none";
}

//  ////////////////////////////////////////////////////////////////////////
//
//  ROUTINE: add_header_button()
//
//  The next routine allows you to add push buttons to the top of an applet (either
//  the main one or a related item applet). 
//
//  Parameters:
//
//      section_name:   The name that appears in the header in the UI.
//                      This probably doesn't work well with localized UIs.
//                      Sorry about that.
//
//      position:       Where in the header you want the button to appear.
//                      Before the first button is "2".  Go figure.
//
//      button_text:    Text to show in a button
//
//      URL:            Where to go to if the button is pressed.
//
//      target_window:  Standard sorts of "_blank", "_top", etc. things
//
//      features:       typically "height=y,width=x", but anything window.open() supports
//
//  Returns:
//
//      true            button was added
//      false           button was not added
//
//  ////////////////////////////////////////////////////////////////////////
OnDemandLib.prototype.add_header_button = function(section_name, position, button_text, url, target_window, features) {
    var i;
    var ih0;
    var ih1;
    var tabs = document.getElementsByTagName("table");

    for (i = 0; i < tabs.length; i++) {
        var td = tabs[i].getElementsByTagName("td");
        try {
            // This can generate an exception we ignore, if so it means
            // it's not the ones we're looking for
            ih0 = td[0].innerHTML;
            ih1 = td[1].innerHTML;

            if (ih0.indexOf(section_name) == 0 || ih1.indexOf(section_name) == 0) {
                var tr = tabs[i].getElementsByTagName("tr");
                var newtd = tr[0].insertCell(position);
                // For some reason, using the DOM to build this up fails in IE, so we
                // have to use the hacky innerHTML instead.  
                newtd.innerHTML = "<div class='buttonTD' " +
                    "onmouseover='toggleNavButton(this);' " +
                    "onmouseout='toggleNavButton(this);' " +
                    "onclick=\"window.open('" + url + "', '" + target_window + "', '" + features + "');\" >" +
                    button_text + "</div>";
                return true;
            }
        } catch (ex) {
            // you really don't want to enable this unless at wits end
            // alert("Exception! " + ex.toString());
        }
    }
    return false;
}


//  ////////////////////////////////////////////////////////////////////////
//
//  ROUTINE: add_footer_button()
//
//  The next routine allows you to add push buttons to the bottom of an applet (either
//  the main one or a related item applet). 
//
//  Parameters:
//
//      position:       Where in the header you want the button to appear.
//                      Before the first button is "2".  Go figure.
//
//      button_text:    Text to show in a button
//
//      URL:            Where to go to if the button is pressed.
//
//      target_window:  Standard sorts of "_blank", "_top", etc. things
//
//      features:       typically "height=y,width=x", but anything window.open() supports
//
//  Returns:
//
//      true            button was added
//      false           button was not added
//
//  ////////////////////////////////////////////////////////////////////////

OnDemandLib.prototype.add_footer_button = function(position, button_text, url, target_window, features) {
    var i;
    var ih;
    var mytables = document.getElementsByTagName("table");

    for (i = 0; i < mytables.length; i++) {
        try {

            if (mytables[i].getAttribute("class") == "footbar") {

                // This can generate an exception we ignore, if so it means
                // it's not the ones we're looking for
                var mytr = mytables[i].getElementsByTagName("tr");
                var newtd = mytr[0].insertCell(position);
                // For some reason, using the DOM to build this up fails in IE, so we
                // have to use the hacky innerHTML instead.  
                newtd.innerHTML = "<div class='buttonTD' " +
                    "onmouseover='toggleNavButton(this);' " +
                    "onmouseout='toggleNavButton(this);' " +
                    "onclick=\"window.open('" + url + "', '" + target_window + "', '" + features + "');\" >" +
                    button_text + "</div>";
                return true;
            }
        } catch (ex) {
            // you really don't want to enable this unless at wits end
            // alert("Exception! " + ex.toString());
        }
    }
    return false;
}


//  ////////////////////////////////////////////////////////////////////////
//
//  ROUTINE: delete_button()
//
//  This routine will delete a button from an On Demand applet.  If you
//  wish to replace a button, delete it and then insert a new one.
//
//  Parameters:
//
//      section_name:   The name that appears in the header in the UI.
//                      This probably doesn't work well with localized UIs.
//                      Sorry about that.
//
//      position:       Where in the header you want the button to appear.
//                      The first button is "2".
//
//  Returns:
//
//      true            button was deleted
//      false           button was not deleted
//
//  ////////////////////////////////////////////////////////////////////////
OnDemandLib.prototype.delete_button = function(section_name, position) {
    var i;
    var ih;
    var tabs = document.getElementsByTagName("table");
    for (i = 0; i < tabs.length; i++) {
        var td = tabs[i].getElementsByTagName("td");
        try {
            // This can generate an exception we ignore, if so it means
            // it's not the ones we're looking for
            ih = td[1].innerHTML;

            if (ih.indexOf(section_name) == 0) {
                var tr = tabs[i].getElementsByTagName("tr");
                tr[0].deleteCell(position);
                return true;
            }
        } catch (ex) {
            // you really don't want to enable this unless at wits end
            // alert("Exception! " + ex.toString());
        }
    }
    return false;
}




//  ////////////////////////////////////////////////////////////////////////
//
//  ROUTINE hide_printer_friendly
//  Removes the printer friendly link from the top of the page
//  Not sure who cares, but the request happens from time to time
//
//  ////////////////////////////////////////////////////////////////////////
OnDemandLib.prototype.hide_printer_friendly = function() {

    try {
        var pf = document.getElementById('Printer_Friendly_Action');
        pf.style.display = "none";
    }
    catch (e) {
    }
}

//  ////////////////////////////////////////////////////////////////////////
//
//  ROUTINE getLocal()
//
//  returns true if a "uselocal" cookie is set indicating that code
//  should use localhost (this is for debugging).  If you use firefox,
//  and you use firebug, there is an add-on called firecookie that allows
//  you to inspect and change cookies.  The first time the script is called
//  it will set the use local cookie to false if there isn't one.  Your code
//  can call getLocal to get the cookie's value. With firecookie, you can
//  change the value of the cookie to "true" to turn on local processing, etc.
//
//  ////////////////////////////////////////////////////////////////////////
OnDemandLib.prototype.getLocal = function() {
    var value;
    var allcookies = document.cookie;
    var pos = allcookies.indexOf("uselocal=");
    if (pos != -1) {
        var start = pos + 9;
        var end = allcookies.indexOf(";", start);
        if (end == -1) end = allcookies.length;
        value = allcookies.substring(start, end);
        if (value == "true") value = true;
        else value = false;
    }
    else {
        document.cookie = "uselocal=false";
        value = false;
    }
    return value;
}



//  ////////////////////////////////////////////////////////////////////////
//
//  ROUTINE: replace_quickcreate_link()
//
//  The next routine allows you to add push buttons to the top of an applet (either
//  the main one or a related item applet). 
//
//  Parameters:
//
//      link_name:      The name that appears in the ...
//
//      position:       Where in the header you want the button to appear.
//                      Before the first button is "2".  Go figure.
//
//      button_text:    Text to show in a button
//
//      URL:            Where to go to if the button is pressed.
//
//      target_window:  Standard sorts of "_blank", "_top", etc. things
//
//      features:       typically "height=y,width=x", but anything window.open() supports
//
//  Returns:
//
//      true            button was added
//      false           button was not added
//
//  ////////////////////////////////////////////////////////////////////////
OnDemandLib.prototype.replace_quickcreate_link = function(linkname, url, target_window) {
    var i;
    var ih;
    var mydiv = document.getElementById("Quick CreateDiv");
    var myanchors = mydiv.getElementsByTagName("a");
    for (i = 0; i < myanchors.length; i++) {
        try {
            if (myanchors[i].getAttribute("href").indexOf(linkname + "QuickCreate") != -1) {

                // This can generate an exception we ignore, if so it means
                // it's not the ones we're looking for

                myanchors[i].setAttribute("href", url);
                myanchors[i].setAttribute("target", target_window);
                return true;
            }
        }
        catch (ex) {
            // you really don't want to enable this unless at wits end
            // alert("Exception! " + ex.toString());
        }
    }


}

//  ////////////////////////////////////////////////////////////////////////
//
//  ROUTINE: trap_contact_new()
//
//  The next routine allows you to add push buttons to the top of an applet (either
//  the main one or a related item applet). 
//
//  Parameters:
//
//      link_name:      The name that appears in the ...
//
//      position:       Where in the header you want the button to appear.
//                      Before the first button is "2".  Go figure.
//
//      button_text:    Text to show in a button
//
//      URL:            Where to go to if the button is pressed.
//
//      target_window:  Standard sorts of "_blank", "_top", etc. things
//
//      features:       typically "height=y,width=x", but anything window.open() supports
//
//  Returns:
//
//      true            button was added
//      false           button was not added
//
//  ////////////////////////////////////////////////////////////////////////
OnDemandLib.prototype.trap_contact_new = function(url, target_window, features) {
    var i = 0;
    var mydivs = document.getElementsByTagName("div");
    for (i = 0; i < mydivs.length; i++) {
        try {
            if (mydivs[i].getAttribute("onclick").indexOf("DefContactInsert") != -1) {
                mydivs[i].setAttribute("onclick", "window.open('" + url + "', '" + target_window + "', '" + features + "');");
                return true;
            }
        }
        catch (ex) {
            // you really don't want to enable this unless at wits end
            // alert("Exception! " + ex.toString());
        }
    }
}


OnDemandLib.prototype.hide_global_applet = function(appletname) {
    //     Hide my element of the action bar ... note that you need to name
    //     your global web applet Scripts or change the string below

    try {
        var tds = document.getElementsByTagName("td");
        var i;
        for (i = 0; i < tds.length; i++) {
            if (tds[i].innerHTML == appletname) {
                tds[i].parentNode.parentNode.parentNode.parentNode.style.display = "none";
                return true;
            }
        }

    }

    catch (e) {
    }
}



//  ////////////////////////////////////////////////////////////////////////
//
//  ROUTINE: sso_login
//
//  Allows a JavaScript routine to log into CRM On Demand for web services
//
//  Parameters:
//
//      ssotoken    The SSO token as supplied by CRM On Demand
//      callback    A string containing code to execute when the login is
//                  complete.  If set to '', then the call is made
//                  synchronously, otherwise, asynchronously
//
//  Notes:
//      Sets session cookie in browser, cookie automatically sent with
//      subsequent requests
//
//  ////////////////////////////////////////////////////////////////////////
OnDemandLib.prototype.sso_login = function(ssotoken, callback) {
    ssotoken = encodeURIComponent(ssotoken);
    var pageroot = document.location;
    pageroot = pageroot.toString();
    pageroot = pageroot.substr(0, pageroot.indexOf('/', 10));
    try {
        var commandStr = '?command=ssologin&odSsoToken=' + ssotoken;
        var oXMLHttpRequest = new XMLHttpRequest;
        if (callback.length > 0) {
            oXMLHttpRequest.open('GET', pageroot + '/Services/Integration' + commandStr, true);
            oXMLHttpRequest.onreadystatechange = function() {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (this.status == 200) eval(callback);
                    else if (this.status == 500) {
                        alert('Server timeout due to inactivity, reloading page!');
                        top.location.reload();
                    }
                    else alert('Error: ' + this.status + ' - ' + this.responseText);
                }
            }
        }
        else {
            oXMLHttpRequest.open('GET', pageroot + '/Services/Integration' + commandStr, false);
        }
        oXMLHttpRequest.send(null);
        if (callback.length == 0) {
            return (oXMLHttpRequest.status == 200);
        }
    } catch (e) { alert('Error: ' + e.message); }
}

OnDemandLib.prototype.user_login = function(userName, password, callback) {
    var pageroot = document.location;
    pageroot = pageroot.toString();
    pageroot = pageroot.substr(0, pageroot.indexOf('/', 10));
    try {
        var commandStr = '?command=login';
        var oXMLHttpRequest = new XMLHttpRequest;
        console.log('begin user_login');
        if (callback) {
            console.log('inside callback');
            oXMLHttpRequest.open('GET', pageroot + '/Services/Integration' + commandStr, true);
            oXMLHttpRequest.onreadystatechange = function() {
                console.log('begin onreadystatechange');
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (this.status == 200) {
                        console.log('before callback');
                        callback();
                        console.log('after callback');                        
                    } else if (this.status == 500) {
                        alert('Server timeout due to inactivity, reloading page!');
                        top.location.reload();
                    } else {
                        alert('Error: ' + this.status + ' - ' + this.responseText);
                    }
                }
            }
        }
        else {
            console.log('else path');
            oXMLHttpRequest.open('GET', pageroot + '/Services/Integration' + commandStr, false);
        }
        
        oXMLHttpRequest.setRequestHeader('UserName', userName);
        oXMLHttpRequest.setRequestHeader('Password', password);
        
        oXMLHttpRequest.send(null);
        if (!callback) {
            return (oXMLHttpRequest.status == 200);
        }
    } catch (e) { alert('Error: ' + e.message); }
}



//  ////////////////////////////////////////////////////////////////////////
//
//  ROUTINE: sso_logoff
//
//  Ends a web services session started by JavaScript
//
//  Parameter:
//
//      callback    A string containing code to execute when the logoff is
//                  complete.  If set to '', then the call is made
//                  synchronously, otherwise, asynchronously
//
//  ////////////////////////////////////////////////////////////////////////
OnDemandLib.prototype.sso_logoff = function(callback) {
    var pageroot = document.location;
    pageroot = pageroot.toString();
    pageroot = pageroot.substr(0, pageroot.indexOf('/', 10));
    try {
        var commandStr = '?command=logoff';
        var oXMLHttpRequest = new XMLHttpRequest;
        if (callback.length > 0) {
            oXMLHttpRequest.open('GET', pageroot + '/Services/Integration' + commandStr, true);
            oXMLHttpRequest.onreadystatechange = function() {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (this.status == 200) eval(callback);
                    else if (this.status == 500) {
                        alert('Server timeout due to inactivity, reloading page!');
                        top.location.reload();
                    }
                    else alert('Error: ' + this.status + ' - ' + this.responseText);
                }
            }
        }
        else {
            oXMLHttpRequest.open('GET', pageroot + '/Services/Integration' + commandStr, false);
        }

        oXMLHttpRequest.send(null);
        if (callback.length == 0) {
            return (oXMLHttpRequest.status == 200);
        }
    } catch (e) { alert('Error: ' + e.message); }
}

OnDemandLib.prototype.user_logoff = OnDemandLib.prototype.sso_logoff;

//
//  query_user
//

OnDemandLib.prototype.query_user = function(fields, callback) {
    var inSoap;
    var x;
    var pageroot = document.location;
    pageroot = pageroot.toString();
    pageroot = pageroot.substr(0, pageroot.indexOf('/', 10));

    inSoap = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:user="urn:crmondemand/ws/user/" xmlns:user1="urn:/crmondemand/xml/user">';
    inSoap += '<soapenv:Header/>';
    inSoap += '<soapenv:Body>';
    inSoap += '<user:UserWS_UserQueryPage_Input>';
    inSoap += '<user1:ListOfUser>';
    inSoap += '<user1:User>';

    for (x in fields) {
        inSoap += '<user1:' + x + '>' + fields[x] + '</user1:' + x + '>';
    }

    inSoap += '</user1:User>';
    inSoap += '</user1:ListOfUser>';
    inSoap += '</user:UserWS_UserQueryPage_Input>';
    inSoap += '</soapenv:Body>';
    inSoap += '</soapenv:Envelope>';

    // Submit XML request, run callback function upon response
    try {
        var oXMLHttpRequest = new XMLHttpRequest;
        if (callback) {

            oXMLHttpRequest.open('POST', pageroot + '/Services/Integration', true);
            oXMLHttpRequest.onreadystatechange = function() {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (this.status == 200) callback(oXMLHttpRequest.responseXML);
                    else if (this.status == 500) {
                        alert('Server timeout due to inactivity, reloading page!');
                        top.location.reload();
                    }
                    else alert('Error: ' + this.status + ' - ' + this.responseText);
                }
            }
        }
        else {
            oXMLHttpRequest.open('POST', pageroot + '/Services/Integration', false);
        }

        oXMLHttpRequest.setRequestHeader('SOAPAction', '"document/urn:crmondemand/ws/user/:UserQueryPage"');
        oXMLHttpRequest.setRequestHeader('Content-Type', 'text/xml');
        oXMLHttpRequest.send(inSoap);
    }
    catch (e) {
        alert('Error: ' + e.message);
    }

    if (callback.length == 0) {
        alert(oXMLHttpRequest.responseText);
        return oXMLHttpRequest.responseXML;
    }
}

OnDemandLib.prototype.getListData = function(type, xmlData) {
    var arr = [];
    jQuery(type, xmlData).each(function(index, item) {
        var obj = {};
        jQuery(item).children().each(function(index, item) {
          var fieldName = jQuery(item).get(0).tagName;
          var fieldValue = jQuery(item).text();
          obj[fieldName] = fieldValue;
        });
        arr.push(obj);
    });
    return arr;    
}

OnDemandLib.prototype.my_query_user = function(fields, callback) {
    var that = this;
    var inSoap;
    var x;
    var pageroot = document.location;
    pageroot = pageroot.toString();
    pageroot = pageroot.substr(0, pageroot.indexOf('/', 10));

    inSoap = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">';
    inSoap += '<soapenv:Header/>';
    inSoap += '<soapenv:Body>';
    inSoap += '<UserWS_UserQueryPage_Input xmlns="urn:crmondemand/ws/user/">';
    inSoap += '<ListOfUser>';
    inSoap += '<User>';

    for (x in fields) {
        inSoap += '<' + x + '>' + fields[x] + '</' + x + '>';
    }

    inSoap += '</User>';
    inSoap += '</ListOfUser>';
    inSoap += '</UserWS_UserQueryPage_Input>';
    inSoap += '</soapenv:Body>';
    inSoap += '</soapenv:Envelope>';

    // Submit XML request, run callback function upon response
    try {
        
        jQuery.ajax({
            url: pageroot + '/Services/Integration',
            type: 'POST',
            contentType: 'text/xml',
            dataType: 'xml',
            data: inSoap,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('SOAPAction', '"document/urn:crmondemand/ws/user/:UserQueryPage"');
            },            
            complete: function(xhr, textStatus) {
            },
            success: function(xmlData, textStatus) {
                var items = that.getListData('User', xmlData);
                callback(items);
            }
        });
        
    } catch (e) {
        alert('Error: ' + e.message);
    }
}

OnDemandLib.prototype.manualQuery = function(entityType, fields, soapAction, soapRequestTemplate, callback) {
    var that = this;
    
    var pageroot = document.location;
    pageroot = pageroot.toString();
    pageroot = pageroot.substr(0, pageroot.indexOf('/', 10));    
    
    var entityTypeLowercase = entityType.toLowerCase();
    var entityTypeCapitalized = entityTypeLowercase.substring(0,1).toUpperCase() + entityTypeLowercase.substring(1); 
    
    var fieldsXML = '';
    for (fieldName in fields) {
        fieldsXML += '<' + fieldName + '>' + fields[fieldName] + '</' + fieldName + '>';
    }
    
    var soapRequest = soapRequestTemplate.replace("<%=fields%>", fieldsXML);
      
    jQuery.ajax({
        url: pageroot + '/Services/Integration',
        type: 'POST',
        contentType: 'text/xml',
        dataType: 'xml',
        data: soapRequest,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('SOAPAction', '"' + soapAction + '"');
        },            
        success: function(xmlData, textStatus) {
            var items = that.getListData(entityTypeCapitalized, xmlData);

            if (callback.itemsCache) {
                callback.itemsCache = callback.itemsCache.concat(items);
            } else {
                callback.itemsCache = [].concat(items);
            }

            var lastPage = jQuery('ns\\:LastPage', xmlData).text().toLowerCase();

            if (lastPage == 'true') {
                callback.more = false;
                callback(callback.itemsCache);
            } else {
                callback.more = true;
                that.entityQuery(entityType, fields, callback);                    
            }
            window.xmlData = xmlData;
        }
    });

}

OnDemandLib.prototype.entityQuery = function(entityType, fields, callback) {    
    var that = this;
    var inSoap;
    var x;
    
    var entityTypeLowercase = entityType.toLowerCase();
    var entityTypeCapitalized = entityTypeLowercase.substring(0, 1).toUpperCase() + entityTypeLowercase.substring(1);
    
    var pageroot = document.location;
    pageroot = pageroot.toString();
    pageroot = pageroot.substr(0, pageroot.indexOf('/', 10));
    
    var pageSize = 5;
    
    if (typeof callback.startRowNum === 'undefined') {
         callback.startRowNum = 0;
    } else {
        if (callback.startRowNum === 0) {
            callback.startRowNum = pageSize + 1;
        } else {
            callback.startRowNum = callback.startRowNum + pageSize;
        }
    }

    inSoap = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">';
    inSoap += '<soapenv:Header/>';
    inSoap += '<soapenv:Body>';
    inSoap += '<' + entityTypeCapitalized + 'WS_' + entityTypeCapitalized + 'QueryPage_Input xmlns="urn:crmondemand/ws/' + entityTypeLowercase + '/">';
    inSoap += '<StartRowNum>' + callback.startRowNum + '</StartRowNum>';
    inSoap += '<PageSize>' + pageSize + '</PageSize>';
    inSoap += '<ListOf' + entityTypeCapitalized + '>';
    inSoap += '<' + entityTypeCapitalized + '>';

    for (x in fields) {
        inSoap += '<' + x + '>' + fields[x] + '</' + x + '>';
    }

    inSoap += '</' + entityTypeCapitalized + '>';
    inSoap += '</ListOf' + entityTypeCapitalized + '>';
    inSoap += '</' + entityTypeCapitalized + 'WS_' + entityTypeCapitalized + 'QueryPage_Input>';
    inSoap += '</soapenv:Body>';
    inSoap += '</soapenv:Envelope>';

    // Submit XML request, run callback function upon response
    try {
        
        jQuery.ajax({
            url: pageroot + '/Services/Integration',
            type: 'POST',
            contentType: 'text/xml',
            dataType: 'xml',
            data: inSoap,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('SOAPAction', '"document/urn:crmondemand/ws/' + entityTypeLowercase + '/:' + entityTypeCapitalized + 'QueryPage"');
            },            
            complete: function(xhr, textStatus) {
            },
            success: function(xmlData, textStatus) {
                var items = that.getListData(entityTypeCapitalized, xmlData);

                if (callback.itemsCache) {
                    callback.itemsCache = callback.itemsCache.concat(items);
                } else {
                    callback.itemsCache = [].concat(items);
                }

                var lastPage = jQuery('ns\\:LastPage', xmlData).text().toLowerCase();

                if (lastPage == 'true') {
                    callback.more = false;
                    callback(callback.itemsCache);
                } else {
                    callback.more = true;
                    that.entityQuery(entityType, fields, callback);                    
                }
                window.xmlData = xmlData;
            }
        });
        
    } catch (e) {
        alert('Error: ' + e.message);
    }
}

OnDemandLib.prototype.activityQuery = function(fields, callback) {
    var soapAction = 'document/urn:crmondemand/ws/activity/10/2004:Activity_QueryPage';
    var soapRequestTemplate = '' +
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
        '   <soapenv:Header/>' +
        '   <soapenv:Body>' +
        '      <ActivityNWS_Activity_QueryPage_Input xmlns="urn:crmondemand/ws/activity/10/2004">' +
        '         <PageSize>100</PageSize>' +
        '         <ListOfActivity>' +
        '            <Activity>' +
        '               <%=fields%>' +
        '            </Activity>' +
        '         </ListOfActivity>' +
        '         <StartRowNum>0</StartRowNum>' +
        '      </ActivityNWS_Activity_QueryPage_Input>' +
        '   </soapenv:Body>' +
        '</soapenv:Envelope>';
        
    this.manualQuery('Activity', fields, soapAction, soapRequestTemplate, function(data) {
        callback(data);
    });
}

OnDemandLib.prototype.login = function(callback) {

    var userName = this.admin.userName;
    var password = this.admin.password;

    jQuery.ajax({
       url: '/Services/Integration?command=login',
       dataType: 'xml',
       beforeSend: function(xhr) {
           xhr.setRequestHeader('UserName', userName);
           xhr.setRequestHeader('Password', password);               
       },
       complete: function(xhr, textStatus) {
           callback.call(this, xhr, textStatus);    
       }
   });
    
}




if (!window.odlib) {
    window.odlib = new OnDemandLib;
}

})();
