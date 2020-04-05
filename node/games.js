// Game structure:
// {
//     id: <some unique id>,
//     members: [<user id>],
// }

let games = {};

const getAllGames = () => {
    return Object.values(games);
};

const addMemberToGame = (id, clientId) => {
    if (!games[id]) {
        console.error(`Cannot add client to game with id ${id} - game does not exist`);
        return;
    }

    games[id].members.push(clientId);
};

const removeMemberFromGame = (id, clientId) => {
    if (!games[id]) {
        console.error(`Cannot remove client from game with id ${id} - game does not exist`);
        return;
    }

    const memberIndex = games[id].members.indexOf(clientId);

    if (memberIndex < 0) {
        console.error(`Cannot remove client with id ${clientId} from game with id ${id} - client not in game`);
        return;
    }

    games[id].members.splice(memberIndex, 1);
};

module.exports = {
    addMemberToGame,
    removeMemberFromGame,
};
