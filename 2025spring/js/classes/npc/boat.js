const BUTT_OFFSET_X = 60;
const BUTT_OFFSET_Y = -82;
const SAIL_OFFSET_X = 28;
const SAIL_OFFSET_Y = -64;
class Boat extends PathfindingNPC {
  constructor(boatParts, x, y, speed) {
    super(x, y, speed);
    this.type = "boat";
    this.front = boatParts[0];
    this.midSail = boatParts[1];
    this.mid = boatParts[2];
    this.butt = boatParts[3];
    this.explosion = boatParts[4];
    this.debris1 = boatParts[5];
    this.debris2 = boatParts[6];
    this.debris3 = boatParts[7];
    this.level = 1;
    this.speed = speed;
    this.isExploding = false;
    this.explodeTime = 0;
    this.elapsedTime = 0;
    this.delete = false;

    this.prevX = x;
    this.prevY = y;
  }
  //
  pickObjective() {
    return [
      Math.floor(this.x) + get_random_int_between_inclusive(-20, 20),
      Math.floor(this.y) + get_random_int_between_inclusive(-20, 20),
    ];
  }

  isTileTraversable(tile) {
    return !tile.isLand();
  }

  draw(p, [camera_x, camera_y]) {
    // Note: in its current implementation, the tile that the boat spawns on will
    // have the boat FRONT on it, and the middle/end pieces will be placed behind it.
    // For example: if you place a boat at [0,0], the boat front will be placed at that point,
    // and the following pieces will be placed at an offset from that tile.

    // function getWaterWaveOffset was copied from island.js
    // which was written by WontonsofDMG
    function getWaterWaveOffset(i, j, p) {
      // Use frameCount if available, else fallback to millis
      let t =
        typeof p.frameCount !== "undefined" ? p.frameCount : p.millis() * 0.06;
      // Sine wave for smooth up/down motion
      return Math.sin(t * 0.05 + i * 0.7 + j * 0.9) * 4;
    }

    let [screen_x, screen_y] = p.worldToScreen(
      [this.x, this.y],
      [camera_x, camera_y]
    );
    //let tile;
    //let waveOffset = 0;
    //console.log(this.world.tileAt(Math.round(screen_x), Math.round(screen_y)));
    //if (this.world){
      //tile = this.world.tileAt(this.x, this.y);
      //if (tile)
        //waveOffset = tile.height;
    //}
    let waveOffset = getWaterWaveOffset(this.x, this.y, p);

    p.push();
    p.translate(0 - screen_x, screen_y);
    p.imageMode(p.CENTER);

    // if the boat is exploding, play the explosion animation
    // and then set this.delete to true, to be used in update()
    if (this.isExploding) {
      this.elapsedTime += this.explodeTime;
      if (this.elapsedTime > 2400000) this.delete = true;
      else if (this.elapsedTime > 600000) p.image(this.debris3, 0, 0, 64, 64);
      else if (this.elapsedTime > 400000) p.image(this.debris2, 0, 0, 64, 64);
      else if (this.elapsedTime > 200000) p.image(this.debris1, 0, 0, 64, 64);
      else {
        p.image(this.explosion, 0, 0, 64, 64);
      }
      this.explodeTime = p.millis() - this.explodeTime;
    } else {
      // display boat as normal
      if (this.prevX > this.x || this.prevY < this.y) p.scale(-1, 1); // flips image if moving right
      p.image(this.butt, BUTT_OFFSET_X, BUTT_OFFSET_Y + waveOffset, 64, 128);
      p.image(this.midSail, SAIL_OFFSET_X, SAIL_OFFSET_Y + waveOffset, 64, 128);
      p.image(this.front, 0, 0 + waveOffset, 64, 64);
    }

    p.pop();

    this.prevX = this.x;
    this.prevY = this.y;
  }

  update(world) {
    super.update(world);

    if (this.delete === true) world.npc_manager.removeEntity(this.id);

    let tile = world.tileAt(Math.round(this.x), Math.round(this.y));
    if (tile == undefined)
      return;
    
    if (tile.type !== "OCEAN") {
      if (this.isExploding === false) world.soundEngine.playExplosion();
      this.speed = 0;
      this.isExploding = true;
    }

    world.npc_manager.forEachNpc((npc) => {
      if (npc.type && npc.type == "boat") {
        let distance = Math.sqrt((this.x - npc.x) ** 2 + (this.y - npc.y) ** 2);
        if (distance <= 1 && this != npc) {
          if (this.isExploding === false) world.soundEngine.playExplosion();
          this.isExploding = true;
          this.speed = 0;
          npc.speed = 0;
          this.explodeTime = world.p.millis();
        }
      }
    });
  }
}
