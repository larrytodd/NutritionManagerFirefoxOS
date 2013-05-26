var nutriAppId = 'XXXXXXX'; //remove before deploying
var nutriAppKey ='XXXXXXXXXXXXXXXXXXXXXXXXXX'; //remove before deploying
var api = {
	sendEmail: function(address){
		var activity = new MozActivity({
			name:"new",
			data:{
				type:"mail",
				url:address
			}
		});
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
function raiseDataReturnedEvent(data){
	var event = new CustomEvent("datareturned",
	{detail: {dataReturned:data},
	bubbles:true,
	cancelable:true});
	document.dispatchEvent(event);
}