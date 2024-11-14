// PROGRAMMER: Ruth Dohrmann
// PROJECT: project 4, part III
// FILE: extruded.js
// DUE DATE: 12/12/23
// INSTRUCTOR: Dr. Cen Li
//
// Description: This file includes the vertices array
// and functions for generating points for and drawing
// the baseboard that is used in studynook.js


var N;
var vertices3 = [];
var N_baseboard;
var N_Circle;
var my_count = 0;

// Generate the points for the boardboard
function ExtrudedBaseboard()
{
    var height=.5;
    vertices3 = [vec4(0, 0, 0, 1),
                 vec4(0.002, 0, .001, 1),
                 vec4(0.003, 0, 0.004, 1),
                 vec4(0.0035, 0, 0.01, 1),
                 vec4(0.004, 0, .01, 1),
                 vec4(0.004, 0, 0.0105, 1),
                 vec4(0.006, 0, 0.0115, 1),
                 vec4(0.007, 0, .0135, 1),
                 vec4(0.0075, 0, 0.0195, 1),
                 vec4(0.008, 0, 0.0195, 1),
                 vec4(0.008, 0, .036, 1),
                 vec4(0.01, 0, 0.0365, 1),
                 vec4(0.013, 0, 0.0373, 1),
                 vec4(0.014, 0, 0.0378, 1),
                 vec4(0.0148, 0, 0.0408, 1),
                 vec4(0, 0, 0.0408, 1)
				 ];
    N=N_baseboard = vertices3.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        vertices3.push(vec4(vertices3[i][0], vertices3[i][1]+height, vertices3[i][2], 1));
    }
    ExtrudedShape();
}

function ExtrudedShape()
{
    var basePoints=[];
    var topPoints=[];

    // create the face list
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
        quad3(j, j+N, (j+1)%N+N, (j+1)%N);
    }

    // the first N vertices come from the base
    basePoints.push(0);
    for (var i=N-1; i>0; i--)
    {
        basePoints.push(i);  // index only
    }
    // add the base face as the Nth face
    polygon(basePoints);

    // the next N vertices come from the top
    for (var i=0; i<N; i++)
    {
        topPoints.push(i+N); // index only
    }
    // add the top face
    polygon(topPoints);
}

// quad function; used by ExtrudedShape and connected to vertices3.
function quad3(a, b, c, d) {

     var indices=[a, b, c, d];
     var normal = Newell2(indices);

     // triangle a-b-c
     pointsArray.push(vertices3[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices3[b]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices3[c]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);

     // triangle a-c-d
     pointsArray.push(vertices3[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices3[c]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices3[d]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[3]);
}

// quad function. Used by ExtrudedShape
function polygon(indices)
{
    // for indices=[a, b, c, d, e, f, ...]
    var M=indices.length;
    var normal=Newell2(indices);

    var prev=1;
    var next=2;
    // triangles:
    // a-b-c
    // a-c-d
    // a-d-e
    // ...
    for (var i=0; i<M-2; i++)
    {
        pointsArray.push(vertices3[indices[0]]);
        normalsArray.push(normal);
        texCoordsArray.push(texCoord[0]);

        pointsArray.push(vertices3[indices[prev]]);
        normalsArray.push(normal);
        texCoordsArray.push(texCoord[1]);

        pointsArray.push(vertices3[indices[next]]);
        normalsArray.push(normal);
        texCoordsArray.push(texCoord[2]);

        prev=next;
        next=next+1;
    }
}

// Used by quad 3. Connected to vertices3
function Newell2(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;
   my_count += 1;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];

       x += (vertices3[index][1] - vertices3[nextIndex][1])*
            (vertices3[index][2] + vertices3[nextIndex][2]);
       y += (vertices3[index][2] - vertices3[nextIndex][2])*
            (vertices3[index][0] + vertices3[nextIndex][0]);
       z += (vertices3[index][0] - vertices3[nextIndex][0])*
            (vertices3[index][1] + vertices3[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

// Draw the baseboard
function DrawBaseboard() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    N=N_baseboard;
    gl.drawArrays( gl.TRIANGLES, (sphereCount+cubeCount+fileHolderCount+curtainCount+cylinderCount+candlestick1Count+2*bookCount), 6*N);
}
