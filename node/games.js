const { v4: uuidv4 } = require('uuid');

const game = (creatorId, gameName) => {
    const id = uuidv4();
    const name = gameName;

    const owner = creatorId;

    let board = [];
    let deck = [];

    let boardIndices = {};

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
                        deck.push(`${i}${j}${k}${l}`);
                    }
                }
            }
        }
    };

    const setBoardIndices = () => {
        boardIndices = {};
        for (let i = 0; i < board.length; ++i) {
            boardIndices[board[i]] = i;
        }
    };

    const drawThree = (first, second, third) => {
        if (deck.length < 3) {
            return false;
        }

        if (first < 0 || second < 0 || third < 0) {
            return false;
        }

        first = Math.min(first, board.length);
        second = Math.min(second, board.length);
        third = Math.min(third, board.length);

        board.splice(first, 0, deck.pop());
        board.splice(second, 0, deck.pop());
        board.splice(third, 0, deck.pop());

        setBoardIndices();

        return true;
    };

    const getSetCard = (card1, card2) => {
        const str1 = Array.from(card1);
        const str2 = Array.from(card2);

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

        return setCard.join('');
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

                if (boardIndices[card3]) {
                    return true;
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

    const shuffleDeck = () => {
        let counter = deck.length, temp, index;

        while (counter > 0) {
            index = Math.floor(Math.random() * counter);
            counter--;
            temp = deck[counter];
            deck[counter] = deck[index];
            deck[index] = temp;
        }

        return deck;
    };

    const start = userId => {
        if (owner !== userId) {
            console.warn(`Non-owner user ${userId} attempted to start game ${id}`);
            return false;
        }

        status = 1;
        scores = members.reduce((obj, member) => {
            obj[member] = 0;
            return obj;
        }, {});

        shuffleDeck();

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

    const validateCard = card => {
        return card.length === 4 && Array.from(card).filter(element => element >= 0 && element <= 2).length == 4;
    };

    const evaluateSet = (userId, cards) => {
        if (cards.length !== 3 || !validateCard(cards[0]) || !validateCard(cards[1]) || !validateCard(cards[2])) {
            return -1;
        }

        const indices = [boardIndices[cards[0]], boardIndices[cards[1]], boardIndices[cards[2]]];

        if (indices.filter(index => index === undefined).length !== 0) {
            return -2;
        }

        if (!scores[userId]) {
            scores[userId] = 0;
        }

        if (getSetCard(cards[0], cards[1]) === cards[2]) {
            indices.sort((a, b) => b - a);
            indices.forEach(index => {
                board.splice(index, 1);
            });

            setBoardIndices();

            scores[userId] += 1;

            addFeedMessage(userId, "set", `["${cards[0]}","${cards[1]}","${cards[2]}"]`);

            if (deck.length) {
                drawThree(indices[2], indices[1], indices[0]);
            }

            while (!hasSet()) {
                if (!deck.length) {
                    status = 2;
                    return 2;
                }

                drawThree(board.length, board.length, board.length);
            }

            return 1;
        }

        scores[userId] -= 1;
        
        addFeedMessage(userId, "fail", `["${cards[0]}","${cards[1]}","${cards[2]}"]`);
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
            cards: board,
            scores,
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

const evaluateSet = (id, userId, cards) => {
    if (!games[id]) {
        console.error(`Cannot evaluate set in game with id ${id} - game does not exist`);
        return -1;
    }

    return games[id].evaluateSet(userId, cards);
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
