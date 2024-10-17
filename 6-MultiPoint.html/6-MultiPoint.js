var gl, program, n;

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {console.log('Failed to get the rendering context for WebGL'); return; }

  // Initialize shaders
  //  Load shaders and initialize attribute buffers
  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  if (!program) {
    console.log("Failed to intialize shaders.");
    return;
  }
  gl.useProgram( program );

  // Write the positions of vertices to a vertex shader
  n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  render();
}

function render() {
  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw three points
  gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
  var vertices = 
     new Float32Array([
            0.0, 0.5, 
           -0.5, -0.5,   
            0.5, -0.5
          ]);
  var n = 3; // The number of vertices

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

  // Associate shader variable with the data buffer
  var a_Position = gl.getAttribLocation(program, "a_Position");
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
