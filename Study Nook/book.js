// PROGRAMMER: Ruth Dohrmann
// PROJECT: project 4, part III
// FILE: book.js
// DUE DATE: 12/12/23
// INSTRUCTOR: Dr. Cen Li
//
// Description: This file includes the vertices array
// and functions for generating points and drawing
// shapes that are used to make the books and bookshelf
// in studynook.js

// Draw the bookshelf (the bookshelf is not drawn properly
// without the pushes and pops between shelves).
function DrawBookshelf() {
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.62, 0.02, 0.1);
    s=scale4(0.6, 0.02, 0.2)
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.62, 0.17, 0.1);
    s=scale4(0.6, 0.02, 0.2)
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.62, 0.32, 0.1);
    s=scale4(0.6, 0.02, 0.2)
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.62, 0.47, 0.1);
    s=scale4(0.6, 0.02, 0.2)
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.62, 0.62, 0.1);
    s=scale4(0.6, 0.02, 0.2)
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.62, 0.72, 0.1);
    s=scale4(0.6, 0.02, 0.2)
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.62, 0.82, 0.1);
    s=scale4(0.6, 0.02, 0.2)
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.33, 0.41, 0.18);
    s=scale4(0.02, 0.81, 0.02)
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.91, 0.41, 0.18);
    s=scale4(0.02, 0.81, 0.02)
    modelViewMatrix = mult(modelViewMatrix, t);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawSolidCube(1);
    modelViewMatrix=mvMatrixStack.pop();
}

// Draw the inside of the book (the pages)
function DrawBookPart1()
{
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, (sphereCount+cubeCount+fileHolderCount+curtainCount+cylinderCount+candlestick1Count), bookCount);
}

// Draw the outsite of the book (the cover)
function DrawBookPart2()
{
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, (sphereCount+cubeCount+fileHolderCount+curtainCount+cylinderCount+candlestick1Count+bookCount), bookCount);
}

// Draw the covers of all the books in the scene
function DrawBookCovers() {

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.621, 0.06, 0.18);
    modelViewMatrix = mult(mult(modelViewMatrix, t), scale4(.32, .4, .34));
    r=rotate(90, 0, 1, 0);
    modelViewMatrix=mult(modelViewMatrix, r);
    DrawBookPart2();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.689, 0.06, 0.18);
    modelViewMatrix = mult(mult(modelViewMatrix, t), scale4(.32, .4, .34));
    r=rotate(90, 0, 1, 0);
    modelViewMatrix=mult(modelViewMatrix, r);
    DrawBookPart2();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.85, 0.04, 0.18);
    modelViewMatrix = mult(mult(modelViewMatrix, t), scale4(1.7, 0.9, 1.3));
    DrawBooksOutside2();
    modelViewMatrix=mvMatrixStack.pop();

    var fullshelf = false;
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.62, 0.21, 0.11);
    modelViewMatrix = mult(mult(modelViewMatrix, t), scale4(1, 1.2, 1));
    DrawBooksOutside1(fullshelf);
    modelViewMatrix=mvMatrixStack.pop();

    fullshelf = true;
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.48, 0.346, 0.11);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawBooksOutside1(fullshelf);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.48, 0.496, 0.12);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawBooksOutside1(fullshelf);
    modelViewMatrix=mvMatrixStack.pop();

    fullshelf = false;
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.49, 0.646, 0.12);
    modelViewMatrix = mult(mult(modelViewMatrix, t), scale4(1, .7, .7));
    DrawBooksOutside1(fullshelf);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.59, 0.746, 0.12);
    modelViewMatrix = mult(mult(modelViewMatrix, t), scale4(1, .7, .5));
    DrawBooksOutside1(fullshelf);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.57, 0.84, 0.12);
    modelViewMatrix = mult(mult(modelViewMatrix, t), scale4(1.7, 0.9, 1.3));
    DrawBooksOutside2();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.2, 0.471, 1.03);
    modelViewMatrix = mult(mult(modelViewMatrix, t), scale4(1.5, 0.7, 1.3));
    DrawBooksOutside2();
    modelViewMatrix=mvMatrixStack.pop();
}

// Draw the pages of all the books in the scene
function DrawBookPages() {
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.621, 0.06, 0.18);
    modelViewMatrix = mult(mult(modelViewMatrix, t), scale4(.32, .4, .34));
    r=rotate(90, 0, 1, 0);
    modelViewMatrix=mult(modelViewMatrix, r);
    DrawBookPart1();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.689, 0.06, 0.18);
    modelViewMatrix = mult(mult(modelViewMatrix, t), scale4(.32, .4, .34));
    r=rotate(90, 0, 1, 0);
    modelViewMatrix=mult(modelViewMatrix, r);
    DrawBookPart1();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.85, 0.04, 0.18);
    modelViewMatrix = mult(mult(modelViewMatrix, t), scale4(1.7, 0.9, 1.3));
    DrawBooksInside2();
    modelViewMatrix=mvMatrixStack.pop();

    var fullshelf = false;
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.62, 0.21, 0.11);
    modelViewMatrix = mult(mult(modelViewMatrix, t), scale4(1, 1.2, 1));
    DrawBooksInside1(fullshelf);
    modelViewMatrix=mvMatrixStack.pop();

    fullshelf = true
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.48, 0.346, 0.11);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawBooksInside1(fullshelf);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.48, 0.496, 0.12);
    modelViewMatrix = mult(modelViewMatrix, t);
    DrawBooksInside1(fullshelf);
    modelViewMatrix=mvMatrixStack.pop();

    fullshelf = false;
    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.49, 0.646, 0.12);
    modelViewMatrix = mult(mult(modelViewMatrix, t), scale4(1, .7, .7));
    DrawBooksInside1(fullshelf);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.59, 0.746, 0.12);
    modelViewMatrix = mult(mult(modelViewMatrix, t), scale4(1, .7, .5));
    DrawBooksInside1(fullshelf);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.57, 0.84, 0.12);
    modelViewMatrix = mult(mult(modelViewMatrix, t), scale4(1.7, 0.9, 1.3));
    DrawBooksInside2();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(0.2, 0.471, 1.03);
    modelViewMatrix = mult(mult(modelViewMatrix, t), scale4(1.5, 0.7, 1.3));
    DrawBooksInside2();
    modelViewMatrix=mvMatrixStack.pop();
}

// Draw book (inside) (the pages are not placed properly
// without the pushes and pops between shelves). These
// books are the ones on the shelves (vertically placed)
function DrawBooksInside1(fullshelf) {
    mvMatrixStack.push(modelViewMatrix);
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart1();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.027, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart1();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.054, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart1();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.081, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart1();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.108, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart1();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.135, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart1();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.162, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart1();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.189, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart1();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.216, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart1();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.243, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart1();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.27, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart1();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.297, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart1();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.324, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart1();
    modelViewMatrix=mvMatrixStack.pop();

    if (fullshelf) {
      mvMatrixStack.push(modelViewMatrix);
      modelViewMatrix = mult(modelViewMatrix, translate(0.351, 0, 0));
      r=rotate(90, 0, 1, 0);
      s=scale4(1/2, 1/3, 1/4);
      modelViewMatrix=mult(mult(modelViewMatrix, r), s);
      DrawBookPart1();
      modelViewMatrix=mvMatrixStack.pop();

      mvMatrixStack.push(modelViewMatrix);
      modelViewMatrix = mult(modelViewMatrix, translate(0.378, 0, 0));
      r=rotate(90, 0, 1, 0);
      s=scale4(1/2, 1/3, 1/4);
      modelViewMatrix=mult(mult(modelViewMatrix, r), s);
      DrawBookPart1();
      modelViewMatrix=mvMatrixStack.pop();

      mvMatrixStack.push(modelViewMatrix);
      modelViewMatrix = mult(modelViewMatrix, translate(0.405, 0, 0));
      r=rotate(90, 0, 1, 0);
      s=scale4(1/2, 1/3, 1/4);
      modelViewMatrix=mult(mult(modelViewMatrix, r), s);
      DrawBookPart1();
      modelViewMatrix=mvMatrixStack.pop();

      mvMatrixStack.push(modelViewMatrix);
      modelViewMatrix = mult(modelViewMatrix, translate(0.432, 0, 0));
      r=rotate(90, 0, 1, 0);
      s=scale4(1/2, 1/3, 1/4);
      modelViewMatrix=mult(mult(modelViewMatrix, r), s);
      DrawBookPart1();
      modelViewMatrix=mvMatrixStack.pop();

      mvMatrixStack.push(modelViewMatrix);
      modelViewMatrix = mult(modelViewMatrix, translate(0.459, 0, 0));
      r=rotate(90, 0, 1, 0);
      s=scale4(1/2, 1/3, 1/4);
      modelViewMatrix=mult(mult(modelViewMatrix, r), s);
      DrawBookPart1();
      modelViewMatrix=mvMatrixStack.pop();
   }
}

// Draw book (outside) (the covers are not placed properly
// without the pushes and pops between shelves). These
// books are the ones on the shelves (vertically placed)
function DrawBooksOutside1(fullshelf) {
    mvMatrixStack.push(modelViewMatrix);
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart2();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.027, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart2();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.054, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart2();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.081, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart2();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.108, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart2();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.135, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart2();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.162, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart2();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.189, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart2();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.216, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart2();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.243, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart2();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.27, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart2();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.297, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart2();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0.324, 0, 0));
    r=rotate(90, 0, 1, 0);
    s=scale4(1/2, 1/3, 1/4);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart2();
    modelViewMatrix=mvMatrixStack.pop();

    if (fullshelf) {
      mvMatrixStack.push(modelViewMatrix);
      modelViewMatrix = mult(modelViewMatrix, translate(0.351, 0, 0));
      r=rotate(90, 0, 1, 0);
      s=scale4(1/2, 1/3, 1/4);
      modelViewMatrix=mult(mult(modelViewMatrix, r), s);
      DrawBookPart2();
      modelViewMatrix=mvMatrixStack.pop();

      mvMatrixStack.push(modelViewMatrix);
      modelViewMatrix = mult(modelViewMatrix, translate(0.378, 0, 0));
      r=rotate(90, 0, 1, 0);
      s=scale4(1/2, 1/3, 1/4);
      modelViewMatrix=mult(mult(modelViewMatrix, r), s);
      DrawBookPart2();
      modelViewMatrix=mvMatrixStack.pop();

      mvMatrixStack.push(modelViewMatrix);
      modelViewMatrix = mult(modelViewMatrix, translate(0.405, 0, 0));
      r=rotate(90, 0, 1, 0);
      s=scale4(1/2, 1/3, 1/4);
      modelViewMatrix=mult(mult(modelViewMatrix, r), s);
      DrawBookPart2();
      modelViewMatrix=mvMatrixStack.pop();

      mvMatrixStack.push(modelViewMatrix);
      modelViewMatrix = mult(modelViewMatrix, translate(0.432, 0, 0));
      r=rotate(90, 0, 1, 0);
      s=scale4(1/2, 1/3, 1/4);
      modelViewMatrix=mult(mult(modelViewMatrix, r), s);
      DrawBookPart2();
      modelViewMatrix=mvMatrixStack.pop();

      mvMatrixStack.push(modelViewMatrix);
      modelViewMatrix = mult(modelViewMatrix, translate(0.459, 0, 0));
      r=rotate(90, 0, 1, 0);
      s=scale4(1/2, 1/3, 1/4);
      modelViewMatrix=mult(mult(modelViewMatrix, r), s);
      DrawBookPart2();
      modelViewMatrix=mvMatrixStack.pop();
   }
}

// Draw book (inside). These books are the ones horizontally placed.
function DrawBooksInside2() {
    mvMatrixStack.push(modelViewMatrix);
    r=rotate(90, 0, 1, 0);
    r=mult(r, rotate(90, 1, 0, 0));
    s=scale4(1/2, 1/3, 1/5);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart1();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, 0.019, 0));
    r=rotate(90, 0, 1, 0);
    r=mult(r, rotate(90, 1, 0, 0));
    s=scale4(1/2, 1/3, 1/5);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart1();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, 0.038, 0));
    r=rotate(90, 0, 1, 0);
    r=mult(r, rotate(90, 1, 0, 0));
    s=scale4(1/2, 1/3, 1/6);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart1();
    modelViewMatrix=mvMatrixStack.pop();
}

// Draw book (outside). These books are the ones horizontally placed.
function DrawBooksOutside2() {
    mvMatrixStack.push(modelViewMatrix);
    r=rotate(90, 0, 1, 0);
    r=mult(r, rotate(90, 1, 0, 0));
    s=scale4(1/2, 1/3, 1/5);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart2();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, 0.019, 0));
    r=rotate(90, 0, 1, 0);
    r=mult(r, rotate(90, 1, 0, 0));
    s=scale4(1/2, 1/3, 1/6);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart2();
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, 0.038, 0));
    r=rotate(90, 0, 1, 0);
    r=mult(r, rotate(90, 1, 0, 0));
    s=scale4(1/2, 1/3, 1/5);
    modelViewMatrix=mult(mult(modelViewMatrix, r), s);
    DrawBookPart2();
    modelViewMatrix=mvMatrixStack.pop();
}
