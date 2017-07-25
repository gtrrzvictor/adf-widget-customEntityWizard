var request = require('request'),
    fs = require('fs'),
    nameWidget = require('../../package.json').name;

module.exports.register = function(config, sessionId) {
    var post_req = createRequest('POST', sessionId, config, nameWidget);
    var form = createForm(post_req);
    form.append('name', nameWidget);
    form.append('actions', normalizeActions(config).actions);
}

module.exports.update = function(config, sessionId) {
    var put_req = createRequest('PUT', sessionId, config, nameWidget);
    createForm(put_req).append('actions', normalizeActions(config).actions);
}

module.exports.delete = function(config, sessionId) {
    createRequest('DELETE', sessionId, config, nameWidget).end();
}

module.exports.setAction = function(config, sessionId) {
    var requestConfig = {
        url: 'http://' + config.host + ':' + config.port + '/api/workspaces/' + config.workspace + '/widgetByAction/' + config.actionName,
        headers: {
            "Cookie": [sessionId]
        }
    };
    Request.call(request.post(requestConfig)).form().append('widgetName', config.widgetName);
}

function normalizeActions(config) {
    //Remove all whitespaces
    config.actions = config.actions.replace(/ /g, '');
    return config;
}

function createForm(request) {
    var form = request.form();
    form.append('bundle', fs.createReadStream(process.cwd() + '/build/bundle.js'));
    form.append('vendor', fs.createReadStream(process.cwd() + '/build/vendor.bundle.js'));
    return form;
}

function createRequest(type, sessionId, config, nameWidget) {
    var requestConfig = {
        url: 'http://' + config.host + ':' + config.port + '/api/wiwi/' + config.domain + '/widgets',
        headers: {
            "Cookie": [sessionId]
        }
    };
    return {
        'POST': function() {
            return Request.call(request.post(requestConfig));
        },
        'PUT': function() {
            requestConfig.url = requestConfig.url + "/" + nameWidget;
            return Request.call(request.put(requestConfig));
        },
        'DELETE': function() {
            requestConfig.url = requestConfig.url + "/" + nameWidget;
            return Request.call(request.delete(requestConfig));
        }
    }[type]();

}

function Request() {
    var str = "";
    this.on('response', function(res) {
        console.log('#### RESPONSE ####');
        console.log('StatusCode:' + res.statusCode);
        if (res.statusCode === 201)
            console.log('Location:' + res.headers['location']);
    });
    this.on('data', function(chunk) {
        str += chunk;
    });
    this.on('end', function() {
        console.log(str);
    });
    return this;
}