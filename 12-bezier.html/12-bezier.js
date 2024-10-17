// tweening between two polygons
 
var gl;
var points;
var program;
var MAX_STEPS=100;
var bezier = false;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    var polyline = [
            vec2(-0.6, -0.4),
            vec2(-0.4, .75),
            vec2(0.4, .6),
            vec2(.8, -0.5)];

    document.getElementById("StartStop").onclick = function () {
        bezier = !bezier;
        t=0;
        render();
    };

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var points=generatePoints(polyline);

    // Load polygon data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var position = gl.getAttribLocation( program, "position" );
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( position );
    
    render();
};

function generatePoints(poly)
{
    var points = poly;

    for (var t=0; t<MAX_STEPS; t+= 1.0/MAX_STEPS) {
        points.push(
        [  Math.pow(t, 3)*poly[0][0] + 3*Math.pow(t, 2)*(1-t)*poly[1][0] + 
           3*t*Math.pow((1-t), 2)*poly[2][0] + Math.pow(1-t, 3)*poly[3][0], 
           Math.pow(t, 3)*poly[0][1] + 3*Math.pow(t, 2)*(1-t)*poly[1][1] + 
           3*t*Math.pow((1-t), 2)*poly[2][1] + Math.pow(1-t, 3)*poly[3][1] ]
         );
    }
    return points;
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT );

    gl.uniform1i(gl.getUniformLocation(program, "index"), 1);
    gl.drawArrays( gl.LINE_STRIP, 0, 4);

    if (bezier) {
        gl.uniform1i(gl.getUniformLocation(program, "index"), 2);
        gl.drawArrays( gl.LINE_STRIP, 4, MAX_STEPS);
    }
}
