/**
 * @author Jialei Li, K.R. Subrmanian, Zachary Wartell
 * 
 * 
 */


/*****
 * 
 * GLOBALS
 * 
 *****/

// 'draw_mode' are names of the different user interaction modes.
// \todo Student Note: others are probably needed...
var draw_mode = {DrawLines: 0, DrawTriangles: 1,DrawQuads:2, ClearScreen: 3,Delete: 4, None: 5};

// 'curr_draw_mode' tracks the active user interaction mode
var curr_draw_mode = draw_mode.DrawLines;

// GL array buffers for points, lines, and triangles
// \todo Student Note: need similar buffers for other draw modes...
var vBuffer_Pnt, vBuffer_Line,vBuffer_Tri,vBuffer_Quad, vBuffer_Select;

// Array's storing 2D vertex coordinates of points, lines, triangles, etc.
// Each array element is an array of size 2 storing the x,y coordinate.
// \todo Student Note: need similar arrays for other draw modes...
var points = [], line_verts = [], tri_verts = [], quad_verts = [], select_verts = [];
var select_point = [];
// count number of points clicked for new line
var num_pts_line = 0;
//count number of points clicked for new triangle
var num_pts_tri=0;
//count number of points clicked for new quad
var num_pts_quad=0;

var select=false;

var select_point = [];
var deleteType=0; //to keep track of the index for delete, and which type to delete
var deleteIndex=0;
//variables for the color
var rvl,bvl,gvl,gvt,rvt,bvt,rvq,bvq,gvq;
// \todo need similar counters for other draw modes...


/*****
 * 
 * MAIN
 * 
 *****/
function main() {
    
    //math2d_test();
    
    /**
     **      Initialize WebGL Components
     **/
    
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    if (!initShadersFromID(gl, "vertex-shader", "fragment-shader")) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // create GL buffer objects
	
    vBuffer_Pnt = gl.createBuffer();
    if (!vBuffer_Pnt) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    vBuffer_Line = gl.createBuffer();
    if (!vBuffer_Line) {
        console.log('Failed to create the buffer object');
        return -1;
    }
	vBuffer_Tri = gl.createBuffer();
	if (!vBuffer_Tri) {
        console.log('Failed to create the buffer object');
        return -1;
    }
	vBuffer_Quad = gl.createBuffer();
	if (!vBuffer_Quad) {
        console.log('Failed to create the buffer object');
        return -1;
    }
	vBuffer_Select = gl.createBuffer();
	if (!vBuffer_Select) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    var skeleton=true;
    if(skeleton)
    {
        document.getElementById("App_Title").innerHTML += "-Skeleton";
    }

    // \todo create buffers for triangles and quads...

    // Specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // get GL shader variable locations
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    /**
     **      Set Event Handlers
     **
     **  Student Note: the WebGL book uses an older syntax. The newer syntax, explicitly calling addEventListener, is preferred.
     **  See https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     **/
    // set event handlers buttons
    document.getElementById("LineButton").addEventListener(
            "click",
            function () {
                curr_draw_mode = draw_mode.DrawLines;
            });

    document.getElementById("TriangleButton").addEventListener(
            "click",
            function () {
                curr_draw_mode = draw_mode.DrawTriangles;
            });   
	document.getElementById("QuadButton").addEventListener(
            "click",
            function () {
                curr_draw_mode = draw_mode.DrawQuads;
            });
	
	document.getElementById("DeleteButton").addEventListener(
            "click",
            function () {
                curr_draw_mode = draw_mode.Delete;
            });
    
    document.getElementById("ClearScreenButton").addEventListener(
            "click",
            function () {
                curr_draw_mode = draw_mode.ClearScreen;
                // clear the vertex arrays
				while (select_point.length > 0)
                    select_point.pop();
				while (select_verts.length > 0)
                    select_verts.pop();
                while (points.length > 0)
                    points.pop();
                while (line_verts.length > 0)
                    line_verts.pop();
                while (tri_verts.length > 0)
                    tri_verts.pop();
				while(quad_verts.length>0)//added quad verts functionality
					quad_verts.pop();

                gl.clear(gl.COLOR_BUFFER_BIT);
                
                curr_draw_mode = draw_mode.DrawLines;
            });
            
    //\todo add event handlers for other buttons as required....            

    // set event handlers for color sliders
    /* \todo right now these just output to the console, code needs to be modified... */
    document.getElementById("RedRange").addEventListener(
            "input",
            function () {
                console.log("RedRange:" + document.getElementById("RedRange").value);
            });
    document.getElementById("GreenRange").addEventListener(
            "input",
            function () {
                console.log("GreenRange:" + document.getElementById("GreenRange").value);
            });
    document.getElementById("BlueRange").addEventListener(
            "input",
            function () {
                console.log("BlueRange:" + document.getElementById("BlueRange").value);
            });                        
            
    // init sliders 
    // \todo this code needs to be modified ...
    document.getElementById("RedRange").value = 0;
    document.getElementById("GreenRange").value = 100;
    document.getElementById("BlueRange").value = 0;
            
    // Register function (event handler) to be called on a mouse press
    canvas.addEventListener(
            "mousedown",
            function (ev) {
				if(ev.button === 0){
                handleMouseDown(ev, gl, canvas, a_Position, u_FragColor);
				}
				
				if (ev.button === 2){
				handleMouseDown(ev, gl, canvas, a_Position, u_FragColor);
				//select=true;	
				}
				
			});
	canvas.addEventListener('contextmenu', function(e) {
      if (e.button === 2) {
       e.preventDefault();
        return false;
      }
  }, false);
}

/*****
 * 
 * FUNCTIONS
 * 
 *****/

/*
 * Handle mouse button press event.
 * 
 * @param {MouseEvent} ev - event that triggered event handler
 * @param {Object} gl - gl context
 * @param {HTMLCanvasElement} canvas - canvas 
 * @param {Number} a_Position - GLSL (attribute) vertex location
 * @param {Number} u_FragColor - GLSL (uniform) color
 * @returns {undefined}
 */
function handleMouseDown(ev, gl, canvas, a_Position, u_FragColor) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();
	
	
    
    // Student Note: 'ev' is a MouseEvent (see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)
    
    // convert from canvas mouse coordinates to GL normalized device coordinates
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    if (curr_draw_mode !== draw_mode.None && curr_draw_mode !== draw_mode.Delete && ev.button!==2 ) {
        // add clicked point to 'points'
        points.push([x, y]);
    }
	//min value for select and index for position
	var min=5.0;
	var minIndex=0;
	//deletes the selected shape
	if(curr_draw_mode==draw_mode.Delete){
				console.log(deleteType);
				console.log(deleteIndex);
				console.log(line_verts);
				if (deleteType==1){
					line_verts.splice(deleteIndex,2);
				}else if(deleteType==2){
					tri_verts.splice(deleteIndex,3);
				}else if(deleteType==3){
					quad_verts.splice(deleteIndex,4);
				}
				console.log(line_verts);
				
				while(select_verts.length>0){
				select_verts.pop();
				}
				deleteType=0;
				deleteIndex=0;
	}
	if (ev.button===2){// selects the closest line within .5 units,works better if you click near an endpoint
	
		select_point.push([x,y]);
			
			//place select code here, need to loop through line_verts to find select candidates
			if(line_verts.length >= 2 ){
				
				select=true;						
				
				for(i=0;i<line_verts.length;i+=2){
					pld = pointLineDist(line_verts[i],line_verts[i+1],[x,y]);
					if(i==0||min>pld && pld< .06 ){
						min=pld;
						minIndex=i;
						//printed the min value to the console
						//console.log(min);
					}
				// if the distance is less than 1 then add verts to select verts
				/* if(Math.abs(test)<.1){
					select_verts.push(line_verts[i]);
					select_verts.push(line_verts[i+1]);
					console.log(select_verts);
				} */
				}
				if(min <.06 && min > 0.0){
					
				select_verts.push(line_verts[minIndex]);
				select_verts.push(line_verts[minIndex+1]);
				deleteIndex=minIndex;
				deleteType=1;//deleteType 1 for lines
				//console.log(min);	
				}
				
			}
			
			if(tri_verts.length >= 3 ){
				select=true;
				
				
				for(i=0;i<tri_verts.length;i+=3){
					bcs = barycentric(tri_verts[i],tri_verts[i+1],tri_verts[i+2],[x,y]);
					check = bcs[0]+bcs[1]+bcs[2];
					if(i==0||min>check){
						min=check;
						minIndex=i;
						//printed the min value to the console
						//console.log(min);
					}
				
				}
				
				
				if(min <= 1.2){
					
				select_verts.push(tri_verts[minIndex])
				select_verts.push(tri_verts[minIndex+1]);
				select_verts.push(tri_verts[minIndex+2]);
				deleteType=2;//deleteType 2 for Triangles
				deleteIndex=minIndex;
				//console.log(select_verts);	
				}
				
			}
			if(quad_verts.length >= 4 ){
				select = true;
				
				for(i=0;i<quad_verts.length;i+=4){
					qBcs1= barycentric(quad_verts[i],quad_verts[i+1],quad_verts[i+2],[x,y]);
					qBcs2= barycentric(quad_verts[i],quad_verts[i+2],quad_verts[i+3],[x,y]);
					q1Check = qBcs1[0]+qBcs1[1]+qBcs1[2];
					q2Check = qBcs2[0]+qBcs2[1]+qBcs2[2];
					console.log(q1Check);
					console.log(q2Check);
					if(i==0 || min > q1Check|| min > q2Check){
						if(q1Check<q2Check){
							min=q1Check;
						}else{
							min=q2Check;
						}
						
						minIndex=i;
						//printed the min value to the console
						//console.log(min);
					}
				
				}
				
				
				if(min <= 1.2){
					
				select_verts.push(quad_verts[minIndex])
				select_verts.push(quad_verts[minIndex+1]);
				select_verts.push(quad_verts[minIndex+2]);
				select_verts.push(quad_verts[minIndex+3]);
				deleteType=3;//deleteType 3 for quads
				deleteIndex=minIndex;
				//console.log(select_verts);	
				}
			}
					//select=false;
		select_point.pop();
		min=0.0;
		minIndex=0;
	}
			
    // perform active drawing operation
	if(ev.button!==2){
		switch (curr_draw_mode) {
			case draw_mode.DrawLines:
				// in line drawing mode, so draw lines
				rvl = document.getElementById("RedRange").value / 100;
				bvl = document.getElementById("BlueRange").value / 100;
				gvl = document.getElementById("GreenRange").value / 100;
				
				if (num_pts_line < 1) {			
					// gathering points of new line segment, so collect points
					line_verts.push([x, y]);
					num_pts_line++;
				}
				else {						
					// got final point of new line, so update the primitive arrays
				
					line_verts.push([x, y]);
					num_pts_line = 0;
					points.length = 0;
				}
				break;
				
			case draw_mode.DrawTriangles:
				//in triangle drawing mode
				rvt = document.getElementById("RedRange").value / 100;
				bvt = document.getElementById("BlueRange").value / 100;
				gvt = document.getElementById("GreenRange").value / 100;
				if (num_pts_tri < 2){
					//gathering points of new triangle, so collect points
					tri_verts.push([x,y]);
					num_pts_tri++;				
				}
				else{
					tri_verts.push([x,y]);
					num_pts_tri=0;
					points.length = 0;
				}
				break;
				
			case draw_mode.DrawQuads:
				//in triangle drawing mode
				rvq = document.getElementById("RedRange").value / 100;
				bvq = document.getElementById("BlueRange").value / 100;
				gvq = document.getElementById("GreenRange").value / 100;
				if (num_pts_quad < 3){
					//gathering points of new triangle, so collect points
					quad_verts.push([x,y]);
					num_pts_quad++;				
				}
				else{
					quad_verts.push([x,y]);
					num_pts_quad=0;
					points.length = 0;
				}
				break;
		}
	}
    
    drawObjects(gl,a_Position, u_FragColor);
}

/*
 * Draw all objects
 * @param {Object} gl - WebGL context
 * @param {Number} a_Position - position attribute variable
 * @param {Number} u_FragColor - color uniform variable
 * @returns {undefined}
 */
function drawObjects(gl, a_Position, u_FragColor) {
	
	

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // draw lines
	
    if (line_verts.length) {	
        // enable the line vertex
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer_Line);
        // set vertex data into buffer (inefficient)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(line_verts), gl.STATIC_DRAW);
        // share location with shader
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
		

        gl.uniform4f(u_FragColor, rvl, gvl, bvl, 1.0);
        // draw the lines
        gl.drawArrays(gl.LINES, 0, line_verts.length );
    }

   // \todo draw triangles
   if (tri_verts.length){
	   // enable the line vertex
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer_Tri);
        // set vertex data into buffer (inefficient)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(tri_verts), gl.STATIC_DRAW);
        // share location with shader
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.uniform4f(u_FragColor, rvt, gvt, bvt, 1.0);
        // draw the lines
        gl.drawArrays(gl.TRIANGLES, 0, tri_verts.length);
    }
	// \todo draw quads
	if (quad_verts.length){
	   // enable the line vertex
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer_Quad);
        // set vertex data into buffer (inefficient)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(quad_verts), gl.STATIC_DRAW);
        // share location with shader
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.uniform4f(u_FragColor, rvq, gvq, bvq, 1.0);
        // draw the lines
		for (i = 0;i < quad_verts.length;i += 4){
        gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
		}
    }
	
		
	if (select == true ) {	
		
		
        // enable the line vertex
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer_Select);
        // set vertex data into buffer (inefficient)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(select_verts), gl.STATIC_DRAW);
        // share location with shader
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.uniform4f(u_FragColor, 1.0, 1.0, 0.0, 1.0);
        // draw the lines
		if(select_verts.length==2){
			gl.drawArrays(gl.LINES, 0, select_verts.length );
		}else if(select_verts.length==3){
				gl.drawArrays(gl.TRIANGLES, 0, select_verts.length );
		}else if(select_verts.length==4){
			gl.drawArrays(gl.TRIANGLE_FAN, 0, select_verts.length );
		}
		while(select_verts.length>0){
			select_verts.pop();
		}
		//console.log(select_verts.length);
		select=false;
    }
   
    
    // draw primitive creation vertices 
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer_Pnt);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
	
    gl.drawArrays(gl.POINTS, 0, points.length);
	
}

/**
 * Converts 1D or 2D array of Number's 'v' into a 1D Float32Array.
 * @param {Number[] | Number[][]} v
 * @returns {Float32Array}
 */
function flatten(v)
{
    var n = v.length;
    var elemsAreArrays = false;

    if (Array.isArray(v[0])) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    var floats = new Float32Array(n);

    if (elemsAreArrays) {
        var idx = 0;
        for (var i = 0; i < v.length; ++i) {
            for (var j = 0; j < v[i].length; ++j) {
                floats[idx++] = v[i][j];
            }
        }
    }
    else {
        for (var i = 0; i < v.length; ++i) {
            floats[i] = v[i];
        }
    }

    return floats;
}
