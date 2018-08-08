function distance(pos1, pos2) {
    return Math.sqrt(Math.pow((pos1.x - pos2.x), 2) + Math.pow((pos1.y - pos2.y), 2));
}

var roleBuilder = {
    
    construct: function(availableEnergy) {
        const requiredBody = [HEAL, ATTACK, TOUGH, MOVE, MOVE, MOVE];
        const requiredCost = 490;
        const additionBody = [HEAL, ATTACK, TOUGH, MOVE, MOVE, MOVE];
        const additionCost = 490;

        var constructedBody = requiredBody;
        var energyUsed = requiredCost;
        while (energyUsed + additionCost + 150 < availableEnergy) {
            constructedBody.push.apply(constructedBody, additionBody);
            energyUsed += additionCost;
        }

        return constructedBody;
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.hits < 200) {
            creep.heal(creep);
        }
        var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (target) {
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            creep.say("Stop attacking, be friendly!", true);
        } else if (creep.ticksToLive <= 150 || creep.memory.renewing) {
            creep.memory.renewing = true;
            if (Game.spawns['Spawn1'].renewCreep(creep) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffffff'}});
            }
            if (creep.ticksToLive >= 1200) {
                creep.memory.renewing = false;
            }
        } else if (!creep.memory.renewing) {
            if (!creep.memory.stationRampart) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_RAMPART);
                    }
                });
                for (var i in targets) {
                    if (!Game.spawns['Spawn1'].memory.defenderStations.includes(targets[i].id)) {
                        creep.memory.stationRampart = targets[i].id;
                        Game.spawns['Spawn1'].memory.defenderStations.push(targets[i].id);
                        break;
                    }
                }
            }
            creep.moveTo(Game.getObjectById(creep.memory.stationRampart));
        }
        
    }
};

module.exports = roleBuilder;