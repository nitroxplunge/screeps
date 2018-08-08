var roleAttacker = {
    
    construct: function(availableEnergy) {
        const requiredBody = [ATTACK, TOUGH, MOVE, MOVE];
        const requiredCost = 190;
        const additionBody = [ATTACK, TOUGH, MOVE, MOVE];
        const additionCost = 190;

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
        var target = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
        if (target) {
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            } else {
                creep.say("xd", true);
            }
        } else {
            creep.moveTo(Game.flags.attack, {visualizePathStyle: {stroke: '#ff0000'}});
        }
        
    }
};

module.exports = roleAttacker;