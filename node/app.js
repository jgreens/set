const users = require('./users');
const games = require('./games');
const socket = require('./socket');

let broadcast;

const connectBroadcaster = broadcaster => {
    broadcast = broadcaster;
};

const createUser = id => {
    const user = users.addUser(id);

    sendLobbyUpdate();

    return user;
};

const deleteUser = id => {
    const gameId = users.getUser(id).gameId;
    if (gameId) {
        games.removeUserFromGame(gameId, id);
    }

    const result = users.deleteUser(id);

    sendLobbyUpdate();

    return result;
};

const getUserNickname = id => {
    const user = users.getUser(id);
    if (!user) {
        return 'unnamed user';
    }

    return user.nickname;
};

const getLobbyData = () => {
    const inactiveUsers = users.getInactiveUsers();
    const allGames = games.getAllGames();

    return {
        clients: inactiveUsers.map(user => user.id),
        users: inactiveUsers.map(user => user.nickname),
        games: allGames,
    };
};

const createGame = (creatorId, name) => {
    const id = games.createGame(name, creatorId);

    if (!games.addMemberToGame(id, creatorId)) {
        console.error(`Error adding initial player with id ${creatorId} to game with id ${id}`);
    } else {
        users.getUser(creatorId).gameId = id;
    }

    return { id };
};

const sendLobbyUpdate = () => {
    const data = getLobbyData();

    broadcast(data.clients, 'LOBBY UPDATE', data);
};

const sendGameUpdate = () => {
    const data = getGameData();

    broadcast(data.clients, 'GAME UPDATE', data);
};

module.exports = {
    connectBroadcaster,
    createUser,
    deleteUser,
    getUserNickname,
    getLobbyData,
    createGame,
};
