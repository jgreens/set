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

    sendLobbyUpdate();
    sendGameUpdate(gameId);

    return true;
};

const leaveGame = (gameId, userId) => {
    if (!games.removeMemberFromGame(gameId, userId)) {
        console.error(`Error removing player with id ${userId} from game with id ${gameId}`);
        return false;
    }

    users.getUser(userId).gameId = null;

    sendGameUpdate(gameId);

    if (games.gameIsEmpty(gameId)) {
        games.deleteGame(gameId);
    }

    sendLobbyUpdate();

    return true;
};

const triggerGameUpdate = gameId => {
    sendGameUpdate(gameId);
};

const startGame = (gameId, userId) => {
    const result = games.startGame(gameId, userId);

    if (result) {
        sendGameUpdate(gameId);
        sendLobbyUpdate();
    }

    return result;
};

const evaluateSet = (gameId, userId, cards) => {
    const rc = games.evaluateSet(gameId, userId, cards);

    let result = {};
    switch (rc) {
        case -2:
            result.message = 'Cards are not on the board';
            result.success = false;
            break;
        case -1:
            result.message = 'Cards are formatted incorrectly';
            result.success = false;
            break;
        case 0:
            result.message = 'Invalid set';
            result.success = false;
            break;
        case 1:
            result.message = 'Valid set; game not yet finished';
            result.success = true;
            break;
        case 2:
            result.message = 'Valid set; game finished';
            result.success = true;
            break;
        default:
            result.message = 'Unknown return code from set evaluation';
            result.success = false;
            break;
    }

    if (rc >= 0) {
        sendGameUpdate(gameId);
    }

    return result;
};

const sendGameFeedMessage = (gameId, userId, type, message) => {
    games.addFeedMessage(gameId, userId, type, message);
    sendGameUpdate(gameId);
};

const getGameData = gameId => {
    const gameData = games.getGameData(gameId);

    gameData.owner = users.getUser(gameData.owner).nickname;

    let scoresByNickname = {};
    Object.keys(gameData.scores).forEach(userId => {
        scoresByNickname[users.getUser(userId).nickname] = gameData.scores[userId];
    });
    gameData.scores = scoresByNickname;

    gameData.feed = gameData.feed.map(message => ({
        username: users.getUser(message.userId).nickname,
        msgType: message.type,
        data: message.data,
    }));

    return gameData;
};

const sendLobbyUpdate = () => {
    const data = getLobbyData();

    broadcast(data.clients, 'LOBBY UPDATE', data);
};

const sendGameUpdate = gameId => {
    const data = getGameData(gameId);

    broadcast(data.members, 'GAME UPDATE', data);
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
    triggerGameUpdate,
    startGame,
    sendGameFeedMessage,
    evaluateSet,
};
