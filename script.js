			document.getElementById("final-box").style.display = "none";
			var sec = 0,mSec = 0;
			var max = 0;
			var isClicked = false;
			var start;
			var bestScore = 10000;

			figureGenerator();
			document.getElementById("shape").addEventListener("click",showTime);
			document.getElementById("end").addEventListener("click",endGame);

			var myVar;
			function fig(){ 				
				document.getElementById("shape").style.display = "none";
				
				setTimeout(figureGenerator,700);
				
			}
			function figureGenerator(){
				start = new Date().getTime();
				var value = Math.random();
				var color = getRandomColor();
				var width = Math.floor(value*500 + 10);
				if(width<50)
					width+= 100;
				else if(width>300)
					width-=50;
				document.getElementById("shape").style.width = width+"px";
				document.getElementById("shape").style.height = width+"px";
				document.getElementById("shape").style.marginLeft = Math.random()*700+"px";
				document.getElementById("shape").style.marginTop = Math.random()*300+"px";
				if(value>0.6 && max<3){
					document.getElementById("shape").style.borderRadius = (width)/2 + "px";
					max++;
				}else{
					document.getElementById("shape").style.borderRadius = "0px";
					max = 0;
				}
				document.getElementById("shape").style.backgroundColor = color;
				document.getElementById("shape").style.display = "block";
				
			}		

			function getRandomColor() {
				var letters = '0123456789ABCDEF';
				var color = '#';
				for (var i = 0; i < 6; i++) {
					color += letters[Math.floor(Math.random() * 16)];
				}
				if(color == "#FFFFFF")
					getRandomColor();
				return color;
			}
			function showTime(){
				var end = new Date().getTime();
				var time = (end-start)/1000;
				document.getElementById("timer").innerHTML = "Time Taken: " + time+"s";
				if(bestScore>time)
					bestScore = time;
				fig();
			}
			function endGame(){
				document.getElementById("sub-heading").style.display = "none";
				document.getElementById("timer").style.display = "none";
				document.getElementById("shape").style.display = "none";
				document.getElementById("end").style.display = "none";
				document.getElementById("page").style.display = "none";	
				document.getElementById("final-box").style.display = "block";		
				document.getElementById("end-result").innerHTML = "Game Over!";
				document.getElementById("final").innerHTML = "Your Best Score: " + bestScore+"s";
			}