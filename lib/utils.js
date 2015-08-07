/* Exports */
module.exports = {
    getElapsed: function() {
        return parseInt((Date.now() - Date.parse(plug.getPlayback().startTime)) / 1000);
    }
}