const clients = require('./clients');
const games = require('./games');

const clientConnect = id => {
    clients.addClient(id);
};

const clientDisconnect = id => {
    const gameId = clients.getClient(id).gameId;
    if (gameId) {
        games.removeUserFromGame(gameId, id);
    }

    clients.deleteClient(id);
};

module.exports = {
    clientConnect,
    clientDisconnect,
};
