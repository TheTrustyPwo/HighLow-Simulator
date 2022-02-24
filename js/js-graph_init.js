	function graph_init (pointData, container_id, label, color) {
		console.log("Graph Init");
		let ctx = document.getElementById(container_id).getContext('2d');

		const data = {
			datasets: [{
				borderColor: color,
				borderWidth: 1,
				data: pointData,
				label: 'Profit',
				radius: 0,
			}]
		};

		const decimation = {
			enabled: false,
			algorithm: 'min-max',
		};

		let chart = new Chart(ctx, {
		    // The type of chart we want to create
			type: 'line',
			
		    // The data for our dataset
		 //   data: {
			// 	datasets: [{
		 //            label: label,
		 //            //backgroundColor: 'rgb(255, 127, 80)',
		 //            borderColor: color,
		 //            data: pointData,
		 //            radius: 0
			// 	}]
			// },
			data: data,
		    // Configuration options
		   options: {
		    	animation: false,
				// parsing: false,
				responsive: true,
				normalized: true,
		    	// legend: {
		     //        display: true,
		     //        labels: {
		     //            fontColor: color,
		     //            fontSize: 9
		     //        }
	      //   	},

	        	aspectRatio: 2.5,
	     //    	interaction: {
			   //    mode: 'nearest',
			   //    axis: 'x',
			   //    intersect: false
			   // },
	        	plugins: {
					decimation: decimation,
					tooltip: {
	        			enabled: false
	        		},
			   },
				scales: {
					x: {
						type: 'linear',
						ticks: {
							source: 'auto',
							// Disabled rotation for performance
							maxRotation: 0,
							autoSkip: true
						}
			      },
			   //    y: {
			   //    	type: "linear",
						// display: true,
						// beginAtZero: true
				  //  }
		      }
	    	}
		});


		return chart;
	}