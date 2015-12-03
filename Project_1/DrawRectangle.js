// DrawTriangle.js (c) 2012 matsuda
function main() {  
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  var ctx = canvas.getContext('2d');
  var ctxAry= new Array();
  
  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(255, 0, 255, 1.0)'; // Set color to blue
  ctx.fillRect(120, 10, 150*1.5, 150*1.5);        // Fill a rectangle with the color
  ctx.fillStyle = 'rgba(0, 176, 0, 1.0)'; // Set second rectcolor to blue
  ctx.fillRect(0, 10, 80, 80); // Fill a second rectangle with the color
  for(i=0;i<4;i++){
	  var c=i;
	  ctxAry[i]=new Array();
	  for(j=0;j<4;j++){
		  var d=j;
		  ctxAry[i][j] = ctx.fillStyle='rgba('+c*50+','+d*50+',255,1.0)';
		  ctxAry[i][j] = ctx.fillRect((c*10)+350,(d*10),10,10);
		  
	  }
  }
}
