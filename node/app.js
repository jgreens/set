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

const getClientNickname = id => {
    const client = clients.getClient(id);
    if (!client) {
        return 'user';
    }

    return client.nickname;
};

const lobbyList = () => {
    const users = clients.getInactiveClients();
    const games = games.getAllGames();

    return {
        users,
        games,
    };
};

module.exports = {
    clientConnect,
    clientDisconnect,
    getClientNickname,
    lobbyList,
};
