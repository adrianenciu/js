/**
 * Prevent recursive loading in the module system by keeping track of which modules are currently being loaded
 * Instead of returning the exposed value, we need the module to export its interface by modifying an object, allowing it then to have temporary module attributes and values before returning from initialisation.
 */
var modules = (function() {
    var modules = {};

    function define(name, fn) {
        if (modules[name])
            throw Error('A module named ' + name + ' is already defined');
        var module = {
            exports: {},
            fn: fn,
            executed: false
        };
        modules[name] = module;
    }

    function require(name) {
        var module = modules[name];
        if (!module)
            throw new Error('Module ' + name + ' not found');
        if (!module.executed) {
            module.executed = true;
            module.fn.call(module, module, module.exports);
        }
        return module.exports;
    }
    return {
        define: define,
        require: require
    };
}());

modules.define('a', function(module, exports) {
    exports.array = ['a'];
    modules.require('b');
});

modules.define('b', function(module) {
    var c = modules.require('c');
    c.push('b');
    module.exports = c;
});

modules.define('c', function(module) {
    var a = modules.require('a');
    a.array.push('c');
    module.exports = a.array;
});

var a = modules.require('a');
console.log(a);
