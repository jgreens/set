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
        leaveGame(gameId, id);
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

    const lobbyData = {
        clients: inactiveUsers.map(user => user.id),
        users: inactiveUsers.map(user => user.nickname),
        games: allGames.map(game => game.getOverviewData()),
    };

    lobbyData.games.map(game => {
        game.members = game.members.map(id => users.getUser(id).nickname);
        return game;
    });

    return lobbyData;
};

const createGame = (creatorId, name) => {
    const id = games.createGame(creatorId, name);

    joinGame(id, creatorId);

    sendLobbyUpdate();

    return { id };
};

const joinGame = (gameId, userId) => {
    if (!games.addMemberToGame(gameId, userId)) {
        console.error(`Error adding player with id ${creatorId} to game with id ${id}`);
        return false;
    }

    users.getUser(userId).gameId = gameId;

    return true;
};

const leaveGame = (gameId, userId) => {
    if (!games.removeMemberFromGame(gameId, userId)) {
        console.error(`Error removing player with id ${creatorId} from game with id ${id}`);
        return false;
    }

    users.getUser(userId).gameId = null;

    return true;
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
    joinGame,
    leaveGame,
};
