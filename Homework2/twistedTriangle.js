var canvas, gl;
var points = [];
var NumTimesToSubdivide = 8;
var THETA = 0.8;

function main()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }
        
    //  Initialize our data for the Sierpinski Gasket
    // First, initialize the corners of our gasket with three points.
    var vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 ) ];

    divideTriangle( vertices[0], vertices[1], vertices[2],
                    NumTimesToSubdivide);

    //transform triangle
    TwistTriangle(points);
    //normalize the points
    NormalizePoints(points);

    //  Configure WebGL
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function triangle( a, b, c ) {
    points.push( a, b, c );
}

// recursively divide the triangles
function divideTriangle( a, b, c, count) {
    // check for end of recursion
    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {
        //bisect the sides
        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;
        //push whitespace triangle
        //triangle(ab, ac, bc);

        // three new triangles
        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
        
    }
}

function TwistTriangle(points) {
    for(var i = 0; i < points.length; i++) {
        vector = points[i];
        a = vector[0];
        b = vector[1];
        //get d
        var d = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

        //transform points
        aPrime = a * Math.cos(d * THETA) - b * Math.sin(d * THETA);
        bPrime = a * Math.sin(d * THETA) + b * Math.cos(d * THETA);

        points[i] = vec2(aPrime, bPrime);
    }
    console.log(points);
}

function NormalizePoints(points) {
    var max = 0, min = 0;
    //get max x value and y value
    for(var i = 0; i < points.length; i++) {
        var vector = points[i];
        var a = vector[0];
        var b = vector[1];
        if(a > max) {
            max = a;
        }
        if(b < min) {
            min = b;
        }
    }

    //normalize a and b values between 1 and -1
    for(var i = 0; i < points.length; i++) {
        var vector = points[i];
        var a = vector[0];
        var b = vector[1];
        a = 2 * ((a - min) / (max - min)) - 1;
        b = 2 * ((b - min) / (max - min)) - 1;

        //append points[i]
        points[i][0] = a;
        points[i][1] = b;
    }
    console.log(points);
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}