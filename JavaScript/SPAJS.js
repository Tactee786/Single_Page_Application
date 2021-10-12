window.addEventListener("load", function()
	{
		/*this is the event listener that is used for the search bar*/
		document.querySelector("#searchForm").addEventListener("submit", searchBar);
	});
	/*this is the main function that is used in the single page application*/
	function searchBar(evt){
		/*prevents the browser form submitting so it can be checked*/
		evt.preventDefault();
		/*get value from the search bar*/
		var search = document.querySelector("#search").value.trim();
		var searchFriendly = search.split(' ').join('+');
		/*gets field error message if teh input is invalid*/
		var email_hint = document.querySelector("#email_error");
		/*used to test field values*/
		var search_ok = true;
		/*if the search value that is entered is not valid then a 
		hint/error message is dispayed to the user */
		if (search.length == 0){
			search_error.classList.remove("hide");
			search_ok = false;
		}else{
			search_error.classList.add("hide");
		}
		/*used to see if the search value is valid and able to be used*/
		/*console.log(search_ok);*/
		if (search_ok == true) {
			/*used to hide the results when a new search value is entered*/
			document.querySelector("#results").classList.add("hide");
			/*used to hide the results message when a new search value is entered*/
			document.querySelector("#searchResults").classList.add("hide");
			/*used to show the loading gif when a new/search item has been entered*/
			document.querySelector("#loading").classList.remove("hide");
			/*this clears the results div content so the new search is the 
			first content in the results*/
			document.querySelector("#results").innerHTML = "";
		
		/*setTimeout function used to allow for the loading animation to be 
		shown to the user and to allow the webpage to get the data that 
		it had requested for the V&A api*/
		setTimeout(function(){
		/*when the results are ready to be shown to the user the loading gif 
		is hidden*/
		document.querySelector("#loading").classList.add("hide");
		/*the results div is shown when the results are ready*/
		document.querySelector("#results").classList.remove("hide");
		/*the search results message is shown when the results are ready 
		to be displayed*/
		document.querySelector("#searchResults").classList.remove("hide");
		/*used to clear the search bar content to allow the user to enter
		new entrys*/
		document.querySelector("#search").value = "";
		/*the value of 1000 is used for the delay is to allow for the 
		loading animation to play and be seen for a certain amount of time*/
		},1000);

		/*this is where the xmlhttprequest starts and then the search 
		url is created using the code below*/
		var xhr = new XMLHttpRequest();
		var url = "https://www.vam.ac.uk/api/json/museumobject/search?q="
		url = url + searchFriendly;
		url = url + "&images=1"
		/*image=1 used to make sure result with images are the only results*/
		xhr.addEventListener("load", function(){
		/*used to see what the status code was for the search*/
		/*console.log(xhr.status);*/

		/*this piece is used to check if the the search is valid and able 
		to get back results and then the results are then looped using a 
		for loop, then default values are applied and then overwritten if 
		if the search result are valid and correct*/
		if (xhr.status == 200 && xhr.readyState == 4) {
			var i, result, results = JSON.parse(xhr.responseText);
			for(i = 0; i < results.records.length; i++){
				result = results.records[i].fields;
				var object = "Unknown";
				if (result.object.length > 0){
					object = result.object
				}
				var artist = "Unknown";
				if(result.artist.length > 0){
					artist = result.artist;
				}
				var date = "Unknown";
				if (result.object.length > 0){
					date = result.date_text
					if(date == undefined){
						date = "Unknown";
					}
				}
				var place = "Unknown";
				if (result.place.length > 0){
					place = result.place
				}
				/*console log used to check if corresponding data is correct*/
				/*console.log(i);
				console.log("object=" + object);
				console.log("artist=" + artist)
				console.log("date=" + date)
				console.log("place=" + place);
				console.log("img=" + result.primary_image_id)*/
				/*this section is used to create the link for the image using the image 
				id from the json file*/
				var imagepart1= result.primary_image_id.substr(0, 6);
				var imageurl = "https://media.vam.ac.uk/media/thira/collection_images/"
				imageurl = imageurl + imagepart1 + "/";
				/*imageurl = imageurl + result.primary_image_id + "_jpg_ws" + ".jpg";*/
				/*used for trying diffrent size of the images available*/
				imageurl = imageurl + result.primary_image_id + "_jpg_w" + ".jpg";
				/*console.log(imageurl);*//*used to show that the image url is made
				correctly for the link to work*/

				/*creates a div for the results to be put inside and class
				for the contents to be styled*/
				var pDiv = document.createElement("div");
				pDiv.setAttribute("id", "resultDiv");
				pDiv.setAttribute("class", "looks");

				/*this section is used to create the image element dynamically 
				for each result and allows fo rerror checking in the image 
				that is loaded*/
				var pImage = document.createElement("img");
				pImage.setAttribute("id", "resultImg");
				pImage.setAttribute("src", imageurl);
				pImage.addEventListener("error", imgError);

				/*this is where the paragraph elements are made dynamically 
				with the corresponding attribute for the data of each 
				record present in the json file*/
				var pObject = document.createElement("p");
				pObject.setAttribute("id", "resultObject");

				var pArtist = document.createElement("p");
				pArtist.setAttribute("id", "resultArtist");

				var pDate = document.createElement("p");
				pDate.setAttribute("id", "resultDate");

				var pPlace = document.createElement("p");
				pPlace.setAttribute("id", "resultPlace");

				/*this section is where the data from the json file 
				is added to the corresponding paragraph element and then 
				appended to its own record div */
				pDiv.appendChild(pImage);
  				pObject.innerText = "Title = " + object;
  				pDiv.appendChild(pObject);
  				pArtist.innerText = "Artist = " + artist;
  				pDiv.appendChild(pArtist);
  				pDate.innerText = "Date = " + date;
  				pDiv.appendChild(pDate);
  				pPlace.innerText = "Place = " + place;
  				pDiv.appendChild(pPlace);

  				/*this allows the div that is made dynamically to be added
  				to the existing results div in the html file*/
				var mainDiv = document.querySelector("#results"); 
  				mainDiv.appendChild(pDiv); 

			}
			/*this is the code needed to allow the user to know if what 
			they have typed is not a valid search value
			i have to first creat a paragragh element in the results div 
			and then input the data that needs to be displayed and then it
			is appended to the div. */
			if (results.records.length == 0){
				var errorCheck = document.querySelector("#results");
				var msgError = document.createElement("p");
				var msgError2 = document.createElement("p");
				msgError.innerText = "Sorry, this doesn't exist.";
				msgError2.innerText= "Please try a seperate search item."
				errorCheck.appendChild(msgError);
				errorCheck.appendChild(msgError2);
			}
		}else{
			/*if there is an error with the webpage a message will be displayed 
			showing the status error code to the user*/
			var errorCheck = document.querySelector("#results");
			var msgError = document.createElement("p");
			msgError.innerText = "Error, " + xhr.status + " code, please try again.";
			errorCheck.appendChild(msgError);
		}
		
		});
		/*this is were the image url is retrieved from */
		xhr.open("GET", url, true);
		xhr.send();
		}else{
		search_error.classList.remove("hide");
		}
	}
	/*this function is used if the image url used is valid and returns
	a real image or if it it not an existing url then a default image will
	be displayed*/
    function imgError(){
    	this.setAttribute("src", "https://ob273.brighton.domains/ass1/Images/inf.png")
    }
