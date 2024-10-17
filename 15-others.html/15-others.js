// Animation -- First translate, then rotate
var ANGLE_STEP = 45.0; // Rotation angle (degrees/second)
var gl, program;
var translateCount=0, rotationCount=0; // for animation control
var MAX_STEPS=100;  // maximam number of translation/rotation steps to goal
var u_ModelMatrix;

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  //  Configure WebGL
  gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

  //  Load shaders and initialize attribute buffers
  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );
  if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
  }

  // Write the positions of vertices to a vertex shader
  initVertexBuffers(gl);

  // Get storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  tick();
}

var currentAngle = 0.0; // starting rotation angle
var currentLocation=[0, 0];  // starting location
// Start drawing
function tick() {
    if (translateCount < MAX_STEPS) {
       currentLocation = animateLocation(currentLocation);
       translateCount ++;
    }
    else if (rotationCount < MAX_STEPS) {
          currentAngle = animateAngle(currentAngle);  // Update the rotation angle
          rotationCount ++;
    }
    else
    {
      currentAngle = 0.0;
      currentLocation=[0, 0];
      translateCount=0;
      rotationCount=0;
    }
    draw(gl, currentLocation, currentAngle, u_ModelMatrix);   // Draw the triangle

    setTimeout(    // set interval time
        requestAnimFrame(tick), 500
    );
    //requestAnimationFrame(tick); // Request that the browser calls tick
};

function initVertexBuffers(gl) {
  var vertices = new Float32Array ([
    0, 0.5,   -0.5, -0.5,   0.5, -0.5
  ]);

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

  // Assign the buffer object to a_Position variable
  var a_Position = gl.getAttribLocation(program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

}

function draw(gl, currentLocation, currentAngle, u_ModelMatrix) {

  // Set the rotation matrix
  var t=translate(currentLocation[0], currentLocation[1], 0);
  var r=rotate(currentAngle, 0, 0, 1);

  // Pass the rotation*translate matrix to the vertex shader
  gl.uniformMatrix4fv(u_ModelMatrix, false, flatten(mult(r, t)));

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function animateLocation(loc) {
  var goalLocation = [0.5, 0.5];
  var startLocation = [0, 0];
  var step_X = (goalLocation[0] - startLocation[0])/MAX_STEPS;
  var step_Y = (goalLocation[1] - startLocation[1])/MAX_STEPS;

  var newLocation=[loc[0]+step_X, loc[1]+step_Y];

  return newLocation;
}

/*
function animateAngle(angle) {
  var step = 360/MAX_STEPS;
  var newAngle = angle + step;
  return newAngle;
}
*/

// newAngle or newXlocation's values are updated
var g_last = Date.now();
function animateAngle(angle) {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle %= 360;
}
