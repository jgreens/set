let games = {};

const addUserToGame = (id, userId) => {
    if (!games[id]) {
        console.error(`Cannot add user to game with id ${id} - game does not exist`);
        return;
    }

    games[id].users.push(userId);
};

const removeUserFromGame = (id, userId) => {
    if (!games[id]) {
        console.error(`Cannot remove user from game with id ${id} - game does not exist`);
        return;
    }

    const userIndex = games[id].users.indexOf(userId);

    if (userIndex < 0) {
        console.error(`Cannot remove user with id ${userId} from game with id ${id} - user not in game`);
        return;
    }

    games[id].users.splice(userIndex, 1);
};

module.exports = {
    addUserToGame,
    removeUserFromGame,
};
