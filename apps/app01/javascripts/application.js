// sandbox ourselves to guarantee we don't interfere with OnDemand platform--abhishek test
// JS internals
jQuery(function($) {
    
// bail if we don't have our main lib
if (typeof jQuery === 'undefined') {
    alert('Custom application extension failed: jQuery not available');
    return;
}

function $get(key) {
    return $("[id='" + key + "']");
}

//***************************************************************************
// Plugin Handlers
//***************************************************************************
var copyPreviousObjectiveHandler = function() {
        var ownerId = $get('AccountCallInsert.Owner Id').val();
        var contactPerId = $get('AccountCallInsert.Contact Per Id').val();
        var $objectiveInputElement = $get('AccountCallInsert.VONDMED Call');
        var objectiveValue = $objectiveInputElement.val();
        
        // already has a value so don't overwrite
        if (objectiveValue !== '') { return; }

        var obj = {ownerId: ownerId, contactPerId: contactPerId, objectiveValue: objectiveValue};

        console.dir(obj);
        
        var fields = {
            ActivityId: '',
            PrimaryContactId: " ='" + contactPerId + "' ",
            PrimaryContactLastName: '',
            PrimaryContactFirstName: '',
            Owner: '',
            AccountId: '',
            CallType: '',
            PrimaryContact: '',
            CreatedBy: '',
            Location: '',
            Objective: '',
            OwnerId: " ='" + ownerId + "' ",
            Status: '',
            Type: '',
            ActivitySubType: '',
            CreatedDate: '',
            ModifiedDate: '',
            Date: '',
            StartTime: '',
            EndTime: ''
        };
        
         odlib.activityQuery(fields, function(data) {

             // no previous activities on contact
             if (data.length === 0) {
                 return;
             }
             
             data.sort(function(item1, item2) {
                 return Date.parse(item1.StartTime) - Date.parse(item2.StartTime);
             });
             
             var lastObjectiveValue = data[data.length - 1].Objective;
             $objectiveInputElement.val(lastObjectiveValue);
             console.dir(data);            
    });
    
};

var copyContactPreviousObjectiveHandler = function() {
        var ownerId = $get('ContactCallInsert.Owner Id').val();
        var contactPerId = $get('ContactCallInsert.Contact Per Id').val();
        var $objectiveInputElement = $get('ContactCallInsert.VONDMED Call');
        var objectiveValue = $objectiveInputElement.val();
        
        // already has a value so don't overwrite
        if (objectiveValue !== '') { return; }

        var obj = {ownerId: ownerId, contactPerId: contactPerId, objectiveValue: objectiveValue};

        console.dir(obj);
        
        var fields = {
            ActivityId: '',
            PrimaryContactId: " ='" + contactPerId + "' ",
            PrimaryContactLastName: '',
            PrimaryContactFirstName: '',
            Owner: '',
            AccountId: '',
            CallType: '',
            PrimaryContact: '',
            CreatedBy: '',
            Location: '',
            Objective: '',
            OwnerId: " ='" + ownerId + "' ",
            Status: '',
            Type: '',
            ActivitySubType: '',
            CreatedDate: '',
            ModifiedDate: '',
            Date: '',
            StartTime: '',
            EndTime: ''
        };
        
         odlib.activityQuery(fields, function(data) {

             // no previous activities on contact
             if (data.length === 0) {
                 return;
             }
             
             data.sort(function(item1, item2) {
                 return Date.parse(item1.StartTime) - Date.parse(item2.StartTime);
             });
             
             var lastObjectiveValue = data[data.length - 1].Objective;
             $objectiveInputElement.val(lastObjectiveValue);
             console.dir(data);            
    });
    
};

var augmentCallDetailsEntry = function() {
	var row =  "<tr width='100%'>";
	row += "<td class="fl" style="vertical-align:middle"><span class="requiredText">Product*</span></td><td class="fv" style="padding-left:6px;height:2px;vertical-align:middle"><input name="CallProdDetailNew.Name" size="" tabindex="3" type="text" value="" class="inputControl" id="CallProdDetailNew.Name" /><input type="hidden" id="CallProdDetailNew.Product Id" name="CallProdDetailNew.Product Id" tabindex="-1" value=""><input type="hidden" id="CallProdDetailNew.Name.hidden" name="CallProdDetailNew.Name.hidden" tabindex="-1" value=""><img class="popup" onclick="openAssocPopup('AssocProductPopup?mapBC=Pharma+Call+Products+Detailed&#38;OACTRL=Name&#38;ophi=CallProdDetailNew.Product+Id&#38;pfid=CallProdDetailNew&#38;OMTHD=AssocPopup&#38;OMTGT=PopupSearchList&#38;assocInit=Y&#38;opht=4&#38;OAOBJ=Call+ProdDetail&#38;mapField=Name&#38;ophd=CallProdDetailNew.Name&#38;ophpd=1&#38;disableclear=Y&#38;ophr=AssocProductPopup',350,500,'OccamPopup1','CallProdDetailNew.Product Id',true,false);" src="../1.10.0.1079.0.03/base/theme                s/oracle/images/iconSearch.gif" /></td>";
	row += "<td>Priority: <input type='text' size='1'></input></td>";
	row += "<td>Indication: <select><option></option><option>Allergy</option><option>Asthma</option></td>";
	row += "<td>Issues: <select><option></option><option>Side effects</option><option>Efficacy</option></td>";
	row += "<td><input type='button' name='delete' value='delete' onclick='jQuery(this).parent().parent().remove()'></input></td>";
	row += "</tr>";

	var html = "<div>";
	html += "<table id='mrk_details'>";
	html += row;
	html += "</table>";
	html += "</div>";

	var e = jQuery("[class='buttonChildTitleBarTD']").filter("[id^='CallsProdDetail']").get(0);
	e.onclick = function() {};
	jQuery("[class='buttonChildTitleBarTD']").filter("[id^='CallsProdDetail']").click(function() {
		if ( jQuery("#mrk_details").size() === 0 ) {
			jQuery("#CallsProdDetailChildListDiv").next().replaceWith(html);
		} else {
			jQuery("#mrk_details").append(row);
		}
	});    
};

//***************************************************************************
// Plugin Manager
//***************************************************************************
function PluginManager(pluginDefinitions) { this.pluginDefinitions = pluginDefinitions; }

PluginManager.prototype.applyPlugins = function() {

    // find out where we're at within the OnDemand application based on the URL
    var pathname = window.location.pathname;
    var index = pathname.lastIndexOf('/');
    var pageName = pathname.substring(index + 1);

    // apply plugins based on the URL pattern match
    $.each(this.pluginDefinitions, function(index, plugin) {   

        console.log('checking plugin match: ' + plugin.name);
        if (pathname.match(plugin.invokeOnPattern)) {
            console.log('invoking plugin: ' + plugin.name);
            if (plugin.requiresLogin) {
                odlib.login(function(xhr, textStatus) {
                    plugin.handler.call(plugin);
                });
            } else {
                plugin.handler.call(plugin);
            }
        }

    });
    
}

//***************************************************************************
// Plugin Definitions
//***************************************************************************
var pluginsDefinitions = [
    {
        name: 'Copy Previous Objective',
        invokeOnPattern: /AccountCallInsert/ig,
        handler: copyPreviousObjectiveHandler,
        requiresLogin: true
    },
	{
        name: 'Copy Previous Objective',
        invokeOnPattern: /ContactCallInsert/ig,
        handler: copyContactPreviousObjectiveHandler,
        requiresLogin: true
    },
    {
        name: 'Augment Call Details Entry',
        invokeOnPattern: /ContactCallDetail/ig,
        handler: augmentCallDetailsEntry,
        requiresLogin: false
    }
];

//***************************************************************************
// Application Logic Entry Point
//***************************************************************************

// find out where we're at in OnDemand
function applyPlugins() {
    var pluginManager = new PluginManager(pluginsDefinitions);
    pluginManager.applyPlugins();
}

window.applyPlugins = applyPlugins;
applyPlugins();
    
});

/*
var fields = {
    ActivityId: '',
    PrimaryContactId: " ='" + contactPerId + "' ",
    PrimaryContactLastName: '',
    PrimaryContactFirstName: '',
    Owner: '',
    AccountId: '',
    CallType: '',
    PrimaryContact: '',
    CreatedBy: '',
    Location: '',
    Objective: '',
    OwnerId: " ='" + ownerId + "' ",
    Status: '',
    Type: '',
    ActivitySubType: '',
    CreatedDate: '',
    ModifiedDate: '',
    Date: '',
    StartTime: '',
    EndTime: ''
};

if (pageName === 'ContactCallDetail') {
    var valueLabel = $( $("td:contains('Objective')")[1] ).next();
    // TODO: implement objective exists logic
    var currentCallObjectiveExists = $.trim( valueLabel.text() ) !== '';
    if (!currentCallObjectiveExists) {
        // autopopulate Objective with previous call objective
        valueLabel.mouseover();
        valueLabel.click();
        var inlineEditor = jQuery('.iled');
        inlineEditor.val((new Date()).toString() + ': last objective' );
        var okButton = inlineEditor.parent().next().children().get(0);
        okButton.click();
        valueLabel.mouseout();
    }
}

 odlib.activityQuery(fields, function(data) {
     alert( JSON.stringify(data) );
     console.dir(data);
});

     var userFields = {AccountName:''};
     var entities = [
        {
            name: 'Account',
            fields: {AccountName: ''}
        },
        {
            name: 'Contact',
            fields: {ContactFullName: '', ContactId: ''}
        },
        {
            name: 'User',
            fields: {UserLoginId: '', UserId: ''}
        }
     ];


     jQuery.each(entities, function(index, entity) {
         odlib.entityQuery(entity.name, entity.fields, function(data) {
             console.log(entity.name + ' count = ' + data.length);
         });                 
     });

     
     odlib.entityQuery('Contact', {ContactFullName: '', ContactId: ''}, function(data) {
         console.dir(data);
      });

      odlib.user_login(userName, password, function() {
           var userFields = ['FirstName', 'LastName'];
           console.log('begin user_login');
           odlib.query_user(userFields, function(data) {
               console.dir(data);
           });
           console.log('end user_login');        
       });


*/