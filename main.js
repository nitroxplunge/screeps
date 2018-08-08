var roleHauler = require('role.hauler');
var roleBuilder = require('role.builder');
var roleMaintainer = require('role.maintainer');
var roleUpgrader = require('role.upgrader');
var roleDefender = require('role.defender');
var roleMiner = require('role.miner');
var roleAttacker = require('role.attacker');

var towerMain = require('tower.main');

var max_haulers = 1;
var max_builders = 1;
var max_maintainers = 1;
var max_upgraders = 1;
var max_defenders = 1;
var max_miners = 0;
var max_attackers = 0;

function distance(pos1, pos2) {
    return Math.sqrt(Math.pow((pos1.x - pos2.x), 2) + Math.pow((pos1.y - pos2.y), 2));
}

module.exports.loop = function() {
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            if (Memory.creeps[i].role == "miner") {
                var minersList = Game.spawns['Spawn1'].memory.miners;
                for (var j in minersList) {
                    console.log(Memory.creeps[i].id);
                    if (minersList[j] == Memory.creeps[i].id) {
                        Game.spawns['Spawn1'].memory.miners[j] = null;
                    }
                }
            }
            delete Memory.creeps[i];
        }
    }

    max_miners = Game.spawns['Spawn1'].room.find(FIND_SOURCES).length;

    var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var maintainers = _.filter(Game.creeps, (creep) => creep.memory.role == 'maintainer');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    var attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');

    var towers = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER);
        }
    });

    console.log(haulers.length + "/" + max_haulers + ' Haulers, ' + builders.length + "/" + max_builders + ' Builders, ' + maintainers.length + "/" + max_maintainers + ' Maintainers, ' + upgraders.length + "/" + max_upgraders + ' Upgraders, ' + miners.length + "/" + max_miners + ' Miners, ' + defenders.length + "/" + max_defenders + ' Defenders, ' + towers.length + ' Tower(s)');

    if (miners.length < max_miners) {
        var newName = 'miner-Spawn1-' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(roleMiner.construct(Game.spawns['Spawn1'].room.energyAvailable), newName,
            {memory: {role: 'miner', atSource: 'false'}});
    }
    if (haulers.length < max_haulers) {
        var newName = 'hauler-Spawn1-' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(roleHauler.construct(Game.spawns['Spawn1'].room.energyAvailable), newName,
            {memory: {role: 'hauler', harvesting: 'true'}});
    }
    if (maintainers.length < max_maintainers) {
        var newName = 'maintainer-Spawn1-' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(roleMaintainer.construct(Game.spawns['Spawn1'].room.energyAvailable), newName,
            {memory: {role: 'maintainer'}});
    }
    if (upgraders.length < max_upgraders) {
        var newName = 'upgrader-Spawn1-' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(roleUpgrader.construct(Game.spawns['Spawn1'].room.energyAvailable), newName,
            {memory: {role: 'upgrader'}});
    }
    if (defenders.length < max_defenders) {
        var newName = 'defender-Spawn1-' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(roleDefender.construct(Game.spawns['Spawn1'].room.energyAvailable), newName,
            {memory: {role: 'defender'}});
    }
    if (builders.length < max_builders) {
        var newName = 'builder-Spawn1-' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(roleBuilder.construct(Game.spawns['Spawn1'].room.energyAvailable), newName,
            {memory: {role: 'builder'}});
    }
    if (attackers.length < max_attackers) {
        var newName = 'innocent-wanderer-Spawn1-' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(roleAttacker.construct(Game.spawns['Spawn1'].room.energyAvailable), newName,
            {memory: {role: 'attacker'}});
    }
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'maintainer') {
            roleMaintainer.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if(creep.memory.role == 'attacker') {
            roleAttacker.run(creep);
        }
    }

    for (var t in towers) {
        towerMain.run(towers[t]);
    }
}