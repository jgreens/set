const users = require('./users');
const games = require('./games');

const createUser = id => {
    return users.addUser(id).nickname;
};

const deleteUser = id => {
    const gameId = users.getUser(id).gameId;
    if (gameId) {
        games.removeUserFromGame(gameId, id);
    }

    users.deleteUser(id);
};

const getUserNickname = id => {
    const user = users.getUser(id);
    if (!user) {
        return 'unnamed user';
    }

    return user.nickname;
};

const lobbyList = () => {
    const users = users.getInactiveUsers();
    const games = games.getAllGames();

    return {
        users,
        games,
    };
};

module.exports = {
    createUser,
    deleteUser,
    getUserNickname,
    lobbyList,
};
