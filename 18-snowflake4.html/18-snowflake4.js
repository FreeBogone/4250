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

    vertices.push(vec2(0, 0.1));
    vertices.push(vec2(2, 0.1));
    vertices.push(vec2(3, 1.5));
    vertices.push(vec2(3.2, 1.4));
    vertices.push(vec2(2, 0.1));
    vertices.push(vec2(2.1, 0.1));
    vertices.push(vec2(4, 0.1));
    vertices.push(vec2(5, 1.4));
    vertices.push(vec2(5.2, 1.4));
    vertices.push(vec2(4.1, 0.1));
    vertices.push(vec2(5.5, 0.1));
    vertices.push(vec2(5.8, 0));

    return vertices;
}

var scaleFactor1 = 1/8;
var scaleFactor2 = 1/30;

function DrawOneBranch()
{
    var s;

    // one branch
    modelViewStack.push(modelViewMatrix);   // save the previous MVM
    s = scale4(scaleFactor2, scaleFactor2, 1);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));// important
    gl.drawArrays( gl.LINE_STRIP, 0, 12);
    modelViewMatrix = modelViewStack.pop();   // undo the scaling effect

    modelViewStack.push(modelViewMatrix);        // save the MVM
    s = scale4(scaleFactor2, -scaleFactor2, 1);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_STRIP, 0, 12);
    modelViewMatrix = modelViewStack.pop();   // undo the scaling effect
}

function DrawOneSnowFlake()
{
    var r;

    modelViewStack.push(modelViewMatrix);
    // draw the full snow flake
    for (var i=0; i<6; i++) {

         r = rotate(60, 0, 0, 1);
         modelViewMatrix =  mult(modelViewMatrix, r);

         DrawOneBranch();
    }
    modelViewMatrix=modelViewStack.pop();
}

var TOTAL_STEPS = 100;
var stepCount = 0;

// This is the starting and ending location of the animation
var startX= -1, startY=1; // upper left corner
var targetX=1, targetY=-1;  // lower right corner

var locationX = startX,   // need to be global
    locationY = startY;  // snowflake starts at the starting location

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    var t;

    var deltaX = (targetX-startX)/TOTAL_STEPS,
        deltaY = (targetY-startY)/TOTAL_STEPS;

    if (stepCount < TOTAL_STEPS) {

    	t = translate(locationX, locationY, 0);
    	modelViewMatrix = t;  // <== location of the snowflake
    	DrawOneSnowFlake();

    	locationX = locationX + deltaX;
    	locationY = locationY + deltaY;

    	stepCount ++;
    }
    else {  // when destination is reached, put the snowflake back to the beginning location
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
