const { v4: uuidv4 } = require('uuid');

const game = (creatorId, gameName) => {
    const id = uuidv4();
    const name = gameName;

    const owner = creatorId;

    let board = [];
    let deck = [];

    let members = [];
    let scores = {};

    let feed = [];

    // 0 - not started; 1 - in progress; 2 - complete
    let status = 0;

    const initDeck = () => {
        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 3; ++j) {
                for (let k = 0; k < 3; ++k) {
                    for (let l = 0; l < 3; ++l) {
                        deck.push([i, j, k, l]);
                    }
                }
            }
        }
    };

    const drawThree = (first, second, third) => {
        if (deck.length < 3) {
            return false;
        }

        if (first < 0 || second < 0 || third < 0) {
            return false;
        }

        if (first > board.length || second >= board.length || third >= board.length) {
            return false;
        }

        board.splice(first, 0, deck.pop());
        board.splice(second, 0, deck.pop());
        board.splice(third, 0, deck.pop());

        return true;
    };

    const getSetCard = (card1, card2) => {
        let setCard = [];

        if (card1[0] === card2[0]) {
            setCard.push(card1[0]);
        } else {
            setCard.push(3 - card2[0] - card1[0]);
        }

        if (card1[1] === card2[1]) {
            setCard.push(card1[1]);
        } else {
            setCard.push(3 - card2[1] - card1[1]);
        }

        if (card1[2] === card2[2]) {
            setCard.push(card1[2]);
        } else {
            setCard.push(3 - card2[2] - card1[2]);
        }

        if (card1[3] === card2[3]) {
            setCard.push(card1[3]);
        } else {
            setCard.push(3 - card2[3] - card1[3]);
        }

        return setCard;
    };

    const arraysEqual = (first, second) => {
        if (first.length !== second.length) {
            return false;
        }

        for (let i = 0; i < first.length; ++i) {
            if (first[i] !== second[i]) {
                return false;
            }
        }

        return true;
    };

    const hasSet = () => {
        for (let i = 0; i < board.length; ++i) {
            for (let j = 0; j < board.length; ++j) {
                if (i === j) {
                    continue;
                }

                const card1 = board[i];
                const card2 = board[j];

                const card3 = getSetCard(card1, card2);

                for (let k = 0; k < board.length; ++k) {
                    if (arraysEqual(board[k], card3)) {
                        return true;
                    }
                }
            }
        }

        return false;
    };

    const parseCard = cardStr => {
        if (cardStr.length !== 4) {
            return -1;
        }

        return [parseInt(cardStr[0]), parseInt(cardStr[1]), parseInt(cardStr[2]), parseInt(cardStr[3])];
    };

    const start = userId => {
        if (owner !== userId) {
            console.warn(`Non-owner user ${userId} attempted to start game ${id}`);
            return false;
        }

        status = 1;
        scores = members.reduce(member, obj => {
            scores[userId] = 0;
        }, {});

        deck.shuffle(() => Math.random() - 0.5);

        drawThree(0, 0, 0);
        drawThree(0, 0, 0);
        drawThree(0, 0, 0);
        drawThree(0, 0, 0);

        while (!hasSet()) {
            drawThree();
        }

        addFeedMessage(userId, "start", null);

        return true;
    };

    const addUser = userId => {
        members.push(userId);

        addFeedMessage(userId, "join", null);
    };

    const removeUser = userId => {
        let index = -1;
        for (let i = 0; i < members.length; ++i) {
            if (userId === members[i]) {
                index = i;
                break;
            }
        }

        if (index !== -1) {
            members.splice(index, 1);
            addFeedMessage(userId, "leave", null);

            return true;
        }

        return false;
    };

    const evaluateSet = (userId, cardIndex1, cardIndex2, cardIndex3) => {
        if (cardIndex1 < board.length || cardIndex2 < board.length || cardIndex3 < board.length) {
            return -2;
        }

        const card1 = board[cardIndex1];
        const card2 = board[cardIndex2];
        const card3 = board[cardIndex3];

        if (arraysEqual(getSetCard(card1, card2), card3)) {
            const indices = [cardIndex1, cardIndex2, cardIndex3].sort((a, b) => b - a);
            indices.forEach(index => {
                board.splice(index, 1);
            });

            scores[userId] += 1;

            addFeedMessage(userId, "set", `[${card1.join('')},${card2.join('')},${card3.join('')}]`);

            drawThree(cardIndex1, cardIndex2, cardIndex3);

            if (board.length < 12 && !hasSet()) {
                status = 2;
                return 2;
            }

            return 1;
        }
        
        addFeedMessage(userId, "fail", `[${card1.join('')},${card2.join('')},${card3.join('')}]`);
        return 0;
    };

    const addFeedMessage = (userId, type, data) => {
        feed.push({ userId, type, data });
    };

    const hasMembers = () => Boolean(members.length);

    const getOverviewData = () => {
        return {
            id,
            name,
            members,
            started: status !== 0,
            finished: status === 2,
        };
    };

    const getDetailedData = () => {
        return {
            id,
            members,
            cards: board.map(card => card.join('')),
            feed,
            owner,
            started: status !== 0,
            finished: status === 2,
        };
    };

    addFeedMessage(creatorId, "create", null);

    initDeck();

    return {
        id,
        start,
        addUser,
        removeUser,
        evaluateSet,
        addFeedMessage,
        getOverviewData,
        hasMembers,
        getDetailedData,
    }
};

// Game structure:
// {
//     id: <some unique id>,
//     name: <name>,
//     members: [<user id>],
// }

const games = {};

const getAllGames = () => {
    return Object.values(games);
};

const createGame = (creatorId, name) => {
    const newGame = game(creatorId, name);
    games[newGame.id] = newGame;
    return newGame.id;
};

const startGame = (id, userId) => {
    if (!games[id]) {
        console.error(`Cannot start game with id ${id} - game does not exist`);
        return false;
    }

    return games[id].start(userId);
};

const addMemberToGame = (id, userId) => {
    if (!games[id]) {
        console.error(`Cannot add user to game with id ${id} - game does not exist`);
        return false;
    }

    games[id].addUser(userId);
    return true
};

const removeMemberFromGame = (id, userId) => {
    if (!games[id]) {
        console.error(`Cannot remove user from game with id ${id} - game does not exist`);
        return false;
    }

    if (!games[id].removeUser(userId)) {
        console.error(`Cannot remove user with id ${userId} from game with id ${id} - user not in game`);
        return false;
    }

    return true;
};

const evaluateSet = (id, userId, first, second, third) => {
    if (!games[id]) {
        console.error(`Cannot evaluate set in game with id ${id} - game does not exist`);
        return -1;
    }

    return games[id].evaluateSet(userId, first, second, third);
};

const addFeedMessage = (id, userId, type, data) => {
    if (!games[id]) {
        console.error(`Cannot add feed message to game with id ${id} - game does not exist`);
        return false;
    }

    games[id].addFeedMessage(userId, type, data);
    return true;
};

const getGameData = id => {
    if (!games[id]) {
        console.error(`Cannot get game data for game with id ${id} - game does not exist`);
        return false;
    }

    return games[id].getDetailedData();
};

const gameIsEmpty = id => {
    if (!games[id]) {
        console.error(`Cannot check game members for game with id ${id} - game does not exist`);
        return false;
    }

    return !games[id].hasMembers();
};

const deleteGame = id => {
    if (!games[id]) {
        console.error(`Cannot delete game with id ${id} - game does not exist`);
        return false;
    }

    delete games[id];

    return true;
};

module.exports = {
    getAllGames,
    createGame,
    startGame,
    addMemberToGame,
    removeMemberFromGame,
    evaluateSet,
    addFeedMessage,
    getGameData,
    gameIsEmpty,
    deleteGame,
};
