var gl, program;
var modelViewStack=[];
var vertices;



function main()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    vertices = GeneratePoints();

    initBuffers();

    render();
};

function initBuffers() {

    //  Configure WebGL
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Prepare to send the model view matrix to the vertex shader
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
}

// Form the 4x4 scale transformation matrix
function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

function GeneratePoints()
{
    var vertices=[];

    vertices.push(vec2(0, 2));
    vertices.push(vec2(0.1, 1));
    vertices.push(vec2(0.4, 1));
    vertices.push(vec2(0, 4));
    vertices.push(vec2(-1, -0.3));
    vertices.push(vec2(-0.5, -0.5));

    return vertices;
}

var scaleFactor1 = 1/18;
var scaleFactor2 = (1/14) * (1/10);

function DrawOneBranch()
{
    var s;

    // one branch
    modelViewStack.push(modelViewMatrix);   // save the previous MVM
    s = scale4(scaleFactor2, scaleFactor2, 1);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));// important
    gl.drawArrays( gl.LINE_LOOP, 0, 6);
    modelViewMatrix = modelViewStack.pop();   // undo the scaling effect

    // modelViewStack.push(modelViewMatrix);        // save the MVM
    // s = scale4(scaleFactor2, -scaleFactor2, 1);
    // modelViewMatrix = mult(modelViewMatrix, s);
    // gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    // gl.drawArrays( gl.LINE_LOOP, 0, 12);
    // modelViewMatrix = modelViewStack.pop();   // undo the scaling effect
}

function DrawOneSnowFlake()
{
    var r;

    modelViewStack.push(modelViewMatrix);
    // draw the full snow flake
    for (var i=0; i<5; i++) {

         r = rotate(72, 0, 0, 1);
         modelViewMatrix =  mult(modelViewMatrix, r);

         DrawOneBranch();
    }
    modelViewMatrix=modelViewStack.pop();
}

function DrawRingOfStars() {

}

var FIRST_SECTION_STEPS = 100;
var SECOND_SECTION_STEPS = 100
var stepCount1 = 0;
var stepCount2 = 0;

// This is the starting and ending location of the animation
var startX= -0.75, startY=-0.75; // upper left corner
var targetX=0, targetY=0.75;  // lower right corner

var locationX = startX,   // need to be global
    locationY = startY;  // snowflake starts at the starting location

var deltaX = (targetX-startX)/FIRST_SECTION_STEPS,
    deltaY = (targetY-startY)/FIRST_SECTION_STEPS;

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    var t;

    if (stepCount1 < FIRST_SECTION_STEPS) {

    	t = translate(locationX, locationY, 0);
    	modelViewMatrix = t;  // <== location of the snowflake
    	DrawOneSnowFlake();

    	locationX = locationX + deltaX;
    	locationY = locationY + deltaY;

    	stepCount1 ++;
    }
    else {
        stepCount = 0;
    	locationX = startX;
    	locationY = startY;
    }

    requestAnimationFrame(render);
}


// Second example: shows the snowflake move across half cycle track

// var stepCount = 0;
// function render() {

//     gl.clear( gl.COLOR_BUFFER_BIT );

//     var t;
//     var angle=Math.PI / TOTAL_STEPS; // each movement will translate a small amount corresponding to 180/100=18 degrees along the half circle

//     if (stepCount < TOTAL_STEPS) {

//     	t = translate(radius * Math.cos((TOTAL_STEPS - stepCount)*angle),
//     	              radius * Math.sin((TOTAL_STEPS - stepCount)*angle), 0);
//     	modelViewMatrix = t;
//     	DrawOneSnowFlake();

//     	stepCount ++;
//     }
//     else {
//     	stepCount = 0;
//     }

//     requestAnimationFrame(render);
// }
