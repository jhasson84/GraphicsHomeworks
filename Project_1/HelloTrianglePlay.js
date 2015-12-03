// HelloTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }
  
  // Get the storage location of u_FragColor
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  
  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  // get random color
  gl.uniform4f(u_FragColor, Math.random(), Math.random(), Math.random(), 1);
  // Draw the Triangle
  gl.drawArrays(gl.TRIANGLES, 0, n[0]);
  gl.uniform4f(u_FragColor, Math.random(), Math.random(), Math.random(), 1);
  gl.drawArrays(gl.TRIANGLES, 3, n[0]);
  gl.uniform4f(u_FragColor, Math.random(), Math.random(), Math.random(), 1);
  gl.drawArrays(gl.TRIANGLE_FAN,6,n[1]);
  gl.uniform4f(u_FragColor, Math.random(), Math.random(), Math.random(), 1);
  gl.drawArrays(gl.TRIANGLE_FAN,12,n[2]);
  gl.uniform4f(u_FragColor, Math.random(), Math.random(), Math.random(), 1);
  gl.drawArrays(gl.LINE_STRIP,12,n[2]);
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    -1.0, 1.0,   -1.0, 0.8,   -0.8, 0.9,	-0.8, 0.9,	-0.7,1.0,	-0.7,0.8,
	-0.3,0.0,	 -0.2,0.2,	  0.2,0.2,		0.3,0.0,	0.2,-0.2,	-0.2,-0.2,
	-1.0,-0.9,	 -0.8,-0.7,   -0.7,-0.9, 	-0.6,-0.7, 	-0.5,-0.9,	-0.4,-0.7,
	-0.3,-0.9,
	
	 
  ]);
  var n = new Array(); // The number of vertices
  n[0]=3
  n[1]=6;
  n[2]=7;

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}
