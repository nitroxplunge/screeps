var roleMiner = {
    
    construct: function(availableEnergy) {
        const requiredBody = [WORK, WORK, CARRY, MOVE]
        const requiredCost = 300;
        const additionBody = [WORK, WORK, CARRY, MOVE];
        const additionCost = 300;

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
        if (creep.memory.sourcenum == null && !creep.spawning) {
            creep.memory.id = creep.id;
            var minersList = Game.spawns['Spawn1'].memory.miners;
            var found = false;
            for (var i = 0; i < minersList.length && !found; i++) {
                if (minersList[i] == null) {
                    Game.spawns['Spawn1'].memory.miners[i] = creep.id;
                    creep.memory.sourcenum = i;
                    found = true;
                }
            }
        }
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.carry.energy < creep.carryCapacity) {
            if(creep.harvest(sources[creep.memory.sourcenum]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.sourcenum]);
            } else if (!creep.spawning) {
                creep.memory.atSource = true;
            }
        }
    }
};

module.exports = roleMiner;