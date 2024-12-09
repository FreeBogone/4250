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
var mvMatrixStack=[];
var pointsArray = [];
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
function SetupLightingMaterial()
{
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
}
function SetupTrunkMaterial() {
    lightAmbient = vec4(0.2, 0.1, 0.05, 1.0);       // Earthy ambient light
    lightDiffuse = vec4(0.6, 0.4, 0.3, 1.0);       // Warm diffuse light
    lightSpecular = vec4(0.5, 0.3, 0.2, 1.0);      // Subtle specular highlight
    materialAmbient = vec4(0.4, 0.2, 0.1, 1.0);    // Brown for ambient reflection
    materialDiffuse = vec4(0.6, 0.4, 0.3, 1.0);    // Brighter brown for diffuse
    materialSpecular = vec4(0.3, 0.2, 0.1, 1.0);   // Slight shine for wood
    materialShininess = 30;                        // Moderate shininess
    SetupLightingMaterial();
}

function SetupLeavesMaterial() {
    lightAmbient = vec4(0.1, 0.3, 0.1, 1.0);       // Soft greenish ambient light
    lightDiffuse = vec4(0.2, 0.8, 0.2, 1.0);       // Bright green diffuse light
    lightSpecular = vec4(0.3, 0.9, 0.3, 1.0);      // Vibrant green specular light
    materialAmbient = vec4(0.2, 0.6, 0.2, 1.0);    // Dark green for ambient reflection
    materialDiffuse = vec4(0.4, 0.9, 0.4, 1.0);    // Lush green for diffuse reflection
    materialSpecular = vec4(0.2, 0.8, 0.2, 1.0);   // Subtle highlight for leaves
    materialShininess = 50;                        // High shininess for glossy leaves
    SetupLightingMaterial();
}


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

        // Calculate normals for each face using Newell3 method
        const normal1 = Newell3([bottom1, bottom2, top1]);
        const normal2 = Newell3([bottom2, top2, top1]);

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
        const normal = Newell3([base1, base2, tip]);

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
        const normal = Newell3([base1, base2, center]);

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

    gl.enable(gl.DEPTH_TEST);

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
    console.log("gggggggggggggggggggggggggggggggwssssssssswww");
    Newell3([vec3(0,2,0),vec3(0,0,2),vec3(3,0,0),vec3(2,1,-1)]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    eye = vec3( AllInfo.radius*Math.cos(AllInfo.phi),
    AllInfo.radius*Math.sin(AllInfo.theta),
    AllInfo.radius*Math.sin(AllInfo.phi));
    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);

    // Render Trunk
    SetupTrunkMaterial(); // Apply trunk material and lighting
    let trunkScale = scale4(0.48, 2, 0.48);
    let trunkTranslate = translate(0, -2, 0);
    mvMatrixStack.push(modelViewMatrix);

    let trunkMatrix = mult(mult(modelViewMatrix, trunkTranslate), trunkScale);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(trunkMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, 60); // First 60 vertices are for the trunk
    modelViewMatrix=mvMatrixStack.pop();


    // Render Leaves
    SetupLeavesMaterial(); // Apply leaves material and lighting
    let leavesScale = scale4(1, 2, 1); // Adjust if needed
    let leavesTranslate = translate(0, -2, 0);
    let leavesMatrix = mult(mult(modelViewMatrix, leavesTranslate), leavesScale);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(leavesMatrix));
    gl.drawArrays(gl.TRIANGLES, 60, pointsArray.length - 60); // Remaining vertices are for the leaves
    console.log(pointsArray.length - 60);

}
function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
 }
// Function to calculate normal vectors using the Newell3 method
function Newell3(vertices) {
    let x = 0, y = 0, z = 0;
    const L = vertices.length;
    for (let i = 0; i < L; i++) {
        const current = vertices[i];
        const next = vertices[(i + 1) % L];
        x += (current[1] - next[1]) * (current[2] + next[2]);
        y += (current[2] - next[2]) * (current[0] + next[0]);
        z += (current[0] - next[0]) * (current[1] + next[1]);
    }
    console.log(vec3(x, y, z));
    return normalize(vec3(x, y, z));
}

