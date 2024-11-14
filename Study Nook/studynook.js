// PROGRAMMER: Ruth Dohrmann
// PROJECT: project 4, part III
// PROGRAM: studynook.js
// DUE DATE: 12/12/23
// INSTRUCTOR: Dr. Cen Li
//
// Description: This program calculates the points of a cube, a
// sphere, a cylinder, a file holder, a curtain, a candlestick,
// a book, a baseboard, an open cylinder (no top or base), a second
// sphere by surface revolution, and a fan blade and arranges these
// shapes and objects to show a scene with one table, one chair, a
// curtain, a file holder, a curtain rod, a bookshelf, multiple
// books, multiple candlesticks, a basebaord, crown molding, a fan,
// a rug, pens, a pen holder, plants (ferns and trees), paper, a
// window, and a framed painting.

var my_r_sphere_count = 0;
var my_r_sphere_count2 = 0;

var canvas;
var gl;
var program;

var numTimesToSubdivide = 3;

var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];

var fernCoord = [];

var sounds = [];

// texture coordinates
var texCoord = [
    vec2(1, 0),
    vec2(0, 0),
    vec2(1, 1),
    vec2(0, 1)
];

// texture coordinates (pentagon)
var texCoord2 = [
    vec2(0, .5),
    vec2(0, 0),
    vec2(.5, .5),
    vec2(.5, 0),
    vec2(.25, .5),
];

// texture coordinates (triangle)
var texCoord3 = [
    vec2(0, 1),
    vec2(0.7, 0.3),
    vec2(0.7, 1)
];

var cubeCount=36;
var sphereCount=0;
var fileHolderCount = 63;
var curtainCount = 96;
var cylinderCount = 600;
var candlestick1Count = 8*24*6;
var bookCount = 3*6;
var boardCount = 96;
var candlestick2Count = 5*24*6;
var openCylinderCount = 852;
var additionalCount = 252;
var wireCount = 1152;
var bladeCount = 57;
var EndPartTwoCount = (sphereCount+cubeCount+fileHolderCount+curtainCount+cylinderCount+candlestick1Count+2*bookCount+boardCount+openCylinderCount+additionalCount+wireCount+bladeCount);
var revolutionSphereCount = 0;
var revolutionSphereLargeCount = 0;
var revolutionSphereCount2 = 0;
var candleCount = 6*24*6;
var potCount = 0;

var FERN_SIZE = 200;

var fanMovement = false;
var paperMovement = false;
var run;

// Variables that control the orthographic projection bounds.
var y_max = 5.5;
var y_min = -5.5;
var x_max = 8;
var x_min = -8;
var near = -50;
var far = 50;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

function fileHolder()
{
    pentagon(8, 9, 10, 11, 12);
    pentagon(13, 14, 15, 16, 17);
    pentagon(18, 19, 20, 21, 22);
    pentagon(23, 24, 25, 26, 27);
    pentagon(28, 29, 30, 31, 32);
    quad(33, 34, 35, 36);
    quad(37, 38, 39, 40);
    quad(41, 42, 43, 44);
}

function curtain()
{
    quad(45, 46, 47, 48);
    quad(49, 50, 51, 52);
    quad(53, 54, 55, 56);
    quad(57, 58, 59, 60);
    quad(61, 62, 63, 64);
    quad(65, 66, 67, 68);
    quad(69, 70, 71, 72);

    quad(73, 74, 75, 76);
    quad(77, 78, 79, 80);
    quad(81, 82, 83, 84);
    quad(85, 86, 87, 88);
    quad(89, 90, 91, 92);
    quad(93, 94, 95, 96);
    quad(97, 98, 99, 100);
    quad(101, 102, 103, 104);
    quad(105, 106, 107, 108);
}

function book()
{
    quad(109, 110, 111, 112);
    quad(113, 114, 115, 116);
    quad(117, 118, 119, 120);

    quad(121, 122, 123, 124);
    quad(125, 126, 127, 128);
    quad(129, 130, 131, 132);
}

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

var lightPosition = vec4(.2, 1, 1, 0);

var lightAmbient = vec4(0.6, 0.6, 0.6, 1.0);
var lightDiffuse = vec4(0.8, 0.8, 0.8, 1.0);
var lightSpecular = vec4(.2, .2, .2, 1.0);

var materialAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var materialDiffuse = vec4(222/255, 197/255, 149/255, 1.0);
var materialSpecular = vec4(1, 1, 1, 1.0 );

var materialShininess = 60.0;

var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];

// namespace contain all the project information
var AllInfo = {

    // Camera pan control variables.
    zoomFactor : .15,
    translateX : -0.1,
    translateY : -0.1,

    // Camera rotate control variables.
    phi : 0.75,
    theta : 0.45,
    radius : 1.5,
    dr : 2.0 * Math.PI/180.0,

    // Mouse control variables
    mouseDownRight : false,
    mouseDownLeft : false,

    mousePosOnClickX : 0,
    mousePosOnClickY : 0
};

var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    // Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // generate the points / normals / texture coorinates
    colorCube();
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
    fileHolder();
    curtain();
    cylinder();
    var saved_length = pointsArray.length;
    surfaceRevPoints(0, 9);
    candlestick1Count = pointsArray.length - saved_length;
    book();
    ExtrudedBaseboard();
    openCylinder();
    GenSpherePoints();
    fanBlades();
    // tiny sphere
    saved_length = pointsArray.length;
    var slices=6;
	  var stacks=4;
	  var radius=0.01;
    GenerateSphereRevolution1(radius, slices, stacks);
    revolutionSphereCount = pointsArray.length - saved_length;
    // regular sphere
    saved_length = pointsArray.length;
    var slices=16;
	  var stacks=12;
	  var radius=0.8;
    GenerateSphereRevolution1(radius, slices, stacks);
    revolutionSphereLargeCount = pointsArray.length - saved_length;
    // small sphere
    var saved_length = pointsArray.length;
    var slices=6;
	  var stacks=4;
	  var radius=0.8;
    GenerateSphereRevolution1(radius, slices, stacks);
    revolutionSphereCount2 = pointsArray.length - saved_length;

    var saved_length = pointsArray.length;
    // candle
    surfaceRevPoints(9, 15);
    candleCount = pointsArray.length - saved_length;

    var saved_length = pointsArray.length;
    // plant pot
    surfaceRevPoints(15, 29);
    potCount = pointsArray.length - saved_length;

    roof();

    var initialPoint = GetInitialPointFern();
    // Generate points
    fernCoord = GeneratePointsFern(initialPoint);

    sounds.push(new Audio("FanandPaperAudio.mp4"));
    sounds.push(new Audio("FanAudio1.mp4"));

    // pass data onto GPU:

    // normals
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    // points
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // set up texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTextureCoord" );
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vTexCoord );

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    SetupLightingMaterial();

    // Set the position of the eye
    document.getElementById("eyeValue").onclick=function() {
        eyeX=document.parameterForm.xValue.value;
        eyeY=document.parameterForm.yValue.value;
        eyeZ=document.parameterForm.zValue.value;
        render();
    };

    // These four just set the handlers for the buttons.
    document.getElementById("thetaup").addEventListener("click", function(e) {
        AllInfo.theta += AllInfo.dr;
        render();
    });
    document.getElementById("thetadown").addEventListener("click", function(e) {
        AllInfo.theta -= AllInfo.dr;
        render();
    });
    document.getElementById("phiup").addEventListener("click", function(e) {
        AllInfo.phi += AllInfo.dr;
        render();
    });
    document.getElementById("phidown").addEventListener("click", function(e) {
        AllInfo.phi -= AllInfo.dr;
        render();
    });

    // Set the scroll wheel to change the zoom factor.
    // wheelDelta returns an integer value indicating the distance that the mouse wheel rolled.
    // Negative values mean the mouse wheel rolled down. The returned value is always a multiple of 120.
    document.getElementById("gl-canvas").addEventListener("wheel", function(e) {
        if (e.wheelDelta > 0) {
            AllInfo.zoomFactor = Math.max(0.1, AllInfo.zoomFactor - 0.1);
        } else {
            AllInfo.zoomFactor += 0.1;
        }
        render();
    });

    //************************************************************************************
    //* When you click a mouse button, set it so that only that button is seen as
    //* pressed in AllInfo. Then set the position. The idea behind this and the mousemove
    //* event handler's functionality is that each update we see how much the mouse moved
    //* and adjust the camera value by that amount.
    //************************************************************************************
    document.getElementById("gl-canvas").addEventListener("mousedown", function(e) {
        if (e.which == 1) {
            AllInfo.mouseDownLeft = true;
            AllInfo.mouseDownRight = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        } else if (e.which == 3) {
            AllInfo.mouseDownRight = true;
            AllInfo.mouseDownLeft = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        }
        render();
    });

    document.addEventListener("mouseup", function(e) {
        AllInfo.mouseDownLeft = false;
        AllInfo.mouseDownRight = false;
        render();
    });

    document.addEventListener("mousemove", function(e) {
        if (AllInfo.mouseDownRight) {
            AllInfo.translateX += (e.x - AllInfo.mousePosOnClickX)/30;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.translateY -= (e.y - AllInfo.mousePosOnClickY)/30;
            AllInfo.mousePosOnClickY = e.y;
        } else if (AllInfo.mouseDownLeft) {
            AllInfo.phi += (e.x - AllInfo.mousePosOnClickX)/100;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.theta += (e.y - AllInfo.mousePosOnClickY)/100;
            AllInfo.mousePosOnClickY = e.y;
        }
        render();
    });

    window.addEventListener("keydown", function () {
    // draw fan movement
		if (event.keyCode == 65) {
        paperMovementCount = 0;
        if (fanMovement) {
            sounds[0].pause();
            sounds[1].pause();
            sounds[0].load();
            sounds[1].load();
        }
        else if (!fanMovement && stepCount == 0) {
            sounds[0].play();
        }
        else {
            sounds[1].loop = true;
            sounds[1].play();
        }
        fanMovement = !fanMovement;
			  render();
		}
    // reset
		else if (event.keyCode == 66) {
        // Camera pan control variables.
        AllInfo.zoomFactor = .15;
        AllInfo.translateX = -0.1;
        AllInfo.translateY = -0.1;

        // Camera rotate control variables.
        AllInfo.phi = 0.75;
        AllInfo.theta = 0.45;
        AllInfo.radius = 1.5;
        AllInfo.dr = 2.0 * Math.PI/180.;

        fanMovement = false;
        paperMovement = false;
        locationX = startX, locationY = startY, locationZ = startZ;
        locationXp2 = startXp2, locationYp2 = startYp2, locationZp2 = startZp2;
        locationXp3 = startXp3, locationYp3 = startYp3, locationZp3 = startZp3;
        stepCount = 0;
        sounds[0].pause();
        sounds[1].pause();
        sounds[0].load();
        sounds[1].load();
        fanRotation = 0;

  			render();
		}
    // reset paper
    else if (event.keyCode == 67) {
        paperMovement = false;
        locationX = startX, locationY = startY, locationZ = startZ;
        locationXp2 = startXp2, locationYp2 = startYp2, locationZp2 = startZp2;
        locationXp3 = startXp3, locationYp3 = startYp3, locationZp3 = startZp3;
        stepCount = 0;
			  render();
		}
  });

    render();
}

function loadTexture(texture, whichTexture)
{
    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Enable texture unit 1
    gl.activeTexture(whichTexture);

    // bind the texture object to the target
    gl.bindTexture( gl.TEXTURE_2D, texture);

    // set the texture image
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image);

    // combination needed for images that are not powers of 2
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
};

function SetupLightingMaterial()
{
    // set up lighting and material
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

	  // send lighting and material coefficient products to GPU
    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
}

// ******************************************
// Draw composite objects
// ******************************************

// Draw leg (for table or chair)
function DrawLeg()
  {
  	var s, t, r;

  	// draw the middle portion of the leg - a stretched sphere
  	mvMatrixStack.push(modelViewMatrix);
  	s=scale4(0.2, 0.2, 1.0);
    modelViewMatrix = mult(modelViewMatrix, s);
  	DrawSolidSphere(1);
  	modelViewMatrix=mvMatrixStack.pop();

  	// flat ball on one end
  	mvMatrixStack.push(modelViewMatrix);
  	t=translate(0, 0, 1.06);
    modelViewMatrix = mult(modelViewMatrix, t);
    s=scale4(1, 1, .3);
    modelViewMatrix = mult(modelViewMatrix, s);
  	DrawSolidSphere(0.2);
    modelViewMatrix=mvMatrixStack.pop();

  	// flat ball on the other end
    mvMatrixStack.push(modelViewMatrix);
  	t=translate(0, 0, -1.06);
    modelViewMatrix = mult(modelViewMatrix, t);
    s=scale4(1, 1, .3);
    modelViewMatrix = mult(modelViewMatrix, s);
  	DrawSolidSphere(0.2);
  	modelViewMatrix=mvMatrixStack.pop();

    // ball on one end
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0, 0, 1.26);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawSolidSphere(0.2);

    // ball on the other end
    t=translate(0, 0, -2.52);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawSolidSphere(0.2);
    modelViewMatrix=mvMatrixStack.pop();

    // draw cylinder at the bottom
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0, 0, 1.45);
    s=scale4(1, 1, 0.8);
    modelViewMatrix=mult((mult(modelViewMatrix, t)), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawCylinder(.35);
    modelViewMatrix=mvMatrixStack.pop();

    // draw cube on the top
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0, 0, -1.645);
    s=scale4(1, 1, 1.1);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(.35);
    modelViewMatrix=mvMatrixStack.pop();

}

// Draw a post for the back of a chair
function DrawChairBack()
  {
  	var s, t, r;

  	// draw a stretched sphere
  	mvMatrixStack.push(modelViewMatrix);
  	s=scale4(0.2, 0.2, 1.0);
    modelViewMatrix = mult(modelViewMatrix, s);
  	DrawSolidSphere(1);
  	modelViewMatrix=mvMatrixStack.pop();

  	// flat ball on one end
  	mvMatrixStack.push(modelViewMatrix);
  	t=translate(0, 0, 1.06);
    modelViewMatrix = mult(modelViewMatrix, t);
    s=scale4(1, 1, .3);
    modelViewMatrix = mult(modelViewMatrix, s);
  	DrawSolidSphere(0.2);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
  	// flat ball on the other end
  	t=translate(0, 0, -1.06);
    modelViewMatrix = mult(modelViewMatrix, t);
    s=scale4(1, 1, .3);
    modelViewMatrix = mult(modelViewMatrix, s);
  	DrawSolidSphere(0.2);
  	modelViewMatrix=mvMatrixStack.pop();

    // ball on one end
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0, 0, 1.26);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawSolidSphere(0.2);

    // ball on one end
    t=translate(0, 0, -2.52);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawSolidSphere(0.2);
    modelViewMatrix=mvMatrixStack.pop();

    // cube on one end
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0, 0, 1.59);
    s=scale4(1, 1, 1.1);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(.3);
    modelViewMatrix=mvMatrixStack.pop();

}

// Draw the table
function DrawTable(topWid, topWidx, topThick)
  {
  	var s, t, r;

  	// draw the table top
  	mvMatrixStack.push(modelViewMatrix);
  	t=translate(0, 0.32, 0);
  	s=scale4(topWidx, topThick, topWid);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  	DrawSolidCube(1);
  	modelViewMatrix=mvMatrixStack.pop();

    // Draw the legs multiple times
    DrawTableLegs();
    t= translate(0, .02, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawTableLegs();
    t= translate(0, -.025, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawTableLegs();

}

function DrawTableLegs() {

    // Place the four table legs:
    // leg one:
    mvMatrixStack.push(modelViewMatrix);
    t= translate(0.1615, .16, 0.2115);
    modelViewMatrix = mult(modelViewMatrix, t);
    r=rotate(90, 1, 0, 0);
    modelViewMatrix = mult(modelViewMatrix, r);
    modelViewMatrix = mult(modelViewMatrix, scale4(0.1, 0.1, 0.081346256));
    DrawLeg();
    modelViewMatrix=mvMatrixStack.pop();

    // leg two:
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.1615, .16, -0.2115);
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix = mult(modelViewMatrix, r);
    modelViewMatrix = mult(modelViewMatrix, scale4(0.1, 0.1, 0.081346256));
    DrawLeg();
    modelViewMatrix=mvMatrixStack.pop();

    // leg three:
    mvMatrixStack.push(modelViewMatrix);
    t= translate(-0.1615, .16, 0.2115);
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix = mult(modelViewMatrix, r);
    modelViewMatrix = mult(modelViewMatrix, scale4(0.1, 0.1, 0.081346256));
    DrawLeg();
    modelViewMatrix=mvMatrixStack.pop();

    // leg four:
    mvMatrixStack.push(modelViewMatrix);
    t= translate(-0.1615, .16, -0.2115);
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix = mult(modelViewMatrix, r);
    modelViewMatrix = mult(modelViewMatrix, scale4(0.1, 0.1, 0.081346256));
    DrawLeg();
    modelViewMatrix=mvMatrixStack.pop();
}

// Draw the chair
function DrawChair(topWid, topWidx, topThick)
  {
  	var s, t, r;

  	// draw the seat of the chair
  	mvMatrixStack.push(modelViewMatrix);
  	t=translate(0, 0.2, 0);
  	s=scale4(topWidx, topThick, topWid);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  	DrawSolidCube(1);
  	modelViewMatrix=mvMatrixStack.pop();

    // Draw the legs multiple times
    DrawChairLegs();
    mvMatrixStack.push(modelViewMatrix);
    t= translate(0, .015, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawChairLegs();
    t= translate(0, -.018, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawChairLegs();
    modelViewMatrix=mvMatrixStack.pop();

    // Draw the posts multiple times
    DrawChairBack2(topThick);
    mvMatrixStack.push(modelViewMatrix);
    t= translate(0, .015, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawChairBack2(topThick);
    t= translate(0, -.018, 0);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawChairBack2(topThick);
    modelViewMatrix=mvMatrixStack.pop();

    // draw one cross rail:
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.0615, 0.338, 0);
    s=scale4(topThick, .03, .14);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();

    // draw second cross rail:
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.0615, 0.288, 0);
    s=scale4(topThick, .03, .14);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();
}

function DrawChairLegs() {
    // place the four chair legs
    // leg one:
    mvMatrixStack.push(modelViewMatrix);
    t= translate(0.0615, .105, 0.0615);
    modelViewMatrix = mult(modelViewMatrix, t);
    r=rotate(90, 1, 0, 0);
    modelViewMatrix = mult(modelViewMatrix, r);
    modelViewMatrix = mult(modelViewMatrix, scale4(0.1, 0.1, 0.0480549199));
    DrawLeg();
    modelViewMatrix=mvMatrixStack.pop();

    // leg two:
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.0615, .105, -0.0615);
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix = mult(modelViewMatrix, r);
    modelViewMatrix = mult(modelViewMatrix, scale4(0.1, 0.1, 0.0480549199));
    DrawLeg();
    modelViewMatrix=mvMatrixStack.pop();

    // leg three:
    mvMatrixStack.push(modelViewMatrix);
    t= translate(-0.0615, .105, 0.0615);
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix = mult(modelViewMatrix, r);
    modelViewMatrix = mult(modelViewMatrix, scale4(0.1, 0.1, 0.0480549199));
    DrawLeg();
    modelViewMatrix=mvMatrixStack.pop();

    // leg four:
    mvMatrixStack.push(modelViewMatrix);
    t= translate(-0.0615, .105, -0.0615);
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix = mult(modelViewMatrix, r);
    modelViewMatrix = mult(modelViewMatrix, scale4(0.1, 0.1, 0.0480549199));
    DrawLeg();
    modelViewMatrix=mvMatrixStack.pop();
}

function DrawChairBack2(topThick) {

    // Draw the back of the chair
    // post one:
    mvMatrixStack.push(modelViewMatrix);
    t= translate(0.0615, .313, 0.0615);
    modelViewMatrix = mult(modelViewMatrix, t);
    r=rotate(90, 1, 0, 0);
    modelViewMatrix = mult(modelViewMatrix, r);
    modelViewMatrix = mult(modelViewMatrix, scale4(0.1, 0.1, 0.058));
    DrawChairBack();
    modelViewMatrix=mvMatrixStack.pop();

    // post two:
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.0615, .313, -0.0615);
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix = mult(modelViewMatrix, r);
    modelViewMatrix = mult(modelViewMatrix, scale4(0.1, 0.1, 0.058));
    DrawChairBack();
    modelViewMatrix=mvMatrixStack.pop();
}

// Draw curtain rod
function DrawCurtainRod() {
    // Draw pole:
    mvMatrixStack.push(modelViewMatrix);
    s=scale4(0.2, 0.2, 1.3)
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawCylinder(.1);
    modelViewMatrix=mvMatrixStack.pop();

    // Draw finial
    DrawSolidSphere(0.015);

    // Draw finial
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0, 0, 0.65);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawSolidSphere(0.015);
    modelViewMatrix=mvMatrixStack.pop();
}

var alpha=1;  // transparency

// render function
function render()
{
	var s, t, r;

  // Set clear color
  gl.clearColor(225/255, 236/255, 252/255, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  projectionMatrix = ortho( x_min*AllInfo.zoomFactor - AllInfo.translateX,
                            x_max*AllInfo.zoomFactor - AllInfo.translateX,
                            y_min*AllInfo.zoomFactor - AllInfo.translateY,
                            y_max*AllInfo.zoomFactor - AllInfo.translateY,
                            near, far);
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));


  // Setup the eye to move around different points on a sphere
  eye = vec3( AllInfo.radius*Math.cos(AllInfo.phi),
              AllInfo.radius*Math.sin(AllInfo.theta),
              AllInfo.radius*Math.sin(AllInfo.phi));

  modelViewMatrix = lookAt(eye, at, up);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  alpha=1;
  gl.uniform1f(gl.getUniformLocation(program, "falpha"), alpha);

  // Make everything a little taller
  mvMatrixStack.push(modelViewMatrix);
  s=scale4(1, 1.4, 1);
  modelViewMatrix=mult(modelViewMatrix, s);

  // lighting and material for fild holder, curtain rod, fan wiring, and pen holder
  materialAmbient = vec4(.1, .1, .1, 1.0 );
  materialDiffuse = vec4(0, 0, 0, 1.0);
  materialSpecular = vec4(82/255, 80/255, 77/255, 1.0 );
  materialShiness=20;
  SetupLightingMaterial();

  // Draw curtain rod
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.12, 0.77, 0.04);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawCurtainRod();
  modelViewMatrix=mvMatrixStack.pop();

  // Objects after this pop will be shorter
  modelViewMatrix=mvMatrixStack.pop();

  // Draw fild holder
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.6, 0.021, 0.035);
  s=scale4(0.25, 0.28, 0.55);
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawFileHolder();
  modelViewMatrix=mvMatrixStack.pop();

  // draw pen holder
	mvMatrixStack.push(modelViewMatrix);
  t=translate(0.11, 0.4619, 0.61);
  s=scale4(0.06, 0.22, 0.06);
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix=mult(modelViewMatrix, s);
	DrawOpenWireCylinder();
  modelViewMatrix=mult(modelViewMatrix, scale4(1, 0.002, 1));
  DrawSphereSimple(.625);
	modelViewMatrix=mvMatrixStack.pop();

  // Draw fan outside wiring
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.3, 0.5, 0.3);
  r=rotate(90, 0, 0, 1);
  r=mult(r, rotate(-45, 1, 0, 0));
  s=scale4(0.2, .11, 0.2)
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix=mult(mult(modelViewMatrix, r), s);
  DrawWireSphere();
  modelViewMatrix=mvMatrixStack.pop();

  // lighting and material for the bookshelf
  materialAmbient = vec4(.03, .03, .03, 1.0 );
  materialDiffuse = vec4(26/255, 17/255, 2/255, 1.0);
  materialSpecular = vec4(0, 0, 0, 1.0 );
  materialShiness=50;
  SetupLightingMaterial();

  // Draw bookshelf
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.1, 0, 0);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawBookshelf();
  modelViewMatrix=mvMatrixStack.pop();

  // lighting and material for the candles
  materialAmbient = vec4(.05, .05, .05, 1.0 );
  materialDiffuse = vec4(99/255, 13/255, 12/255, 1.0);
  materialSpecular = vec4(128/255, 17/255, 15/255, 1.0 );
  materialShiness=60;
  SetupLightingMaterial();

  DrawCandles();

  // lighting and material for the ground
  materialAmbient = vec4(.05, .05, .05, 1.0 );
  materialDiffuse = vec4(5/255, 77/255, 11/255, 1.0 );
  materialSpecular = vec4(5/255, 77/255, 11/255, 1.0 );
  materialShiness=1;
  SetupLightingMaterial();

  DrawBushes();

  // lighting and material for the ground
  materialAmbient = vec4(.1, .1, .1, 1.0 );
  materialDiffuse = vec4(5/255, 43/255, 3/255, 1.0);
  materialSpecular = vec4(8/255, 66/255, 5/255, 1.0 );
  materialShiness=1;
  SetupLightingMaterial();

  DrawTrees();

  mvMatrixStack.push(modelViewMatrix);
  t=translate(-0.7, 0.025, -.7);
  modelViewMatrix = mult(modelViewMatrix, t);
  s=scale4(2, 3, 2);
  modelViewMatrix = mult(modelViewMatrix, s);
  DrawTreeLarge(1);
  modelViewMatrix=mvMatrixStack.pop();

  // lighting and material for the ground (dirt)
  materialAmbient = vec4(.05, .05, .05, 1.0 );
  materialDiffuse = vec4(48/255, 31/255, 1/255, 1.0);
  materialSpecular = vec4(48/255, 31/255, 1/255, 1.0 );
  materialShiness=1;
  SetupLightingMaterial();

  DrawDirt();

  mvMatrixStack.push(modelViewMatrix);
  t=translate(0, -0.01, 0);
  s = scale4(2.4, 0.02, 2.4);
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

  DrawTrunk();

  // inside plants' dirt
  mvMatrixStack.push(modelViewMatrix);
  t=translate(1.11, 0.145, 0.1);
  s = scale4(1, 0.002, 1);
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawSphereSimple(.09);
  modelViewMatrix=mvMatrixStack.pop();
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.08, 0.535, .95);
  s = scale4(1, 0.002, 1);
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawSphereSimple(.053);
  modelViewMatrix=mvMatrixStack.pop();

  // lighting and material for the pens
  materialAmbient = vec4(.15, .15, .15, 1.0 );
  materialDiffuse = vec4(4/255, 11/255, 54/255, 1.0);
  materialSpecular = vec4(9/255, 37/255, 222/255, 1.0 );
  materialShiness=60;
  SetupLightingMaterial();

  // draw the pens
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.24, .46, 0.63);
  modelViewMatrix=mult(modelViewMatrix, t);
  r=rotate(-10, 0, 1, 0);
  modelViewMatrix=mult(modelViewMatrix, r);
  s=scale4(.12, .01, .01);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawSphereSimple(.9);
  modelViewMatrix=mvMatrixStack.pop();
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.1, 0.535, 0.6);
  modelViewMatrix=mult(modelViewMatrix, t);
  r=rotate(-18, 1, 0, 0);
  modelViewMatrix=mult(modelViewMatrix, r);
  s=scale4(.01, .12, .01);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawSphereSimple(.8);
  modelViewMatrix=mvMatrixStack.pop();
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.11, 0.535, 0.61);
  modelViewMatrix=mult(modelViewMatrix, t);
  r=rotate(15, 1, 0, 1);
  modelViewMatrix=mult(modelViewMatrix, r);
  s=scale4(.01, .12, .01);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawSphereSimple(.8);
  modelViewMatrix=mvMatrixStack.pop();

  // lighting and material for the grass
  materialAmbient = vec4(.3, .3, .3, 1.0 );
  materialDiffuse = vec4(45/255, 161/255, 45/255, 1.0);
  materialSpecular = vec4(45/255, 161/255, 45/255, 1.0);
  materialShiness=1;
  SetupLightingMaterial();

  // --------create texture object 1----------
  texture1 = gl.createTexture();
  // create the image object
  texture1.image = new Image();
  // Tell the broswer to load an image
  // Plain texture for this stage of the project
  texture1.image.src='grass-cropped.jpg';
  // register the event handler to be called on loading an image
  texture1.image.onload = function() {  loadTexture(texture1, gl.TEXTURE0); }
  // set the texture unit 0 the sampler
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

  DrawGrass();

  // -------create texture object 10------------
  texture10 = gl.createTexture();
  // create the image object
  texture10.image = new Image();
  // Tell the broswer to load an image
  // Plain texture for this stage of the project
  texture10.image.src='blue-tile.jpg';
  // register the event handler to be called on loading an image
  texture10.image.onload = function() {  loadTexture(texture10, gl.TEXTURE9); }
  // set the texture unit 10 the sampler
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 9);

  // lighting and material for the pot
  materialAmbient = vec4(.1, .1, .1, 1.0 );
  materialDiffuse = vec4(84/255, 140/255, 153/255, 1.0);
  materialSpecular = vec4(195/255, 212/255, 214/255, 1.0 );
  materialShiness=70;
  SetupLightingMaterial();

  mvMatrixStack.push(modelViewMatrix);
  t=translate(1.11, 0.01, 0.1);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawPot(1/4, 1/4, 1/4);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.08, 0.4619, .95);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawPot(1/7, 1/7, 1/7);
  modelViewMatrix=mvMatrixStack.pop();

  // lighting and material for book covers
  materialAmbient = vec4(.15, .15, .15, 1.0 );
  materialDiffuse = vec4(133/255, 102/255, 99/255, 1.0);
  materialSpecular = vec4(1, 1, 1, 1.0 );
  materialShiness=60;
  SetupLightingMaterial();

  // -------create texture object 7------------
  texture7 = gl.createTexture();
  // create the image object
  texture7.image = new Image();
  // Tell the broswer to load an image
  // Plain texture for this stage of the project
  texture7.image.src='maroon-book-cropped.jpg';
  // register the event handler to be called on loading an image
  texture7.image.onload = function() {  loadTexture(texture7, gl.TEXTURE6); }
  // set the texture unit 6 the sampler
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);

  // Draw book covers
  DrawBookCovers();

  // -------create texture object 9------------
  texture9 = gl.createTexture();
  // create the image object
  texture9.image = new Image();
  // Tell the broswer to load an image
  // Plain texture for this stage of the project
  texture9.image.src='painting-cropped3.jpg';
  // register the event handler to be called on loading an image
  texture9.image.onload = function() {  loadTexture(texture9, gl.TEXTURE8); }
  // set the texture unit 6 the sampler
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 8);

  // lighting and material for painting
  materialAmbient = vec4(.15, .15, .15, 1.0 );
  materialDiffuse = vec4(1, 1, 1, 1.0);
  materialSpecular = vec4(1, 1, 1, 1.0 );
  materialShiness=60;
  SetupLightingMaterial();

  // Draw painting
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0, 0.775, .8125);
  s=scale4(.01, .35, .35);
  r=rotate(90, 1, 0, 0);
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix=mult(mult(modelViewMatrix, r), s);
  DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

  // lighting and material for the roof
  materialAmbient = vec4(.2, .2, .2, 1.0 );
  materialDiffuse = vec4(214/255, 212/255, 206/255, 1.0);
  materialSpecular = vec4(254/255, 254/255, 254/255, 1.0 );
  materialShiness=10;
  SetupLightingMaterial();

  // -------create texture object 11------------
  texture11 = gl.createTexture();
  // create the image object
  texture11.image = new Image();
  // Tell the broswer to load an image
  // Plain texture for this stage of the project
  texture11.image.src='roofing-cropped2.jpg';
  // register the event handler to be called on loading an image
  texture11.image.onload = function() {  loadTexture(texture11, gl.TEXTURE10); }
  // set the texture unit 10 the sampler
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 10);

  mvMatrixStack.push(modelViewMatrix);
  t=translate(-0.01, 1.15, 0.01);
  modelViewMatrix = mult(modelViewMatrix, t);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  DrawRoof();
  gl.disable(gl.CULL_FACE);
  modelViewMatrix=mvMatrixStack.pop();

  // lighting and material for the candlesticks
  materialAmbient = vec4(.6, .6, .6, 1.0 );
  materialDiffuse = vec4(1, 215/255, 0, 1.0);
  materialSpecular = vec4(249/255, 242/255, 149/255, 1.0 );
  materialShiness=80;
  SetupLightingMaterial();

  // gold candlestick texture from freepik
  // -------create texture object 6------------
  texture6 = gl.createTexture();
  // create the image object
  texture6.image = new Image();
  // Tell the broswer to load an image
  texture6.image.src='gold-cropped.jpg';
  // register the event handler to be called on loading an image
  texture6.image.onload = function() {  loadTexture(texture6, gl.TEXTURE5); }
  // set the texture unit 3 the sampler
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 5);

  // Draw candlesticks
  DrawCandleSticks();

  // Draw picture frame
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0, 0.599, .99);
  s=scale4(1, .7, .6);
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix = mult(modelViewMatrix, s);
  DrawBaseboard();
  modelViewMatrix=mvMatrixStack.pop();
  // bottom
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0, 0.625, .625);
  r=rotate(90, 1, 0, 0);
  s=scale4(1, .75, .6);
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix=mult(mult(modelViewMatrix, r), s);
  DrawBaseboard();
  modelViewMatrix=mvMatrixStack.pop();
  // right
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0, .9468, .635);
  r=rotate(180, 1, 0, 0);
  s=scale4(1, .7, .6);
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix=mult(mult(modelViewMatrix, r), s);
  DrawBaseboard();
  modelViewMatrix=mvMatrixStack.pop();
  // top
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0, 0.925, 1);
  r=rotate(270, 1, 0, 0);
  s=scale4(1, .75, .6);
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix=mult(mult(modelViewMatrix, r), s);
  DrawBaseboard();
  modelViewMatrix=mvMatrixStack.pop();

  // lighting and material for the ferns
  materialAmbient = vec4(.6, .6, .6, 1.0 );
  materialDiffuse = vec4(201/255, 133/255, 20/255, 1.0);
  materialSpecular = vec4(249/255, 242/255, 149/255, 1.0 );
  materialShiness=30;
  SetupLightingMaterial();

  // Outside ferns
  mvMatrixStack.push(modelViewMatrix);
  t=translate(-0.24, 0.02, -0.24);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawFerns1(2);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  t=translate(-0.3, 0.02, 0.55);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawFerns1(2);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.55, 0.02, -0.3);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawFerns1(2);
  modelViewMatrix=mvMatrixStack.pop();

  // Inside fern
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.08, 0.54, .95);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawFerns2(1);
  modelViewMatrix=mvMatrixStack.pop();

  // lighting and material for the fan
  materialAmbient = vec4(.6, .6, .6, 1.0 );
  materialDiffuse = vec4(69/255, 55/255, 32/255, 1.0);
  materialSpecular = vec4(181/255, 145/255, 83/255, 1.0 );
  materialShiness=40;
  SetupLightingMaterial();

  // Draw the exterior body of the fan
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.32, 0.5, 0.32);
  r=rotate(90, 0, 0, 1);
  r=mult(r, rotate(-45, 1, 0, 0));
  s=scale4(.21, .15, .21);
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix=mult(mult(modelViewMatrix, r), s);
  DrawOpenCylinder();
  modelViewMatrix=mvMatrixStack.pop();
  // Stand
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.275, 0.41, 0.275);
  r=rotate(90, 1, 0, 0);
  r=mult(r, rotate(-45, 0, 0, 1));
  s=scale4(.3, .41, 0.76);
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix=mult(mult(modelViewMatrix, r), s);
  DrawCylinder(.1);
  modelViewMatrix=mvMatrixStack.pop();
  // Base
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.275, 0.015, 0.275);
  r=rotate(-45, 0, 1, 0);
  s=scale4(.3, .05, 0.41);
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix=mult(mult(modelViewMatrix, r), s);
  DrawSolidSphere(.3);
  modelViewMatrix=mvMatrixStack.pop();

  // rug texture from freepik
  // -------create texture object 8------------
  texture8 = gl.createTexture();
  // create the image object
  texture8.image = new Image();
  // Tell the broswer to load an image
  texture8.image.src='rug-small-cropped.jpg';
  // register the event handler to be called on loading an image
  texture8.image.onload = function() {  loadTexture(texture8, gl.TEXTURE7); }
  // set the texture unit 3 the sampler
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 7);

  // lighting and material for rug
  materialAmbient = vec4(.3, .3, .3, 1.0 );
  materialDiffuse = vec4(247/255, 233/255, 210/255, 1.0);
  materialSpecular = vec4(1, 1, 1, 1.0 );
  materialShiness=10;
  SetupLightingMaterial();

  // the rug
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.65, 0.02, .65);
  s = scale4(1, 0.007, 1);
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawSphereSimple4(.55);
  modelViewMatrix=mvMatrixStack.pop();

  // lighting and material for floor
  materialAmbient = vec4(.3, .3, .3, 1.0 );
  materialDiffuse = vec4(247/255, 233/255, 210/255, 1.0);
  materialSpecular = vec4(1, 1, 1, 1.0 );
  materialShiness=10;
  SetupLightingMaterial();

  // Picture for floor by fwstudio on Freepik
  // -------create texture object 3------------
  texture3 = gl.createTexture();
  // create the image object
  texture3.image = new Image();
  // Tell the broswer to load an image
  texture3.image.src='texture-wooden-boards-cropped.jpg';
  // register the event handler to be called on loading an image
  texture3.image.onload = function() {  loadTexture(texture3, gl.TEXTURE2); }
  // set the texture unit 2 the sampler
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);

	// wall # 1: in xz-plane
	DrawWall(0.02);

  // brick wall texture from rawpixel.com on freepik
  // -------create texture object 4------------
  texture4 = gl.createTexture();
  // create the image object
  texture4.image = new Image();
  // Tell the broswer to load an image
  texture4.image.src='empty-red-brick-wall-cropped.jpg';
  // register the event handler to be called on loading an image
  texture4.image.onload = function() {  loadTexture(texture4, gl.TEXTURE3); }
  // set the texture unit 3 the sampler
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);

  materialShiness=1;
  SetupLightingMaterial();

	// wall #2: in xy-plane
	mvMatrixStack.push(modelViewMatrix);
  t=translate(-0.04, 0, 0);
  modelViewMatrix = mult(modelViewMatrix, t);
	r=rotate(-90, 1.0, 0.0, 0.0);
  modelViewMatrix=mult(modelViewMatrix, r);
	DrawWall(0.02);
	modelViewMatrix=mvMatrixStack.pop();

  // grey wall
  // -------create texture object 5------------
  texture5 = gl.createTexture();
  // create the image object
  texture5.image = new Image();
  // Tell the broswer to load an image
  // Plain texture for this stage of the project
  texture5.image.src='grey-cropped.jpg';
  // register the event handler to be called on loading an image
  texture5.image.onload = function() {  loadTexture(texture5, gl.TEXTURE4); }
  // set the texture unit 3 the sampler
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);

  mvMatrixStack.push(modelViewMatrix);
  r=rotate(90.0, 0.0, 0.0, 1.0);
  modelViewMatrix=mult(modelViewMatrix, r);
  DrawWallWindow(.02);
  modelViewMatrix=mvMatrixStack.pop();

  // -------create texture object 2------------
  texture2 = gl.createTexture();
  // create the image object
  texture2.image = new Image();
  // Tell the broswer to load an image
  // Plain texture for this stage of the project
  texture2.image.src='offwhite-cropped.jpg';
  // register the event handler to be called on loading an image
  texture2.image.onload = function() {  loadTexture(texture2, gl.TEXTURE1); }
  // set the texture unit 1 the sampler
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);

  // lighting and material for the siding
  materialAmbient = vec4(.2, .2, .2, 1.0 );
  materialDiffuse = vec4(188/255, 193/255, 196/255, 1.0);
  materialSpecular = vec4(1, 1, 1, 1.0 );
  materialShiness=60;
  SetupLightingMaterial();

  // Draw the siding
  mvMatrixStack.push(modelViewMatrix);
  t=translate(-0.05, 0, 0);
  r=rotate(-90.0, 0.0, 0.0, 1.0);
  modelViewMatrix=mult(modelViewMatrix, t);
  modelViewMatrix=mult(modelViewMatrix, r);
  DrawSiding(0.015);
  modelViewMatrix=mvMatrixStack.pop();

  // lighting and material for the baseboard, crown molding, paper, and fan blades
  materialAmbient = vec4(.6, .6, .6, 1.0 );
  materialDiffuse = vec4(252/255, 252/255, 250/255, 1.0);
  materialSpecular = vec4(1, 1, 1, 1.0 );
  materialShiness=60;
  SetupLightingMaterial();

  // Draw book pages
  DrawBookPages();

  DrawWindowFrame();

  // Draw baseboard
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0, 0.06488, 0);
  r=rotate(90, 1, 0, 0);
  s=scale4(1.2, 2.41, 1.1)
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix=mult(mult(modelViewMatrix, r), s);
  DrawBaseboard();
  modelViewMatrix=mvMatrixStack.pop();

  // Draw crown molding
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0, 1.14, 1.21);
  r=rotate(-90, 1, 0, 0);
  s=scale4(1.7, 2.4, 2);
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix=mult(mult(modelViewMatrix, r), s);
  DrawBaseboard();
  modelViewMatrix=mvMatrixStack.pop();

  // Draw fan blades
  mvMatrixStack.push(modelViewMatrix);
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.3, 0.5, 0.3);
  r=rotate(-45, 0, 1, 0);
  modelViewMatrix=mult(mult(modelViewMatrix, t), r);
  DrawFanBlades(scale4(.8, 1.15, 1.15));
  modelViewMatrix=mvMatrixStack.pop();

  // Everything will be taller
  mvMatrixStack.push(modelViewMatrix);
  s=scale4(1, 1.4, 1);
  modelViewMatrix=mult(modelViewMatrix, s);

  // draw the paper
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.24, .33, 0.75);
  modelViewMatrix=mult(modelViewMatrix, t);
  s=scale4(.19, .001, .13);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawSolidCube(1);
  t=translate(0.01, .0001, -0.06);
  modelViewMatrix=mult(modelViewMatrix, t);
  r=rotate(5, 0, 1, 0);
  modelViewMatrix=mult(modelViewMatrix, r);
  DrawSolidCube(1);
  t=translate(-0.01, .0001, -0.03);
  modelViewMatrix=mult(modelViewMatrix, t);
  r=rotate(-10, 0, 1, 0);
  modelViewMatrix=mult(modelViewMatrix, r);
  DrawSolidCube(1);
  t=translate(0.01, .0001, -0.02);
  modelViewMatrix=mult(modelViewMatrix, t);
  r=rotate(5, 0, 1, 0);
  modelViewMatrix=mult(modelViewMatrix, r);
  DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();
  DrawPaper();

  // lighting and material for the table and chair
  materialAmbient = vec4(.2, .2, .2, 1.0 );
  materialDiffuse = vec4(214/255, 212/255, 206/255, 1.0);
  materialSpecular = vec4(254/255, 254/255, 254/255, 1.0 );
  materialShiness=10;
  SetupLightingMaterial();

  // draw the table
	mvMatrixStack.push(modelViewMatrix);
  t=translate(0.2, 0, 0.8);
  modelViewMatrix=mult(modelViewMatrix, t);
	DrawTable(0.5, 0.4, 0.02);
	modelViewMatrix=mvMatrixStack.pop();

  // draw the chair
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.4, 0, 0.8);
  modelViewMatrix=mult(modelViewMatrix, t);
  DrawChair(0.2, 0.2, 0.02);
  modelViewMatrix=mvMatrixStack.pop();

  // lighting and material for the curtain
  materialAmbient = vec4(.3, .3, .3, 1.0 );
  materialDiffuse = vec4(252/255, 252/255, 250/255, 1.0);
  materialSpecular = vec4(254/255, 254/255, 254/255, 1.0 );
  materialShiness=10;
  SetupLightingMaterial();

  // Draw curtain
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.1, 0.01, 0.4);
  r=rotate(90, 0, 1, 0);
  s=scale4(0.4, 1, 0.2)
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix=mult(mult(modelViewMatrix, r), s);
  alpha=.6;
  gl.uniform1f(gl.getUniformLocation(program, "falpha"), alpha);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  DrawCurtain();
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  t=translate(-.01, 0.45, .30625);
  s=scale4(0.01, 0.61, 0.4725)
  modelViewMatrix = mult(modelViewMatrix, t);
  modelViewMatrix=mult(modelViewMatrix, s);
  alpha=.2;
  gl.uniform1f(gl.getUniformLocation(program, "falpha"), alpha);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();
  gl.disable(gl.BLEND);
  modelViewMatrix=mvMatrixStack.pop();
}

// Scale function
function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}
