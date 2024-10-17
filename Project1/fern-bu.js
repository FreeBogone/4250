var canvas, gl;
var points = [];
var iterations = 100000;
var drawFirst = 1;

function main() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        console.log("WebGL isn't available");
        return;
    }

    // Initialize starting point for fern
    var vertex = [
        vec2(0, 0)
    ];

    //Initialize sets
    var firstFernSets = [
        [0.0, 0.0, 0.0, 0.16, 0.0, 0.0],
        [0.2, -0.26, 0.23, 0.22, 0.0, 1.6],
        [-0.15, 0.28, 0.26, 0.24, 0.0, 0.44],
        [0.75, 0.04, -0.04, 0.85, 0.0, 1.6]
    ];

    // var secondFernSets = [
    //     [],
    //     [],
    //     [],
    //     []
    // ]

    //build fern
    buildFern(vertex, firstFernSets, iterations);
    NormalizePoints(points);

    // Convert points array to Float32Array
    var vertexArray = new Float32Array(points.flat());

    // Configure WebGL
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render();
}

//push points to points array
function fern(point) {
    points.push(point);
}

function buildFern(point, sets, count) {
    var x = point[0][0];
    var y = point[0][1];
    
    for(var i = 0; i < count; i++) {
        //determine set with probabilities
        set = getRandomSet(sets);

        //get a-f
        var a = set[0];
        var b = set[1];
        var c = set[2];
        var d = set[3];
        var e = set[4];
        var f = set[5];

        //get x and y prime
        var xPrime = (a * x) + (b * y) + e;
        var yPrime = (c * x) + (d * y) + f;

        //make a point
        var pointPrime = vec2(xPrime, yPrime);
        fern(pointPrime);

        //use primes for next iteration
        x = xPrime;
        y = yPrime;
    }
}

function getRandomSet(sets) {
    var set = [];
    var num = Math.random();

    if (num <= 0.1) {
        set = sets[0];
    }
    else if (num > 0.1 && num <= 0.18) {
        set = sets[1];
    }
    else if (num > 0.18 && num <= 0.26) {
        set = sets[2];
    }
    else if (num > 0.26) {
        set = sets[3];
    }

    return set;
}

function NormalizePoints(points) {
    var maxX = -Infinity, minX = Infinity;
    var maxY = -Infinity, minY = Infinity;

    // Find the max and min values for x and y
    for (var i = 0; i < points.length; i++) {
        var vector = points[i];
        var a = vector[0];
        var b = vector[1];
        if (a > maxX) maxX = a;
        if (a < minX) minX = a;
        if (b > maxY) maxY = b;
        if (b < minY) minY = b;
    }

    // Normalize a and b values between -1 and 1
    for (var i = 0; i < points.length; i++) {
        var vector = points[i];
        var a = vector[0];
        var b = vector[1];
        a = 2 * ((a - minX) / (maxX - minX)) - 1;
        b = 2 * ((b - minY) / (maxY - minY)) - 1;

        // Update points[i]
        points[i][0] = a;
        points[i][1] = b;
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, points.length);
}
