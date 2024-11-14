// PROGRAMMER: Ruth Dohrmann
// PROJECT: project 4, part III
// FILE: fern.js
// DUE DATE: 12/12/23
// INSTRUCTOR: Dr. Cen Li
//
// Description: This file includes the vertices array
// and functions for generating points and drawing
// the ferns that are used in studynook.js

// set up sets
var set1=[0.0, 0.0, 0.0, 0.16, 0.0, 0.0]
var set2=[0.2, -0.26, 0.23, 0.22, 0.0, 1.6]
var set3=[-0.15, 0.28, 0.26, 0.24, 0.0, 0.44]
var set4_1=[0.75, 0.04, -0.04, 0.85, 0.0, 1.6]
var set4_2=[0.85, 0.04, -0.04, 0.85, 0.0, 1.6]

// This function generates the starting point
// for each of the two ferns
function GetInitialPointFern()
{
    var savedPoints = [];

    // Get random points
    var randX = (Math.random() * 2) - 1;
    var randY = (Math.random() * 2) - 1;
    // Call function GetPoints
    savedPoints.push(GetPoint(randX, randY, 1));
    savedPoints.push(GetPoint(randX, randY, 2));

    return savedPoints;
}

// Run through the equations x_new = a*x_previous + b*y_previous + e
// and y_new = c*x_previous + d*y_previous + f ten times to get the
// starting point
function GetPoint(myX, myY, fernNum) {
    var xVal, yVal;
    var newX = myX;
    var newY = myY;
    // Calculate new x and y values
    for (var i = 0; i < 10; i++) {
        xVal = newX;
        yVal = newY;
        set = probability(fernNum);
        newX = set[0] * xVal + set[1] * yVal + set[4];
        newY = set[2] * xVal + set[3] * yVal + set[5];
    }
    return vec2(newX, newY);
}

// This function generates the points of the two ferns
function GeneratePointsFern(initialPoint)
{
    var vertices=[];
    var set, newX, newY, x, y, p;

    // Calculate the points for the two ferns
    for (var count = 1; count < 3; count++) {
        var xArray = [];
        var yArray = [];
        p = initialPoint[count-1];
        xArray.push(p[0]);
        yArray.push(p[1]);
        // Perform the calculations
        // x_new = a*x_previous + b*y_previous + e
        // and y_new = c*x_previous + d*y_previous + f
        // 50000 times to get the points for each fern
        for (var i = 0; i < FERN_SIZE; i++) {
            x = xArray[i];
            y = yArray[i];
            set = probability(count);
            newX = set[0] * x + set[1] * y + set[4];
            newY = set[2] * x + set[3] * y + set[5];
            xArray.push(newX);
            yArray.push(newY);
        }

        // Find min and max x and y values
        var xmax = xArray.reduce((a, b) => Math.max(a, b), -Infinity);
        var ymax = yArray.reduce((a, b) => Math.max(a, b), -Infinity);
        var xmin = xArray.reduce((a, b) => Math.min(a, b));
        var ymin = yArray.reduce((a, b) => Math.min(a, b));

        // Scale the coordinates to be within the range x: -1 to 1,
        // y: -1 to 1
        for (var i = 0; i < FERN_SIZE; i++) {
            newX = (((2 * xArray[i]) - 1) / (xmax - xmin)) * .05;
            newY = ((2 * yArray[i]) - 1) / (ymax - ymin) * .1;
            vertices.push(vec2(newX, newY));
        }
    }

    return vertices;
}

// Return the correct set based on the probabilities of
// fern 1 or fern 2
function probability(fernNum)
{
    // generate random number between [1,0)
    r = Math.random();
    // return set for fern 1
    if (fernNum == 1) {
        if (r < .1) {
            return set1;
        }
        else if (r < .18) {
            return set2;
        }
        else if (r < .26) {
            return set3;
        }
        else {
            return set4_1;
        }
    }
    // return set for fern 2
    else {
        if (r < .01) {
            return set1;
        }
        else if (r < .08) {
            return set2;
        }
        else if (r < .15) {
            return set3;
        }
        else {
            return set4_2;
        }
    }
}

// Draw function: draw one of the two ferns based on the value
// of drawStrip
function DrawFerns(fern_choice) {
    // if fern_choice = 1, draw the first fern
    if (fern_choice==1)
    {
        for (var i = 0; i < FERN_SIZE; i++) {
            mvMatrixStack.push(modelViewMatrix);
            var t = translate(fernCoord[i][0], fernCoord[i][1], 0);
            //console.log(fernCoord[i][0], fernCoord[i][0]);
            modelViewMatrix = mult(modelViewMatrix, t);
            DrawSphereSimple2(.004);
            modelViewMatrix=mvMatrixStack.pop();
        }
     }
     // if fern_choice != 1, draw the second fern
     else
     {
       for (var i = FERN_SIZE; i < FERN_SIZE*2; i++) {
           mvMatrixStack.push(modelViewMatrix);
           var t = translate(fernCoord[i][0], fernCoord[i][1], 0);
           //console.log(fernCoord[i][0], fernCoord[i][0]);
           modelViewMatrix = mult(modelViewMatrix, t);
           DrawSphereSimple2(.004);
           modelViewMatrix=mvMatrixStack.pop();
       }
     }
}

// Draw function: draw one of the two ferns based on the value
// of drawStrip
function DrawFernsSphere(fern_choice) {
    // if fern_choice = 1, draw the first fern
    if (fern_choice==1)
    {
        for (var i = 0; i < FERN_SIZE; i++) {
            mvMatrixStack.push(modelViewMatrix);
            var t = translate(fernCoord[i][0], fernCoord[i][1], 0);
            //console.log(fernCoord[i][0], fernCoord[i][0]);
            modelViewMatrix = mult(modelViewMatrix, t);
            DrawSphereSimple4(.004);
            modelViewMatrix=mvMatrixStack.pop();
        }
     }
     // if fern_choice != 1, draw the second fern
     else
     {
       for (var i = FERN_SIZE; i < FERN_SIZE*2; i++) {
           mvMatrixStack.push(modelViewMatrix);
           var t = translate(fernCoord[i][0], fernCoord[i][1], 0);
           //console.log(fernCoord[i][0], fernCoord[i][0]);
           modelViewMatrix = mult(modelViewMatrix, t);
           DrawSphereSimple4(.004);
           modelViewMatrix=mvMatrixStack.pop();
       }
     }
}

function DrawFerns1(type) {
    mvMatrixStack.push(modelViewMatrix);
    DrawWholeFernLayerSphere(40, type);
    DrawWholeFernLayerSphere(10, type);
    modelViewMatrix=mvMatrixStack.pop();
}

function DrawFerns2(type) {
    mvMatrixStack.push(modelViewMatrix);
    DrawWholeFernLayerSphere(10, type);
    modelViewMatrix=mvMatrixStack.pop();
}

function DrawTree(type) {
    mvMatrixStack.push(modelViewMatrix);
    DrawWholeFernLayer(40, type);
    t=translate(0, 0.1, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayer(30, type);
    t=translate(0, 0.1, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayer(20, type);
    t=translate(0, 0.1, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayer(10, type);
    modelViewMatrix=mvMatrixStack.pop();
}

function DrawTreeSphere(type) {
    mvMatrixStack.push(modelViewMatrix);
    DrawWholeFernLayerSphere(40, type);
    t=translate(0, 0.1, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayerSphere(30, type);
    t=translate(0, 0.1, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayerSphere(20, type);
    t=translate(0, 0.1, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayerSphere(10, type);
    modelViewMatrix=mvMatrixStack.pop();
}

function DrawTreeLarge(type) {
    var height_incr = 0.05;
    mvMatrixStack.push(modelViewMatrix);
    DrawWholeFernLayer(80, type);
    t=translate(0, height_incr/2, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayer(75, type);
    t=translate(0, height_incr, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayer(70, type);
    t=translate(0, height_incr, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayer(60, type);
    t=translate(0, height_incr, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayer(50, type);
    t=translate(0, height_incr, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayer(40, type);
    t=translate(0, height_incr, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayer(30, type);
    t=translate(0, height_incr, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayer(20, type);
    t=translate(0, height_incr, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayer(10, type);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    r=rotate(45, 0, 1, 0);
    modelViewMatrix=mult(modelViewMatrix, r);
    DrawWholeFernLayer(80, type);
    t=translate(0, height_incr/2, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayer(75, type);
    t=translate(0, height_incr, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayer(70, type);
    t=translate(0, height_incr, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayer(60, type);
    t=translate(0, height_incr, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayer(50, type);
    t=translate(0, height_incr, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayer(40, type);
    t=translate(0, height_incr, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayer(30, type);
    t=translate(0, height_incr, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayer(20, type);
    t=translate(0, height_incr, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawWholeFernLayer(10, type);
    modelViewMatrix=mvMatrixStack.pop();
}

// Use rotation to create a fern layer
function DrawWholeFernLayer(tilt, type) {
    var r, t;
    mvMatrixStack.push(modelViewMatrix);
    r=rotate(-tilt, 1, 0, 0);
    modelViewMatrix=mult(modelViewMatrix, r);
    DrawFerns(type);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    r=rotate(90, 0, 1, 0);
    r=mult(r, rotate(-tilt, 1, 0, 0));
    modelViewMatrix=mult(modelViewMatrix, r);
    DrawFerns(type);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    r=rotate(180, 0, 1, 0);
    r=mult(r, rotate(-tilt, 1, 0, 0));
    modelViewMatrix=mult(modelViewMatrix, r);
    DrawFerns(type);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    r=rotate(-90, 0, 1, 0);
    r=mult(r, rotate(-tilt, 1, 0, 0));
    modelViewMatrix=mult(modelViewMatrix, r);
    DrawFerns(type);
    modelViewMatrix=mvMatrixStack.pop();
}

// Use rotation to create a fern layer
function DrawWholeFernLayerSphere(tilt, type) {
    var r, t;
    mvMatrixStack.push(modelViewMatrix);
    r=rotate(-tilt, 1, 0, 0);
    modelViewMatrix=mult(modelViewMatrix, r);
    DrawFernsSphere(type);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    r=rotate(90, 0, 1, 0);
    r=mult(r, rotate(-tilt, 1, 0, 0));
    modelViewMatrix=mult(modelViewMatrix, r);
    DrawFernsSphere(type);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    r=rotate(180, 0, 1, 0);
    r=mult(r, rotate(-tilt, 1, 0, 0));
    modelViewMatrix=mult(modelViewMatrix, r);
    DrawFernsSphere(type);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    r=rotate(-90, 0, 1, 0);
    r=mult(r, rotate(-tilt, 1, 0, 0));
    modelViewMatrix=mult(modelViewMatrix, r);
    DrawFernsSphere(type);
    modelViewMatrix=mvMatrixStack.pop();
}

function DrawGrass() {

    // the ground
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0, 0.02, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    r=rotate(-180, 1.0, 0.0, 0.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    DrawWall(0.02);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0, 0.02, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    r=rotate(-180, 0, 0.0, 1.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    DrawWall(0.02);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    r=rotate(-180, 0, 0.0, 1.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    r=rotate(-180, 1.0, 0.0, 0.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    DrawWall(0.02);
    modelViewMatrix=mvMatrixStack.pop();
}

function DrawDirt() {
    // the ground (dirt)
  	mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.3, 0.025, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
  	r=rotate(-180, 1.0, 0.0, 0.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    s=scale4(1.25, .5, .25);
    modelViewMatrix=mult(modelViewMatrix, s);
  	DrawWall(0.02);
  	modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0, 0.025, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
  	r=rotate(-180, 0, 0.0, 1.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    s=scale4(.25, .25, 1);
    modelViewMatrix=mult(modelViewMatrix, s);
  	DrawWall(0.02);
  	modelViewMatrix=mvMatrixStack.pop();
}

function DrawTrunk() {

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.2, 0.025, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    r=rotate(-90, 1.0, 0.0, 0.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    s=scale4(1, 1, 0.8)
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawCylinder(.018);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.2, 0.025, 0.5);
    modelViewMatrix = mult(modelViewMatrix, t);
    r=rotate(-90, 1.0, 0.0, 0.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    s=scale4(1, 1, 0.8)
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawCylinder(.018);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.2, 0.025, 1);
    modelViewMatrix = mult(modelViewMatrix, t);
    r=rotate(-90, 1.0, 0.0, 0.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    s=scale4(1, 1, 0.8)
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawCylinder(.018);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.2, 0.025, -0.2);
    modelViewMatrix = mult(modelViewMatrix, t);
    r=rotate(-90, 1.0, 0.0, 0.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    s=scale4(1, 1, 0.8)
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawCylinder(.018);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.6, 0.025, -0.2);
    modelViewMatrix = mult(modelViewMatrix, t);
    r=rotate(-90, 1.0, 0.0, 0.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    s=scale4(1, 1, 0.8)
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawCylinder(.018);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(1, 0.025, -0.2);
    modelViewMatrix = mult(modelViewMatrix, t);
    r=rotate(-90, 1.0, 0.0, 0.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    s=scale4(1, 1, 0.8)
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawCylinder(.018);
    modelViewMatrix=mvMatrixStack.pop();

    // Also large tree trunk
    mvMatrixStack.push(modelViewMatrix);
    t=translate(-.7, 0.025, -0.7);
    modelViewMatrix = mult(modelViewMatrix, t);
    r=rotate(-90, 1.0, 0.0, 0.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    s=scale4(1, 1, 2.2)
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawCylinder(.02);
    modelViewMatrix=mvMatrixStack.pop();

    // Also inside tree trunk
    mvMatrixStack.push(modelViewMatrix);
    t=translate(1.11, 0.145, 0.1);
    modelViewMatrix = mult(modelViewMatrix, t);
    r=rotate(-90, 1.0, 0.0, 0.0);
    modelViewMatrix=mult(modelViewMatrix, r);
    s=scale4(1, 1, 0.8)
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawCylinder(.018);
    modelViewMatrix=mvMatrixStack.pop();
}

function DrawTrees() {

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.2, 0.025, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawTree(1);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.2, 0.025, 0.5);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawTree(1);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.2, 0.025, 1);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawTree(1);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.2, 0.025, -0.2);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawTree(1);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.6, 0.025, -0.2);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawTree(1);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(1, 0.025, -0.2);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawTree(1);
    modelViewMatrix=mvMatrixStack.pop();


    mvMatrixStack.push(modelViewMatrix);
    t=translate(1.11, 0.15, 0.1);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawTreeSphere(1);
    modelViewMatrix=mvMatrixStack.pop();
}

function DrawBushes() {

  mvMatrixStack.push(modelViewMatrix);
  t=translate(-0.2, 0.13, 0.25);
  modelViewMatrix = mult(modelViewMatrix, t);
  s = scale4(.15, .16, .23);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawSphereSimple3(1);
  modelViewMatrix=mvMatrixStack.pop();
  mvMatrixStack.push(modelViewMatrix);
  t=translate(-0.2, 0.14, 0.2);
  modelViewMatrix = mult(modelViewMatrix, t);
  s = scale4(.12, .19, .21);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawSphereSimple3(1);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  t=translate(-0.21, 0.1, 0.74);
  modelViewMatrix = mult(modelViewMatrix, t);
  s = scale4(.2, .1, .24);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawSphereSimple3(1);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  t=translate(-0.21, 0.13, 0.77);
  modelViewMatrix = mult(modelViewMatrix, t);
  s = scale4(.18, .13, .23);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawSphereSimple3(1);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.41, 0.15, -0.2);
  modelViewMatrix = mult(modelViewMatrix, t);
  s = scale4(.25, .15, .18);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawSphereSimple3(1);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.8, 0.12, -0.18);
  modelViewMatrix = mult(modelViewMatrix, t);
  s = scale4(.25, .14, .2);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawSphereSimple3(1);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  t=translate(-0.05, 0.12, -0.18);
  modelViewMatrix = mult(modelViewMatrix, t);
  s = scale4(.25, .15, .23);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawSphereSimple3(1);
  modelViewMatrix=mvMatrixStack.pop();
}
