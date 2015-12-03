// RotatedTriangle_Matrix4.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_xformMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_xformMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';
var Tx = 0.5,Ty = 0.5, Tz = 0.0;
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

  // Create Matrix4 object for the rotation matrix
  var xformMatrix = new Matrix4();

  // Set the rotation matrix
  var ANGLE = 90.0; // The rotation angle
  
  
  xformMatrix.setTranslate(Tx,Ty,Tz);
  
  // Pass the rotation matrix to the vertex shader
  var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
  if (!u_xformMatrix) {
    console.log('Failed to get the storage location of u_xformMatrix');
    return;
  }
  //variable for fragcolor
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  
  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  gl.uniform4f(u_FragColor, Math.random(), Math.random(), Math.random(), 1);
  
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);
  // Draw the triangle pair
  
  gl.drawArrays(gl.TRIANGLES, 0, n);  
 
  
  
  xformMatrix.setRotate(ANGLE, 0, 0, 1);
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);
  gl.uniform4f(u_FragColor, Math.random(), Math.random(), Math.random(), 1);
  gl.drawArrays(gl.TRIANGLES, 0, n);
  
  //Draw Second Triangle pair
  xformMatrix.setTranslate(-Tx,Ty,Tz);
   
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);
  gl.uniform4f(u_FragColor, Math.random(), Math.random(), Math.random(), 1);
  gl.drawArrays(gl.TRIANGLES, 3, n);
  
   xformMatrix.setRotate(120.0, 0, 0, 1);
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);
  gl.uniform4f(u_FragColor, Math.random(), Math.random(), Math.random(), 1);
  gl.drawArrays(gl.TRIANGLES, 3, n);
  //Draw third Triangle pair
  xformMatrix.setTranslate(-Tx,-Ty,Tz);
   
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);
  gl.uniform4f(u_FragColor, Math.random(), Math.random(), Math.random(), 1);
  gl.drawArrays(gl.TRIANGLES, 6, n);
  
   xformMatrix.setRotate(60.0, 0, 0, 1);
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);
  gl.uniform4f(u_FragColor, Math.random(), Math.random(), Math.random(), 1);
  gl.drawArrays(gl.TRIANGLES, 6, n);
//Draw fourth Triangle pair
  xformMatrix.setTranslate(Tx,-Ty,Tz);
   
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);
  gl.uniform4f(u_FragColor, Math.random(), Math.random(), Math.random(), 1);
  gl.drawArrays(gl.TRIANGLES, 6, n);
  
   xformMatrix.setRotate(270.0, 0, 0, 1);
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);
  gl.uniform4f(u_FragColor, Math.random(), Math.random(), Math.random(), 1);
  gl.drawArrays(gl.TRIANGLES, 6, n);
  }

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    0, 0.5,   -0.5, -0.5,   0.5, -0.5,
	0.4, 0.2,   0.2, 0.2,   0.2, 0.4,
	0.0,0.3,	0.3,-0.2,	0.1,-0.2,
	-0.3, 0.2,   -0.4, 0.4,   -0.3, 0.5
  ]);
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return false;
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

