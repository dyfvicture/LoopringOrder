function Config() {
    var ipfsHost = 'localhost'
    var ipfsPort = '5001'
    var ipfsPubSubTopic = 'loopring-orders'

    this.ipfsHost = function() {
        return ipfsHost
    };

    this.ipfsPort = function() {
        return ipfsPort
    }

    this.ipfsPubSubTopic = function() {
        return ipfsPubSubTopic
    }
};
module.exports = Config;