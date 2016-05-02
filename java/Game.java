import java.util.*;

//REMEMBER CHANGE THE CONSTRUCTOR
public class Game {

    ArrayList<User> players;
    User owner;
    String gameid, name;
    Queue<String> commandQ;
    /**
     * The number of cards on the board and in the deck respectively.
     */
    int boardSize;
    int deckSize;

    //status of hte game, whether it has started or is just waiting in the lobby
    //0 means it has not started. 1 means it has started
    int status;

    /**
     * Hash Table of all the cards in the deck.Originally the second value is 0, when the card is still in the deck.
     * When a card is delt to the board the value is set to 1. When the card is removed from the board it is set to -1
     */
    HashMap<Card, Integer> deck;
    /**
     * ArrayList of all the cards on the board. Done to make it easy to loop through the deck, because looping through a hashtable is annoying.
     */
    ArrayList<Card> board;

    /**
     * Constructor creates a board of 12 cards.
     * Also initializes the internal ArrayList and HashMap of Cards.
     */
    public Game(String gid, String n) {
        gameid = gid;
        name = n;
        initDeck();
        board = new ArrayList<Card>();
        players = new ArrayList<User>();
        boardSize = 0;
        deckSize = 81;
        status = 0;
        drawThree();
        drawThree();
        drawThree();
        drawThree();
    }

    void start() {
        status = 1;
        for (User u : players) {
            u.score = 0;
        }
        while(!hasSet())
        {
            drawThree();
        }
    }

    int removeUser(User u) {
        Boolean success = false;
        for (int i = players.size() - 1; i >= 0; i--) {
            if (players.get(i).userid.compareTo(u.userid) == 0 && players.get(i).username.compareTo(u.username) == 0) {
                players.remove(i);
                success = true;
                break;
            }
        }
        if (success) {
            return players.size();
        } else {
            return -1;
        }
    }

    void addUser(User user, Boolean isOwner) {
        players.add(user);
        user.gameId = gameid;
        if (isOwner) {
            owner = user;
        }
    }

    //parse strings into cards and check if set
    //update board,
    //update score if it is a set
    //returns 2 if it is a set and the game has finished
    //returns 1 if it is a set
    //returns 0 if not a set
    //return -1 if the cards are formatted wrong
    //return -2 if the cards are not on the board
    public synchronized int pickSet(String uid, String c1, String c2, String c3) {
        Card card1 = new Card(0, 0, 0, 0);
        if (card1.parseCard(c1) == -1) return -1;

        Card card2 = new Card(0, 0, 0, 0);
        if (card2.parseCard(c2) == -1) return -1;

        Card card3 = new Card(0, 0, 0, 0);
        if (card3.parseCard(c3) == -1) return -1;

        if (deck.get(card1) != 1 || deck.get(card2) != 1 || deck.get(card3) != 1) {//if any of the cards are not on the board return -2
            return -2;
        }

        if (isSet(card1, card2, card3)) {

            //if set loop through board and delete the specfied cards
            for (int i = board.size() - 1; i >= 0; i--) {
                if (board.get(i).equals(card1) || board.get(i).equals(card2) || board.get(i).equals(card3)) {
                    removeCard(i);
                }
            }
            for (int i = 0; i < players.size(); i++) {
                if (players.get(i).userid.compareTo(uid) == 0) {
                    players.get(i).score += 1;
                }
            }

            if(boardSize > 12 && hasSet())//if the game board is large and there is a set don't draw
            {
                return 1;
            }else{
                do{
                    if (drawThree() == false) {
                        return 2;//game has finished
                    }
                }while(!hasSet());
            }
            return 1;
        }
        for (int i = 0; i < players.size(); i++) {
            if (players.get(i).userid.compareTo(uid) == 0) {
                players.get(i).score -= 1;
            }
        }
        return 0;
    }

    void initDeck() {
        deck = new HashMap<Card, Integer>();
        //goes through every combination of cards for each of the 4 attributes
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                for (int k = 0; k < 3; k++) {
                    for (int l = 0; l < 3; l++) {
                        Card card = new Card(i, j, k, l);
                        deck.put(card, 0);
                    }
                }
            }
        }
    }

    /**
     * Draws three cards and sticks them on the board.
     * <p>
     * returns true if three cards were drawn
     * false if not enough cards in the deck
     */
    public Boolean drawThree() {
        if (deckSize < 3) {
            return false;
        }
        ArrayList<Card> temp = new ArrayList<Card>(3);
        Random r = new Random();
        for (int j = 0; j < 3; j++) {
            Card card;
            int[] arr = new int[4];
            Boolean exists = true;
            do {
                for (int i = 0; i < 4; i++) {
                    arr[i] = r.nextInt(3);
                }
                card = new Card(arr[0], arr[1], arr[2], arr[3]);
                int code = deck.get(card);
                exists = code == 0 ? false : true;//if the code is 0 then the card has not been delt
            } while (exists);//make sure you generate a unique card
            deck.put(card, 1);//makes the value of that card 1, indicating its on the board
            temp.add(card);
        }
        board.addAll(temp);
        deckSize -= 3;
        boardSize += 3;
        return true;
    }

    /**
     * Prints the board. Used for debugging
     */
    public void printBoard() {
        for (int i = 0; i < board.size(); i++) {
            board.get(i).print();
            if (i % 3 == 2) {
                System.out.println("");
            }
        }
        System.out.println("");
    }

    /**
     * Checks if the board has a Set, by looping through the board, finding every pair of cards and
     * checking if the third card needed to complete the pair exists
     *
     * @return Boolean-Returns true if there is a set on the board, false otherwise
     */
    public Boolean hasSet() {
        //System.out.println("Checking for set");
        for (int i = 0; i < boardSize - 1; i++) {
            for (int j = i + 1; j < boardSize; j++) {
                Card c1 = board.get(i);
                Card c2 = board.get(j);
                //if the card needed to complete the set is on the board you got yourself a set
                if (deck.get(nextCard(c1, c2)) == 1) {
                    System.out.print("Set: ");
                    c1.print();
                    c2.print();
                    Card c3 = nextCard(c1, c2);
                    c3.print();
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Checks if the parameters form a Set
     *
     * @param c1 card one
     * @param c2 card two
     * @param c3 card three
     * @return Boolean- Returns true if these three cards form a set, returns false otherwise
     */
    public Boolean isSet(Card c1, Card c2, Card c3) {
        return nextCard(c1, c2).equals(c3);
    }

    /**
     * Returns the card necessary to complete a set given two cards.
     *
     * @param c1 card one
     * @param c2 card two
     * @return Card- Returns the card to complete the set
     */
    public Card nextCard(Card c1, Card c2) {
        Card c3 = new Card(0, 0, 0, 0);

        if (c1.color == c2.color) {
            c3.color = c1.color;
        } else {
            c3.color = (3 - c2.color - c1.color);
        }

        if (c1.shape == c2.shape) {
            c3.shape = c1.shape;
        } else {
            c3.shape = (3 - c2.shape - c1.shape);
        }

        if (c1.fill == c2.fill) {
            c3.fill = c1.fill;
        } else {
            c3.fill = (3 - c2.fill - c1.fill);
        }

        if (c1.number == c2.number) {
            c3.number = c1.number;
        } else {
            c3.number = (3 - c2.number - c1.number);
        }
        return c3;
    }

    /**
     * Removes the card at the specified index.
     *
     * @param i index of card on board to remove
     * @return Boolean-whether or not the card at that index was removed
     */
    public Boolean removeCard(int i) {
        System.out.println("Removing Card");
        if (i < 0 || i >= board.size()) {
            return false;
        }
        Card removed = board.remove(i);
        deck.put(removed, -1);
        boardSize--;
        return true;
    }

    public User getWinner() {
        int max = 0;
        User winner = null;
        for (int i = 0; i < players.size(); i++) {
            if (players.get(i).score > max) {
                max = players.get(i).score;
                winner = players.get(i);
            }
        }
        return winner;
    }
}
