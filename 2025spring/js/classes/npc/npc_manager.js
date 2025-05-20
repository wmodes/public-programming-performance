const MAX_ENTITIES = 300;

class NpcManager {
    constructor() {
        this.entities = {};
        this.counter = 0;
        this.loaded_ids = []
    }

    spawnEntity(entity) {
        if (this.entities.length >= MAX_ENTITIES) {
            this.entities[this.loaded_ids[0]] = undefined
            this.loaded_ids.shift()
        }

        var id = this.counter++;
        entity.id = id;

        this.entities[id] = entity;
        this.loaded_ids.push(id)

        return id;
    }

    draw(p, camera_offset) {
        for (let entity_id of this.loaded_ids) {
            this.entities[entity_id].draw(p, camera_offset);
        }
    }

    update(world) {
        for (let entity_id of this.loaded_ids) {
            this.entities[entity_id].update(world);
        }        
    }

    removeEntity(id) {
        this.entities[id] = id
        var idx = this.loaded_ids.indexOf(id)
        if (idx == -1) return
        
        this.loaded_ids.splice(idx, 1)
    }
}