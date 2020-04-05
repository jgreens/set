// Game structure:
// {
//     id: <some unique id>,
//     members: [<user id>],
// }

const games = {};

const getAllGames = () => {
    return Object.values(games);
};

const addMemberToGame = (id, userId) => {
    if (!games[id]) {
        console.error(`Cannot add user to game with id ${id} - game does not exist`);
        return;
    }

    games[id].members.push(userId);
};

const removeMemberFromGame = (id, userId) => {
    if (!games[id]) {
        console.error(`Cannot remove user from game with id ${id} - game does not exist`);
        return;
    }

    const memberIndex = games[id].members.indexOf(userId);

    if (memberIndex < 0) {
        console.error(`Cannot remove user with id ${userId} from game with id ${id} - user not in game`);
        return;
    }

    games[id].members.splice(memberIndex, 1);
};

module.exports = {
    getAllGames,
    addMemberToGame,
    removeMemberFromGame,
};
