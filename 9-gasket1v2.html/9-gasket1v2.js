var gl, points;
var NumPoints = 5000;

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
        vec2(  1, -1 )
    ];

    // Next, generate the rest of the points, by first finding a random point
    //  within our gasket boundary.  We use Barycentric coordinates
    //  (simply the weighted average of the corners) to find the point
	// https://en.wikipedia.org/wiki/Barycentric_coordinate_system
    var coeffs = vec3( Math.random(), Math.random(), Math.random() );
    
    //console.log (`${coeffs[0]}, ${coeffs[1]}, ${coeffs[2]}`);
    let sum=coeffs[0]+coeffs[1]+coeffs[2];
    coeffs[0]=coeffs[0]/sum;
    coeffs[1]=coeffs[1]/sum;
    coeffs[2]=coeffs[2]/sum;
    //console.log (`${coeffs[0]}, ${coeffs[1]}, ${coeffs[2]}`);

    var a = scale( coeffs[0], vertices[0] );
    var b = scale( coeffs[1], vertices[1] );
    var c = scale( coeffs[2], vertices[2] );

    var p = add( a, add(b, c) );

    // Add our randomly chosen point into our array of points
    points = [ p ];

    for ( var i = 0; points.length < NumPoints; ++i ) {
        var j = Math.floor(Math.random() * 3);

        p = add( points[i], vertices[j] );
        p = scale( 0.5, p );
        points.push( p );
    }

    //  Configure WebGL
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    //var program = initShaders( gl, "shaders/vshader21.glsl", "shaders/fshader21.glsl" );
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    if (!program) { console.log('Failed to intialize shaders.'); return; }
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPos );

    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, points.length );
}
