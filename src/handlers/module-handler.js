const path = require('path');
const Module = require('../modules/module-class');
const fs = require('fs');

class ModuleHandler {
    constructor(bot) {
        this.bot = bot;
        this.modules = [];
        this.modulesFolder = path.resolve(__dirname, '../modules');

        this.loadAllModules();
        //TODO: Run preInit() on all loaded modules?
    }

    init() {
        //TODO: Run init() on all loaded modules?
    }

    getModule(modId) {
        return this.modules.find(mod => mod.id === modId);
    }

    validateModule(ModClass) {
        if (!(ModClass.prototype instanceof Module)) { return 'not a Module class'; }
        //TODO: Check for duplicate module?
        return '';
    }

    loadModule(id, skipCheck = false) {
        const modFolder = path.resolve(this.modulesFolder, id);

        if (!skipCheck && !fs.statSync(modFolder).isDirectory()) {
            throw `No module '${id}' found`;
        }

        const ModClass = require(modFolder);
        const check = this.validateModule(ModClass);
        if (check) {
            throw `Error validating module '${id}': ${check}`;
        }

        const mod = new ModClass(this, id);

        this.modules.push(mod);
        this.bot.log(`Loaded module: ${id}`);
    }

    loadAllModules() {
        fs.readdirSync(this.modulesFolder).forEach(file => {
            try {
                if (file.startsWith('_')) {
                    this.bot.debug(`Skipped module '${file}' for preceding underscore`);
                    return;
                }

                const modFolder = path.resolve(this.modulesFolder, file);
                if (!fs.statSync(modFolder).isDirectory()) { return; }

                this.loadModule(file, true);
            } catch (error) {
                this.bot.error(`Failed to load module '${file}': ${error}`);
            }
        });
    }

    runAll(methodName, params) {
        if (!(params instanceof Array)) {
            params = [params];
        }

        this.modules.forEach(mod => {
            if (mod[methodName]) {
                try {
                    mod[methodName].apply(mod, params);
                } catch (err) {
                    this.bot.error(`Failed to run ${methodName} on ${mod.id}: ${err}`);
                    process.exit(1);
                }
            }
        });
    }
}

module.exports = ModuleHandler;
