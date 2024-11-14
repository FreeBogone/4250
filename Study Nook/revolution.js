// PROGRAMMER: Ruth Dohrmann
// PROJECT: project 4, part III
// FILE: revolution.js
// DUE DATE: 12/12/23
// INSTRUCTOR: Dr. Cen Li
//
// Description: This file includes the vertices array
// and functions for generating points for and drawing
// the candlestick, candles and pot that are used in
// studynook.js

var vertices2=[];

//Pawn initial 2d line points for surface of revolution
var candlestickPoints = [
    // candlestick
    [0, 0, 0.0],
    [0.06, 0, 0.0],
    [.05, .008, 0.0],
    [.045, .008, 0.0],
    [0.04, 0.015, 0.0],
    [0.01, 0.015, 0.0],
    [0.01, 0.12, 0.0],
    [0.03, 0.15, 0.0],
    [0.03, 0.18, 0.0],

    // candle
    [0, 0, 0.0],
    [0.03, 0, 0.0],
    [0.03, 0.15, 0.0],
    [0.004, 0.18, 0.0],
    [0.004, 0.20, 0.0],
    [0, 0.20, 0.0],

    // pot
    [0, 0, 0.0],
    [0.2, 0, 0.0],
    [0.26, 0.35, 0.0],
    [0.27, 0.363, 0.0],
    [0.28, 0.384, 0.0],
    [0.27, .405, 0.0],
    [0.268, 0.418, 0.0],
    [0.3, 8/15, 0.0],
    [0.32, 8/15, 0.0],
    [0.33, 0.543, 0.0],
    [0.335, 0.56, 0.0],
    [0.33, .577, 0.0],
    [0.32, 0.5867, 0.0],
    [0.299, 0.5867, 0.0]
];

function surfaceRevPoints(start, end)
{
  var vertices2 = [];
	//Setup initial points matrix
	for (var i = start; i<end; i++)
	{
		  vertices2.push(vec4(candlestickPoints[i][0], candlestickPoints[i][1],
                                   candlestickPoints[i][2], 1));
	}

	var r;
  var t=Math.PI/12;
  var N=end-start;

  // sweep the original curve another "angle" degree
	for (var j = 0; j < 24; j++)
	{
      var angle = (j+1)*t;

      // for each sweeping step, generate 25 new points corresponding to the original points
		  for(var i = 0; i < N; i++ )
		  {
		        r = vertices2[i][0];
            vertices2.push(vec4(r*Math.cos(angle), vertices2[i][1], -r*Math.sin(angle), 1));
		  }
	}
  var N=end-start;
  // quad strips are formed slice by slice (not layer by layer)
  for (var i=0; i<24; i++) // slices
  {
       for (var j=0; j<N-1; j++)  // layers
       {
		       quad5(vertices2[i*N+j], vertices2[(i+1)*N+j],
                vertices2[(i+1)*N+(j+1)], vertices2[i*N+(j+1)]);
        }
  }
}

// Draw the candlestick
function DrawCandleSticks() {
    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.46, 0.18, 0.06));
    DrawCandleStick1(1/3, 1/3, 1/3);
    modelViewMatrix = mult(modelViewMatrix, translate(0.2, 0, 0.12));
    DrawCandleStick1(1, 1, 1);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.82, 0.835, 0.06));
    DrawCandleStick1(1/3, 1/3, 1/3);
    modelViewMatrix = mult(modelViewMatrix, translate(0.2, 0, 0.12));
    DrawCandleStick1(1, 1, 1);
    modelViewMatrix = mult(modelViewMatrix, translate(0.2, 0, -0.08));
    DrawCandleStick1(1, 1, 1);
    modelViewMatrix=mvMatrixStack.pop();
}

// Draw the candlestick
function DrawCandles() {
    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.82, 0.895, 0.06));
    DrawCandle(.28, .42, .28);
    modelViewMatrix = mult(modelViewMatrix, translate(0.238, 0, 0.145));
    DrawCandle(1, 1, 1);
    modelViewMatrix = mult(modelViewMatrix, translate(0.238, 0, -0.105));
    DrawCandle(1, 1, 1);
    modelViewMatrix=mvMatrixStack.pop();
}

// Draw a single candlestick
function DrawCandleStick1(sx, sy, sz) {
    modelViewMatrix = mult(modelViewMatrix, scale4(sx, sy, sz));
    gl.uniformMatrix4fv(gl.getUniformLocation(program,
                        "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.drawArrays( gl.TRIANGLES, (sphereCount+cubeCount+fileHolderCount+curtainCount+cylinderCount), candlestick1Count);
}

// Draw a single candle
function DrawCandle(sx, sy, sz) {
    modelViewMatrix = mult(modelViewMatrix, scale4(sx, sy, sz));
    gl.uniformMatrix4fv(gl.getUniformLocation(program,
                        "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.drawArrays( gl.TRIANGLES,EndPartTwoCount+510+revolutionSphereCount+revolutionSphereLargeCount+revolutionSphereCount2+6, candleCount);
}

// Draw a pot
function DrawPot(sx, sy, sz) {
    modelViewMatrix = mult(modelViewMatrix, scale4(sx, sy, sz));
    gl.uniformMatrix4fv(gl.getUniformLocation(program,
                        "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.drawArrays( gl.TRIANGLES,EndPartTwoCount+510+revolutionSphereCount+revolutionSphereLargeCount+revolutionSphereCount2+6+candleCount, potCount);
}
