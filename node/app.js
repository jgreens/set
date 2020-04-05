const users = require('./users');
const games = require('./games');
const socket = require('./socket');

const createUser = id => {
    return users.addUser(id);
};

const deleteUser = id => {
    const gameId = users.getUser(id).gameId;
    if (gameId) {
        games.removeUserFromGame(gameId, id);
    }

    return users.deleteUser(id);
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

module.exports = {
    createUser,
    deleteUser,
    getUserNickname,
    getLobbyData,
};
