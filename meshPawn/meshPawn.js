// Pawn drawn with mesh - surface of revolution

var canvas;
var gl;
var program;

var slices;
var stacks;
var radius;

var pointsArray = [];

var modelViewMatrix;
var modelViewMatrixLoc;
    
window.onload = function init() {

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
    
    radius = .8;
    GenSpherePoints(radius);
 
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );

    render();
}

function GenSpherePoints(radius)
{
    slices = 12;  
    stacks = 8;
    var sliceInc = 2*Math.PI/slices;
    var stackInc = Math.PI/stacks;

    var curr1, curr2, prev1, prev2;

    var half = [];
    half.push(vec4(0,    .104, 0.0, 1));
    half.push(vec4(.028, .110, 0.0, 1));
    half.push(vec4(.052, .126, 0.0, 1));
    half.push(vec4(.068, .161, 0.0, 1));
    half.push(vec4(.067, .197, 0.0, 1));
    half.push(vec4(.055, .219, 0.0, 1));
    half.push(vec4(.041, .238, 0.0, 1));
    half.push(vec4(.033, .245, 0.0, 1));
    half.push(vec4(.031, .246, 0.0, 1));
    half.push(vec4(.056, .257, 0.0, 1));
    half.push(vec4(.063, .266, 0.0, 1));
    half.push(vec4(.059, .287, 0.0, 1));
    half.push(vec4(.048, .294, 0.0, 1));
    half.push(vec4(.032, .301, 0.0, 1));
    half.push(vec4(.027, .328, 0.0, 1));
    half.push(vec4(.032, .380, 0.0, 1));
    half.push(vec4(.043, .410, 0.0, 1));
    half.push(vec4(.058, .425, 0.0, 1));
    half.push(vec4(.066, .433, 0.0, 1));
    half.push(vec4(.069, .447, 0.0, 1));
    half.push(vec4(.093, .465, 0.0, 1));
    half.push(vec4(.107, .488, 0.0, 1));
    half.push(vec4(.106, .512, 0.0, 1));
    half.push(vec4(.115, .526, 0.0, 1));
    half.push(vec4(0, .525, 0.0, 1));

    for (var i=0; i<24; i++) {
        // the initial two points
        prev1=init1=half[i];
        prev2=init2=half[i+1];

        // rotate around y axis
        for (var j=1; j<=slices; j++) {
            var m=rotate(j*360/slices, 0, 1, 0);
            curr1 = multiply(m, init1);
            curr2 = multiply(m, init2);
        
            quad(prev1, curr1, curr2, prev2);

            // currs used as prevs for the next two points
            prev1 = curr1;
            prev2 = curr2;
        }  
    } 
}

function quad(a, b, c, d) 
{
    pointsArray.push(a);
    pointsArray.push(b);
    pointsArray.push(c);

    pointsArray.push(a);
    pointsArray.push(c);
    pointsArray.push(d);
}

// a 4x4 matrix multiple by a vec4
function multiply(m, v)
{
    var vv=vec4(
     m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2]+ m[0][3]*v[3],
     m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2]+ m[1][3]*v[3],
     m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]+ m[2][3]*v[3],
     m[3][0]*v[0] + m[3][1]*v[1] + m[3][2]*v[2]+ m[3][3]*v[3]);
    return vv;
}

// Form the 4x4 scale transformation matrix
function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    modelViewMatrix = mult(translate(0, 1, 0), scale4(2, -2, 2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        
    // draw as surface
    // gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);

    // draw wireframe
    gl.drawArrays(gl.LINE_STRIP, 0, pointsArray.length);

    window.requestAnimFrame(render);
}

