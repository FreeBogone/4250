function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById("webgl");

  // Get the rendering context for WebGL
  var gl = WebGLUtils.setupWebGL( canvas );
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  var  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  if (!program) {
    console.log('Failed to intialize shaders.');
    return;
  }
  gl.useProgram( program );

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 1.0, 1.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw a point
  gl.drawArrays(gl.POINTS, 0, 1);
}
