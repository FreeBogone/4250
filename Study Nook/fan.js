// PROGRAMMER: Ruth Dohrmann
// PROJECT: project 4, part III
// FILE: fan.js
// DUE DATE: 12/12/23
// INSTRUCTOR: Dr. Cen Li
//
// Description: This file includes the vertices array
// and functions for generating points and drawing
// shapes that are used to make the fan blades
// in studynook.js and the the pages that are blown
// off the desk

// fan blade
var fanPoints = [
    vec4( 0.0075, 0.03, 0.028, 1.0 ),
    vec4( 0, 0, 0, 1.0 ),
    vec4( 0, 0.01, 0.005, 1.0 ),
    vec4( 0, 0.015, 0.006, 1.0 ),
    vec4( -0.008, 0.025, 0.005, 1.0 ),
    vec4( -0.01, 0.034, 0.0001, 1.0 ),
    vec4( -0.02, 0.04, -0.0001, 1.0 ),
    vec4( -0.02, 0.048, 0, 1.0 ),
    vec4( -0.015, 0.058, 0.002, 1.0 ),
    vec4( -0.01, 0.07, 0.01, 1.0 ),
    vec4( -0.008, 0.073, 0.025, 1.0 ),
    vec4( 0, 0.071, 0.032, 1.0 ),
    vec4( 0.01, 0.058, 0.049, 1.0 ),
    vec4( 0.025, 0.048, 0.057, 1.0 ),
    vec4( 0.035, 0.03, 0.064, 1.0 ),
    vec4( 0.038, 0.014, 0.062, 1.0 ),
    vec4( 0.035, -0.008, 0.048, 1.0 ),
    vec4( 0.034, -0.013, 0.029, 1.0 ),
    vec4( 0.033, -0.015, 0.02, 1.0 ),
    vec4( 0.032, -0.01, 0, 1.0 )
];

function fanBlades()
{
    triangle2(fanPoints[0], fanPoints[2], fanPoints[1]);
    triangle2(fanPoints[0], fanPoints[3], fanPoints[2]);
    triangle2(fanPoints[0], fanPoints[4], fanPoints[3]);
    triangle2(fanPoints[0], fanPoints[5], fanPoints[4]);
    triangle2(fanPoints[0], fanPoints[6], fanPoints[5]);
    triangle2(fanPoints[0], fanPoints[7], fanPoints[6]);
    triangle2(fanPoints[0], fanPoints[8], fanPoints[7]);
    triangle2(fanPoints[0], fanPoints[9], fanPoints[8]);
    triangle2(fanPoints[0], fanPoints[10], fanPoints[9]);
    triangle2(fanPoints[0], fanPoints[11], fanPoints[10]);
    triangle2(fanPoints[0], fanPoints[12], fanPoints[11]);
    triangle2(fanPoints[0], fanPoints[13], fanPoints[12]);
    triangle2(fanPoints[0], fanPoints[14], fanPoints[13]);
    triangle2(fanPoints[0], fanPoints[15], fanPoints[14]);
    triangle2(fanPoints[0], fanPoints[16], fanPoints[15]);
    triangle2(fanPoints[0], fanPoints[17], fanPoints[16]);
    triangle2(fanPoints[0], fanPoints[18], fanPoints[17]);
    triangle2(fanPoints[0], fanPoints[19], fanPoints[18]);
    triangle2(fanPoints[0], fanPoints[1], fanPoints[19]);
}

// Draw the fan blades (determine whether or not the fan is moving)
function DrawFanBlades(s)
{
    var r;
    if (!fanMovement) {
       mvMatrixStack.push(modelViewMatrix);
       r=rotate(fanRotation, 1, 0, 0);
       modelViewMatrix=mult(modelViewMatrix, r);
    	 DrawFanNoMovement();
       modelViewMatrix=mvMatrixStack.pop();
     }
    else {
       mvMatrixStack.push(modelViewMatrix);
       DrawFanMovement();
       modelViewMatrix=mvMatrixStack.pop();
     }
}

// Draw the fan blades
function DrawFanNoMovement() {
  var r;
  var s = scale4(.8, 1.15, 1.15);
  mvMatrixStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays( gl.TRIANGLES, (sphereCount+cubeCount+fileHolderCount+curtainCount+cylinderCount+candlestick1Count+2*bookCount+boardCount+cylinderCount+additionalCount+wireCount), bladeCount);
  modelViewMatrix=mvMatrixStack.pop();
  mvMatrixStack.push(modelViewMatrix);
  r=rotate(-90, 1, 0, 0);
  modelViewMatrix=mult(modelViewMatrix, r);
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays( gl.TRIANGLES, (sphereCount+cubeCount+fileHolderCount+curtainCount+cylinderCount+candlestick1Count+2*bookCount+boardCount+cylinderCount+additionalCount+wireCount), bladeCount);
  modelViewMatrix=mvMatrixStack.pop();
  mvMatrixStack.push(modelViewMatrix);
  r=rotate(-180, 1, 0, 0);
  modelViewMatrix=mult(modelViewMatrix, r);
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays( gl.TRIANGLES, (sphereCount+cubeCount+fileHolderCount+curtainCount+cylinderCount+candlestick1Count+2*bookCount+boardCount+cylinderCount+additionalCount+wireCount), bladeCount);
  modelViewMatrix=mvMatrixStack.pop();
  mvMatrixStack.push(modelViewMatrix);
  r=rotate(-270, 1, 0, 0);
  modelViewMatrix=mult(modelViewMatrix, r);
  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays( gl.TRIANGLES, (sphereCount+cubeCount+fileHolderCount+curtainCount+cylinderCount+candlestick1Count+2*bookCount+boardCount+cylinderCount+additionalCount+wireCount), bladeCount);
  modelViewMatrix=mvMatrixStack.pop();
}

var fanRotation = 0;
var paperMovementCount = 0;

// Decrease fanRotation to achieve fan movement.
// Call rander with requestAnimFrame.
function DrawFanMovement() {

  mvMatrixStack.push(modelViewMatrix);
  fanRotation -= 20;
  r=rotate(fanRotation, 1, 0, 0);
  modelViewMatrix=mult(modelViewMatrix, r);
  DrawFanNoMovement();
  modelViewMatrix=mvMatrixStack.pop();
  if (fanRotation == -360) {
    fanRotation = 0;
  }

  if (paperMovementCount == 9) {
    paperMovement = true;
  }

  paperMovementCount++;

  if (fanMovement) {
    requestAnimFrame(render);
  }
}

function DrawPaper() {
  if (!paperMovement) {
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.25, .3304, 0.73);
    modelViewMatrix=mult(modelViewMatrix, t);
    s=scale4(.19, .001, .13);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.23, .3305, 0.72);
    modelViewMatrix=mult(modelViewMatrix, t);
    r=rotate(5, 0, 1, 0);
    modelViewMatrix=mult(modelViewMatrix, r);
    s=scale4(.19, .001, .13);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.24, .3306, 0.71);
    modelViewMatrix=mult(modelViewMatrix, t);
    r=rotate(-10, 0, 1, 0);
    modelViewMatrix=mult(modelViewMatrix, r);
    s=scale4(.19, .001, .13);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();
   }
  else {
     DrawPaperMovement();
   }
}

var TOTAL_STEPS = 10;
var TOTAL_STEPS2 = 15;
var stepCount = 0;

// Paper 1
var startX= 0.25, startY=0.3304, startZ=.73;
var targetX1=.26, targetY1=0.6, targetZ1=1.6;
var targetX2=0.78, targetY2=0.018, targetZ2=0.8;
var locationX = startX, locationY = startY, locationZ = startZ;  // location of the paper at any given time

// Paper 2
var startXp2= 0.23, startYp2=0.3305, startZp2=.72;
var targetX1p2=.9, targetY1p2=0.64, targetZ1p2=1.7;
var targetX2p2=0.9, targetY2p2=0.015, targetZ2p2=1;
var locationXp2 = startXp2, locationYp2 = startYp2, locationZp2 = startZp2;  // location of the paper at any given time

// Paper 3
var startXp3=0.24, startYp3=0.3306, startZp3=.71;
var targetX1p3=1.2, targetY1p3=0.7, targetZ1p3=1.8;
var targetX2p3=0.8, targetY2p3=0.018, targetZ2p3=.5;
var locationXp3 = startXp3, locationYp3 = startYp3, locationZp3 = startZp3;  // location of the paper at any given time


function DrawPaperMovement() {
    var t;
    // Calculate change in x and y
    var deltaX1 = (targetX1-startX)/TOTAL_STEPS;
    var deltaY1 = (targetY1-startY)/TOTAL_STEPS;
    var deltaZ1 = (targetZ1-startZ)/TOTAL_STEPS;
    var deltaX2 = (targetX2-targetX1)/TOTAL_STEPS2;
    var deltaY2 = (targetY2-targetY1)/TOTAL_STEPS2;
    var deltaZ2 = (targetZ2-targetZ1)/TOTAL_STEPS2;
    // Calculate change in x and y
    var deltaX1p2 = (targetX1p2-startXp2)/TOTAL_STEPS;
    var deltaY1p2 = (targetY1p2-startYp2)/TOTAL_STEPS;
    var deltaZ1p2 = (targetZ1p2-startZp2)/TOTAL_STEPS;
    var deltaX2p2 = (targetX2p2-targetX1p2)/TOTAL_STEPS2;
    var deltaY2p2 = (targetY2p2-targetY1p2)/TOTAL_STEPS2;
    var deltaZ2p2 = (targetZ2p2-targetZ1p2)/TOTAL_STEPS2;
    // Calculate change in x and y
    var deltaX1p3 = (targetX1p3-startXp3)/TOTAL_STEPS;
    var deltaY1p3 = (targetY1p3-startYp3)/TOTAL_STEPS;
    var deltaZ1p3 = (targetZ1p3-startZp3)/TOTAL_STEPS;
    var deltaX2p3 = (targetX2p3-targetX1p3)/TOTAL_STEPS2;
    var deltaY2p3 = (targetY2p3-targetY1p3)/TOTAL_STEPS2;
    var deltaZ2p3 = (targetZ2p3-targetZ1p3)/TOTAL_STEPS2;

    // draw the paper fly off the table
    if (stepCount < TOTAL_STEPS) {
      DrawEachPage();

      locationX = locationX + deltaX1;
      locationY = locationY + deltaY1;
      locationZ = locationZ + deltaZ1;

      locationXp2 = locationXp2 + deltaX1p2;
      locationYp2 = locationYp2 + deltaY1p2;
      locationZp2 = locationZp2 + deltaZ1p2;

      locationXp3 = locationXp3 + deltaX1p3;
      locationYp3 = locationYp3 + deltaY1p3;
      locationZp3 = locationZp3 + deltaZ1p3;

      stepCount++;
    }
    // the paper pauses
    else if (stepCount < (TOTAL_STEPS+1)) {
      DrawEachPage();
      stepCount++;
    }
    // the paper falls to the floor
    else if (stepCount < (TOTAL_STEPS+TOTAL_STEPS2+1)) {
      DrawEachPage();

      locationX = locationX + deltaX2;
      locationY = locationY + deltaY2;
      locationZ = locationZ + deltaZ2;

      locationXp2 = locationXp2 + deltaX2p2;
      locationYp2 = locationYp2 + deltaY2p2;
      locationZp2 = locationZp2 + deltaZ2p2;

      locationXp3 = locationXp3 + deltaX2p3;
      locationYp3 = locationYp3 + deltaY2p3;
      locationZp3 = locationZp3 + deltaZ2p3;

      stepCount++;
    }
    // the paper stays on the floor
    else {
      DrawEachPage();

      locationX = targetX2;
      locationY = targetY2;
      locationZ = targetZ2;

      locationXp2 = targetX2p2;
      locationYp2 = targetY2p2;
      locationZp2 = targetZ2p2;

      locationXp3 = targetX2p3;
      locationYp3 = targetY2p3;
      locationZp3 = targetZ2p3;

      stepCount++;
    }
    if (stepCount == 30) {
        sounds[1].play();
    }
    // Paper will still move even if the fan does not
    if (!fanMovement && stepCount < (TOTAL_STEPS+TOTAL_STEPS2+1) && paperMovement) {
      requestAnimFrame(render);
    }

}

function DrawEachPage() {
  mvMatrixStack.push(modelViewMatrix);
  t = translate(locationX, locationY, locationZ, 0);
  modelViewMatrix=mult(modelViewMatrix, t);
  s=scale4(.19, .001, .13);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  t=translate(locationXp2, locationYp2, locationZp2, 0);
  modelViewMatrix=mult(modelViewMatrix, t);
  r=rotate(5, 0, 1, 0);
  modelViewMatrix=mult(modelViewMatrix, r);
  s=scale4(.19, .001, .13);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  t=translate(locationXp3, locationYp3, locationZp3, 0);
  modelViewMatrix=mult(modelViewMatrix, t);
  r=rotate(-10, 0, 1, 0);
  modelViewMatrix=mult(modelViewMatrix, r);
  s=scale4(.19, .001, .13);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();
}
