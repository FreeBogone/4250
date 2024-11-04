// Bowen Truelove
// Project 3
// Halloween.js
// Due Date: 11/05/2024
// Dr. Cen Li


// A.I. Disclaimer: All work for this assignment was completed by myself and entirely without 
// the use of artificial intelligence tools such as ChatGPT, MS Copilot, other LLMs, etc

// features implemented: 

// • When the game starts, the landscape is drawn. The bow and arrow is also visible in the center lower screen
// When one presses the ‘s’ or ‘S’ key, a ghost appears at a random position in the upper half of the screen.
// Continue to press the ‘s’ or ‘S’ key will allow the ghost to change to a different random position..
// • Pressing the ‘l’ or ‘L’ key or the left arrow key rotates the bow to the left to aim for the ghost. Similarly,
// pressing the ‘r’ or ‘R’ key or the right arrow key rotates the bow to the right to aim for the ghost.
// • Pressing the ‘f’ or ‘F’ key fires the arrow. When the arrow is fired, it moves forward in the current
// direction. After a fixed length of movement (that ensures the arrow exits the screen), the ghost disappears
// and the arrow re-appears on the bow (which remains at the center lower screen).


var modelViewMatrix = mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack = [];

var cmtStack = [];

var points = [];
var colors = [];
var tempStarPoints = [];
var randomLocations = [];
GetRandomLocations();

var ghostVisible = false;
var ghostPosition = [Math.random() * 16 - 8, Math.random() * 8];
var bowAngle = 0;
var arrowPosition = [0, 0];
var arrowFired = false;
var arrowSpeed = 0.1;
var arrowDistance = 0;

function main() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  GeneratePoints();

  modelViewMatrix = mat4();
  projectionMatrix = ortho(-8, 8, -8, 8, -1, 1);

  initWebGL();

  document.addEventListener('keydown', handleKeyPress);

  render();
}

function initWebGL() {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  //  Load shaders and initialize attribute buffers
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
  projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
}

function handleKeyPress(event) {
  switch (event.key) {
    case 's':
    case 'S':
      console.log("S: Move Ghost\n");
      moveGhost();
      break;
    case 'l':
    case 'L':
    case 'ArrowLeft':
      console.log("L: Rotate Bow Left\n");
      rotateBow(-5);
      break;
    case 'r':
    case 'R':
    case 'ArrowRight':
      console.log("R: Rotate Bow Right\n");
      rotateBow(5);
      break;
    case 'f':
    case 'F':
      console.log("F: Fire Arrow\n");
      fireArrow();
      break;
    case 'b':
    case 'B':
      console.log("B: Reset Game\n");
      resetGame();
      break;
  }
}

function moveGhost() {
  // Implement logic to move the ghost to a random position
  if(ghostVisible === false) {
    ghostVisible = true;
  }
  else {
    ghostPosition = [Math.random() * 16 - 8, Math.random() * 8];
  }
}

function moveArrow() {
  arrowPosition[1] += arrowSpeed;
  console.log(arrowPosition);

  if(arrowPosition[1] > 16) {
    //wait one second
    arrowPosition = [0, 0];
    arrowFired = false;
    ghostVisible = false;
  }
}

function rotateBow(angle) {
  bowAngle += angle;
  console.log(bowAngle);
}

function fireArrow() {
  if (!arrowFired) {
    arrowFired = true;
  }
}

function resetGame() {
  ghostVisible = false;
  ghostPosition = [Math.random() * 16 - 8, Math.random() * 8];
  bowAngle = 0;
  arrowPosition = [0, 0];
  arrowFired = false;
  arrowDistance = 0;
}

function scale4(a, b, c) {
  var result = mat4();
  result[0][0] = a;
  result[1][1] = b;
  result[2][2] = c;
  return result;
}

function GeneratePoints() {
  GenerateSky();
  GenerateGround();
  GenerateStars();
  GenerateMountains();
  GeneratePlanet();
  GenerateGhost();
  GenerateBow();
  GeneratePumpkin();
  //GenerateBoundingBox();
}

function GenerateSky() {
  points.push(vec2(-8, 8));
  points.push(vec2(8, 8));
  points.push(vec2(8, -8));
  points.push(vec2(-8, -8));

  colors.push(vec4(0.194, 0.051, 0.402, 1));
  colors.push(vec4(0.35, 0.051, 0.302, 1));
  colors.push(vec4(0.194, 0.051, 0.402, 1));
  colors.push(vec4(0.194, 0.051, 0.402, 1));
  //4 points, total 4
}

function GenerateGround() {
  points.push(vec2(-8, 0));
  points.push(vec2(8, 0));
  points.push(vec2(8, -8));
  points.push(vec2(-8, -8));

  colors.push(vec4(0.0, 0.5, 0.0, 1)); // Green
  colors.push(vec4(0.275, 0.385, 0.035, 1)); // Interpolated color between green and brown
  colors.push(vec4(0.55, 0.27, 0.07, 1)); // Brown
  colors.push(vec4(0.275, 0.385, 0.035, 1)); // Interpolated color between green and brown
  //4 points, total 8
}

function GenerateMountains() {
  originalPoints = [];

  //generate 5 mountains on the origin
  for (var i = 0; i < 5; i++) {
    points.push(vec2(-2, 0)); //bottom left
    points.push(vec2(0, 4)); //top point
    points.push(vec2(2, 0)); //bototm right
    colors.push(vec4(0.2, 0.2, 0.2, 1)); // Dark Grey
    colors.push(vec4(0.7, 0.7, 0.7, 1)); // Medium Grey
    colors.push(vec4(0.2, 0.2, 0.2, 1)); // Dark Grey
  }
  //15 points, total 23
}
function GetRandomLocations() {
  for (var i = 0; i < 20; i++) {
    randomLocations.push(vec2(Math.random() * 16 - 8, Math.random() * 8));
  }
}

function GenerateStar() {
  //draw triangles to make up one star
  tempStarPoints.push(vec2(0, 0));
  tempStarPoints.push(vec2(0.1, 0.2));
  tempStarPoints.push(vec2(0.1, 0));
  tempStarPoints.push(vec2(0.1, 0));
  tempStarPoints.push(vec2(0.1, 0.2));
  tempStarPoints.push(vec2(0.2, 0));
  tempStarPoints.push(vec2(0, 0));
  tempStarPoints.push(vec2(0.2, 0));
  tempStarPoints.push(vec2(0.1, -0.2));
  colors.push(vec4(1, 1, 1, 1));
  colors.push(vec4(1, 1, 1, 1));
  colors.push(vec4(1, 1, 1, 1));
  colors.push(vec4(1, 1, 1, 1));
  colors.push(vec4(1, 1, 1, 1));
  colors.push(vec4(1, 1, 1, 1));
  colors.push(vec4(1, 1, 1, 1));
  colors.push(vec4(1, 1, 1, 1));
  colors.push(vec4(1, 1, 1, 1));
}

function GenerateStars() {
  for (var i = 0; i < 20; i++) {
    GenerateStar();
  }
  //translate stars in random locations
  for (var i = 0; i < 20; i++) {
    var x = randomLocations[i][0];
    var y = randomLocations[i][1];
    for (var j = 0; j < 9; j++) {
      points.push(vec2(tempStarPoints[j][0] + x, tempStarPoints[j][1] + y));
    }
  }
}

function GeneratePlanet() {
  var Radius = 1.0;
  var numPoints = 80;

  // LINE_STRIP semi circle
  for(var i = 0; i < numPoints; i++) {
      var Angle = i * (( Math.PI) / numPoints);
      var X = Math.cos(Angle) * Radius;
      var Y = Math.sin(Angle) * Radius;
      colors.push(vec4(0, 0, 1, 1));
      points.push(vec2(X, Y));
  }

  for(var i = 0; i < numPoints; i++) {
      var Angle = i * (( Math.PI) / numPoints);
      var X = Math.cos(Angle) * Radius;
      var Y = Math.sin(Angle) * Radius;
      colors.push(vec4(0, 1, 0, 1));
      points.push(vec2(X, Y));
  }

  for(var i = 0; i < numPoints; i++) {
      var Angle = i * (( Math.PI) / numPoints);
      var X = Math.cos(Angle) * Radius;
      var Y = Math.sin(Angle) * Radius;
      colors.push(vec4(1, 0, 0, 1));
      points.push(vec2(X, Y));
  }


  // TRIANGLE_FAN : for solid circle
  for (var i = 0; i < numPoints; i++) {
      var Angle = i * ((2.0 * Math.PI) / numPoints);
      var X = Math.cos(Angle) * Radius;
      var Y = Math.sin(Angle) * Radius;
      colors.push(vec4(0.7, 0.7, 0, 1));
      points.push(vec2(X, Y));

  // use 360 instead of 2.0*PI if // you use d_cos and d_sin
  }

  for(var i = 0; i < numPoints; i++) {
      var Angle = i * (( Math.PI) / numPoints);
      var X = Math.cos(Angle) * Radius;
      var Y = Math.sin(Angle) * Radius;
      colors.push(vec4(0, 0, 1, 1));
      points.push(vec2(X, Y));
  }       

  for(var i = 0; i < numPoints; i++) {
      var Angle = i * (( Math.PI) / numPoints);
      var X = Math.cos(Angle) * Radius;
      var Y = Math.sin(Angle) * Radius;
      colors.push(vec4(0, 1, 0, 1));
      points.push(vec2(X, Y));
  }

  for(var i = 0; i < numPoints; i++) {
      var Angle = i * (( Math.PI) / numPoints);
      var X = Math.cos(Angle) * Radius;
      var Y = Math.sin(Angle) * Radius;
      colors.push(vec4(1, 0, 0, 1));
      points.push(vec2(X, Y));
  }
}

function GenerateGhost() {
  // begin body  (91 points)
  points.push(vec2(3, 0));
  points.push(vec2(3.1, 1));
  points.push(vec2(3.5, 2));
  points.push(vec2(4, 3.6));
  points.push(vec2(4, 4));
  points.push(vec2(4.1, 3.3));
  points.push(vec2(4.5, 3));
  points.push(vec2(5.5, 3));
  points.push(vec2(6, 3.5));
  points.push(vec2(6.5, 4));
  points.push(vec2(6.7, 4.2));
  points.push(vec2(6.8, 2.8));
  points.push(vec2(7, 2.4));
  points.push(vec2(7.5, 2));
  points.push(vec2(8, 2));
  points.push(vec2(8.5, 1.7));
  points.push(vec2(9, 1.2));
  points.push(vec2(10, 0.8));
  points.push(vec2(10, -2));
  points.push(vec2(10.4, -2.8));
  points.push(vec2(10.5, -3.5));
  points.push(vec2(10.7, -1.7));
  points.push(vec2(11, -1.4));
  points.push(vec2(11.2, -1.5));
  points.push(vec2(12, -2));
  points.push(vec2(12.5, -2.5));
  points.push(vec2(13, -3));
  points.push(vec2(13, -2));
  points.push(vec2(12.8, -0.5));
  points.push(vec2(12, 0));
  points.push(vec2(12.5, 0.5));
  points.push(vec2(11, 1));
  points.push(vec2(10.8, 1.4));
  points.push(vec2(10.2, 2.5));
  points.push(vec2(10, 4));
  points.push(vec2(9.8, 7.5));
  points.push(vec2(7.5, 9.5));
  points.push(vec2(6, 11));
  points.push(vec2(3, 12));
  points.push(vec2(0.5, 15));
  points.push(vec2(0, 17));
  points.push(vec2(-1.8, 17.4));
  points.push(vec2(-4, 16.6));
  points.push(vec2(-5, 14));
  points.push(vec2(-6, 10.5));
  points.push(vec2(-9, 10));
  points.push(vec2(-10.5, 8.5));
  points.push(vec2(-12, 7.5));
  points.push(vec2(-12.5, 4.5));
  points.push(vec2(-13, 3));
  points.push(vec2(-13.5, -1));
  points.push(vec2(-13, -2.3));
  points.push(vec2(-12, 0));
  points.push(vec2(-11.5, 1.8));
  points.push(vec2(-11.5, -2));
  points.push(vec2(-10.5, 0));
  points.push(vec2(-10, 2));
  points.push(vec2(-8.5, 4));
  points.push(vec2(-8, 4.5));
  points.push(vec2(-8.5, 7));
  points.push(vec2(-8, 5));
  points.push(vec2(-6.5, 4.2));
  points.push(vec2(-4.5, 6.5));
  points.push(vec2(-4, 4));
  points.push(vec2(-5.2, 2));
  points.push(vec2(-5, 0));
  points.push(vec2(-5.5, -2));
  points.push(vec2(-6, -5));
  points.push(vec2(-7, -8));
  points.push(vec2(-8, -10));
  points.push(vec2(-9, -12.5));
  points.push(vec2(-10, -14.5));
  points.push(vec2(-10.5, -15.5));
  points.push(vec2(-11, -17.5));
  points.push(vec2(-5, -14));
  points.push(vec2(-4, -11));
  points.push(vec2(-5, -12.5));
  points.push(vec2(-3, -12.5));
  points.push(vec2(-2, -11.5));
  points.push(vec2(0, -11.5));
  points.push(vec2(1, -12));
  points.push(vec2(3, -12));
  points.push(vec2(3.5, -7));
  points.push(vec2(3, -4));
  points.push(vec2(4, -3.8));
  points.push(vec2(4.5, -2.5));
  points.push(vec2(3, 0));
  // end body

  // begin mouth (6 points)
  points.push(vec2(-1, 6));
  points.push(vec2(-0.5, 7));
  points.push(vec2(-0.2, 8));
  points.push(vec2(-1, 8.6));
  points.push(vec2(-2, 7));
  points.push(vec2(-1.5, 5.8));
  // end mouth

  // begin nose (5 points)
  points.push(vec2(-1.8, 9.2));
  points.push(vec2(-1, 9.8));
  points.push(vec2(-1.1, 10.6));
  points.push(vec2(-1.6, 10.8));
  points.push(vec2(-1.9, 10));

  // begin left eye, translate (2.6, 0.2, 0) to draw the right eye
  // outer eye, draw line loop (9 points)
  points.push(vec2(-2.9, 10.8));
  points.push(vec2(-2.2, 11));
  points.push(vec2(-2, 12));
  points.push(vec2(-2, 12.8));
  points.push(vec2(-2.2, 13));
  points.push(vec2(-2.5, 13));
  points.push(vec2(-2.9, 12));
  points.push(vec2(-3, 11));
  points.push(vec2(-2.9, 10.5));

  // eye ball, draw triangle_fan (7 points)
  points.push(vec2(-2.5, 11.4)); // middle point
  points.push(vec2(-2.9, 10.8));
  points.push(vec2(-2.2, 11));
  points.push(vec2(-2, 12));
  points.push(vec2(-2.9, 12));
  points.push(vec2(-3, 11));
  points.push(vec2(-2.9, 10.5));
  // end left eye

  //push color for the points
  for (var i = 0; i <= 113; i++) {
    colors.push(vec4(1, 1, 1, 1));
  }
}

function GenerateBow() {
  var Radius = 1.0;
  var numPoints = 80;

  // Generate the bow (semicircle)
  for (var i = 0; i <= numPoints; i++) {
    var Angle = i * (Math.PI / numPoints);
    var X = Math.cos(Angle) * Radius;
    var Y = Math.sin(Angle) * Radius;
    colors.push(vec4(0.7, 0.7, 0, 1));
    points.push(vec2(X, Y));
  }

  //generate the bow string
  points.push(vec2(-1, 0));
  points.push(vec2(0, -2));
  colors.push(vec4(1, 1, 1, 1));
  colors.push(vec4(1, 1, 1, 1));

  //generate the other bow string
  points.push(vec2(1, 0));
  points.push(vec2(0, -2));
  colors.push(vec4(1, 1, 1, 1));
  colors.push(vec4(1, 1, 1, 1));

  //generate arrow
  //arrow head
  points.push(vec2(0, -2));
  points.push(vec2(0.5, -3));
  points.push(vec2(-0.5, -3));
  colors.push(vec4(1, 1, 1, 1));
  colors.push(vec4(1, 1, 1, 1));
  colors.push(vec4(1, 1, 1, 1));

  //arrow body
  points.push(vec2(0, 0));
  points.push(vec2(0, -3));
  colors.push(vec4(1, 1, 1, 1));
  colors.push(vec4(1, 1, 1, 1));

  //feathers
  points.push(vec2(0, -1));
  points.push(vec2(0.5, -1.5));
  colors.push(vec4(1, 1, 1, 1));
  colors.push(vec4(1, 1, 1, 1));

  points.push(vec2(0, -1));
  points.push(vec2(0.5, -1.5));
  colors.push(vec4(1, 1, 1, 1));
  colors.push(vec4(1, 1, 1, 1));

  points.push(vec2(0, -1));
  points.push(vec2(0.5, -1.5));
  colors.push(vec4(1, 1, 1, 1));
  colors.push(vec4(1, 1, 1, 1));

  points.push(vec2(0, -1));
  points.push(vec2(-0.5, -1.5));
  colors.push(vec4(1, 1, 1, 1));
  colors.push(vec4(1, 1, 1, 1));

  points.push(vec2(0, -1));
  points.push(vec2(-0.5, -1.5));
  colors.push(vec4(1, 1, 1, 1));
  colors.push(vec4(1, 1, 1, 1));
  
  points.push(vec2(0, -1));
  points.push(vec2(-0.5, -1.5));
  colors.push(vec4(1, 1, 1, 1));
  colors.push(vec4(1, 1, 1, 1));
}

function GeneratePumpkin() {
  var radius = 1.0;
  var segments = 80;

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;
    points.push(vec2(radius * Math.cos(angle), radius * Math.sin(angle)));
    //as i approaches 80, get darker orange
    colors.push(vec4(1, 0.5 - i / 160, 0, 1));
}

  //draw face
  //left eye 
  points.push(vec2(-0.5, 0.25));
  points.push(vec2(-0.25, 0.5));
  points.push(vec2(-0, 0.25));
  colors.push(vec4(0, 0, 0, 1));
  colors.push(vec4(0, 0, 0, 1));
  colors.push(vec4(0, 0, 0, 1));

  //right eye
  points.push(vec2(0.2, 0.25));
  points.push(vec2(0.4, 0.5));
  points.push(vec2(0.7, 0.25));
  colors.push(vec4(0, 0, 0, 1));
  colors.push(vec4(0, 0, 0, 1));
  colors.push(vec4(0, 0, 0, 1));

  //generate mouth
  for (var i = 0; i <= 80; i++) {
    var Angle = i * (Math.PI / 80);
    var X = Math.cos(Angle) * radius * 0.5;
    var Y = Math.sin(Angle) * radius * 0.5 - 0.5;
    colors.push(vec4(0, 0, 0, 1));
    points.push(vec2(X, Y + (0.7)));
}

  //teeth (rectangle)
  points.push(vec2(-0.1, -0.5));
  points.push(vec2(-0.1, -0.7));
  points.push(vec2(0.1, -0.7));
  points.push(vec2(0.1, -0.5));
  colors.push(vec4(1, 0.5, 0, 1));
  colors.push(vec4(1, 0.5, 0, 1));
  colors.push(vec4(1, 0.5, 0, 1));
  colors.push(vec4(1, 0.5, 0, 1));

  //vine on top
  points.push(vec2(-0.1, 1));
  points.push(vec2(-0.1, 1.5));
  points.push(vec2(0.1, 1.5));
  points.push(vec2(0.1, 1));
  colors.push(vec4(0, 0.5, 0, 1));
  colors.push(vec4(0, 0.5, 0, 1));
  colors.push(vec4(0, 0.5, 0, 1));
  colors.push(vec4(0, 0.5, 0, 1));
}

function GenerateBoundingBox() {
  points.push(vec2(-1, 1));
  points.push(vec2(1, 1));
  points.push(vec2(1, -1));
  points.push(vec2(-1, -1));

  //yellow color
  colors.push(vec4(1, 1, 0, 1));
  colors.push(vec4(1, 1, 0, 1));
  colors.push(vec4(1, 1, 0, 1));
  colors.push(vec4(1, 1, 0, 1));
}

function DrawSky() {
  modelViewMatrix = mat4();
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function DrawGround() {
  modelViewMatrix = mat4();
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
}

function DrawStars() {
  for (var i = 0; i < 20; i++) {
    modelViewMatrix = mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 8 + i * 9, 9);
  }
}

function DrawMountains() {
  modelViewMatrix = mat4();
  modelViewMatrix = mult(
    translate(-4, 0, 0),
    mult(scale4(1, 1.8, 0), modelViewMatrix),
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLES, 188, 3);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(
    translate(7, -1, 0),
    mult(scale4(1, 1.5, 0), modelViewMatrix),
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLES, 191, 3);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(
    translate(5, -2, 0),
    mult(scale4(1, 1, 0), modelViewMatrix),
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLES, 194, 3);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(
    translate(-6, -1, 0),
    mult(scale4(2.3, 1.5, 0), modelViewMatrix),
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLES, 197, 3);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(
    translate(-3, -1.75, 1),
    mult(scale4(1.4, 1, 0), modelViewMatrix),
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLES, 200, 3);
}

function DrawFullPlanet() {
  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(6, 6, 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 0.5 * 1.618, 1));
  modelViewMatrix = mult(modelViewMatrix, rotate(70, 1, 0, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(30, 0, 1, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  // draw planet circle
  gl.drawArrays(gl.LINE_STRIP, 203, 80);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(6, 6.2, 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 0.5 * 1.618, 1));
  modelViewMatrix = mult(modelViewMatrix, rotate(70, 1, 0, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(30, 0, 1, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  // draw planet circle
  gl.drawArrays(gl.LINE_STRIP, 283, 80);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(6, 6 - 0.2, 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 0.5 * 1.618, 1));
  modelViewMatrix = mult(modelViewMatrix, rotate(70, 1, 0, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(30, 0, 1, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  // draw planet circle
  gl.drawArrays(gl.LINE_STRIP, 363, 80);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(6, 6, 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(0.7, 0.7 * 1.618, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  // draw planet circle
  gl.drawArrays(gl.TRIANGLE_FAN, 443, 80);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(6, 6, 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 0.5 * 1.618, 1));
  modelViewMatrix = mult(modelViewMatrix, rotate(110, 1, 0, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(30, 0, 1, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  // draw planet circle
  gl.drawArrays(gl.LINE_STRIP, 523, 80);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(6, 6.2, 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 0.5 * 1.618, 1));
  modelViewMatrix = mult(modelViewMatrix, rotate(110, 1, 0, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(30, 0, 1, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  // draw planet circle
  gl.drawArrays(gl.LINE_STRIP, 603, 80);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(6, 6-0.2, 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 0.5 * 1.618, 1));
  modelViewMatrix = mult(modelViewMatrix, rotate(110, 1, 0, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(30, 0, 1, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  // draw planet circle
  gl.drawArrays(gl.LINE_STRIP, 683, 80);
}

function DrawGhost() {
  modelViewMatrix = mult(modelViewMatrix, scale4(1 / 20, 1 / 20, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.LINE_LOOP, 763, 87); // body
  gl.drawArrays(gl.LINE_LOOP, 850, 6); // mouth
  gl.drawArrays(gl.LINE_LOOP, 856, 5); // nose

  gl.drawArrays(gl.LINE_LOOP, 861, 9); // left eye
  gl.drawArrays(gl.TRIANGLE_FAN, 870, 7); // left eye ball

  modelViewMatrix = mult(modelViewMatrix, translate(2.6, 0, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.LINE_STRIP, 861, 9); // right eye
  gl.drawArrays(gl.TRIANGLE_FAN, 870, 7); // right eye ball
}

function DrawBow() {
  // Start with a base model matrix that applies the overall rotation
  let baseModelViewMatrix = mat4();
  baseModelViewMatrix = mult(baseModelViewMatrix, translate(0, -5, 0));  // Move center of bow to origin
  baseModelViewMatrix = mult(baseModelViewMatrix, rotate(bowAngle, 0, 0, 1));  // Rotate around the center
  baseModelViewMatrix = mult(baseModelViewMatrix, translate(0, 5, 0));  // Move it back

  modelViewMatrix = mult(baseModelViewMatrix, translate(0, -5, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.LINE_STRIP, 877, 81);

  modelViewMatrix = mult(baseModelViewMatrix, translate(0, -5, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.LINE_LOOP, 958, 2);

  modelViewMatrix = mult(baseModelViewMatrix, translate(0, -5, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.LINE_LOOP, 960, 2);
}

function DrawArrow() {
  // Start with a base model matrix that applies the overall rotation
  let baseModelViewMatrix = mat4();
  baseModelViewMatrix = mult(baseModelViewMatrix, translate(0, -5, 0));  // Move center of bow to origin
  baseModelViewMatrix = mult(baseModelViewMatrix, rotate(bowAngle, 0, 0, 1));  // Rotate around the center
  baseModelViewMatrix = mult(baseModelViewMatrix, translate(0, 5, 0));  // Move it back
  
  //draw arrowhead
  modelViewMatrix = mult(baseModelViewMatrix, translate(0 + arrowPosition[0], -3 + arrowPosition[1], 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(0.3, 0.3, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLE_FAN, 962, 3);

  //draw arrow body
  modelViewMatrix = mult(baseModelViewMatrix, translate(0 + arrowPosition[0], -3.8 + arrowPosition[1], 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1, 1.1, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.LINE_STRIP, 965, 2);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(baseModelViewMatrix, translate(0 + arrowPosition[0], -6 + arrowPosition[1], 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1/2, 1/2, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.LINE_STRIP, 967, 2);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(baseModelViewMatrix, translate(0 + arrowPosition[0], -6.2 + arrowPosition[1], 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1/2, 1/2, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.LINE_STRIP, 969, 2);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(baseModelViewMatrix, translate(0 + arrowPosition[0], -6.4 + arrowPosition[1], 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1/2, 1/2, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.LINE_STRIP, 971, 2);
  modelViewMatrix = mat4();
  modelViewMatrix = mult(baseModelViewMatrix, translate(0 + arrowPosition[0], -6 + arrowPosition[1], 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1/2, 1/2, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.LINE_STRIP, 973, 2);
  modelViewMatrix = mat4();
  modelViewMatrix = mult(baseModelViewMatrix, translate(0 + arrowPosition[0], -6.2 + arrowPosition[1], 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1/2, 1/2, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.LINE_STRIP, 975, 2);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(baseModelViewMatrix, translate(0 + arrowPosition[0], -6.4 + arrowPosition[1], 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1/2, 1/2, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.LINE_STRIP, 977, 2);
}

function DrawOnePumpkin(t, s) {
  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLE_FAN, 979, 81);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLE_FAN, 1060, 3);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLE_FAN, 1063, 3);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix = mult(modelViewMatrix, s);
  modelViewMatrix = mult(modelViewMatrix, scale4(1, -1, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLE_FAN, 1066, 80);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLE_FAN, 1147, 4);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLE_FAN, 1151, 4);
}

function DrawPumpkin() {
  t = translate(-6.3, -1, 0);
  s = scale4(0.75, 0.75, 1);
  DrawOnePumpkin(t, s);

  t = translate(3, .1, 0);
  s = scale4(1, 1, 1);
  DrawOnePumpkin(t, s);

  t = translate(6.8, -1.2, 0);
  s = scale4(0.9, 0.9, 1);
  DrawOnePumpkin(t, s);
}

function DrawBoundingBox() {
  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(ghostPosition[0], ghostPosition[1], 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1.2, 1.6, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.LINE_LOOP, 1155, 4);
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  // draw ground and sky first
  DrawSky();
  DrawGround();
  // draw stars and mountains... next
  DrawStars();
  DrawMountains();
  // then, draw planet, add rings too
  DrawFullPlanet();

  // then, draw ghost
  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(ghostPosition[0], ghostPosition[1], 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(2, 2, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  if(ghostVisible === true) {
    DrawGhost();
  }

  // add other things, like bow, arrow, spider, flower, tree ...
  DrawBow();

  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(arrowPosition[0], arrowPosition[1], 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(bowAngle, 0, 0, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawArrow();
  if(arrowFired === true) {
    moveArrow();
  }

  DrawPumpkin();

  //DrawBoundingBox();
   
  requestAnimFrame(render);
}
