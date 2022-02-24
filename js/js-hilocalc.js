var STRATEGY, MIN_BET, BAS_BET, ODDS, INCR, MAX_PLAYS, MAX_ROLLS, MAX_BET, MAX_WIN, MARGIN, MIN_LOSSES_BEFORE_PLAY, WAIT_PLAY_AFTER_LOSSES;
// var N;
// var UPDATE_DOM = true;
var isPlaying=false;
var idleTime=50;
var chunkSize=1000;
var maxNum=10000;

// Multiply Vars
var bet, past_bet, rowl, roww, wager, variance, tot_rolls, game_play_count, profit;
var max_rowl, max_roww;
var limit_low, limit_high;
var max_amount_bet=0;

var graphScriptLoaded = false;
var i_arr=[];
var profit_arr = [];
var chart;

// Strategy2 vars
var game2_consecutive_lost_passed = false;
var game2_finished_loosing = false;
var game2_play_after_losses=0;
var game2_step=0;

checkInputs();

document.getElementById('strategy').addEventListener('change', function (){
	checkInputs();
});

document.getElementById('startcalc').addEventListener('click', function(e) {
	setVars();
	checkInputs();
	setHiLoLimits();
	handler();

});

function drawGraph(i_arr, profit_arr){
	
	if (!Boolean(graphScriptLoaded)) {
		loadScript('https://cdn.jsdelivr.net/npm/chart.js@3.2.1', function(){
			graphScriptLoaded = true;

			chart=graph_init(profit_arr, 'chart_wagered', 'Profit', 'rgb(255, 127, 80)');
			// chart=chartArr[1];
			// action=chartArr[0];
		});
	} else {
		if(chart && typeof chart.destroy === 'function'){ 
		   chart.destroy();
			console.log("Chart destroyed");
		}
		chart=graph_init(profit_arr, 'chart_wagered', 'Profit', 'rgb(255, 127, 80)');
	}

}

// Set Vars
function setVars() {
	game2_consecutive_lost_passed = false;
	game2_finished_loosing = false;
	game2_play_after_losses = 0; 
	game2_step = 0; 
	bet=0;
	past_bet=0;
	roww =0;
	rowl=0;
	game_play_count=0;
	tot_rolls=0;
	max_amount_bet=0;
	wager = 0;
	profit =0;
	max_roww=0; max_rowl=0;
	STRATEGY = document.getElementById('strategy').value;
	MIN_BET = document.getElementById('min_bet').value;
	BAS_BET = document.getElementById('bas_bet').value;
	ODDS = document.getElementById('odds').value;
	INCR = document.getElementById('incr').value;
	MAX_PLAYS = document.getElementById('max_plays').value;
	MAX_ROLLS = document.getElementById('max_rolls').value;
	MAX_BET = document.getElementById('max_bet').value;
	MAX_WIN = document.getElementById('max_win').value;
	HI_LO = document.getElementById('hilo').value;
	MIN_LOSSES_BEFORE_PLAY = document.getElementById('min_losses').value;
	WAIT_PLAY_AFTER_LOSSES = document.getElementById('wait_play').value;
	MARGIN = document.getElementById('margin').value.replace(/[^0-9.]/g, '');
	chunkSize = document.getElementById('chunk_size').value;
	idleTime = document.getElementById('idle_time').value;
}

function setHiLoLimits() {
	var a = parseFloat(maxNum/ODDS);
	var m = Math.round(a*MARGIN/100);
	limit_low = a-m;
	limit_high = maxNum-a+m;
	console.log(a+"---"+m+"---"+limit_low+"---"+limit_high);
}

function playInterval(i,s) {
	return new Promise((resolve) => {
		setTimeout(function(){
			var hl, N, begin, end;
			if (Boolean(isPlaying)) {
				console.log("Overlapping Playing on chunk: "+i);
			}

			isPlaying=true;
			begin = i*s; if (begin == 0) begin=1;
			end = (i+1)*s-1; if (end > MAX_ROLLS) end=MAX_ROLLS;
			console.log("[playInterval] chunk "+i+", begin from: "+begin+", end to: "+end);
			for (j=begin; j<=end; j++) {
				bet=parseFloat(get_bet_amount(past_bet,rowl,roww));
				hl=get_bet_hilo();

				past_bet=bet;
				wager+=bet;
				tot_rolls++;
				if (max_amount_bet<bet) max_amount_bet=bet;

				N=Math.round(random(1,maxNum));
				var won = getWinLose(hl,N);

				if (Boolean(won)) {profit+=(bet*(ODDS-1));}
				else {profit-=bet;}
				if (max_roww < roww) { max_roww = roww;}
				if (max_rowl < rowl) { max_rowl = rowl;}
				profit_arr.push({ x: j, y: profit.toFixed(8) });
				// i_arr.push(j);
				//console.log("#"+j+"("+game_play_count+")("+game2_step+") --> rolled "+N+", bet "+bet+" on "+hl+", won > "+won+"("+roww+"/"+rowl+"), p: "+profit);
			}
			isPlaying=false;
			updateDom(N);
			resolve({ 'status prc': 'done '+i, 'lastnum': N });
		},i*idleTime);
	});
}

function getWinLose(hl, N){
	if (hl == 'L') {
		if (N<limit_low) { roww++; rowl=0; return true;} 
		else { rowl++; roww=0; return false;}
	} else {
		if (N>limit_high) { roww++; rowl=0; return true;} 
		else { rowl++; roww=0; return false;}
	}
}

function updateDom(N) {
	if (N<5000) {
		document.getElementById("res_num").classList.remove('coral');
		document.getElementById("res_num").classList.add('lime');
	} else {
		document.getElementById("res_num").classList.remove('lime');
		document.getElementById("res_num").classList.add('coral');
	}
	//console.log("val "+n);
	document.getElementById("res_num").innerHTML = N;
	console.log("update DOM");
}

function get_bet_amount(past_bet, consecutive_lost, consecutive_win){
	past_bet=parseFloat(past_bet);
   if (STRATEGY == 0) {
   	if (consecutive_lost == 0) {
         return BAS_BET;
		} else {
			if (consecutive_lost == 1) { game_play_count++; }
         return past_bet*2;
		}
	} else if (STRATEGY == 1 || WAIT_PLAY_AFTER_LOSSES == 0){
		if (consecutive_lost < MIN_LOSSES_BEFORE_PLAY) {
         return MIN_BET;
		} else if (consecutive_lost == MIN_LOSSES_BEFORE_PLAY){
			game_play_count++;
			return BAS_BET;
		} else {
      	return past_bet+(past_bet*INCR/100);
      }
	} else if (STRATEGY == 2 || STRATEGY == 3) {
		if (!Boolean(game2_consecutive_lost_passed)) {
			if (consecutive_lost < MIN_LOSSES_BEFORE_PLAY) {
				game2_step=1;
				return MIN_BET;
			} else if (consecutive_lost == MIN_LOSSES_BEFORE_PLAY){
				// passed tot lost, next step -> else
				game2_step=2;
				game2_consecutive_lost_passed = true;
				return MIN_BET;
			} else return "-009";
		} else {
			if (!Boolean(game2_finished_loosing)) {
				if (consecutive_win == 0 ) {
					game2_step=3;
					return MIN_BET;
				} else {
					//finished loosing, first win, next step -> else
					game2_step=4;
					game2_finished_loosing=true;
					game2_play_after_losses++;
					//console.log('recursive call, step4');
					return get_bet_amount(MIN_BET,consecutive_lost,consecutive_win);
				}  
         } else {
				if (game2_step<6){
					if (game2_play_after_losses < WAIT_PLAY_AFTER_LOSSES) {
					   game2_step=5;
					   game2_play_after_losses++;
					   return MIN_BET;
					} else if (game2_play_after_losses >= WAIT_PLAY_AFTER_LOSSES){
					   // Begin to play, next step -> else
					   game2_step=6;
					   game_play_count++;
					   return BAS_BET;
					} else return "-008";
				} else {
					if (consecutive_lost > 0) {
					   game2_step=7;
					   return past_bet+(past_bet*INCR/100);
					} else {
					   // Playing and won, go back to the begin
					   game2_step=0;
					   game2_consecutive_lost_passed=false;
					   game2_finished_loosing=false;
					   game2_play_after_losses=0;
					   //console.log("Won, back to begin");
					   if (STRATEGY == 3) {
							MIN_LOSSES_BEFORE_PLAY++;
							if (LOGGING > 2) console.log("New MIN_LOSSES_BEFORE_PLAY value is: "+MIN_LOSSES_BEFORE_PLAY); 
					   }
					   return MIN_BET;
					}
				}
			}
		}	
	} else return "-010";
}

function get_bet_hilo () {
	if (HI_LO == 1) {
	  	return "H";
	} else if (HI_LO == 2) {
	  	return "L";
	} else {
	  	var r = random(1,10);
	  	if (r<5) return 'H';
	  	else return 'L';
	}
}


async function handler() {
	var blocks=Math.floor(MAX_ROLLS/chunkSize);
	console.log(blocks);
	var arrayOfPromises = [];
	for (i=0; i<=blocks; i++) {
		arrayOfPromises[i]=playInterval(i,chunkSize);
	}
	
   await multiPlayer(arrayOfPromises);
   console.log(`processing is complete`);
   console.log (`max_bet=${max_amount_bet}, plays=${game_play_count}`);
   document.getElementById('res_wagered').lastChild.innerHTML = parseFloat(wager).toFixed(8).slice(0,10);
   document.getElementById('res_max_bet').lastChild.innerHTML = parseFloat(max_amount_bet).toFixed(8).slice(0,10);
   document.getElementById('res_rolls').lastChild.innerHTML = tot_rolls;
   document.getElementById('res_plays').lastChild.innerHTML = game_play_count;
   document.getElementById('res_max_roww').lastChild.innerHTML = max_roww;
   document.getElementById('res_max_rowl').lastChild.innerHTML = max_rowl;
   document.getElementById('res_profit').lastChild.innerHTML = parseFloat(profit).toFixed(8);
   document.getElementById('result_container').classList.remove('hidden','opaque');

   drawGraph(i_arr, profit_arr);
   i_arr	= []; profit_arr = [];
}

async function multiPlayer(arrayOfPromises) {
	//console.time(`multiPlayer`);
	var t0 = performance.now()
	let responses = await Promise.all(arrayOfPromises);
	for(let r of responses) { console.log(r);}
	var t1 = performance.now();
	console.log(`Execution time ${t1 - t0} ms`);
	document.getElementById('res_exec_time').lastChild.innerHTML = `${parseFloat((t1 - t0)/1000).toFixed(2)} s`;
	checkInputs();
	//console.timeEnd(`multiPlayer`);
	return;
}

function checkInputs() {
	var msg = "";
	STRATEGY = document.getElementById('strategy').value;
	document.getElementById('min_bet').disabled = false;
	document.getElementById('odds').disabled = false;
	document.getElementById('incr').disabled = false;
	document.getElementById('min_losses').disabled = false;
	document.getElementById('wait_play').disabled = false;
	document.getElementById('max_plays').disabled = true;
	document.getElementById('max_bet').disabled = true;
	document.getElementById('max_win').disabled = true;
	
	if (STRATEGY == 0) {
		msg="With <b>STRATEGY</b>=0 (Classic Martingale) <b>ODDS</b> is forced at 2, <b>INCR</b> forced at 100, <br /><b>BASE BET</b> is used, <b>MIN LOSSES</b> and <b>WAIT PLAY</b> are ignored";
		document.getElementById('min_bet').disabled = true;
		document.getElementById('odds').disabled = true;
		document.getElementById('incr').disabled = true;
		document.getElementById('min_losses').disabled = true;
		document.getElementById('wait_play').disabled = true;
	} else if (STRATEGY == 1) {
		msg="With <b>STRATEGY</b>=1, <b>WAIT PLAY</b> are ignored";
		document.getElementById('wait_play').disabled = true;
	} else if (STRATEGY >= 3) {
		msg="Not yet exists";
	}
	document.getElementById('calc_out_message').innerHTML = msg;	
	// console.log(msg);	
}