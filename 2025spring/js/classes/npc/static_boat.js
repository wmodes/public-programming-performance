// Testing placing boats on the water

class StaticBoat {
    constructor(p) {
        this.p = p;
        //this.image = p.loadImage('../assets/tiles/boat_middle.png');
    }

    draw() {
        this.p.push();
        this.p.fill(169, 117, 79);
        this.p.ellipse(0, 0, 20, 10);
        //this.p.imageMode(this.p.CENTER);
        //this.p.image(this.image, 0, 0);
        this.p.pop();
    }
}

// Drawing an image doesn't work for reasons I don't understand, but it's able to draw an ellipse!