var api = function(){
	var nutriAppId = 'xxxxxxxx'; //remove before deploying
	var nutriAppKey ='xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; //remove before deploying
	return{
		sendEmail: function(address){
			var activity = new MozActivity({
				name:"new",
				data:{
					type:"mail",
					url:address
				}
			});
		},
		getContacts : function(){
			var allContacts = navigator.mozContacts.getAll({sortBy:"familyName", sortOrder:"descending"});
			allContacts.onsuccess=function(event){
				var cursor = event.target.result;
				if(cursor.result)
				{
					raiseDataReturnedEvent(cursor.result);
				}
				else
				{
					console.log("No Contacts");
				}
			};
			allContacts.onerror = function(){
				console.warn("Error getting contacts.");
			};
		},
		getNutrtionixSearch: function(searchPhrase){
			var url = 'http://api.nutritionix.com/v1/search/'+searchPhrase+'?results=0%3A10&cal_min=0&cal_max=50000&fields=item_name%2Cbrand_name%2Citem_id%2Cbrand_id&appId='+nutriAppId+'&appKey='+nutriAppKey;
			var xhr = new XMLHttpRequest({mozSystem:true});
			xhr.overrideMimeType('application/json');
			xhr.open("GET",url,true);
			xhr.onreadystatechange = function(){
				if(xhr.status===200&&xhr.readyState===4){
					raiseDataReturnedEvent(JSON.parse(xhr.responseText));
				}
			};
			xhr.onerror=function(){
				console.log('error occoured accesing request');
			};
			xhr.send();
		},
		getNutritionixDetails: function(id){
			var url ='http://api.nutritionix.com/v1/item/'+ id +'?appId='+nutriAppId+'&appKey='+ nutriAppKey;
			var xhr = new XMLHttpRequest({mozSystem:true});
			xhr.overrideMimeType('application/json');
			xhr.open("GET",url,true);
			xhr.onreadystatechange = function(){
				if(xhr.status===200&&xhr.readyState===4){
					raiseDataReturnedEvent(JSON.parse(xhr.responseText));
				}
			};
			xhr.onerror=function(){
				console.log('error occoured accesing request');
			};
			xhr.send();
		}
	};
}();
function raiseDataReturnedEvent(data){
	var event = new CustomEvent("datareturned",
	{detail: {dataReturned:data},
	bubbles:true,
	cancelable:true});
	document.dispatchEvent(event);
}