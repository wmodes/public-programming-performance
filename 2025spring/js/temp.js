function draw([world_x, world_y], [camera_x, camera_y]){
    let [screen_x, screen_y] = p.worldToScreen(
        [world_x, world_y],
        [camera_x, camera_y]
    );
    p.push();
    p.translate(0 - screen_x, screen_y);
    
    ///

    p.circle(0,0,10);
    ///

    p.pop();

}



p.drawTile(p.tileRenderingOrder([x + world_offset.x, y - world_offset.y]), [
    camera_offset.x,
    camera_offset.y
  ]);


p.drawTile = function([world_x, world_y], [camera_x, camera_y]) {
let [screen_x, screen_y] = p.worldToScreen(
    [world_x, world_y],
    [camera_x, camera_y]
);
p.push();
p.translate(0 - screen_x, screen_y);
if (w.p3_drawTile) {
    w.p3_drawTile(world_x, world_y, -screen_x, screen_y);
    p.print([world_x, world_y, -screen_x, screen_y])
}
p.pop();
}


function p3_drawTile(i, j) {
this.p.print([i,j])

this.p.noStroke();
let boatWidth = 5;


let onBoat = false;
if (j < -boatWidth || j > boatWidth) {
    // water
    let t = this.p.millis()/1000.0;
    this.p.fill(100, 150, 233, 64+256*this.p.noise(-t+i/5,j/5,t));
    
} else {
    onBoat = true;
    if (j == -boatWidth || j == boatWidth) {
    
    this.p.translate(0,-this.th/2);

    this.p.fill(this.trimColor);
    } else {
    this.p.fill(200);
    
    }
    

}


this.p.push();

this.p.beginShape();
this.p.vertex(-this.tw, 0);
this.p.vertex(0, this.th);
this.p.vertex(this.tw, 0);
this.p.vertex(0, -this.th);
this.p.endShape(this.p.CLOSE);

if(onBoat) {
    let n = this.clicks[[i, j]] | 0;
    if (n % 2 == 1) {
    this.p.fill(0, 0, 0, 32);
    this.p.rect(0, 0, 10, 5);
    this.p.translate(0, -10);
    this.p.fill(0, 0, 0, 128);
    this.p.rect(0, 0, 10, 10);
    }
}


this.p.pop();
}