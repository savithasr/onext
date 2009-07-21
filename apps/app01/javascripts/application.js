// sandbox ourselves to guarantee we don't interfere with OnDemand platform
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
<tr name="" id=""><td class="fl" style="vertical-align:middle"><span class="fl">Product Category</span></td><td class="fv" style="padding-left:6px;height:2px;vertical-align:middle"><input name="CallProdDetailNew.Primary Product Line Name" id="CallProdDetailNew.Primary Product Line Name" maxlength="100" class="inputReadOnly" tabindex="-1" readonly="readonly" type="text" value="" size="20" /></td></tr>
	   
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