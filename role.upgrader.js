var roleUpgrader = {

    construct: function(availableEnergy) {
        const requiredBody = [CARRY, MOVE, WORK];
        const requiredCost = 200;
        const additionBody = [WORK];
        const additionCost = 100;

        var constructedBody = requiredBody;
        var energyUsed = requiredCost;
        while (energyUsed + additionCost + 300 < availableEnergy) {
            constructedBody.push.apply(constructedBody, additionBody);
            energyUsed += additionCost;
        }

        return constructedBody;
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.action == 'transferring') {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTROLLER);
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            if (creep.carry.energy == 0) {
                creep.memory.action = 'harvesting';
            }
        }
        else if (creep.memory.action == 'harvesting') {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.action = 'transferring';
            }
        } else {
            creep.memory.action = 'harvesting';
        }
    }
};

module.exports = roleUpgrader;