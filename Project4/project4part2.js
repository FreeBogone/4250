// Bowen Truelove
// Zeiad Abdelkhalik
// CSCI 4250
// Project 4 Part 2
// 11/26/2024

// No AI:

// A.I. Disclaimer: All work for this assignment was completed by myself and entirely without 
// the use of artificial intelligence tools such as ChatGPT, MS Copilot, other LLMs, etc

var canvas;
var gl, program;

var zoomFactor = 2.5;
var translateFactorX = -0.2;
var translateFactorY = 0.1;

var numTimesToSubdivide = 5;

var pointsArray = [];
var normalsArray = [];
var pointsIndex = 0;
var colorsArray = [];

var buildingVertices = [];

var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -10;
var far = 10;
var deg=5;
var eye=[.4, .6, .4];
var at=[.0, .2, -0.2];
var up=[0, 1, 0];

var cubeCount=36;
var sphereCount=0;

var lightPosition = vec4(0.5, 0.5, 0.5, 0);
var lightAmbient, lightDiffuse, lightSpecular;
var materialAmbient, materialDiffuse, materialSpecular;
var materialShininess;

var vertices = [
  vec4( -0.5, -0.5,  0.5, 1.0 ),
  vec4( -0.5,  0.5,  0.5, 1.0 ),
  vec4( 0.5,  0.5,  0.5, 1.0 ),
  vec4( 0.5, -0.5,  0.5, 1.0 ),
  vec4( -0.5, -0.5, -0.5, 1.0 ),
  vec4( -0.5,  0.5, -0.5, 1.0 ),
  vec4( 0.5,  0.5, -0.5, 1.0 ),
  vec4( 0.5, -0.5, -0.5, 1.0 ),
  // Trapezoid vertices (8-15)
  vec4(-0.6, -0.5, 0.5, 1.0),
  vec4(0.6, -0.5, 0.5, 1.0),
  vec4(0.3, 0.5, 0.5, 1.0),
  vec4(-0.3, 0.5, 0.5, 1.0),
  vec4(-0.6, -0.5, -0.5, 1.0),
  vec4(0.6, -0.5, -0.5, 1.0),
  vec4(0.3, 0.5, -0.5, 1.0),
  vec4(-0.3, 0.5, -0.5, 1.0),
  // Spaceship vertices (16-31):
  vec4( 0.0,  0.0,  1.2, 1.0 ),   
  vec4(-0.2,  0.1,  0.6, 1.0 ),    
  vec4( 0.2,  0.1,  0.6, 1.0 ),    
  vec4(-0.2, -0.1,  0.6, 1.0 ),     
  vec4( 0.2, -0.1,  0.6, 1.0 ),     
  vec4(-0.3,  0.15, -0.6, 1.0 ),    
  vec4( 0.3,  0.15, -0.6, 1.0 ),   
  vec4(-0.3, -0.15, -0.6, 1.0 ),   
  vec4( 0.3, -0.15, -0.6, 1.0 ),    
  vec4(-0.9,  0.0,  0.0, 1.0 ),  
  vec4( 0.9,  0.0,  0.0, 1.0 ),     
  vec4(-0.2, -0.1, -0.8, 1.0 ),     
  vec4( 0.2, -0.1, -0.8, 1.0 ),    
  vec4(-0.2,  0.1, -0.8, 1.0 ),    
  vec4( 0.2,  0.1, -0.8, 1.0 ),    
  vec4( 0.0,  0.25, -0.2, 1.0 )     
];
var trunkVertices = {
  base: [  // Bottom decagon (base of the tree trunk)
      vec4(Math.cos(0 * Math.PI / 5), 0.0, Math.sin(0 * Math.PI / 5), 1.0),
      vec4(Math.cos(1 * Math.PI / 5), 0.0, Math.sin(1 * Math.PI / 5), 1.0),
      vec4(Math.cos(2 * Math.PI / 5), 0.0, Math.sin(2 * Math.PI / 5), 1.0),
      vec4(Math.cos(3 * Math.PI / 5), 0.0, Math.sin(3 * Math.PI / 5), 1.0),
      vec4(Math.cos(4 * Math.PI / 5), 0.0, Math.sin(4 * Math.PI / 5), 1.0),
      vec4(Math.cos(5 * Math.PI / 5), 0.0, Math.sin(5 * Math.PI / 5), 1.0),
      vec4(Math.cos(6 * Math.PI / 5), 0.0, Math.sin(6 * Math.PI / 5), 1.0),
      vec4(Math.cos(7 * Math.PI / 5), 0.0, Math.sin(7 * Math.PI / 5), 1.0),
      vec4(Math.cos(8 * Math.PI / 5), 0.0, Math.sin(8 * Math.PI / 5), 1.0),
      vec4(Math.cos(9 * Math.PI / 5), 0.0, Math.sin(9 * Math.PI / 5), 1.0)
  ],
  top: [   // Top smaller decagon (top of the tree trunk)
      vec4(Math.cos(0 * Math.PI / 5) * 0.6, 1.0, Math.sin(0 * Math.PI / 5) * 0.6, 1.0),
      vec4(Math.cos(1 * Math.PI / 5) * 0.6, 1.0, Math.sin(1 * Math.PI / 5) * 0.6, 1.0),
      vec4(Math.cos(2 * Math.PI / 5) * 0.6, 1.0, Math.sin(2 * Math.PI / 5) * 0.6, 1.0),
      vec4(Math.cos(3 * Math.PI / 5) * 0.6, 1.0, Math.sin(3 * Math.PI / 5) * 0.6, 1.0),
      vec4(Math.cos(4 * Math.PI / 5) * 0.6, 1.0, Math.sin(4 * Math.PI / 5) * 0.6, 1.0),
      vec4(Math.cos(5 * Math.PI / 5) * 0.6, 1.0, Math.sin(5 * Math.PI / 5) * 0.6, 1.0),
      vec4(Math.cos(6 * Math.PI / 5) * 0.6, 1.0, Math.sin(6 * Math.PI / 5) * 0.6, 1.0),
      vec4(Math.cos(7 * Math.PI / 5) * 0.6, 1.0, Math.sin(7 * Math.PI / 5) * 0.6, 1.0),
      vec4(Math.cos(8 * Math.PI / 5) * 0.6, 1.0, Math.sin(8 * Math.PI / 5) * 0.6, 1.0),
      vec4(Math.cos(9 * Math.PI / 5) * 0.6, 1.0, Math.sin(9 * Math.PI / 5) * 0.6, 1.0)
  ]
};

var leavesTip = vec4(0.0, 2.0, 0.0, 1.0); // The tip is placed 2 units above the top of the trunk

//Building initial 2d line points for surface of revolution  (25 points)
var buildingPoints = [
  [0,    0.0,   0.0],  // Base center
  [0.15, 0.0,   0.0],  // Wide base
  [0.13, 0.05,  0.0],  // Base start taper
  [0.10, 0.10,  0.0],  // Base taper
  [0.15, 0.15,  0.0],  // Continuing base taper
  [0.10, 0.20,  0.0],  // Moving to shaft
  [0.05, 0.25,  0.0],  // Narrow shaft begins
  [0.04, 0.30,  0.0],  // Shaft
  [0.04, 0.35,  0.0],  // Shaft continues
  [0.04, 0.40,  0.0],  // Shaft maintains
  [0.05, 0.45,  0.0],  // Start widening for deck
  [0.08, 0.48,  0.0],  // Widening
  [0.12, 0.50,  0.0],  // Almost to deck
  [0.18, 0.52,  0.0],  // Observation deck base
  [0.10, 0.53,  0.0],  // Observation deck widest
  [0.10, 0.54,  0.0],  // Deck maintains
  [0.18, 0.55,  0.0],  // Deck starts taper
  [0.15, 0.56,  0.0],  // Deck tapers
  [0.10, 0.57,  0.0],
  [0.05, 0.60,  0.0],  // Spire base
  [0.04, 0.63,  0.0],  // Spire
  [0.03, 0.66,  0.0],
  [0.02, 0.68,  0.0],  // Near top
  [0.01, 0.69,  0.0],
  [0,    0.70,  0.0],  // Top point
];

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var rotationMatrix = mat4();

var carAnimating = false;
var carPosition = 0;
var carRotation = 0;
var animationSpeed = 0.01;

var carStart = { x: 3.0, y: 0.15, z: 1.2 };
var carTurn = { x: 1.1, y: 0.15, z: 1.2 };
var carEnd = { x: 1.3, y: 0.15, z: 3.0 };

function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

function handleMouseUp(event) {
    mouseDown = false;
}

function handleMouseMove(event) {
    if (!mouseDown) {
        return;
    }

    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - lastMouseX;
    var deltaY = newY - lastMouseY;

    var newRotationMatrix = mat4();
    newRotationMatrix = mult(rotate(deltaX / 10, [0, 1, 0]), newRotationMatrix);
    newRotationMatrix = mult(rotate(deltaY / 10, [1, 0, 0]), newRotationMatrix);

    rotationMatrix = mult(newRotationMatrix, rotationMatrix);

    lastMouseX = newX;
    lastMouseY = newY;

    //render();
}

function main()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // generate the points/normals
    colorCube();
    colorTrapezoid();
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
    // console.log(pointsArray.length);
    DrawMesh();
    // console.log(pointsArray.length);
    // generate the points
    SurfaceRevPoints();
    //Draw tree
    DrawTree();

    // pass data onto GPU
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    // support user interface
    document.getElementById("zoomIn").onclick=function(){zoomFactor *= 0.95;};
    document.getElementById("zoomOut").onclick=function(){zoomFactor *= 1.05;};
    document.getElementById("left").onclick=function(){translateFactorX -= 0.1;};
    document.getElementById("right").onclick=function(){translateFactorX += 0.1;};
    document.getElementById("up").onclick=function(){translateFactorY += 0.1;};
    document.getElementById("down").onclick=function(){translateFactorY -= 0.1;};

    // keyboard handle
    window.onkeydown = HandleKeyboard;

    canvas.addEventListener("mousedown", handleMouseDown, false);
    document.addEventListener("mouseup", handleMouseUp, false);
    document.addEventListener("mousemove", handleMouseMove, false);

    render();
}

function HandleKeyboard(event)
{
    switch (event.keyCode)
    {
    case 37:  // left cursor key
              xrot -= deg;
              break;
    case 39:   // right cursor key
              xrot += deg;
              break;
    case 38:   // up cursor key
              yrot -= deg;
              break;
    case 40:    // down cursor key
              yrot += deg;
              break;
    case 65:    // 'a' key
        carAnimating = !carAnimating;
        if (carAnimating) {
            carPosition = 0;
            carRotation = 0;
        }
        break;
    }
}

function SetupLightingMaterial()
{
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
}
function SetupTrunkMaterial() {
  lightAmbient = vec4(0.2, 0.1, 0.05, 1.0);       // Earthy ambient light
  lightDiffuse = vec4(0.6, 0.4, 0.3, 1.0);       // Warm diffuse light
  lightSpecular = vec4(0.5, 0.3, 0.2, 1.0);      // Subtle specular highlight
  materialAmbient = vec4(0.4, 0.2, 0.1, 1.0);    // Brown for ambient reflection
  materialDiffuse = vec4(0.6, 0.4, 0.3, 1.0);    // Brighter brown for diffuse
  materialSpecular = vec4(0.3, 0.2, 0.1, 1.0);   // Slight shine for wood
  materialShininess = 30;                        // Moderate shininess
  SetupLightingMaterial();
}

function SetupLeavesMaterial() {
  lightAmbient = vec4(0.1, 0.3, 0.1, 1.0);       // Soft greenish ambient light
  lightDiffuse = vec4(0.2, 0.8, 0.2, 1.0);       // Bright green diffuse light
  lightSpecular = vec4(0.3, 0.9, 0.3, 1.0);      // Vibrant green specular light
  materialAmbient = vec4(0.2, 0.6, 0.2, 1.0);    // Dark green for ambient reflection
  materialDiffuse = vec4(0.4, 0.9, 0.4, 1.0);    // Lush green for diffuse reflection
  materialSpecular = vec4(0.2, 0.8, 0.2, 1.0);   // Subtle highlight for leaves
  materialShininess = 50;                        // High shininess for glossy leaves
  SetupLightingMaterial();
}

// ******************************************
// Draw simple and primitive objects
// ******************************************

// Create the sides of the trunk (connecting the base and top) with normals
function createTrunkFaces() {
  for (let i = 0; i < 10; i++) {
      const bottom1 = trunkVertices.base[i];
      const bottom2 = trunkVertices.base[(i + 1) % 10];
      const top1 = trunkVertices.top[i];
      const top2 = trunkVertices.top[(i + 1) % 10];

      // Side face (quad split into two triangles)
      pointsArray.push(bottom1, bottom2, top1); // First triangle
      pointsArray.push(bottom2, top2, top1);   // Second triangle

      // Calculate normals for each face using Newell3 method
      const normal1 = Newell3([bottom1, bottom2, top1]);
      const normal2 = Newell3([bottom2, top2, top1]);

      // Push normals for each vertex of the two triangles
      normalsArray.push(normal1, normal1, normal1);
      normalsArray.push(normal2, normal2, normal2);
  }
}

// Create the cone-shaped leaves above the trunk with normals
function createLeaves() {
  const leavesBaseRadius = 1.2;
  const leavesBase = [];
  const leavesHeight = 1;

  // Define the base of the leaves
  for (let i = 0; i < 10; i++) {
      leavesBase.push(vec4(
          Math.cos(i * Math.PI / 5) * leavesBaseRadius,
          leavesHeight,
          Math.sin(i * Math.PI / 5) * leavesBaseRadius,
          1.0
      ));
  }

  // Create cone faces
  for (let i = 0; i < 10; i++) {
      const base1 = leavesBase[i];
      const base2 = leavesBase[(i + 1) % 10];
      const tip = leavesTip;

      // Add the face vertices
      pointsArray.push(base1, base2, tip);

      // Compute normal for the triangle
      const normal = Newell3([base1, base2, tip]);

      // Push the normal for each vertex of the triangle
      normalsArray.push(normal, normal, normal);
  }

  // Close the base of the cone
  for (let i = 0; i < 10; i++) {
      const base1 = leavesBase[i];
      const base2 = leavesBase[(i + 1) % 10];
      const center = vec4(0.0, leavesHeight, 0.0, 1.0); // Center of the base

      // Add the base face vertices
      pointsArray.push(base1, base2, center);

      // Compute normal for the base triangle
      const normal = Newell3([base1, base2, center]);

      // Push the normal for each vertex of the triangle
      normalsArray.push(normal, normal, normal);
  }
}

function DrawTree() {
  createTrunkFaces(); // Call function to create the tree trunk faces
  createLeaves();     // Call function to create the tree leaves (cone)

}
function DrawSolidSphere(radius)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(radius, radius, radius);   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

 	// draw unit radius sphere
        for( var i=0; i<sphereCount; i+=3)
            gl.drawArrays( gl.TRIANGLES, cubeCount+i, 3 );

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSolidCube(length)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(length, length, length );   // scale to the given width/height/depth

    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawTrapezoid() {
    mvMatrixStack.push(modelViewMatrix);
    s=scale4(1, 1, 0.5);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 36, 36);
    
    modelViewMatrix = mvMatrixStack.pop();
}

// start drawing the wall
function DrawWall(thickness)
{
  // lightAmbient = vec4(0.1, 0.1, 0.3, 1);
  // lightDiffuse = vec4(0.1, 0.1, 0.3, 1);
  // lightSpecular = vec4(0.1, 0.1, 0.3, 1);
  // materialAmbient = vec4(0.0, 0.0, 0.5, 1);
  // materialDiffuse = vec4(0.0, 0.0, 0.8, 1);
  // materialSpecular = vec4(0.0, 0.0, 1.0, 1);
  // materialShininess = 6;
  // SetupLightingMaterial();
	var s, t, r;

	// draw thin wall with top = xz-plane, corner at origin
	mvMatrixStack.push(modelViewMatrix);

	t=translate(1.5, 0.5*thickness, 1.5);
	s=scale4(3.0, thickness, 3.0);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);

	modelViewMatrix=mvMatrixStack.pop();
}

// ******************************************
// Draw composite objects
// ******************************************
function DrawTire() {

    lightAmbient = vec4(0.0, 0.0, 0.0, 1);
    lightDiffuse = vec4(0.0, 0.0, 0.0, 1);
    lightSpecular = vec4(0.0, 0.0, 0.0, 1);
    materialAmbient = vec4(0.0, 0.0, 0.0, 1);
    materialDiffuse = vec4(0.0, 0.0, 0.0, 1);
    materialSpecular = vec4(0.0, 0.0, 0.0, 1);
    materialShininess = 1;
    SetupLightingMaterial();
    //a tire is a squashed sphere
    mvMatrixStack.push(modelViewMatrix);

    t=translate(0, 0, 0);
    s=scale4(1, 1, 0.5);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCylinder(0.5, 0.5);

    modelViewMatrix=mvMatrixStack.pop();
}

function DrawCar() {

    //COMPOSITE OBJECT: CAR
    //SIMPLE OBJECTS: SPHERE, CUBE, TRAPEZOID, CYLINDER

    //using spheres as wheels
    mvMatrixStack.push(modelViewMatrix);
    lightAmbient = vec4(0.0, 0.0, 0.0, 1);
    lightDiffuse = vec4(0.0, 0.0, 0.0, 1);
    lightSpecular = vec4(0.0, 0.0, 0.0, 1);
    materialAmbient = vec4(0.0, 0.0, 0.0, 1);
    materialDiffuse = vec4(0.0, 0.0, 0.0, 1);
    materialSpecular = vec4(0.0, 0.0, 0.0, 1);
    materialShininess = 1;
    SetupLightingMaterial();
    t=translate(0.6, -0.5, -0.3);
    s=scale4(0.7, 0.4, 0.7);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    DrawSolidSphere(0.5);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    lightAmbient = vec4(0.0, 0.0, 0.0, 1);
    lightDiffuse = vec4(0.0, 0.0, 0.0, 1);
    lightSpecular = vec4(0.0, 0.0, 0.0, 1);
    materialAmbient = vec4(0.0, 0.0, 0.0, 1);
    materialDiffuse = vec4(0.0, 0.0, 0.0, 1);
    materialSpecular = vec4(0.0, 0.0, 0.0, 1);
    materialShininess = 1;
    SetupLightingMaterial();
    t=translate(-0.6, -0.5, -0.3);
    s=scale4(0.7, 0.4, 0.7);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    DrawSolidSphere(0.5);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    lightAmbient = vec4(0.0, 0.0, 0.0, 1);
    lightDiffuse = vec4(0.0, 0.0, 0.0, 1);
    lightSpecular = vec4(0.0, 0.0, 0.0, 1);
    materialAmbient = vec4(0.0, 0.0, 0.0, 1);
    materialDiffuse = vec4(0.0, 0.0, 0.0, 1);
    materialSpecular = vec4(0.0, 0.0, 0.0, 1);
    materialShininess = 1;
    SetupLightingMaterial();
    t=translate(-0.6, 0.5, -0.3);
    s=scale4(0.7, 0.4, 0.7);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    DrawSolidSphere(0.5);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    lightAmbient = vec4(0.0, 0.0, 0.0, 1);
    lightDiffuse = vec4(0.0, 0.0, 0.0, 1);
    lightSpecular = vec4(0.0, 0.0, 0.0, 1);
    materialAmbient = vec4(0.0, 0.0, 0.0, 1);
    materialDiffuse = vec4(0.0, 0.0, 0.0, 1);
    materialSpecular = vec4(0.0, 0.0, 0.0, 1);
    materialShininess = 1;
    SetupLightingMaterial();
    t=translate(0.6, 0.5, -0.3);
    s=scale4(0.7, 0.4, 0.7);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    DrawSolidSphere(0.5);
    modelViewMatrix=mvMatrixStack.pop();

    //draw body
    mvMatrixStack.push(modelViewMatrix);
    lightAmbient = vec4(0.3, 0.1, 0.0, 1);
    lightDiffuse = vec4(0.8, 0.4, 0.0, 1);
    lightSpecular = vec4(1.0, 0.5, 0.0, 1);
    materialAmbient = vec4(0.3, 0.1, 0.0, 1);
    materialDiffuse = vec4(0.8, 0.4, 0.0, 1);
    materialSpecular = vec4(1.0, 0.5, 0.0, 1);
    materialShininess = 1;
    SetupLightingMaterial();
    t=translate(0, 0, 0);
    s=scale4(2, 1, 0.5);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();

    //draw cabin
    mvMatrixStack.push(modelViewMatrix);
    lightAmbient = vec4(0.3, 0.1, 0.0, 1);
    lightDiffuse = vec4(0.8, 0.4, 0.0, 1);
    lightSpecular = vec4(1.0, 0.5, 0.0, 1);
    materialAmbient = vec4(0.3, 0.1, 0.0, 1);
    materialDiffuse = vec4(0.8, 0.4, 0.0, 1);
    materialSpecular = vec4(1.0, 0.5, 0.0, 1);
    materialShininess = 1;
    SetupLightingMaterial();
    t=translate(-0.2, 0, 0.5);
    s=scale4(1.2, 0.8, 1.8);
    r=rotate(90, 1, 0, 0);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawTrapezoid();
    modelViewMatrix=mvMatrixStack.pop();

    //draw windows
    mvMatrixStack.push(modelViewMatrix);
    lightAmbient = vec4(0.8, 0.8, 1.0, 1);
    lightDiffuse = vec4(0.8, 0.8, 1.0, 1);
    lightSpecular = vec4(0.9, 0.9, 1.0, 1);
    materialAmbient = vec4(0.8, 0.8, 1.0, 1);
    materialDiffuse = vec4(0.8, 0.8, 1.0, 1);
    materialSpecular = vec4(0.9, 0.9, 1.0, 1);
    materialShininess = 50;
    SetupLightingMaterial();
    t=translate(-0.2, 0, 0.5);
    s=scale4(0.9, 0.6, 1.9);
    r=rotate(90, 1, 0, 0);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawTrapezoid();
    modelViewMatrix=mvMatrixStack.pop();

    //draw windshield and rear windsheild with a trapezoid rotated at the angle of the front trapezoid face
    mvMatrixStack.push(modelViewMatrix);
    lightAmbient = vec4(0.8, 0.8, 1.0, 1);
    lightDiffuse = vec4(0.8, 0.8, 1.0, 1);
    lightSpecular = vec4(0.9, 0.9, 1.0, 1);
    materialAmbient = vec4(0.8, 0.8, 1.0, 1);
    materialDiffuse = vec4(0.8, 0.8, 1.0, 1);
    materialSpecular = vec4(0.9, 0.9, 1.0, 1);
    materialShininess = 50;
    SetupLightingMaterial();
    t=translate(-0.2, 0, 0.5);
    s=scale4(1.3, 0.7, 1.5);
    r=rotate(90, 1, 0, 0);
    modelViewMatrix=mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawTrapezoid();
    modelViewMatrix=mvMatrixStack.pop();

    //draw headlights using spheres
    mvMatrixStack.push(modelViewMatrix);
    lightAmbient = vec4(1.0, 1.0, 0.8, 1);
    lightDiffuse = vec4(1.0, 1.0, 0.8, 1);
    lightSpecular = vec4(1.0, 1.0, 0.8, 1);
    materialAmbient = vec4(1.0, 1.0, 0.8, 1);
    materialDiffuse = vec4(1.0, 1.0, 0.8, 1);
    materialSpecular = vec4(1.0, 1.0, 0.8, 1);
    materialShininess = 100;
    SetupLightingMaterial();
    t=translate(0.9, 0.3, 0);
    s=scale4(0.2, 0.2, 0.2);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    DrawSolidSphere(1);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    lightAmbient = vec4(1.0, 1.0, 0.8, 1);
    lightDiffuse = vec4(1.0, 1.0, 0.8, 1);
    lightSpecular = vec4(1.0, 1.0, 0.8, 1);
    materialAmbient = vec4(1.0, 1.0, 0.4, 1);
    materialDiffuse = vec4(1.0, 1.0, 0.4, 1);
    materialSpecular = vec4(1.0, 1.0, 0.4, 1);
    materialShininess = 100;
    SetupLightingMaterial();
    t=translate(0.9, -0.3, 0);
    s=scale4(0.2, 0.2, 0.2);
    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    DrawSolidSphere(1);
    modelViewMatrix=mvMatrixStack.pop();
}

function DrawFirstFloor(unit){
  var s, t;
  mvMatrixStack.push(modelViewMatrix);

  //make the tower maroon red and shiny
  lightAmbient = vec4(0.1, 0.1, 0.1, 1);
  lightDiffuse = vec4(0.1, 0.1, 0.1, 1);
  lightSpecular = vec4(0.1, 0.1, 0.1, 1);
  materialAmbient = vec4(0.5, 0.1, 0.1, 1);
  materialDiffuse = vec4(0.9, 0.2, 0.2, 1);
  materialSpecular = vec4(0.8, 0.1, 0.1, 1);
  materialShininess = 100;
  SetupLightingMaterial();
  t=translate(0, unit/2, 0);
	s=scale4(unit, unit, unit);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  lightAmbient = vec4(0.1, 0.1, 0.1, 1);
  lightDiffuse = vec4(0.1, 0.1, 0.1, 1);
  lightSpecular = vec4(0.1, 0.1, 0.1, 1);
  materialAmbient = vec4(0.5, 0.1, 0.1, 1);
  materialDiffuse = vec4(0.9, 0.2, 0.2, 1);
  materialSpecular = vec4(0.8, 0.1, 0.1, 1);
  materialShininess = 100;
  SetupLightingMaterial();
  t=translate(unit/4, (unit/2)+(unit/3), unit/2);
	s=scale4(unit/4, unit/4, unit/8);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

  
  mvMatrixStack.push(modelViewMatrix);
  lightAmbient = vec4(0.1, 0.1, 0.1, 1);
  lightDiffuse = vec4(0.1, 0.1, 0.1, 1);
  lightSpecular = vec4(0.1, 0.1, 0.1, 1);
  materialAmbient = vec4(0.5, 0.1, 0.1, 1);
  materialDiffuse = vec4(0.9, 0.2, 0.2, 1);
  materialSpecular = vec4(0.8, 0.1, 0.1, 1);
  materialShininess = 50;
  SetupLightingMaterial();
  t=translate(-1*unit/4, (unit/2)+(unit/3), unit/2);
	s=scale4(unit/4, unit/4, unit/10);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  lightAmbient = vec4(0.1, 0.1, 0.1, 1);
  lightDiffuse = vec4(0.1, 0.1, 0.1, 1);
  lightSpecular = vec4(0.1, 0.1, 0.1, 1);
  materialAmbient = vec4(0.5, 0.1, 0.1, 1);
  materialDiffuse = vec4(0.9, 0.2, 0.2, 1);
  materialSpecular = vec4(0.8, 0.1, 0.1, 1);
  materialShininess = 50;
  SetupLightingMaterial();
  t=translate(unit/4, (unit/2)+(unit/3), -1*unit/2);
	s=scale4(unit/4, unit/4, unit/8);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

  
  mvMatrixStack.push(modelViewMatrix);
  lightAmbient = vec4(0.1, 0.1, 0.1, 1);
  lightDiffuse = vec4(0.1, 0.1, 0.1, 1);
  lightSpecular = vec4(0.1, 0.1, 0.1, 1);
  materialAmbient = vec4(0.5, 0.1, 0.1, 1);
  materialDiffuse = vec4(0.9, 0.2, 0.2, 1);
  materialSpecular = vec4(0.8, 0.1, 0.1, 1);
  materialShininess = 50;
  SetupLightingMaterial();
  t=translate(-1*unit/4, (unit/2)+(unit/3), -1*unit/2);
	s=scale4(unit/4, unit/4, unit/10);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  lightAmbient = vec4(0.1, 0.1, 0.1, 1);
  lightDiffuse = vec4(0.1, 0.1, 0.1, 1);
  lightSpecular = vec4(0.1, 0.1, 0.1, 1);
  materialAmbient = vec4(0.5, 0.1, 0.1, 1);
  materialDiffuse = vec4(0.9, 0.2, 0.2, 1);
  materialSpecular = vec4(0.8, 0.1, 0.1, 1);
  materialShininess = 50;
  SetupLightingMaterial();
  t=translate(unit/2, (unit/2)+(unit/3), unit/4);
	s=scale4(unit/4, unit/4, unit/8);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

  
  mvMatrixStack.push(modelViewMatrix);
  lightAmbient = vec4(0.1, 0.1, 0.1, 1);
  lightDiffuse = vec4(0.1, 0.1, 0.1, 1);
  lightSpecular = vec4(0.1, 0.1, 0.1, 1);
  materialAmbient = vec4(0.5, 0.1, 0.1, 1);
  materialDiffuse = vec4(0.9, 0.2, 0.2, 1);
  materialSpecular = vec4(0.8, 0.1, 0.1, 1);
  materialShininess = 50;
  SetupLightingMaterial();
  t=translate(unit/2, (unit/2)+(unit/3), -1*unit/4);
	s=scale4(unit/4, unit/4, unit/10);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  lightAmbient = vec4(0.1, 0.1, 0.1, 1);
  lightDiffuse = vec4(0.1, 0.1, 0.1, 1);
  lightSpecular = vec4(0.1, 0.1, 0.1, 1);
  materialAmbient = vec4(0.5, 0.1, 0.1, 1);
  materialDiffuse = vec4(0.9, 0.2, 0.2, 1);
  materialSpecular = vec4(0.8, 0.1, 0.1, 1);
  materialShininess = 50;
  SetupLightingMaterial();
  t=translate(-1*unit/2, (unit/2)+(unit/3), unit/4);
	s=scale4(unit/4, unit/4, unit/8);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

  
  mvMatrixStack.push(modelViewMatrix);
  lightAmbient = vec4(0.1, 0.1, 0.1, 1);
  lightDiffuse = vec4(0.1, 0.1, 0.1, 1);
  lightSpecular = vec4(0.1, 0.1, 0.1, 1);
  materialAmbient = vec4(0.5, 0.1, 0.1, 1);
  materialDiffuse = vec4(0.9, 0.2, 0.2, 1);
  materialSpecular = vec4(0.8, 0.1, 0.1, 1);
  materialShininess = 50;
  SetupLightingMaterial();
  t=translate(-1*unit/2, (unit/2)+(unit/3), -1*unit/4);
	s=scale4(unit/4, unit/4, unit/10);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

}

function DrawSecondFloor(unit,hight,ex){
  var s, t;
  mvMatrixStack.push(modelViewMatrix);
  lightAmbient = vec4(0.1, 0.1, 0.1, 1);
  lightDiffuse = vec4(0.1, 0.1, 0.1, 1);
  lightSpecular = vec4(0.1, 0.1, 0.1, 1);
  materialAmbient = vec4(0.5, 0.1, 0.1, 1);
  materialDiffuse = vec4(0.9, 0.2, 0.2, 1);
  materialSpecular = vec4(0.8, 0.1, 0.1, 1);
  materialShininess = 50;
  SetupLightingMaterial();
  t=translate(0, hight/2, 0);
	s=scale4(unit, hight, unit);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

  // draw small cubes as decorations
  mvMatrixStack.push(modelViewMatrix);
  lightAmbient = vec4(0.8, 0.8, 1.0, 1);
  lightDiffuse = vec4(0.8, 0.8, 1.0, 1);
  lightSpecular = vec4(0.9, 0.9, 1.0, 1);
  materialAmbient = vec4(0.8, 0.8, 1.0, 1);
  materialDiffuse = vec4(0.8, 0.8, 1.0, 1);
  materialSpecular = vec4(0.9, 0.9, 1.0, 1);
  materialShininess = 50;
  SetupLightingMaterial();
  t=translate((unit/2)-(hight/2), (hight/2)-hight, (unit/2)-(hight/2));
	s=scale4(hight, hight, hight);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  lightAmbient = vec4(0.8, 0.8, 1.0, 1);
  lightDiffuse = vec4(0.8, 0.8, 1.0, 1);
  lightSpecular = vec4(0.9, 0.9, 1.0, 1);
  materialAmbient = vec4(0.8, 0.8, 1.0, 1);
  materialDiffuse = vec4(0.8, 0.8, 1.0, 1);
  materialSpecular = vec4(0.9, 0.9, 1.0, 1);
  materialShininess = 50;
  SetupLightingMaterial();
  t=translate(-1*((unit/2)-(hight/2)), (hight/2)-hight, (unit/2)-(hight/2));
	s=scale4(hight, hight, hight);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();


  mvMatrixStack.push(modelViewMatrix);
  lightAmbient = vec4(0.8, 0.8, 1.0, 1);
  lightDiffuse = vec4(0.8, 0.8, 1.0, 1);
  lightSpecular = vec4(0.9, 0.9, 1.0, 1);
  materialAmbient = vec4(0.8, 0.8, 1.0, 1);
  materialDiffuse = vec4(0.8, 0.8, 1.0, 1);
  materialSpecular = vec4(0.9, 0.9, 1.0, 1);
  materialShininess = 50;
  SetupLightingMaterial();
  t=translate((unit/2)-(hight/2), (hight/2)-hight, -1*((unit/2)-(hight/2)));
	s=scale4(hight, hight, hight);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  lightAmbient = vec4(0.8, 0.8, 1.0, 1);
  lightDiffuse = vec4(0.8, 0.8, 1.0, 1);
  lightSpecular = vec4(0.9, 0.9, 1.0, 1);
  materialAmbient = vec4(0.8, 0.8, 1.0, 1);
  materialDiffuse = vec4(0.8, 0.8, 1.0, 1);
  materialSpecular = vec4(0.9, 0.9, 1.0, 1);
  materialShininess = 50;
  SetupLightingMaterial();
  t=translate(-1*((unit/2)-(hight/2)), (hight/2)-hight, -1*((unit/2)-(hight/2)));
	s=scale4(hight, hight, hight);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawBuilding() {
  //Drawing the composite object by Zeiad
  //COMPOSITE OBJECT: BUILDING
  //SIMPLE OBJECTS: SPHERE, CUBE, CYLINDER

	// draw the sphere
	mvMatrixStack.push(modelViewMatrix);
  lightAmbient = vec4(0.2, 0.2, 0.2, 1);
  lightDiffuse = vec4(0.8, 0.8, 0.8, 1);
  lightSpecular = vec4(1.0, 1.0, 1.0, 1);
  materialAmbient = vec4(0.5, 0.5, 0.5, 1);
  materialDiffuse = vec4(0.7, 0.7, 0.7, 1);
  materialSpecular = vec4(1.0, 1.0, 1.0, 1);
  materialShininess = 50;
  SetupLightingMaterial();
	t=translate(0.4, 0.1+0.2+0.02+0.2+0.02+0.2,0.4);
	modelViewMatrix=mult(modelViewMatrix, t);
	DrawSolidSphere(0.1);
	modelViewMatrix=mvMatrixStack.pop();

  // draw the first Floor
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.4, 0, 0.4);
  modelViewMatrix=mult(modelViewMatrix, t);
	DrawFirstFloor(0.2);
	modelViewMatrix=mvMatrixStack.pop();

    // draw the Second Floor
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.4, 0.2, 0.4);
  modelViewMatrix=mult(modelViewMatrix, t);
	DrawSecondFloor(0.25,0.02);
	modelViewMatrix=mvMatrixStack.pop();

  // draw the first Floor
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0.4, 0.2+0.02, 0.4);
  modelViewMatrix=mult(modelViewMatrix, t);
	DrawFirstFloor(0.2);
	modelViewMatrix=mvMatrixStack.pop();

  // draw the Second Floor
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.4, 0.2+0.02+0.2, 0.4);
  modelViewMatrix=mult(modelViewMatrix, t);
  DrawSecondFloor(0.25,0.02);
  modelViewMatrix=mvMatrixStack.pop();

  // draw the first Floor
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.4, 0.2+0.02+0.2+0.02, 0.4);
  modelViewMatrix=mult(modelViewMatrix, t);
  DrawFirstFloor(0.2);
  modelViewMatrix=mvMatrixStack.pop();

  // draw the Second Floor
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.4, 0.2+0.02+0.2+0.02+0.2, 0.4);
  modelViewMatrix=mult(modelViewMatrix, t);
  DrawSecondFloor(0.25,0.02);
  modelViewMatrix=mvMatrixStack.pop();

  // draw the Second Floor
  mvMatrixStack.push(modelViewMatrix);
  t=translate(0.4, 0.1+0.2+0.02+0.2+0.02+0.2+0.1, 0.4);
  modelViewMatrix=mult(modelViewMatrix, t);
  DrawSecondFloor(0.25,0.02);
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawRoad() {
  //Draw the road using cubes scaled and translated
  //COMPOSITE OBJECT: ROAD
  //SIMPLE OBJECTS: CUBE

  // draw the tarmac
  mvMatrixStack.push(modelViewMatrix);
  lightAmbient = vec4(0.0, 0.0, 0.0, 1);
  lightDiffuse = vec4(0.0, 0.0, 0.0, 1);
  lightSpecular = vec4(0.0, 0.0, 0.0, 1);
  materialAmbient = vec4(0.0, 0.0, 0.0, 1);
  materialDiffuse = vec4(0.0, 0.0, 0.0, 1);
  materialSpecular = vec4(0.0, 0.0, 0.0, 1);
  materialShininess = 50;
  SetupLightingMaterial();
  t=translate(1.95, 0.02, 1.4);
  s=scale4(2.1, 0.05, 0.8);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  lightAmbient = vec4(0.0, 0.0, 0.0, 1);
  lightDiffuse = vec4(0.0, 0.0, 0.0, 1);
  lightSpecular = vec4(0.0, 0.0, 0.0, 1);
  materialAmbient = vec4(0.0, 0.0, 0.0, 1);
  materialDiffuse = vec4(0.0, 0.0, 0.0, 1);
  materialSpecular = vec4(0.0, 0.0, 0.0, 1);
  materialShininess = 50;
  SetupLightingMaterial();
  t=translate(1.3, 0.02, 2.1);
  s=scale4(0.8, 0.05, 1.85);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidCube(1);
  modelViewMatrix=mvMatrixStack.pop();

  //draw the lines on the road using a loop
  // mvMatrixStack.push(modelViewMatrix);
  // lightAmbient = vec4(1.0, 1.0, 1.0, 1);
  // lightDiffuse = vec4(1.0, 1.0, 1.0, 1);
  // lightSpecular = vec4(1.0, 1.0, 1.0, 1);
  // materialAmbient = vec4(1.0, 1.0, 1.0, 1);
  // materialDiffuse = vec4(1.0, 1.0, 1.0, 1);
  // materialSpecular = vec4(1.0, 1.0, 1.0, 1);
  // materialShininess = 50;
  // SetupLightingMaterial();
  // t=translate(1.95, 0.1, 1.4);
  // s=scale4(2.1, 0.01, 0.01);
  // modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  // gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  // DrawSolidCube(1);
  // modelViewMatrix=mvMatrixStack.pop();
var numDashes = 9;
var dashLength = 0.1;
var gapLength = 0.1;

  for (var i = 0; i < numDashes; i++) {
    var offset = i * (dashLength + gapLength);
    mvMatrixStack.push(modelViewMatrix);
    lightAmbient = vec4(1.0, 1.0, 1.0, 1);
    lightDiffuse = vec4(1.0, 1.0, 1.0, 1);
    lightSpecular = vec4(1.0, 1.0, 1.0, 1);
    materialAmbient = vec4(1.0, 1.0, 1.0, 1);
    materialDiffuse = vec4(1.0, 1.0, 1.0, 1);
    materialSpecular = vec4(1.0, 1.0, 1.0, 1);
    materialShininess = 50;
    SetupLightingMaterial();
    t = translate(2.95 - offset, 0.05, 1.4);
    s = scale4(dashLength, 0.01, 0.05);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1);
    modelViewMatrix = mvMatrixStack.pop();
  }

  for (var i = 0; i < numDashes; i++) {
    var offset = i * (dashLength + gapLength);
    mvMatrixStack.push(modelViewMatrix);
    lightAmbient = vec4(1.0, 1.0, 1.0, 1);
    lightDiffuse = vec4(1.0, 1.0, 1.0, 1);
    lightSpecular = vec4(1.0, 1.0, 1.0, 1);
    materialAmbient = vec4(1.0, 1.0, 1.0, 1);
    materialDiffuse = vec4(1.0, 1.0, 1.0, 1);
    materialSpecular = vec4(1.0, 1.0, 1.0, 1);
    materialShininess = 50;
    SetupLightingMaterial();
    t = translate(1.3, 0.05, 3 - offset);
    s = scale4(dashLength, 0.01, 0.05);
    r = rotate(90, 0, 1, 0);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1);
    modelViewMatrix = mvMatrixStack.pop();
  }
}

//Sets up the vertices array so the building can be drawn
function SurfaceRevPoints()
{
	//Setup initial points matrix
	for (var i = 0; i<25; i++)
	{
		buildingVertices.push(vec4(buildingPoints[i][0], buildingPoints[i][1],
      buildingPoints[i][2], 1));
	}

	var r;
        var t=Math.PI/12;

        // sweep the original curve another "angle" degree
	       for (var j = 0; j < 24; j++)
	        {
                var angle = (j+1)*t;

                // for each sweeping step, generate 25 new points corresponding to the original points
		           for(var i = 0; i < 25 ; i++ )
		           {
		                r = buildingVertices[i][0];
                    buildingVertices.push(vec4(r*Math.cos(angle), buildingVertices[i][1], -r*Math.sin(angle), 1));
		           }
	       }

       var N=25;
       // quad strips are formed slice by slice (not layer by layer)
       for (var i=0; i<24; i++) // slices
       {
           for (var j=0; j<24; j++)  // layers
           {
		           surfaceRevQuad(i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1));
           }
       }
}

function DrawMesh() {
  // POLYGONAL MESH OBJECT: SPACESHIP
  // BOWEN TRUELOVE

  // Main body
  quad(17, 18, 22, 21); 
  quad(19, 20, 24, 23); 
  quad(17, 19, 23, 21); 
  quad(18, 20, 24, 22);
  
  // Nose cone connections
  tri(16, 17, 18); 
  tri(16, 19, 20);  
  tri(16, 17, 19);  
  tri(16, 18, 20); 
  
  // Wings
  tri(21, 25, 23);  
  tri(23, 25, 27); 
  tri(22, 26, 24);  
  tri(24, 26, 28); 
  tri(21, 22, 25);  
  tri(21, 22, 26);  
  tri(23, 24, 25);
  tri(23, 24, 26);
  tri(25, 21, 23);
  tri(26, 22, 24);
  tri(25, 21, 23);
  
  // Engine section
  quad(27, 28, 30, 29);  
  quad(23, 24, 28, 27);  
  quad(21, 22, 30, 29);  
  quad(21, 23, 27, 29);  
  quad(22, 24, 28, 30);  
  
  // Rear connections
  tri(21, 23, 29);  
  tri(22, 24, 30);  
  tri(23, 27, 29);  
  tri(24, 28, 30);  
  tri(27, 28, 29);  
  tri(29, 30, 28);  

  // Update sphereCount after drawing the spaceship
  sphereCount += 36;
}

function DrawRevolutionBuilding() {
  mvMatrixStack.push(modelViewMatrix);
  
  // Set up materials for visibility
  lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
  lightDiffuse = vec4(0.4, 0.4, 0.4, 1.0);
  lightSpecular = vec4(0.6, 0.6, 0.6, 1.0);
  materialAmbient = vec4(0.5, 0.8, 0.5, 1.0);
  materialDiffuse = vec4(0.4, 0.7, 0.4, 1.0);
  materialSpecular = vec4(0.6, 0.9, 0.6, 1.0);
  materialShininess = 100;
  SetupLightingMaterial();

  // Adjust position and scale
  t = translate(2, 0.2, 1.6);
  s = scale4(2.0, 3.0, 2.0);  // Increased scale
  //r = rotate(180, 0, 0, 1);     // Rotate to face the camera
  modelViewMatrix = mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  // Draw the surface
  // var startIndex = pointsArray.length - 24*24*6;
  var startIndex = pointsArray.length - 120 - 24*24*6;
  var vertexCount = 24*24*6;
  gl.drawArrays(gl.TRIANGLES, startIndex, vertexCount);

  //draw cubes around base to make it look like a building
  var numCubes = 12;
  var radius = 0.075;
  var cubeSize = 0.15;

  for (var i = 0; i < numCubes; i++) {
    var angle = (i / numCubes) * 2 * Math.PI;
    var x = radius * Math.cos(angle);
    var z = radius * Math.sin(angle);

    mvMatrixStack.push(modelViewMatrix);
    lightAmbient = vec4(0.5, 0.5, 0.5, 1.0);
    lightDiffuse = vec4(0.5, 0.5, 0.5, 1.0);
    lightSpecular = vec4(0.5, 0.5, 0.5, 1.0);
    materialAmbient = vec4(0.5, 0.5, 0.5, 1.0);
    materialDiffuse = vec4(0.5, 0.5, 0.5, 1.0);
    materialSpecular = vec4(0.5, 0.5, 0.5, 1.0);
    materialShininess = 100;
    SetupLightingMaterial();
    t = translate(x, 0.06, z);
    s = scale4(cubeSize, 0.2, cubeSize);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawSolidCube(1);
    modelViewMatrix = mvMatrixStack.pop();
  }
  

  // Draw squashed sphere at the top
  mvMatrixStack.push(modelViewMatrix);
  lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
  lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
  lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
  materialAmbient = vec4(1.0, 1.0, 1.0, 1.0);
  materialDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
  materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
  materialShininess = 100;
  SetupLightingMaterial();
  t = translate(0, 0.535, 0);
  s = scale4(0.2, 0.03, 0.2);
  modelViewMatrix = mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  DrawSolidSphere(1);
  modelViewMatrix = mvMatrixStack.pop();

  modelViewMatrix = mvMatrixStack.pop();
}

function animateCar() {
  if (carAnimating) {
      if (carPosition < 1) {
          // First straight section
          var x = carStart.x + (carTurn.x - carStart.x) * carPosition;
          var z = carStart.z;
          
          mvMatrixStack.push(modelViewMatrix);
          t = translate(x, carStart.y, z);
          s = scale4(0.2, 0.2, 0.2);
          // First rotate 90 degrees around X to make car upright, then rotate around Y for direction
          r = mult(rotate(180, 0, 0, 1), rotate(90, 1, 0, 0));
          modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
          DrawCar();
          modelViewMatrix = mvMatrixStack.pop();
      } else if (carPosition < 2) {
          // Second straight section
          var progress = carPosition - 1;
          var x = carTurn.x;
          var z = carTurn.z + (carEnd.z - carTurn.z) * progress;
          
            mvMatrixStack.push(modelViewMatrix);
            t = translate(x, carTurn.y, z);
            s = scale4(0.2, 0.2, 0.2);
            r = mult(rotate(270, 0, 1, 0), rotate(270, 1, 0, 0));
            modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
            DrawCar();
            modelViewMatrix = mvMatrixStack.pop();
      } else {
          // Reset animation
          carAnimating = false;
          carPosition = 0;
      }
      
      carPosition += animationSpeed;
  } else {
      // Draw car in default position when not animating
      mvMatrixStack.push(modelViewMatrix);
      t = translate(carStart.x, carStart.y, carStart.z);
      s = scale4(0.2, 0.2, 0.2);
      r = mult(rotate(180, 0, 0, 1), rotate(90, 1, 0, 0));
      modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
      DrawCar();
      modelViewMatrix = mvMatrixStack.pop();
  }
}

function render()
{
	var s, t, r;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // set up view and projection
  projectionMatrix = ortho(left*zoomFactor-translateFactorX, right*zoomFactor-translateFactorX, bottom*zoomFactor-translateFactorY, ytop*zoomFactor-translateFactorY, near, far);
  modelViewMatrix=lookAt(eye, at, up);
 	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  modelViewMatrix = mult(rotationMatrix, modelViewMatrix);

  mvMatrixStack.push(modelViewMatrix);
  t=translate(-0.5, 0.0, 0.3);
  s=scale4(2.6, 2.6, 2.6);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  DrawBuilding();
  modelViewMatrix=mvMatrixStack.pop();

	// wall # 1: in xz-plane
  lightAmbient = vec4(0.2, 0.2, 0.2, 1);
  lightDiffuse = vec4(0.8, 0.8, 0.8, 1);
  lightSpecular = vec4(1.0, 1.0, 1.0, 1);
  materialAmbient = vec4(0.5, 0.5, 0.5, 1);
  materialDiffuse = vec4(0.7, 0.7, 0.7, 1);
  materialSpecular = vec4(1.0, 1.0, 1.0, 1);
  materialShininess = 100;
  SetupLightingMaterial();
	DrawWall(0.02);

	// wall #2: in yz-plane
	mvMatrixStack.push(modelViewMatrix);
  lightAmbient = vec4(0.1, 0.1, 0.3, 1);
  lightDiffuse = vec4(0.1, 0.1, 0.3, 1);
  lightSpecular = vec4(0.1, 0.1, 0.3, 1);
  materialAmbient = vec4(0.0, 0.0, 0.5, 1);
  materialDiffuse = vec4(0.0, 0.0, 0.8, 1);
  materialSpecular = vec4(0.0, 0.0, 1.0, 1);
  materialShininess = 0;
  SetupLightingMaterial();
	r=rotate(90.0, 0.0, 0.0, 1.0);
  modelViewMatrix=mult(modelViewMatrix, r);
	DrawWall(0);
	modelViewMatrix=mvMatrixStack.pop();

	// wall #3: in xy-plane
	mvMatrixStack.push(modelViewMatrix);
  lightAmbient = vec4(0.1, 0.1, 0.3, 1);
  lightDiffuse = vec4(0.1, 0.1, 0.3, 1);
  lightSpecular = vec4(0.1, 0.1, 0.3, 1);
  materialAmbient = vec4(0.0, 0.0, 0.5, 1);
  materialDiffuse = vec4(0.0, 0.0, 0.8, 1);
  materialSpecular = vec4(0.0, 0.0, 1.0, 1);
  materialShininess = 0;
  SetupLightingMaterial();
	r=rotate(-90, 1.0, 0.0, 0.0);
	//r=rotate(90, 1.0, 0.0, 0.0);  // ??
  modelViewMatrix=mult(modelViewMatrix, r);
	DrawWall(0.02);
	modelViewMatrix=mvMatrixStack.pop();

  //draw road
  DrawRoad();

  // draw the car
  animateCar();

  mvMatrixStack.push(modelViewMatrix);
  // Adjust position and orientation for better view
  t = translate(1.6, 0.55, 1.7);
  s = scale4(0.25, 0.25, 0.25);  
  r = rotate(45, 0, 1, 0);       
  modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  lightAmbient = vec4(0.1, 0.1, 0.3, 1.0);
  lightDiffuse = vec4(0.3, 0.3, 0.8, 1.0);
  lightSpecular = vec4(0.5, 0.5, 1.0, 1.0);
  materialAmbient = vec4(0.5, 0.5, 1.0, 1.0);
  materialDiffuse = vec4(0.3, 0.3, 0.8, 1.0);
  materialSpecular = vec4(0.5, 0.5, 1.0, 1.0);
  materialShininess = 100;
  SetupLightingMaterial();
  gl.drawArrays(gl.TRIANGLES, cubeCount + sphereCount, pointsArray.length - 120 - (cubeCount + sphereCount ));
  // console.log("lenght = " + pointsArray.length);
  modelViewMatrix = mvMatrixStack.pop();

  //draw the surface rev building
  mvMatrixStack.push(modelViewMatrix);
  // Adjust position and orientation for better view
  t = translate(-0.6, 0, -1);
  s = scale4(1, 1, 1);        
  modelViewMatrix = mult(mult(modelViewMatrix, t), s);
  DrawRevolutionBuilding();

  // Render Trunk
  SetupTrunkMaterial(); // Apply trunk material and lighting
  let trunkScale = scale4(0.12, 0.5, 0.12);
  let trunkTranslate = translate(3, 0, 1.5);
  mvMatrixStack.push(modelViewMatrix);

  let trunkMatrix = mult(mult(modelViewMatrix, trunkTranslate), trunkScale);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(trunkMatrix));
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  gl.drawArrays(gl.TRIANGLES, 15933, 60); // First 60 vertices are for the trunk
  modelViewMatrix=mvMatrixStack.pop();
  // Render Leaves
  SetupLeavesMaterial(); // Apply leaves material and lighting
  let leavesScale = scale4(0.25, 0.5, 0.25); // Adjust if needed
  let leavesTranslate = translate(3, 0, 1.5);
  let leavesMatrix = mult(mult(modelViewMatrix, leavesTranslate), leavesScale);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(leavesMatrix));
  gl.drawArrays(gl.TRIANGLES, 60 + 15933,  60); // Remaining vertices are for the leaves
  // console.log(pointsArray.length - 60);
  requestAnimFrame(render);

  // //repeat tree
  // SetupTrunkMaterial(); // Apply trunk material and lighting
  //  trunkScale = scale4(0.12, 0.5, 0.12);
  //  trunkTranslate = translate(1, 0, 3);
  // mvMatrixStack.push(modelViewMatrix);

  //  trunkMatrix = mult(mult(modelViewMatrix, trunkTranslate), trunkScale);
  // gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(trunkMatrix));
  // gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  // gl.drawArrays(gl.TRIANGLES, 15933, 60); // First 60 vertices are for the trunk
  // modelViewMatrix=mvMatrixStack.pop();


  // SetupLeavesMaterial(); // Apply leaves material and lighting
  //  leavesScale = scale4(0.25, 0.5, 0.25); // Adjust if needed
  //  leavesTranslate = translate(1, 0, 3);
  //  leavesMatrix = mult(mult(modelViewMatrix, leavesTranslate), leavesScale);
  // gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(leavesMatrix));
  // gl.drawArrays(gl.TRIANGLES, 60 + 15933,  60); // Remaining vertices are for the leaves
  // // console.log(pointsArray.length - 60);
  // requestAnimFrame(render);
  // //end repeat

  // //repeat tree
  // SetupTrunkMaterial(); // Apply trunk material and lighting
  //  trunkScale = scale4(0.12, 0.5, 0.12);
  //  trunkTranslate = translate(1, 0, 3.7);
  // mvMatrixStack.push(modelViewMatrix);

  //  trunkMatrix = mult(mult(modelViewMatrix, trunkTranslate), trunkScale);
  // gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(trunkMatrix));
  // gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  // gl.drawArrays(gl.TRIANGLES, 15933, 60); // First 60 vertices are for the trunk
  // modelViewMatrix=mvMatrixStack.pop();


  // SetupLeavesMaterial(); // Apply leaves material and lighting
  //  leavesScale = scale4(0.25, 0.5, 0.25); // Adjust if needed
  //  leavesTranslate = translate(1, 0, 3.7);
  //  leavesMatrix = mult(mult(modelViewMatrix, leavesTranslate), leavesScale);
  // gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(leavesMatrix));
  // gl.drawArrays(gl.TRIANGLES, 60 + 15933,  60); // Remaining vertices are for the leaves
  // // console.log(pointsArray.length - 60);
  // requestAnimFrame(render);
  // //end repeat

}

// ******************************************
// supporting functions below this:
// ******************************************
function triangle(a, b, c)
{
     normalsArray.push(vec3(a[0], a[1], a[2]));
     normalsArray.push(vec3(b[0], b[1], b[2]));
     normalsArray.push(vec3(c[0], c[1], c[2]));

     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);

     sphereCount += 3;
}

function divideTriangle(a, b, c, count)
{
    if ( count > 0 )
    {
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        triangle( a, b, c );
    }
}

function tetrahedron(a, b, c, d, n)
{
    	divideTriangle(a, b, c, n);
    	divideTriangle(d, c, b, n);
    	divideTriangle(a, d, b, n);
    	divideTriangle(a, c, d, n);
}

function quad(a, b, c, d)
{
     	var t1 = subtract(vertices[b], vertices[a]);
     	var t2 = subtract(vertices[c], vertices[b]);
     	var normal = cross(t1, t2);
     	var normal = vec3(normal);
     	normal = normalize(normal);

     	pointsArray.push(vertices[a]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[b]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[c]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[a]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[c]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[d]);
     	normalsArray.push(normal);
}

function tri(a, b, c) {
  // Calculate normal from two edges of the triangle
  var t1 = subtract(vertices[b], vertices[a]);
  var t2 = subtract(vertices[c], vertices[b]);
  var normal = normalize(cross(t1, t2));

  pointsArray.push(vertices[a]);
  normalsArray.push(normal);
  pointsArray.push(vertices[b]);
  normalsArray.push(normal);
  pointsArray.push(vertices[c]);
  normalsArray.push(normal);
}

function surfaceRevQuad(a, b, c, d) {

  var indices=[a, b, c, d];
  var normal = Newell(indices);

  // triangle a-b-c
  pointsArray.push(buildingVertices[a]);
  normalsArray.push(normal);

  pointsArray.push(buildingVertices[b]);
  normalsArray.push(normal);

  pointsArray.push(buildingVertices[c]);
  normalsArray.push(normal);

  // triangle a-c-d
  pointsArray.push(buildingVertices[a]);
  normalsArray.push(normal);

  pointsArray.push(buildingVertices[c]);
  normalsArray.push(normal);

  pointsArray.push(buildingVertices[d]);
  normalsArray.push(normal);
}
// Start Creating Tree

// End Creating Tree
function Newell(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];

       x += (buildingVertices[index][1] - buildingVertices[nextIndex][1])*
            (buildingVertices[index][2] + buildingVertices[nextIndex][2]);
       y += (buildingVertices[index][2] - buildingVertices[nextIndex][2])*
            (buildingVertices[index][0] + buildingVertices[nextIndex][0]);
       z += (buildingVertices[index][0] - buildingVertices[nextIndex][0])*
            (buildingVertices[index][1] + buildingVertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

function colorCube()
{
    	quad( 1, 0, 3, 2 );
    	quad( 2, 3, 7, 6 );
    	quad( 3, 0, 4, 7 );
    	quad( 6, 5, 1, 2 );
    	quad( 4, 5, 6, 7 );
    	quad( 5, 4, 0, 1 );
}

function colorTrapezoid()
{
    quad(8, 9, 10, 11);    // front face
    quad(12, 13, 14, 15);  // back face
    quad(11, 10, 14, 15);  // top face
    quad(8, 9, 13, 12);    // bottom face
    quad(9, 10, 14, 13);   // right face
    quad(8, 11, 15, 12);   // left face
}   


function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}
// Function to calculate normal vectors using the Newell3 method
function Newell3(vertices) {
  let x = 0, y = 0, z = 0;
  const L = vertices.length;
  for (let i = 0; i < L; i++) {
      const current = vertices[i];
      const next = vertices[(i + 1) % L];
      x += (current[1] - next[1]) * (current[2] + next[2]);
      y += (current[2] - next[2]) * (current[0] + next[0]);
      z += (current[0] - next[0]) * (current[1] + next[1]);
  }
  return normalize(vec3(x, y, z));
}