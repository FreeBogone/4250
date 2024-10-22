var modelViewMatrix = mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack = [];

var cmtStack = [];

var points = [];
var colors = [];

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

  render();
}

function initWebGL() {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

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

function scale4(a, b, c) {
  var result = mat4();
  result[0][0] = a;
  result[1][1] = b;
  result[2][2] = c;
  return result;
}

function GeneratePoints() {
  GeneratePlanet();
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

function DrawFullPlanet() {
  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 0.5 * 1.618, 1));
  modelViewMatrix = mult(modelViewMatrix, rotate(70, 1, 0, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(30, 0, 1, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  // draw planet circle
  gl.drawArrays(gl.LINE_STRIP, 0, 80);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(0, 0.2, 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 0.5 * 1.618, 1));
  modelViewMatrix = mult(modelViewMatrix, rotate(70, 1, 0, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(30, 0, 1, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  // draw planet circle
  gl.drawArrays(gl.LINE_STRIP, 80, 80);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(0, -0.2, 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 0.5 * 1.618, 1));
  modelViewMatrix = mult(modelViewMatrix, rotate(70, 1, 0, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(30, 0, 1, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  // draw planet circle
  gl.drawArrays(gl.LINE_STRIP, 160, 80);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(0.7, 0.7 * 1.618, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  // draw planet circle
  gl.drawArrays(gl.TRIANGLE_FAN, 240, 80);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 0.5 * 1.618, 1));
  modelViewMatrix = mult(modelViewMatrix, rotate(110, 1, 0, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(30, 0, 1, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  // draw planet circle
  gl.drawArrays(gl.LINE_STRIP, 320, 80);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(0, 0.2, 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 0.5 * 1.618, 1));
  modelViewMatrix = mult(modelViewMatrix, rotate(110, 1, 0, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(30, 0, 1, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  // draw planet circle
  gl.drawArrays(gl.LINE_STRIP, 400, 80);

  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(0, -0.2, 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(1.5, 0.5 * 1.618, 1));
  modelViewMatrix = mult(modelViewMatrix, rotate(110, 1, 0, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(30, 0, 1, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  // draw planet circle
  gl.drawArrays(gl.LINE_STRIP, 480, 80);
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));


  // then, draw planet, add rings too
  DrawFullPlanet();

}
