var session = require('./utils/session-id'),
    registerWidget = require('./utils/registerWidget'),
    reader = require('./utils/read-config-stdin');

reader.post(function(config) {
    session.getSessionId(config, function(sessionId) {
        registerWidget.register(config, sessionId);
    });
});