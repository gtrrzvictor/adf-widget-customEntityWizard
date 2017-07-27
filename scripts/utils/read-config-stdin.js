var merge = require('merge');
var stdin = process.openStdin();

var defaults = {
    host: '127.0.0.1',
    meta: 'meta-widget.json',
    port: '3000'
}

var putpost_config = {
    meta: 'Meta File (meta-widget.json):'
}

var delete_config = {
    host: 'Type opengate-ux host (localhost):',
    port: 'Type web port (3000):',
    domain: "Type your domain:",
    user: "Type your user name:",
    password: "Type your password:"
}

var setaction_config = {
    workspace: 'Type opengate-ux workspace identifier:',
    actionName: 'Type the action name:',
    widgetName: "Type the widget name:"
}

module.exports.post = function(cb) {
    var _labels = merge(putpost_config, delete_config);
    var keys = Object.keys(_labels).reverse();
    readNextKey(keys, _labels, {}, cb);
};

module.exports.delete = function(cb) {
    var keys = Object.keys(delete_config).reverse();
    readNextKey(keys, delete_config, {}, cb);
};

module.exports.setaction = function(cb) {
    var _labels = merge(setaction_config, delete_config);
    var keys = Object.keys(_labels).reverse();
    readNextKey(keys, _labels, {}, cb);
};

function readNextKey(keys, labels, config, cb) {
    var key = keys.pop();
    if (key === "password") {
        hidden(labels[key], function(password) {
            valueTyped(password);
        });
    } else {
        console.log(labels[key]);
        stdin.addListener("data", function(d) {
            // note:  d is an object, and when converted to a string it will
            // end with a linefeed.  so we (rather crudely) account for that  
            // with toString() and then trim() 
            valueTyped(d.toString().trim());
        });
    }

    function valueTyped(value) {
        stdin.removeAllListeners('data');
        if (value.length === 0) {
            value = defaults[key];
        }
        config[key] = value;
        if (keys.length > 0) {
            readNextKey(keys, labels, config, cb);
        } else {
            process.stdin.unref();
            cb(config);
        }
    }
}

function hidden(query, callback) {
    var readline = require('readline');
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    process.stdin.on("data", function(char) {
        char = char + "";
        switch (char) {
            case "\n":
            case "\r":
            case "\u0004":
                stdin.pause();
                break;
            default:
                process.stdout.write("\033[2K\033[200D" + query + Array(rl.line.length + 1).join("*"));
                break;
        }
    });
    rl.question(query, function(value) {
        rl.history = rl.history.slice(1);
        callback(value);
    });
}