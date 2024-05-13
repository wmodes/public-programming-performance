
/**
 * boat object
 * @class 
 */
class Boat {
  static updateInterval = 250
  static headingMomentum = 0.9
  static time = 0;
  /**
   * @constructor 
   * @param {number} x x coordinate to render to
   * @param {number} y y coordinate to rener to 
   */
  constructor(x, y) {
      this.x = x;
      this.y = y;
      this.tiles = {};
      this.color = Math.random();
      this.dist = 0;
      this.lastUpdateTime = 0;
      this.heading = "N";
      this.index = -1;
  }

  /**
   * @returns {undefined}
   */
  draw() {

  }

  /**
   * @returns {void}
   */
  update() {
      if (millis() - this.lastUpdateTime > Boat.updateInterval) {
          return;
      }
      this.lastUpdateTime = millis();
      if (random() > Boat.headingMomentum) {
          // Change Heading
      }

      // Move

  }

  /**
   * @param {number} i x coordinate to add to
   * @param {number} j y coordinate to add to
   * @returns {void}
   */
  addBoatTile(i, j) {
      let tmpDist = dist(this.x, this.y, i, j);
      //this.tiles.push({i:i - this.x, j:j - this.y, dist: tmpDist});
      let I = i - this.x;
      let J = j - this.y;
      let key = [I, J];
      this.tiles[key] = { i: i - this.x, j: j - this.y, dist: tmpDist };
      //this.tiles.push({ i: i - this.x, j: j - this.y, dist: tmpDist });
      if (tmpDist > this.dist) {
          this.dist = tmpDist;
      }
  }

  boatTiles = {};
  // boatTiles[[i, j]] = 1;

  
  checkMove(di, dj){
    for(let key in this.tiles){
      if(window.tiles.isIsland(this.x + this.tiles[key].i + di, this.y + this.tiles[key].j + dj)){
        return false;
      }
    }
    for(let key in this.tiles){
      let I = this.x + this.tiles[key].i + di;
      let J = this.y + this.tiles[key].j + dj;
      for (let o = 0; o < boats.length; o++) {
        if(o !== this.index){
          for (let key2 in boats[o].tiles) {
            let I2 = boats[o].x + boats[o].tiles[key2].i;
            let J2 = boats[o].y + boats[o].tiles[key2].j;
            if(I === I2 && J === J2){
              return false;
            }
          }
      }
      }
    }
    return true;
  }
  

  static moveBoats = function(){
    Boat.time++;
    if(Boat.time %60 === 0){
      for(let I = 0; I < boats.length; I++){
        let rx = round(random(-1,1));
        let ry = round(random(-1,1));
        if(boats[I].checkMove(rx, ry)){
          boats[I].x += rx;
          boats[I].y += ry;
        }
      }
    }
  }

  static drawBoats(i, j){
    for(let I = 0; I < boats.length; I++){
      //for(let O = 0; O < boats[I].tiles.length; O++){
      for(let key in boats[I].tiles){
        if(i === boats[I].x + boats[I].tiles[key].i && j === boats[I].y + boats[I].tiles[key].j){
          // fill( boats[I].color * 255);
          // beginShape();
          // vertex(-tw, 0);
          // vertex(0, th);
          // vertex(tw, 0);
          // vertex(0, -th);
          // endShape(CLOSE);
          let r = boats[I].color;
          // temp
          drawBoat(color(101*r, 53*r, 15*r), color(60*r, 40*r, 13*r), color(63*r, 48*r, 29*r));
        }
      }
    }
  }
  

}

/**
* @function isAdjacent
* @param {number}
* @param {number}
* @param {number}
* @param {number}
* @author Aidan
*/
var isAdjacent = function(i1, j1, i2, j2) {
if(j1 === j2){
  if(i1 === i2 + 1 || i1 === i2 - 1){
    return true;
  }
}
if(i1 === i2){
  if(j1 === j2 + 1 || j1 === j2 - 1){
    return true;
  }
}
return false;
}

var isOn = function(i1, j1, i2, j2) {
return j1 === j2 && i1 === i2;
}


/**
* @function addBoat
* @author Aidan
* @param {number}
*/
var addBoat = function (i, j) {
  console.log(i + ", " + j + ", " + boats.length);
  for (let o = 0; o < boats.length; o++) {
    //console.log(dist(i, j, boats[o].x, boats[o].y) + "----" + boats[o].dist);
    if (dist(i, j, boats[o].x, boats[o].y) < boats[o].dist + 4) {
      //for(let p = 0; p < boats[o].tiles.length; p++){
      for (let key in boats[o].tiles) {
        if (isOn(i, j, boats[o].x + boats[o].tiles[key].i, boats[o].y + boats[o].tiles[key].j)) {
          delete boats[o].tiles[key];
          splitBoat(o);
          let tmp = Object.keys(boats[o].tiles);
          if(tmp.length === 0){
            console.log("test");
            boats.splice(o, 1);
          }
          return;
        }
      }
    }
  }
  for (let o = 0; o < boats.length; o++) {
    //console.log(dist(i, j, boats[o].x, boats[o].y) + "----" + boats[o].dist);
    if (dist(i, j, boats[o].x, boats[o].y) < boats[o].dist + 4) {
      //for(let p = 0; p < boats[o].tiles.length; p++){
      for (let key in boats[o].tiles) {
        if (isAdjacent(i, j, boats[o].x + boats[o].tiles[key].i, boats[o].y + boats[o].tiles[key].j)) {
          boats[o].addBoatTile(i, j);
          return;
        }
      }
    }
  }
  let tmp = new Boat(i, j);
  tmp.addBoatTile(i, j);
  tmp.index = boats.length;
  boats.push(tmp);

}

var splitBoat = function(I){
  let boat = boats[I];


  let tmp = Object.keys(boat.tiles);
  if(tmp.length === 0){
    return;
  }

let chunks = [];
let chunkIndex = 0;


for(let currentKey of tmp){

  let flag = false;
  for(let chunk of chunks){
    if(currentKey in chunk){
      flag = true;
      break;
    }
  }
  if(flag){
    continue;
  }
  
  let stack = {};
  stack[currentKey] = boat.tiles[currentKey];
  let skeys = Object.keys(stack);
  let slen = skeys.length;

  chunks.push({});
  chunkIndex = chunks.length - 1;

  while(slen !== 0){
    skeys = Object.keys(stack);
    for(let key of skeys){
      let tile = boat.tiles[key];
      let k = [];
      k.push([tile.i + 1, tile.j]);
      k.push([tile.i - 1, tile.j]);
      k.push([tile.i, tile.j + 1]);
      k.push([tile.i, tile.j - 1]);


      for(let K of k){
        if(boat.tiles[K] && !stack[K] && !chunks[chunkIndex][K]){
          stack[K] = boat.tiles[K];
        }
      }
      chunks[chunkIndex][key] = stack[key];
      delete stack[key];
    }
    skeys = Object.keys(stack);
    slen = skeys.length;
  }

  for(let key in boat.tiles){
    boat.tiles[key].flag = false;
  }
  for(let chunk of chunks){
    for(let key in chunk){
      boat.tiles[key].flag = true;
    }
  }
}

if(chunks.length > 1){
  for(let chunk of chunks){
    let ckeys = Object.keys(chunk);
    clen = ckeys.length;
    if(clen <= 0){
      continue;
    }
    let startTile = chunk[ckeys[0]];
    let newBoat = new Boat(boat.x + startTile.i, boat.y + startTile.j);
    for(let key in chunk){
      let tile = chunk[key];
      newBoat.addBoatTile(boat.x + tile.i, boat.y + tile.j);
    }
    newBoat.index = boats.length;
    boats.push(newBoat);
  }
  boats.splice(I, 1);
  for(let i = 0; i < boats.length; i++){
    boats[i].index = i;
  }
}
console.log(boats.length);

}


/**
* @function drawBoat renders a boat to the canvas
* @returns {void}
* @author James
*  James is here!
*  Lets start with drawing the new boats instead of the lawn chairs
*  I'm gonna try to make a 1 tile boat here:
*  This code is straight from chat gpt
*  I'm gonna try to make it smaller and map it to a tile. 
*/
function drawBoat() {
  // basic boat shape v1.0
  let bh = 20; // boat height
  // front face
  fill("#65350f");
  beginShape();
  vertex(-10 / 16 * tw, -2 / 16 * th); // 0
  vertex(-10 / 16 * tw, -2 / 16 * th - bh); // 0^
  vertex(1 / 8 * tw, 5 / 8 * th - bh); // 3^
  vertex(1 / 8 * tw, 5 / 8 * th); // 3
  endShape();

  // side face
  fill("#3c280d")
  beginShape();
  vertex(10 / 16 * tw, 2 / 16 * th); // 2
  vertex(10 / 16 * tw, 2 / 16 * th - bh); // 2^
  vertex(1 / 8 * tw, 5 / 8 * th - bh); // 3^
  vertex(1 / 8 * tw, 5 / 8 * th); // 3
  endShape();

  // top face
  fill("#3f301d")
  beginShape();
  vertex(-10 / 16 * tw, -2 / 16 * th - bh); // 0
  vertex(-1 / 8 * tw, -5 / 8 * th - bh); // 1
  vertex(10 / 16 * tw, 2 / 16 * th - bh); // 2
  vertex(1 / 8 * tw, 5 / 8 * th - bh); // 3
  endShape();
}
