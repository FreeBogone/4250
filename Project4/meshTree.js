var canvas;
var gl;
var image;
var program;

var eye;
var near = -30;
var far = 30;

var left = -2.0;
var right = 2.0;
var ytop = 2.0;
var bottom = -2.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var modelView, projection;
var viewerPos;
var flag = true;

var pointsArray = [];
var colorsArray = [];
var normalsArray = [];
var lightPosition = vec4(0.5, 0.5, 0.5, 0);
var lightAmbient, lightDiffuse, lightSpecular;
var materialAmbient, materialDiffuse, materialSpecular;
var materialShininess;

// Define the vertices for the tree trunk with pentagram base
var trunkVertices = {
    base: [  // Bottom decagon (base of the tree trunk)
        vec4(Math.cos(0 * Math.PI / 5), 0.0, Math.sin(0 * Math.PI / 5), 1.0),
        vec4(Math.cos(1 * Math.PI / 5), 0.0, Math.sin(1 * Math.PI / 5), 1.0),
        vec4(Math.cos(2 * Math.PI / 5), 0.0, Math.sin(2 * Math.PI / 5), 1.0),
        vec4(Math.cos(3 * Math.PI / 5), 0.0, Math.sin(3 * Math.PI / 5), 1.0),
        vec4(Math.cos(4 * Math.PI / 5), 0.0, Math.sin(4 * Math.PI / 5), 1.0),
        vec4(Math.cos(5 * Math.PI / 5), 0.0, Math.sin(5 * Math.PI / 5), 1.0),
        vec4(Math.cos(6 * Math.PI / 5), 0.0, Math.sin(6 * Math.PI / 5), 1.0),
        vec4(Math.cos(7 * Math.PI / 5), 0.0, Math.sin(7 * Math.PI / 5), 1.0),
        vec4(Math.cos(8 * Math.PI / 5), 0.0, Math.sin(8 * Math.PI / 5), 1.0),
        vec4(Math.cos(9 * Math.PI / 5), 0.0, Math.sin(9 * Math.PI / 5), 1.0)
    ],
    top: [   // Top smaller decagon (top of the tree trunk)
        vec4(Math.cos(0 * Math.PI / 5) * 0.6, 1.0, Math.sin(0 * Math.PI / 5) * 0.6, 1.0),
        vec4(Math.cos(1 * Math.PI / 5) * 0.6, 1.0, Math.sin(1 * Math.PI / 5) * 0.6, 1.0),
        vec4(Math.cos(2 * Math.PI / 5) * 0.6, 1.0, Math.sin(2 * Math.PI / 5) * 0.6, 1.0),
        vec4(Math.cos(3 * Math.PI / 5) * 0.6, 1.0, Math.sin(3 * Math.PI / 5) * 0.6, 1.0),
        vec4(Math.cos(4 * Math.PI / 5) * 0.6, 1.0, Math.sin(4 * Math.PI / 5) * 0.6, 1.0),
        vec4(Math.cos(5 * Math.PI / 5) * 0.6, 1.0, Math.sin(5 * Math.PI / 5) * 0.6, 1.0),
        vec4(Math.cos(6 * Math.PI / 5) * 0.6, 1.0, Math.sin(6 * Math.PI / 5) * 0.6, 1.0),
        vec4(Math.cos(7 * Math.PI / 5) * 0.6, 1.0, Math.sin(7 * Math.PI / 5) * 0.6, 1.0),
        vec4(Math.cos(8 * Math.PI / 5) * 0.6, 1.0, Math.sin(8 * Math.PI / 5) * 0.6, 1.0),
        vec4(Math.cos(9 * Math.PI / 5) * 0.6, 1.0, Math.sin(9 * Math.PI / 5) * 0.6, 1.0)
    ]
};



// Define the tip of the cone (leaves)
var leavesTip = vec4(0.0, 2.0, 0.0, 1.0); // The tip is placed 2 units above the top of the trunk



// /// Function to calculate gradient color based on the height of the vertex
// function getGradientColor(i) {
//     // Normalize the index for a smooth transition from bottom to top (0 to 1)
//     let t = i / 10.0;

//     // Interpolate between two colors: dark brown at the bottom and lighter brown at the top
//     let colorBottom = vec4(0.5, 0.25, 0.0, 1.0);  // Dark brown (base color)
//     let colorTop = vec4(0.8, 0.6, 0.2, 1.0);     // Lighter brown (top color)

//     // Linear interpolation (lerp) between base and top colors
//     return vec4(
//         (1 - t) * colorBottom[0] + t * colorTop[0],
//         (1 - t) * colorBottom[1] + t * colorTop[1],
//         (1 - t) * colorBottom[2] + t * colorTop[2],
//         1.0
//     );
// }


// // Function to calculate gradient color for the leaves (green shades)
// function getLeafColor(i) {
//     let t = i / 10.0;
//     let colorBase = vec4(0.0, 0.6, 0.0, 1.0); // Dark green (base of leaves)
//     let colorTip = vec4(0.5, 1.0, 0.5, 1.0);  // Lighter green (tip of leaves)
//     return vec4(
//         (1 - t) * colorBase[0] + t * colorTip[0],
//         (1 - t) * colorBase[1] + t * colorTip[1],
//         (1 - t) * colorBase[2] + t * colorTip[2],
//         1.0
//     );
// }
// // Create the sides of the trunk (connecting the base and top) with gradient coloring
// function createTrunkFaces() {
//     for (let i = 0; i < 10; i++) {  // Now 10 vertices for the decagon
//         // Bottom base to top (side faces)
//         pointsArray.push(trunkVertices.base[i]);
//         pointsArray.push(trunkVertices.base[(i + 1) % 10]);
//         pointsArray.push(trunkVertices.top[i]);

//         pointsArray.push(trunkVertices.base[(i + 1) % 10]);
//         pointsArray.push(trunkVertices.top[i]);
//         pointsArray.push(trunkVertices.top[(i + 1) % 10]);

//         // Get the gradient color for each face based on the index i
//         let color = getGradientColor(i);

//         // Add gradient color for each face
//         colorsArray.push(color); // Color for the trunk (brownish)
//         colorsArray.push(color); // Color for the trunk (brownish)
//         colorsArray.push(color); // Color for the trunk (brownish)

//         colorsArray.push(color); // Color for the trunk (brownish)
//         colorsArray.push(color); // Color for the trunk (brownish)
//         colorsArray.push(color); // Color for the trunk (brownish)
//     }
// }
// // /// Create the cone-shaped leaves above the trunk with a wider base
// function createLeaves() {
//     let leavesBaseRadius = 1.2;  // Increase this value to make the base of the leaves wider than the trunk's top
//     let leavesBase = [];  // Define the base vertices of the cone (wider than the trunk top)
    
//     // Define the base of the leaves (wider than the trunk top) positioned just above the trunk
//     let leavesHeight = 1;  // Position the leaves a little above the top of the trunk
//     for (let i = 0; i < 10; i++) {
//         // Spread the base vertices in 3D space (circle in the X-Z plane, at height 'leavesHeight')
//         leavesBase.push(vec4(Math.cos(i * Math.PI / 5) * leavesBaseRadius, leavesHeight, Math.sin(i * Math.PI / 5) * leavesBaseRadius, 1.0));
//     }
    
//     // Create faces for the cone (leaves) with proper 3D cone shape
//     for (let i = 0; i < 10; i++) {
//         pointsArray.push(leavesBase[i]);  // Bottom base vertex
//         pointsArray.push(leavesBase[(i + 1) % 10]);  // Next base vertex
//         pointsArray.push(leavesTip);  // Tip of the cone (top of the leaves)

//         let color = getLeafColor(i);  // Get the color for this face
//         colorsArray.push(color, color, color);  // Add color for each face
//     }
//     // Close the base of the leaves (making it solid) by creating faces for the base
//     for (let i = 0; i < 10; i++) {
//         // Draw the base of the cone by connecting adjacent vertices in the base
//         pointsArray.push(leavesBase[i]);  // One vertex of the base
//         pointsArray.push(leavesBase[(i + 1) % 10]);  // Next vertex of the base
//         pointsArray.push(leavesBase[(i + 2) % 10]);  // Third vertex of the base

//         let color = getLeafColor(i);  // Get the color for the base
//         colorsArray.push(color, color, color);  // Add color for each base triangle face
//     }
// }

// Create the sides of the trunk (connecting the base and top) with normals
function createTrunkFaces() {
    for (let i = 0; i < 10; i++) {
        const bottom1 = trunkVertices.base[i];
        const bottom2 = trunkVertices.base[(i + 1) % 10];
        const top1 = trunkVertices.top[i];
        const top2 = trunkVertices.top[(i + 1) % 10];

        // Side face (quad split into two triangles)
        pointsArray.push(bottom1, bottom2, top1); // First triangle
        pointsArray.push(bottom2, top2, top1);   // Second triangle

        // Calculate normals for each face using Newell method
        const normal1 = Newell([bottom1, bottom2, top1]);
        const normal2 = Newell([bottom2, top2, top1]);

        // Push normals for each vertex of the two triangles
        normalsArray.push(normal1, normal1, normal1);
        normalsArray.push(normal2, normal2, normal2);
    }
}

// Create the cone-shaped leaves above the trunk with normals
function createLeaves() {
    const leavesBaseRadius = 1.2;
    const leavesBase = [];
    const leavesHeight = 1;

    // Define the base of the leaves
    for (let i = 0; i < 10; i++) {
        leavesBase.push(vec4(
            Math.cos(i * Math.PI / 5) * leavesBaseRadius,
            leavesHeight,
            Math.sin(i * Math.PI / 5) * leavesBaseRadius,
            1.0
        ));
    }

    // Create cone faces
    for (let i = 0; i < 10; i++) {
        const base1 = leavesBase[i];
        const base2 = leavesBase[(i + 1) % 10];
        const tip = leavesTip;

        // Add the face vertices
        pointsArray.push(base1, base2, tip);

        // Compute normal for the triangle
        const normal = Newell([base1, base2, tip]);

        // Push the normal for each vertex of the triangle
        normalsArray.push(normal, normal, normal);
    }

    // Close the base of the cone
    for (let i = 0; i < 10; i++) {
        const base1 = leavesBase[i];
        const base2 = leavesBase[(i + 1) % 10];
        const center = vec4(0.0, leavesHeight, 0.0, 1.0); // Center of the base

        // Add the base face vertices
        pointsArray.push(base1, base2, center);

        // Compute normal for the base triangle
        const normal = Newell([base1, base2, center]);

        // Push the normal for each vertex of the triangle
        normalsArray.push(normal, normal, normal);
    }
}


function DrawTree() {
    createTrunkFaces(); // Call function to create the tree trunk faces
    createLeaves();     // Call function to create the tree leaves (cone)

}
// no need to change after this point
var AllInfo = {

    // Camera pan control variables.
    zoomFactor : 4,
    translateX : 0,
    translateY : 0,

    // Camera rotate control variables.
    phi : 1,
    theta : 0.5,
    radius : 1,
    dr : 2.0 * Math.PI/180.0,

    // Mouse control variables
    mouseDownRight : false,
    mouseDownLeft : false,

    mousePosOnClickX : 0,
    mousePosOnClickY : 0
};
// Set up WebGL
window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.5, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    // !!
    // program needs to be global
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    DrawTree();

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vPosition);

	// // color buffer
    // var cBuffer = gl.createBuffer();
    // gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    // var vColor = gl.getAttribLocation( program, "vColor" );
    // gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    // gl.enableVertexAttribArray( vColor );

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );


    // Set the scroll wheel to change the zoom factor.
    document.getElementById("gl-canvas").addEventListener("wheel", function(e) {
        if (e.wheelDelta > 0) {
            AllInfo.zoomFactor = Math.max(0.1, AllInfo.zoomFactor - 0.1);
        } else {
            AllInfo.zoomFactor += 0.1;
        }
        render();
    });

    document.getElementById("gl-canvas").addEventListener("mousedown", function(e) {
        if (e.which == 1) {
            AllInfo.mouseDownLeft = true;
            AllInfo.mouseDownRight = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        } else if (e.which == 3) {
            AllInfo.mouseDownRight = true;
            AllInfo.mouseDownLeft = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        }
        render();
    });

    document.addEventListener("mouseup", function(e) {
        AllInfo.mouseDownLeft = false;
        AllInfo.mouseDownRight = false;
        render();
    });

    document.addEventListener("mousemove", function(e) {
        if (AllInfo.mouseDownRight) {
            AllInfo.translateX += (e.x - AllInfo.mousePosOnClickX)/30;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.translateY -= (e.y - AllInfo.mousePosOnClickY)/30;
            AllInfo.mousePosOnClickY = e.y;
        } else if (AllInfo.mouseDownLeft) {
            AllInfo.phi += (e.x - AllInfo.mousePosOnClickX)/100;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.theta += (e.y - AllInfo.mousePosOnClickY)/100;
            AllInfo.mousePosOnClickY = e.y;
        }
        render();
    });
    render();
}

// Render function to update and draw the tree
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

   // eye = vec3(2.0, 2.0, 2.0); // Set a perspective viewpoint
    eye = vec3( AllInfo.radius*Math.cos(AllInfo.phi),
    AllInfo.radius*Math.sin(AllInfo.theta),
    AllInfo.radius*Math.sin(AllInfo.phi));
    
    
    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);


    let s = scale4(0.48, 2, 0.48);
    t=translate(0, -2, 0);

    modelViewMatrix=mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);
}


function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
 }
//  function Newell(indices)
// {
//    var L=indices.length;
//    var x=0, y=0, z=0;
//    var index, nextIndex;

//    for (var i=0; i<L; i++)
//    {
//        index=indices[i];
//        nextIndex = indices[(i+1)%L];

//        x += (buildingVertices[index][1] - buildingVertices[nextIndex][1])*
//             (buildingVertices[index][2] + buildingVertices[nextIndex][2]);
//        y += (buildingVertices[index][2] - buildingVertices[nextIndex][2])*
//             (buildingVertices[index][0] + buildingVertices[nextIndex][0]);
//        z += (buildingVertices[index][0] - buildingVertices[nextIndex][0])*
//             (buildingVertices[index][1] + buildingVertices[nextIndex][1]);
//    }

//    return (normalize(vec3(x, y, z)));
// }

// Function to calculate normal vectors using the Newell method
function Newell(vertices) {
    let x = 0, y = 0, z = 0;
    const L = vertices.length;

    for (let i = 0; i < L; i++) {
        const current = vertices[i];
        const next = vertices[(i + 1) % L];
        x += (current[1] - next[1]) * (current[2] + next[2]);
        y += (current[2] - next[2]) * (current[0] + next[0]);
        z += (current[0] - next[0]) * (current[1] + next[1]);
    }

    return normalize(vec3(x, y, z));
}