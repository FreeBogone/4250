// transformation exercise

var gl;
var points;
var program;

var translate=[0, 0, 0];
var scale=[1/50, 1/50, 1];

var version = 1;

var SIZE=200;   // number of locations to fly to before stopping
var count=0;    // counting the number of location it is currently at
var ghostStepCount=0;  // count the steps from 0 to 99 between each pair of locations
var prePosition=[];
var nextPosition=[];

var translateStack=[];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Four Vertices
    
    var vertices = GeneratePoints();

    var a = document.getElementById("OneButton")
    a.addEventListener("click", function(){
        version = 1;
        translate=[0, 0, 0];
        render();
    });

    var a = document.getElementById("TwoButton")
    a.addEventListener("click", function(){
        version = 2;
        count = 0;

        prevPosition=[myRandom(), myRandom()];
        nextPosition=[myRandom(), myRandom()];

        translate=[prevPosition[0], prevPosition[1], 0];

        ghostStepCount=0;

        render();
    });

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( .95, 0.95, 0.95, 1.0 );
    
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

    render();
};


function GeneratePoints()
{
    var points=[];

    // begin body  (91 points)
	points.push(vec2(3, 0));
	points.push(vec2(3.1, 1));
	points.push(vec2(3.5, 2));
	points.push(vec2(4, 3.6));
	points.push(vec2(4, 4));
	points.push(vec2(4.1, 3.3));
	points.push(vec2(4.5, 3));
	points.push(vec2(5.5, 3));
	points.push(vec2(6,3.5));
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
	points.push(vec2(.5, 15));
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
	points.push(vec2(-2.5, 11.4));  // middle point
	points.push(vec2(-2.9, 10.8));
	points.push(vec2(-2.2, 11));
	points.push(vec2(-2, 12));
	points.push(vec2(-2.9, 12));
	points.push(vec2(-3, 11));
	points.push(vec2(-2.9, 10.5));
    // end left eye

    return points;
}

function DrawGhost() {
    gl.drawArrays( gl.LINE_LOOP, 0, 87); // body
    gl.drawArrays( gl.LINE_LOOP, 87, 6);  // mouth
    gl.drawArrays( gl.LINE_LOOP, 93, 5);  // nose

    gl.drawArrays( gl.LINE_LOOP, 98, 9);  // left eye
    gl.drawArrays( gl.TRIANGLE_FAN, 107, 7);  // left eye ball

    translateStack.push(translate);
    translate=[translate[0]+.04, translate[1], 0];
    gl.uniform3fv(gl.getUniformLocation(program, "tr"), translate);

    // draw right eye
    gl.drawArrays( gl.LINE_STRIP, 98, 9);  // right eye outline
    gl.drawArrays( gl.TRIANGLE_FAN, 107, 7);  // right eye ball

    translate=translateStack.pop();
    gl.uniform3fv(gl.getUniformLocation(program, "tr"), translate);
}

function render() {

    var STEPS=100;   // number of steps between two ghostPositions
    var xstep, ystep;
    gl.clear( gl.COLOR_BUFFER_BIT );

    // transformation parameters set in button event handler
    gl.uniform3fv(gl.getUniformLocation(program, "sc"), scale);
    gl.uniform3fv(gl.getUniformLocation(program, "tr"), translate);

    if (version == 1)  // ghost still
    {
        DrawGhost();
    }
    else if (version == 2)  // ghost fly
    {
        if (ghostStepCount < STEPS)
        {
            xstep = (nextPosition[0] - prevPosition[0])/100.0;
            ystep = (nextPosition[1] - prevPosition[1])/100.0;

		    // Actually move the ghost 
            translate=[translate[0]+xstep, translate[1]+ystep, 0];

            ghostStepCount ++;
	    }
        else if (count < SIZE-1)
        {
            count ++;

            prevPosition = nextPosition;
            nextPosition=[myRandom(), myRandom()];

            ghostStepCount = 0;
        }
        /* 
        // if we want the ghost to return to the center at the end
        else
        {
            translate=[0, 0, 0];
            gl.uniform3fv(gl.getUniformLocation(program, "tr"), translate);
        }
        */
        DrawGhost();
        window.requestAnimFrame(render);
    }
}

function myRandom() {
    return (Math.random()*1.8 - .9);
}
