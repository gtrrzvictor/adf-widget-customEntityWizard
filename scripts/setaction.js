var session = require('./utils/session-id'),
    registerWidget = require('./utils/registerWidget'),
    reader = require('./utils/read-config-stdin');

reader.setaction(function(config) {
    session.getSessionId(config, function(sessionId) {
        registerWidget.setAction(config, sessionId);
    });
});