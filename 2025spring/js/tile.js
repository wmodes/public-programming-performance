
class Tile {
    constructor(p, world)
    {
        this.p = p;
        this.world = world;
        this.height;
        this.width;
        this.sprite;
        this.type;
        this.surface;
        this.image = [];
        
    }

    changeAttributes(type)
    {
        this.setType(type);
        this.setImage(this.world.tileTypes[type]);
        this.surface = type == "OCEAN" ? "LAND" : "WATER";
    }

    draw(y = 0, tileOffsetX = 0, tileOffsetY = 0)
    {
        this.p.noStroke();
        this.world.p.image(this.image[0], -30, -24 + y, 60, 50, tileOffsetX, 56 + tileOffsetY, 32, 24); //"[0]": change when more tiles are added
    
        if (this.sprite) {
            this.world.p.image(this.sprite, -30, -30 + y, 60, 60);
        }
    }

    setType(type)
    {
        this.type = type;
    }

    getType()
    {
        return this.type;
    }

    isLand()
    {
        return this.surface == "LAND" ? true : false;
    }

    setImage(image)
    {
        this.image = image;
    }

    getType() { return this.type; }
}