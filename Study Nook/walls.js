// PROGRAMMER: Ruth Dohrmann
// PROJECT: project 4, part III
// FILE: walls.js
// DUE DATE: 12/12/23
// INSTRUCTOR: Dr. Cen Li
//
// Description: This file includes the vertices array
// and functions for generating points and drawing
// shapes that are used to make the walls, the siding,
// and the window.

// start drawing the wall
function DrawWall(thickness)
{
  	var s, t, r;

  	// draw thin wall with top = xz-plane, corner at origin
  	mvMatrixStack.push(modelViewMatrix);

  	t=translate(.6, 0.5*thickness, .6);
  	s=scale4(1.2, thickness, 1.2);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  	DrawSolidCube(1);

  	modelViewMatrix=mvMatrixStack.pop();
}

function DrawWallWindow(thickness)
{
    var s, t, r;

    // draw thin wall with top = xz-plane, corner at origin
    mvMatrixStack.push(modelViewMatrix);
    t=translate(.15, 0.5*thickness, .6);
    s=scale4(.3, thickness, 1.2);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(1.05, 0.5*thickness, .6);
    s=scale4(.3, thickness, 1.2);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(.6, 0.5*thickness, 0.075);
    s=scale4(.6, thickness, .15);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(.6, 0.5*thickness, 0.85);
    s=scale4(.6, thickness, .7);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();
}

function DrawSiding(thickness)
{
    var height = -.04;
    var rotationDegree = -25;
    for (var i = 0; i < 4; i++) {
      DrawSidingWhole(thickness, height, rotationDegree);
      height -= 0.07;
    }

    mvMatrixStack.push(modelViewMatrix);
    t=translate(height+0.02, 0.5*thickness, .325);
    s=scale4(.04, thickness, .35);
    r = rotate(rotationDegree, 0, 0, 1);
    modelViewMatrix=mult(modelViewMatrix, t);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();

    for (var i = 0; i < 9; i++) {
      DrawSidingHalves(thickness, height, rotationDegree);
      height -= 0.07;
    }

    for (var i = 0; i < 4; i++) {
      DrawSidingWhole(thickness, height, rotationDegree);
      height -= 0.07;
    }
}

function DrawSidingWhole(thickness, height, rotationDegree) {
    var s, t, r;

    mvMatrixStack.push(modelViewMatrix);
    t=translate(height, 0.5*thickness, .6);
    s=scale4(.08, thickness, 1.2);
    r = rotate(rotationDegree, 0, 0, 1);
    modelViewMatrix=mult(modelViewMatrix, t);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();
}

// siding halves for either side of the window
function DrawSidingHalves(thickness, height, rotationDegree) {
    var s, t, r;

    mvMatrixStack.push(modelViewMatrix);
    t=translate(height, 0.5*thickness, .075);
    s=scale4(.08, thickness, .15);
    r = rotate(rotationDegree, 0, 0, 1);
    modelViewMatrix=mult(modelViewMatrix, t);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(height, 0.5*thickness, .85);
    s=scale4(.08, thickness, .7);
    r = rotate(rotationDegree, 0, 0, 1);
    modelViewMatrix=mult(modelViewMatrix, t);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();
}

function DrawWindowFrame() {
    // Draw window frame
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0, 0.29, .499);
    s=scale4(1.3, 1.26, .8);
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix = mult(modelViewMatrix, s);
    DrawBaseboard();
    modelViewMatrix=mvMatrixStack.pop();
    // bottom
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0, 0.305, .12);
    r=rotate(90, 1, 0, 0);
    s=scale4(1.3, .825, .8);
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBaseboard();
    modelViewMatrix=mvMatrixStack.pop();
    // right
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0, 0.93, .156);
    r=rotate(180, 1, 0, 0);
    s=scale4(1.3, 1.28, .8);
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBaseboard();
    modelViewMatrix=mvMatrixStack.pop();
    // top
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0, 0.9, .533);
    r=rotate(270, 1, 0, 0);
    s=scale4(1.3, .822, .8);
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBaseboard();
    modelViewMatrix=mvMatrixStack.pop();

    // Draw window lattice
    var loc = .15;
    var length = .25;
    var height = .2;
    var rotation = 35;
    for (var i = 0; i < 7; i++) {
       DrawWindowSolid(loc, length, height, rotation);
       loc += 0.08;
       height -= 0.04;
       length += .4;
       length = Math.min(.9, length);
    }

    var loc = .15;
    var length = .25;
    var height = -.2;
    var rotation = -35;
    for (var i = 0; i < 7; i++) {
       DrawWindowSolid(loc, length, height, rotation);
       loc += 0.08;
       height += 0.04;
       length += .4;
       length = Math.min(.9, length);
    }
}

// Draw single board in the window lattice
function DrawWindowSolid(loc, length, height, rotation) {
    mvMatrixStack.push(modelViewMatrix);
    t=translate(-.01, 0.6+height, loc);
    r=rotate(rotation, 1, 0, 0);
    s=scale4(.01, length, 0.01);
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();
}
