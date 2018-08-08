var roleBuilder = {

    construct: function(availableEnergy) {
        const requiredBody = [WORK, CARRY, MOVE, MOVE];
        const requiredCost = 250;
        const additionBody = [WORK, CARRY, MOVE, MOVE];
        const additionCost = 250;

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
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_ROAD ||
                        structure.structureType == STRUCTURE_WALL ||
                        structure.structureType == STRUCTURE_RAMPART ||
                        structure.structureType == STRUCTURE_TOWER);
                }
            }); 
            if(targets.length > 0) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ff00ff'}});
                } else {
                    creep.repair(targets[0]);
                }
            } else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_WALL ||
                            structure.structureType == STRUCTURE_RAMPART ||
                            structure.structureType == STRUCTURE_ROAD);
                    }
                });
                if (targets.length > 0) {
                    var targetNum = 0;
                    var lowestHits = 9007199254740991;
                    for (var i = 0; i < targets.length; i++) {
                        var thisHits = targets[i].hits;
                        if (targets[i].structureType == STRUCTURE_RAMPART) {
                            thisHits *= 0.5;
                        }
                        var isWorthRepairing = true;
                        if (targets[i].structureType == STRUCTURE_ROAD && thisHits > 3000) {
                            isWorthRepairing = false;
                        }
                        if (thisHits < lowestHits && isWorthRepairing) {
                            targetNum = i;
                            lowestHits = thisHits;
                        }
                    }
                    if(creep.repair(targets[targetNum]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[targetNum], {visualizePathStyle: {stroke: '#00ff00'}});
                    }
                }
            }
        }
        else {
            try {
                var miner = Game.getObjectById(Game.spawns['Spawn1'].memory.miners[0]);
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
                    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
            catch(error) {
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.building = true;
            }
        }
    }
};

module.exports = roleBuilder;