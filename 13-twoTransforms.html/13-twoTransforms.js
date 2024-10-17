var gl, program;
var n=3;
var ANGLE=45;
var u_xformMatrix;

function main() {

  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  // Initialize shaders
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram( program );
  if (!program) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Pass the data required to rotate the shape to the vertex shader
  modelViewMatrixLoc = gl.getUniformLocation(program, "u_modelViewMatrix");
  if (!modelViewMatrixLoc) {
    console.log('Failed to get the storage location of u_modelViewMatrix');
    return;
  }

  render();
}

function render () {
  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // perform translation and then rotation
  var modelViewMatrix = mat4();
  var r=rotate(ANGLE, 0, 0, 1);
  var t=translate(0.3, 0, 0);
  var s=scale4(0.5, 0.5, 1);
  //modelViewMatrix = mult ( mult(modelViewMatrix, t), r);
  //modelViewMatrix = mult ( mult(modelViewMatrix, r), t);
  modelViewMatrix = mult ( mult(modelViewMatrix, t), s);

  // send over the modelview transformation matrix to vertex shader
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    0, 0.5,
  -0.5, -0.5,
   0.5, -0.5
  ]);
  n = 3; // The number of vertices

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

  // Assign the buffer object to the attribute variable
  var a_Position = gl.getAttribLocation(program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}
