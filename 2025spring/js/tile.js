class Tile {
    constructor(p)
    {
        this.p = p;
        this.height;
        this.width;
        this.sprite;
        this.type; // either ocean or island (maybe biomes too later)
        this.image = [];
    }

    draw(i, j)
    {
        this.p.noStroke();
        
        // Might want some of this old code for changing the water color, but otherwise dont need
        /*
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
        */
        
        this.p.push();
        /*
        this.p.beginShape();
        this.p.vertex(-this.tw, 0);
        this.p.vertex(0, this.th);
        this.p.vertex(this.tw, 0);
        this.p.vertex(0, -this.th);
        this.p.endShape(this.p.CLOSE);
        */
        //this.p.image();

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
}