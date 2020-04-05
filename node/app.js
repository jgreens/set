const users = require('./users');
const games = require('./games');

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

const getLobbyList = () => {
    const nicknames = users.getInactiveUsers().map(user => user.nickname);
    const allGames = games.getAllGames();

    return {
        nicknames,
        games: allGames,
    };
};

module.exports = {
    createUser,
    deleteUser,
    getUserNickname,
    getLobbyList,
};
