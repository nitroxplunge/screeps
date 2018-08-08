var roleHauler = {

    construct: function(availableEnergy) {
        const requiredBody = [WORK, CARRY, CARRY, MOVE, MOVE];
        const requiredCost = 300;
        const additionBody = [CARRY, CARRY, MOVE];
        const additionCost = 150;

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
        //console.log(creep.signController(creep.room.controller, "EpicScreeps - v0.1"));
        
        if (creep.memory.harvesting) {
            try {
                var miner = Game.getObjectById(Game.spawns['Spawn1'].memory.miners[1]);
                if (miner.memory.atSource) {
                    var transfer = miner.carry.energy;
                    if (creep.carryCapacity - creep.carry.energy <  miner.carry.energy) {
                        transfer = creep.carryCapacity - creep.carry.energy;
                    }
                    if(miner.transfer(creep, RESOURCE_ENERGY, transfer) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(miner, {visualizePathStyle: {stroke: '#ff0000'}});
                    }
                } else {
                    var sources = creep.room.find(FIND_SOURCES);
                    if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
            catch(error) {
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.harvesting = false;
            }
        } else {
            const targetlist = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_CONTAINER, STRUCTURE_TOWER];

            let targets = _(creep.room.find(FIND_MY_STRUCTURES))
                .filter(s => targetlist.includes(s.structureType))
                .sortBy(s => targetlist.indexOf(s.structureType))
                .value();

            if(targets.length > 0) {
                var target = _.filter(targets, t => t.energy < t.energyCapacity)[0];
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            if (creep.carry.energy == 0) {
                creep.memory.harvesting = true;
            }
        }
    }
};

module.exports = roleHauler;