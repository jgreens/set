const { uniqueNamesGenerator, colors, animals } = require('unique-names-generator');

const generateNickname = () => {
    return uniqueNamesGenerator({
        dictionaries: [ colors, animals, ],
        length: 2,
    });
};

let clients = {};

const addClient = id => {
    if (clients[id]) {
        console.error(`Cannot add client with id ${id} - client already exists`);
        return;
    }

    const client = {
        id,
        nickname: generateNickname(),
    };

    clients[id] = client;

    console.log(`Created client '${client.nickname}'`);
};

const deleteClient = id => {
    if (!clients[id]) {
        console.error(`Cannot remove client with id ${id} - client does not exist`);
        return;
    }

    // TODO: Clean up user from games

    const nickname = clients[id].nickname;

    delete clients[id];

    console.log(`Deleted client '${nickname}'`);
};

const getClient = id => {
    if (!clients[id]) {
        console.error(`Cannot get client with id ${id} - client does not exist`);
        return;
    }

    return clients[id];
};

const getInactiveClients = () => {
    const inactiveClients = Object.values(clients).filter(client => !client.gameId);
    return inactiveClients;
};

module.exports = {
    addClient,
    deleteClient,
    getClient,
    getInactiveClients,
};
