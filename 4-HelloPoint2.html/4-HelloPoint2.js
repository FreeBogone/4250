var gl;

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById("webgl");

  // Get the rendering context for WebGL
  gl = WebGLUtils.setupWebGL( canvas );
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  //  Load shaders and initialize attribute buffers
  var  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  if (!program) {
    console.log("Failed to intialize shaders.");
    return;
  }
  gl.useProgram( program );

  // Get the storage location of a_Position
  var a_Position = gl.getAttribLocation(program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  // Pass vertex position to attribute variable
  gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

  render();
}

function render() {

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 1.0, 1.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw a point
  gl.drawArrays(gl.POINTS, 0, 1);
}
