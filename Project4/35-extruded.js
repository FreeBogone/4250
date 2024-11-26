var canvas;
var gl;

var shape="triangle";
var eye= [5, 5, 5];
var at = [0, 0, 0];
var up = [0, 1, 0];
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var modelView, projection;
var mvMatrixStack=[];

var pointsArray = [];
var normalsArray = [];

var N;
var Exvertices;
var N_Triangle;
var N_Circle;

var lightPosition = vec4(0.5, 0.5, 0.5, 0);
var lightAmbient ;
var lightDiffuse;
var lightSpecular ;

var materialAmbient ;
var materialDiffuse ;
var materialSpecular ;
var materialShininess ;

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelView, projection;
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta =[0, 0, 0];

var thetaLoc;

var flag = true;
//var flag = false;
var normalsArray = [];
var lightPosition = vec4(0.5, 0.5, 0.5, 0);
var lightAmbient, lightDiffuse, lightSpecular;
var materialAmbient, materialDiffuse, materialSpecular;
var materialShininess;
window.onload = function init()
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

    ExtrudedTriangle();
    // HalfCircle();

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");

    projection = ortho(-3, 3, -3, 3, -20, 20);

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    document.getElementById("triangle").onclick = function() {
        shape = "triangle";
    };

    document.getElementById("circle").onclick = function() {
        shape = "circle";
    };

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );

    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
       false, flatten(projection));

    render();
}

function ExtrudedTriangle()
{
    // for a different extruded object,
    // only change these two variables: Exvertices and height

    var height=2;
    Exvertices = [ vec4(2, 0, 0, 1),
                 vec4(0, 0, 2, 1),
                 vec4(0, 0, 0, 1)
				 ];
    N=N_Triangle = Exvertices.length;

    // add the second set of points
    // extruded along the Y Axis
    for (var i=0; i<N; i++)
    {
        Exvertices.push(vec4(Exvertices[i][0], Exvertices[i][1]+height, Exvertices[i][2], 1));
    }

    ExtrudedShape();
}


function ExtrudedShape()
{
    lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
    lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
    lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
   
    materialAmbient = vec4( 1.0, 0.1, 0.1, 1.0 );
    materialDiffuse = vec4( 1.0, 0.1, 0.1, 1.0);
    materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
    materialShininess = 50.0;
    var basePoints=[];
    var topPoints=[];

    // create the face list
    // add the side faces first --> N ExQuads
    for (var j=0; j<N; j++)
    {
        ExQuad(j, j+N, (j+1)%N+N, (j+1)%N); // CCW rotation
    }

    // the first N Exvertices come from the base
    basePoints.push(0);
    for (var i=N-1; i>0; i--)
    {
        basePoints.push(i);  // index only
    }
    // add the base face as the Nth face
    polygon(basePoints);

    // the next N Exvertices come from the top
    for (var i=0; i<N; i++)
    {
        topPoints.push(i+N); // index only
    }
    // add the top face
    polygon(topPoints);
}

function ExQuad(a, b, c, d) {

     var indices=[a, b, c, d];
     var normal = Newell(indices);

     // triangle a-b-c
     pointsArray.push(Exvertices[a]);
     normalsArray.push(normal);

     pointsArray.push(Exvertices[b]);
     normalsArray.push(normal);

     pointsArray.push(Exvertices[c]);
     normalsArray.push(normal);

     // triangle a-c-d
     pointsArray.push(Exvertices[a]);
     normalsArray.push(normal);

     pointsArray.push(Exvertices[c]);
     normalsArray.push(normal);

     pointsArray.push(Exvertices[d]);
     normalsArray.push(normal);
}


function polygon(indices)
{
    // for indices=[a, b, c, d, e, f, ...]
    var M=indices.length;
    var normal=Newell(indices);

    var prev=1;
    var next=2;
    // triangles:
    // a-b-c
    // a-c-d
    // a-d-e
    // ...
    for (var i=0; i<M-2; i++)
    {
        pointsArray.push(Exvertices[indices[0]]);
        normalsArray.push(normal);

        pointsArray.push(Exvertices[indices[prev]]);
        normalsArray.push(normal);

        pointsArray.push(Exvertices[indices[next]]);
        normalsArray.push(normal);

        prev=next;
        next=next+1;
    }
}

function Newell(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];

       x += (Exvertices[index][1] - Exvertices[nextIndex][1])*
            (Exvertices[index][2] + Exvertices[nextIndex][2]);
       y += (Exvertices[index][2] - Exvertices[nextIndex][2])*
            (Exvertices[index][0] + Exvertices[nextIndex][0]);
       z += (Exvertices[index][0] - Exvertices[nextIndex][0])*
            (Exvertices[index][1] + Exvertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

var render = function()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 2.0;

    modelView = lookAt(eye, at, up);
    modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
    modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
    modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));

    //******************
//      lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
//  lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
//  lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

//  materialAmbient = vec4( 1.0, 0.1, 0.1, 1.0 );
//  materialDiffuse = vec4( 1.0, 0.1, 0.1, 1.0);
//  materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
//  materialShininess = 50.0;
    //********* */

    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );

        materialAmbient = vec4( 1.0, 0, 0.2, 1.0 );
        materialDiffuse = vec4( 1.0, 0, 0.2, 1.0);
        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                      flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                      flatten(diffuseProduct) );
        N=N_Triangle;
        gl.drawArrays( gl.TRIANGLES, 0, 6*N+1*3*2);
    
    

    requestAnimFrame(render);
}
