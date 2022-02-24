
function help_init(id, trigger, aclose) {
	
	var el = document.getElementById(id);
	var elclose = document.getElementById(aclose);
	//console.log ("display: "+elclose.style.display);

	if ( window.innerWidth > 900 ) {
		// Desktop 
		document.getElementById(trigger).addEventListener("click", function(e){
			el.classList.remove("hidden");
			el.style.top = e.clientY+"px";
			el.style.left = e.clientX+"px";
			e.stopPropagation();
		});

	} else {
		// Mobile 
		document.getElementById(trigger).addEventListener("mouseover", function(e){
			document.getElementById(aclose).classList.remove("hidden");
			el.classList.remove("hidden");
			el.style.top = "100px";
			el.style.left = "0";
			el.style.right = "0";
			el.style.marginRight = "auto";
			el.style.marginLeft = "auto";
			el.style.width = "30em";
		});

		document.getElementById(trigger).addEventListener("touchstart", function(e){
			document.getElementById(aclose).classList.remove("hidden");
			el.classList.remove("hidden");
			el.style.top = "100px";
			el.style.left = "0";
			el.style.right = "0";
			el.style.marginRight = "auto";
			el.style.marginLeft = "auto";
			el.style.width = "30em";
			e.preventDefault();
			e.stopPropagation();
		});

		document.getElementById(trigger).addEventListener("touchend", function(e){
			e.preventDefault();
			e.stopPropagation();
		});

		document.getElementById(aclose).addEventListener("touchstart", function(){
			el.classList.add("hidden");
		});
	}

	el.addEventListener("click", function(e){
		console.log("click inside");
		e.stopPropagation();
	});

	document.addEventListener("click", function () {
		var el = document.getElementById(id);
		el.classList.add("hidden");
	});

	document.getElementById(aclose).addEventListener("click", function(){
		el.classList.add("hidden");
	});
	
}
