function getCurrentUserListItems()
{
	var titleElement = document.getElementsByClassName("title");

	if(titleElement.length == 0 || titleElement[0].innerText != "My List") 
	{
		alert('Error, make sure you are within the My List page on Netflix.com');
		return;
	}
		
	var items = document.getElementsByClassName("slider-item");
	
	var userList = [];
	[].forEach.call(items, function (item) {
		userList.push(item.innerText);
	});
		
	return userList;
}

function getCurrentUser()
{
	var userElement = document.getElementsByClassName("profile-name");
	if(userElement.length == 1)
	{
		return userElement[0].innerText;
	}
}

function compareUsers(user1, user2)
{
	var matches = [];
	if(user2 != undefined)
	{
		for(var b =0;b < user1.items.length;b++)
		{
			for(var c=0; c<user2.items.length;c++)
			{
				if(user2.items[c] == user1.items[b])
				{
					matches.push(user2.items[c]);
					break;
				}
			}
		}
	}
	
	return matches;
}


console.log('Fetch Start');
chrome.storage.local.get({"Profiles" :[]}, function(result){	
	var profiles = result.Profiles;

	var profile = {
		user: getCurrentUser(),
		items: getCurrentUserListItems()
	};					
	
	
	for(var a = profiles.length-1; a >= 0; a--)
	{
		if(profiles[a].user == profile.user)
		{
			profiles.splice(a,1);
		}
	}		
	console.log(profile.user);
	
	if(profile.user != null && profile.items != null && profile.items.length > 0)
	{
		profiles.push(profile);
	
		chrome.storage.local.set({ "Profiles": profiles }, function(){
			// Yucky, but will expand to run through all added profiles in the future.
			var user1 = profiles[0];
			var user2 = profiles[1];
			
			var matches = compareUsers(user1, user2);				
					
			var response = { 
				"users" : profiles,
				"matches": matches
			};
			
			console.log('Profile Count: '  + profiles.length);
			console.log(profiles);
			
			chrome.runtime.sendMessage(response);
			
			console.log('Fetch End');
		});
	}
});




