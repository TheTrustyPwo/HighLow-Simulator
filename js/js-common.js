
//Return a RANDOM number
function random(min,max){
   return min + (max - min) * Math.random();
}

// Load JS just when needed
function loadScript(url, callback){

	var script = document.createElement("script")
	script.type = "text/javascript";

	if (script.readyState){  //IE
	  	script.onreadystatechange = function(){
	      if (script.readyState === "loaded" || script.readyState === "complete"){
				script.onreadystatechange = null;
				callback();
	      }
	  	};
	} else {  //Others
	  	script.onload = function(){
	      callback();
	  	};
	}

	script.src = url;
	document.getElementsByTagName("head")[0].appendChild(script);
}