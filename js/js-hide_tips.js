document.querySelectorAll('a.dismiss').forEach(function(item){
	item.addEventListener('click', function(e){
		item.parentElement.classList.add('hide');
		// item.parentElement.parentElement.classList.remove('grid-container');
	});
});

// function hideTips(timeout) {
// 	var hiddenTime = 1000;
// 	var appBanners = document.getElementsByClassName('tip');
// 	for (var i = 0; i < appBanners.length; i++) {
// 		hideTipsDelay(appBanners[i],timeout,hiddenTime);
// 		timeout += timeout;
// 	}
// }

// function hideTipsDelay (target, timeout, hiddenTime) {
// 	setTimeout(function () { 
// 		target.classList.add('hide');
// 	},timeout); 
// }