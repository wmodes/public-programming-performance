const TILE_OFFSET = {
    XAVIER: 0,
    NORMAL: 8-56
}

class Tile {
    constructor(p, world)
    {
        this.p = p;
        this.world = world;
        this.offset;
        this.width;
        this.sprite;
        this.type;
        this.surface;
        this.image = [];
        
    }

    changeAttributes(type)
    {
        this.setType(type);
        this.setOffset(type);
        this.setImage(this.world.tileTypes[type]);
        this.surface = type == "OCEAN" ? "WATER" : "LAND";
        this.subtype = subtype % this.image.length;
    }

    draw(y = 0, tileOffsetX = 0)
    {
        this.p.noStroke();
        this.world.p.image(this.image[0], -30, -24 + y, 60, 50, tileOffsetX, 56 + this.offset, 32, 24); //"[0]": change when more tiles are added
    
        if (this.sprite) {
            this.world.p.image(this.sprite, -30, -30 + y, 60, 60);
        }
    }



    getType()
    {
        return this.type;
    }

    isLand()
    {
        return this.surface == "LAND" ? true : false;
    }

    setType(type)
    {
        this.type = type;
    }

    setOffset(type)
    {
        this.offset = type == "SAND" || type == "GRASS" ? TILE_OFFSET.XAVIER : TILE_OFFSET.NORMAL;
    }

    setImage(image)
    {
        this.image = image;
    }
}