const momet = require('moment');

function formatMessage(username, text) {
    return {
        username,
        text,
        time: momet().format('h:mm a')

    }

}

module.exports = formatMessage;