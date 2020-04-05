const { uniqueNamesGenerator, colors, animals } = require('unique-names-generator');

const generateNickname = () => {
    return uniqueNamesGenerator({
        dictionaries: [ colors, animals, ],
        length: 2,
    });
};

// User structure:
// {
//     id: <socket id>,
//     nickname: <some nickname>,
//     gameId: <game id> | null | undefined,
// }

let users = {};

const addUser = id => {
    if (users[id]) {
        console.error(`Cannot add user with id ${id} - user already exists`);
        return;
    }

    const user = {
        id,
        nickname: generateNickname(),
    };

    users[id] = user;

    console.log(`Created user '${user.nickname}'`);
};

const deleteUser = id => {
    if (!users[id]) {
        console.error(`Cannot remove user with id ${id} - user does not exist`);
        return;
    }

    // TODO: Clean up user from games

    const nickname = users[id].nickname;

    delete users[id];

    console.log(`Deleted user '${nickname}'`);
};

const getUser = id => {
    if (!users[id]) {
        console.error(`Cannot get user with id ${id} - user does not exist`);
        return;
    }

    return users[id];
};

const getInactiveUser = () => {
    const inactiveUser = Object.values(users).filter(user => !user.gameId);
    return inactiveUser;
};

module.exports = {
    addUser,
    deleteUser,
    getUser,
    getInactiveUser,
};
