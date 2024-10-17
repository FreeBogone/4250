var gl;
var points;
var theta=45/180*Math.PI;

function main() {
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }
    
    // Three Vertices
    var vertices = [
        vec2( -.52, -.3 ),
        vec2(  0,  .6 ),
        vec2(  .52, -.3 )
    ];

    // twist the triangle by theta degrees to the left
    vertices = ProcessPoints(vertices);

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
}

function ProcessPoints(vertices) {
    var x, y;
    var twistedPoints = [];

    for (var i=0; i<vertices.length; i++) {
  	    x = vertices[i][0]*Math.cos(theta) - vertices[i][1]*Math.sin(theta);
        y = vertices[i][0]*Math.sin(theta) + vertices[i][1]*Math.cos(theta);

        twistedPoints.push(vec2(x, y));
    }
    return twistedPoints;
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
}
