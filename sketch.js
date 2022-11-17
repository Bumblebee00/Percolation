/*
the system is:
o - o - o - o
|   |   |   |
o - o - o - o
|   |   |   |
o - o - o - o
|   |   |   |
o - o - o - o
where each bar is a (0, 1) num.
this is stored in the horizontal and vertical conneection arrays
*/

let horizontal_connections = [];
let vertical_connections = [];
let gridDim = [100, 100];
let p = 0.1;
let slider;

function setup() {
  createCanvas(gridDim[0], gridDim[1]);
  pixelDensity(1);
  slider = createSlider(0, 1, p, 0);
  frameRate(1);

  for (let y = 0; y < gridDim[1]; y++) {
    horizontal_connections[y] = [];
    for (let x = 0; x < gridDim[0] - 1; x++) {
      horizontal_connections[y][x] = random(0, 1);
    }
  }

  for (let y = 0; y < gridDim[1] - 1; y++) {
    vertical_connections[y] = [];
    for (let x = 0; x < gridDim[0]; x++) {
      vertical_connections[y][x] = random(0, 1);
    }
  }
  console.log(vertical_connections);
  console.log(horizontal_connections);
}

function setPixel(i, indexOfColor) {

  if (indexOfColor == null) {
    randomSeed(i);
    pixels[i] = random(1, 255);
    pixels[i + 1] = random(1, 255);
    pixels[i + 2] = random(1, 255);
    pixels[i + 3] = random(1, 255);
  } else {
    pixels[i] = pixels[indexOfColor];
    pixels[i + 1] = pixels[indexOfColor + 1];
    pixels[i + 2] = pixels[indexOfColor + 2];
    pixels[i + 3] = pixels[indexOfColor + 3];
  }
}

function getConnectionBetween(i1, i2) {
  // i1 and i2 must be neighbour
  coo1 = [(i1 / 4) % gridDim[0], int((i1 / 4) / gridDim[0])]
  coo2 = [(i2 / 4) % gridDim[0], int((i2 / 4) / gridDim[0])]
  // up neighbour
  if (coo1[1] == coo2[1] + 1) {
    return vertical_connections[coo1[1] - 1][coo1[0]]
  }
  // right neighbour
  else if (coo1[0] == coo2[0] - 1) {
    return horizontal_connections[coo1[1]][coo1[0]]
  }
  // down neighbour
  else if (coo1[1] == coo2[1] - 1) {
    return vertical_connections[coo1[1]][coo1[0]]
  }
  // left neighbour
  else if (coo1[0] == coo2[0] + 1) {
    return horizontal_connections[coo1[1]][coo1[0] - 1]
  }
  return null
}

function neighborsOfIndex(i) {
  let n = []
  let coo = [(i / 4) % gridDim[0], int((i / 4) / gridDim[0])]
  // top
  if (coo[1] > 0) { n.push(i - gridDim[0] * 4); }
  // right
  if (coo[0] < gridDim[0] - 1) { n.push(i + 4); }
  // bottom
  if (coo[1] < gridDim[1] - 1) { n.push(i + gridDim[0] * 4); }
  // left
  if (coo[0] > 0) { n.push(i - 4); }

  return n;
}

function draw() {
  p = slider.value();
  background(0);

  loadPixels();

  for (let y = 0; y < gridDim[1]; y++) {
    for (let x = 0; x < gridDim[0]; x++) {
      let index = (x + y * gridDim[0]) * 4;
      // if is not yet colored
      if (pixels[index] == 0) {
        // this array will contain all a cluster, all of it beacause
        // for each element in the cluster we'll check if it's neighbours are in the cluster
        let to_check = [index];
        while (to_check.length > 0) {
          i = to_check[0]
          let neighbor_indexes = neighborsOfIndex(i);
          // for every neighbour
          for (neighbor_index of neighbor_indexes) {
            // if i am connected
            if (getConnectionBetween(i, neighbor_index) < p) {
              //if the neighbour has a color 
              if (pixels[neighbor_index] != 0) {
                // take his colour
                setPixel(i, neighbor_index);
              } else {
                // remember for later and add him to the cluster
                to_check.push(neighbor_index);
              }
            }
          }
          // if my pixel has not taken color of anyone, set pixel's own color
          if (pixels[i] == 0) { setPixel(i, null) }
          // remove it from the cluster
          to_check.shift();
        }
        console.log('finished cluster');
      }
    }
  }
  console.log('fs')
  updatePixels();
}
