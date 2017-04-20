function executeContentScript()
{
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'contentScript.js'
	});
}

function fetchClick(e) {		
	executeContentScript();
}

function clearClick(e) {
	
	chrome.storage.local.set({ "Profiles": [] });

	document.getElementById('users').innerHTML = "<li>- Empty -</li>";
	document.getElementById('matches').innerHTML = "<li>- Empty -</li>";	
}

function removeClick(e){

	var userToRemove = e.target.parentElement.childNodes[0].data;

	chrome.storage.local.get({"Profiles" :[]}, function(result){	
	
		var profiles = result.Profiles;
		console.log('Profiles Assigned: ' + profiles.length);
		for(var a = profiles.length-1; a >= 0; a--)
		{
			if(profiles[a].user == userToRemove)
			{
				console.log('Removing User: ' + userToRemove);
				profiles.splice(a,1);
				break;
			}
		}
	
		chrome.storage.local.set({ "Profiles": profiles }, function(){
			e.target.parentElement.remove();

			if(profiles.length < 2)
			{
				document.getElementById('matches').innerHTML = "<li>- Empty -</li>";	
			}
			
			if(profiles.length === 0)
			{
				document.getElementById('users').innerHTML = "<li>- Empty -</li>";	
			}
		});
	
	});
}

chrome.runtime.onMessage.addListener(function (response) {

	var userElement = document.getElementById('users');
	userElement.innerHTML = "";
	[].forEach.call(response.users, function (record) {		
		var liElement = document.createElement("li");
		liElement.appendChild(document.createTextNode(record.user));
		
		var removeLink = document.createElement("a");
		
		removeLink.setAttribute("href", "#");
		removeLink.setAttribute("class", "remove");
		removeLink.innerHTML = "X";	
		
		liElement.appendChild(removeLink);
		
		userElement.appendChild(liElement);
	});	
		
	var removeLinks = document.getElementsByClassName('remove');
	[].forEach.call(removeLinks, function (item) {
		item.addEventListener('click', removeClick);
	});
	
	
	var matchesElement = document.getElementById('matches');
	matchesElement.innerHTML = "";
	[].forEach.call(response.matches, function (item) {
		var liElement = document.createElement("li");
		liElement.appendChild(document.createTextNode(item));	
		matchesElement.appendChild(liElement);
	});
	
	if(response.matches.length == 0)
	{
		var liElement = document.createElement("li");
		liElement.appendChild(document.createTextNode("- Empty -"));	
		matchesElement.appendChild(liElement);
	}
});

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('fetch').addEventListener('click', fetchClick);
	document.getElementById('clearData').addEventListener('click', clearClick);
	executeContentScript();
});