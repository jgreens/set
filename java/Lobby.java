import java.util.*;
import org.json.*;

class Lobby {

    HashMap<String, Game> games;//key is game id, list of games each game has a arraylist with all the users in that game
    static SetServer server = null;
    HashMap<String, User> currentUsers;//key is clientId
    ArrayList<String> waitingClients;//these are the clients not in any game

    public Lobby() {
        games = new HashMap<String, Game>();
        currentUsers = new HashMap<String, User>();
        waitingClients = new ArrayList<String>();
    }

    public void executeCommand(String command, JSONObject data) {

        if (server == null) {
           server = SetServer.getSetServerSingleton();
        }
        System.out.println("Executing " + command);
        String username = "invalid";
        String clientId = "invalid";
        String gameId = "invalid";
        String gameName = "invalid";
        switch (command) {
            case "CLIENT CONNECT":
                // Create client with unique id and no user logged in (user is null)
                try {
                    clientId = data.getString("clientId");
                    currentUsers.put(clientId, null);
                    waitingClients.add(clientId);
                } catch (JSONException j) {
                    sendJSONMessage("CLIENT CONNECT ERROR", "clientId", clientId);
                }
                break;
            case "CLIENT DISCONNECT":
                // Remove client with specified id due to disconnect
                try {
                    clientId = data.getString("clientId");
                    currentUsers.remove(clientId);
                    for (int i = 0; i < waitingClients.size(); i++) {
                        if (waitingClients.get(i).compareTo(clientId) == 0) {
                            waitingClients.remove(i);
                            break;
                        }
                    }
                } catch (JSONException j) {
                    sendJSONMessage("CLIENT DISCONNECT ERROR", "clientId", clientId);
                }
                break;
            case "USER REGISTER":
                //create a User with the specified username and password and add into the database.
            	try{
            		clientId = data.getString("clientId");
            		username = data.getString("username");
                    String password = data.getString("password");
                    Database d = new Database();	 
              	  	String register = d.registerUser(username, password);
              	  	d.disconnectDB();
              	  	if (register == username)
              	  		sendJSONMessage("USER REGISTER SUCCESS", "clientId", clientId, "username", username);
              	  	else 
              	  		sendJSONMessage("USER REGISTER FAIL", "clientId", clientId, "errorMessage", register);
            	} catch (JSONException j){
            		sendJSONMessage("USER REGISTER FAIL", "clientId", clientId, "errorMessage", "Invalid naming of JSON file");
            	}

                break;
            case "USER LOGIN":
                try {
                    clientId = data.getString("clientId");
                    username = data.getString("username");
                    String password = data.getString("password");
                    Database d = new Database();
                    String login = d.loginUser(username, password);
                    d.disconnectDB();
                    //should also first check if the guy exists in the database
                    if (login!=username) {
                    	sendJSONMessage("USER LOGIN FAIL", "clientId", clientId, "errorMessage", login);
                        return;
                    }
                    if (!waitingClients.contains(clientId)) {
                        sendJSONMessage("USER LOGIN FAIL", "clientId", clientId, "errorMessage", "Client was not connected");
                        return;
                    }
                    User newU = new User(username, clientId);
                    currentUsers.put(clientId, newU);
                    for (int i = 0; i < waitingClients.size(); i++) {//take user out of the waiting clients list
                        if (waitingClients.get(i).compareTo(clientId) == 0) {
                            waitingClients.remove(i);
                            break;
                        }
                    }
                    sendLobbyUpdate();
                    sendJSONMessage("USER LOGIN SUCCESS", "clientId", clientId, "username", username);
                } catch (JSONException j) {
                    j.printStackTrace();
                    sendJSONMessage("USER LOGIN FAIL", "clientId", clientId, "errorMessage", "Invalid naming of JSON file");
                }
                break;
            case "USER LOGOUT":
                try {
                    clientId = data.getString("clientId");
                    username = data.getString("username");
                    User u = currentUsers.get(clientId);
                    if (u == null) {
                        sendJSONMessage("USER LOGOUT FAIL", "clientId", clientId, "errorMessage", "User not currently logged in");
                    } else {
                        // Remove user from currentUsers
                        currentUsers.remove(clientId);
                        // Add client to waiting clients list
                        waitingClients.add(clientId);
                        sendJSONMessage("USER LOGOUT SUCCESS", "clientId", clientId);
                    }
                } catch (JSONException j) {
                    j.printStackTrace();
                    sendJSONMessage("USER LOGOUT FAIL", "clientId", clientId, "errorMessage", "Invalid naming of JSON file");
                }
                break;
            case "LOBBY LIST":
                //list all the current users in JSON
                JSONObject reply = new JSONObject();
                JSONArray clients = new JSONArray();
                JSONArray gamesArray = new JSONArray();

                for (String user : currentUsers.keySet()) {
                    clients.put(user);
                }
                for (Game g : games.values()) {
                    JSONObject gameStuff = new JSONObject();

                    gameStuff.put("gameId", g.gameid);
                    gameStuff.put("name", g.name);

                    JSONArray playersArray = new JSONArray();
                    for (int i = 0; i < g.players.size(); i++) {
                        JSONObject userObj = new JSONObject();
                        String cId = g.players.get(i).userid;
                        userObj.put("clientId", cId);
                        userObj.put("username", currentUsers.get(cId).getUsername());
                        playersArray.put(userObj);
                    }
                    gameStuff.put("members", playersArray);

                    gamesArray.put(gameStuff);
                }
                reply.put("clients", clients);
                reply.put("games", gamesArray);
                System.out.println("LOBBY LIST SUCCESS");
                server.SendMessage("LOBBY LIST SUCCESS", reply);
                break;
            case "GAME CREATE":
                //Request:    GAME CREATE - { clientId, name }
                try {
                    clientId = data.getString("clientId");
                    gameName = data.getString("name");
                    gameId = "game" + (games.size() + 1);
                    Game g = new Game(gameId, gameName);
                    games.put(gameId, g);
                    //Response:    GAME CREATE SUCCESS - { clientId, username, gameId }
                    sendLobbyUpdate();
                    sendJSONMessage("GAME CREATE SUCCESS", "clientId", clientId, "username", currentUsers.get(clientId).getUsername(), "gameId", gameId);
                } catch (JSONException j) {
                    sendJSONMessage("GAME CREATE FAIL", "clientId", clientId, "errorMessage", "Invalid naming of JSON file");
                }
                break;
            case "GAME JOIN":
                //Request:    GAME JOIN - { clientId, gameId }
                //Response:    GAME JOIN SUCCESS - { clientId, username, [ membername, ... ] }
                try {
                    clientId = data.getString("clientId");
                    gameId = data.getString("gameId");

                    Game temp = games.get(gameId);
                    if (temp == null) {
                        sendJSONMessage("GAME JOIN FAIL", "clientId", clientId, "errorMessage", "Invalid Game Id");
                        return;
                    }
                    User newU = currentUsers.get(clientId);
                    if (newU == null) {
                        sendJSONMessage("GAME JOIN FAIL", "clientId", clientId, "errorMessage", "User not registered");
                        return;
                    }
                    temp.addUser(newU, false);
                    JSONObject obj = new JSONObject();
                    obj.put("clientId", clientId);
                    obj.put("username", newU.getUsername());
                    JSONArray omember = new JSONArray();
                    for (int i = 0; i < temp.players.size(); i++) {
                        omember.put(temp.players.get(i).username);
                    }
                    obj.put("membername", omember);
                    sendGameMemberUpdate(gameId);
                    System.out.println("GAME JOIN SUCCESS");
                    server.SendMessage("GAME JOIN SUCCESS", obj);

                } catch (JSONException j) {
                    j.printStackTrace();
                    sendJSONMessage("GAME JOIN FAIL", "clientId", clientId, "errorMessage", "Invalid naming of JSON file");
                }
                break;
            case "GAME LEAVE":
                //Request:    GAME LEAVE - { clientId, username, gameId }
                //Response:    GAME LEAVE SUCCESS - { clientId, username }
                //GAME LEAVE FAIL - { clientId, errorMessage }

                try {
                    clientId = data.getString("clientId");
                    username = data.getString("username");
                    gameId = data.getString("gameId");

                    Game game1 = games.get(gameId);
                    if (game1 == null) {
                        sendJSONMessage("GAME LEAVE FAIL", "clientId", clientId, "errorMessage", "Invalid Game Id");
                        return;
                    } else {
                        Boolean success = false;
                        int max = 0;
                        String winnerid = "invalid";
                        for (int i = game1.players.size() - 1; i >= 0; i--) {
                            if (game1.players.get(i).score > max) {
                                max = game1.players.get(i).score;
                                winnerid = game1.players.get(i).userid;
                            }
                            if (game1.players.get(i).username.compareTo(username) == 0 && game1.players.get(i).userid.compareTo(clientId) == 0) {
                                game1.players.remove(i);
                                success = true;
                            }
                        }
                        if (game1.players.size() == 0)//no more players so game finished
                        {
                            sendGameFinishedUpdate(gameId, winnerid);
                        }
                        if (!success) {
                            sendJSONMessage("GAME LEAVE FAIL", "clientId", clientId, "errorMessage", "User not in Game");
                            return;
                        } else {
                            sendGameMemberUpdate(gameId);
                            sendJSONMessage("GAME LEAVE SUCCESS", "clientId", clientId, "username", username);
                        }
                    }
                } catch (JSONException j) {
                    sendJSONMessage("GAME LEAVE FAIL", "clientId", clientId, "errorMessage", "Invalid naming of JSON file");
                }
                break;

            case "GAME START":
                //start a game
                //Request:    GAME START - { clientId, gameId }
                //Response:    GAME START SUCCESS - { [ { clientId, username, score (0) }, ... ], gameId }
                //GAME START FAIL - { clientId, errorMessage }
                //(Note: a successful start should trigger a GAME CARDS UPDATE message, spec'ed below)
                try {
                    clientId = data.getString("clientId");
                    gameId = data.getString("gameId");

                    JSONObject response = new JSONObject();
                    response.put("gameId", gameId);

                    Game game = (Game) games.get(gameId);
                    if (game == null) {
                        sendJSONMessage("GAME START FAIL", "clientId", clientId, "errorMessage", "Invalid Game Id");
                        return;
                    }
                    game.start();
                    sendCardUpdate(gameId);
                    clients = new JSONArray();
                    JSONObject scores = new JSONObject();
                    for (int i = 0; i < game.players.size(); i++) {
                        clients.put(game.players.get(i).userid);
                        scores.put(game.players.get(i).username, game.players.get(i).score);
                    }
                    response.put("clients", clients);
                    response.put("scores", scores);
                    response.put("feed", new JSONObject()); // Temporary
                    sendLobbyUpdate();
                    System.out.println("GAME START SUCCESS");
                    server.SendMessage("GAME START SUCCESS", response);

                } catch (JSONException j) {
                    sendJSONMessage("GAME START FAIL", "clientId", clientId, "errorMessage", "Invalid naming of JSON file");
                }
                break;
            case "GAME SET":
                // check if the next three cards make a successful group, and if they exist on the board.
                //If they do remove the three cards, update the corresponding score and returns three new cards if there are no more sets on the board.
                //Request:    GAME SET - { setClientId, setGameId, card: [card[0], card[1], card[2]] }
                //Response:    GAME SET SUCCESS - { setClientId, setGameId }
                //GAME SET INVALID - { setClientId, setGameId }
                //GAME SET FAIL - { setClientId, errorMessage }
                //(Note: a successful set should trigger a GAME CARDS UPDATE message, specified below, and this should also check for a win condition)
                try {
                    clientId = data.getString("setClientId");
                    gameId = data.getString("setGameId");

                    JSONArray cards = data.getJSONArray("card");

                    Game game = (Game) games.get(gameId);
                    if (game == null) {
                        sendJSONMessage("GAME SET FAIL", "setClientId", clientId, "errorMessage", "Invalid Game ID");
                        return;
                    }
                    if (cards.length() != 3) {
                        sendJSONMessage("GAME SET FAIL", "setClientId", clientId, "errorMessage", "Invalid Number of Cards");
                        return;
                    }

                    int retval = game.pickSet(clientId, cards.getString(0), cards.getString(1), cards.getString(2));
                    switch (retval) {
                        case -2:
                            sendJSONMessage("GAME SET FAIL", "setClientId", clientId, "errorMessage", "Cards are not on the board");
                            break;
                        case -1:
                            sendJSONMessage("GAME SET FAIL", "setClientId", clientId, "errorMessage", "Cards are formated wrong");
                            break;
                        case 0:
                            sendGameScoreUpdate(gameId);
                            sendJSONMessage("GAME SET INVALID", "setClientId", clientId, "setGameId", gameId);
                            break;
                        case 1:
                            sendCardUpdate(gameId);
                            sendGameScoreUpdate(gameId);
                            sendJSONMessage("GAME SET SUCCESS", "setClientId", clientId, "setGameId", gameId);
                            break;
                        case 2:
                            sendCardUpdate(gameId);
                            sendGameScoreUpdate(gameId);
                            User winner = game.getWinner();
                            sendGameFinishedUpdate(gameId, winner.userid);
                            sendJSONMessage("GAME SET SUCCESS", "setClientId", clientId, "setGameId", gameId);
                            break;
                        default://nothing
                            break;
                    }

                } catch (JSONException j) {
                    sendJSONMessage("GAME SET FAIL", "clientId", clientId, "errorMessage", "Invalid naming of JSON file");
                }

                break;
            case "GAME DELETE":
                try {
                    clientId = data.getString("clientId");
                    username = data.getString("username");
                    gameId = data.getString("gameId");

                    Game temp = games.get(gameId);
                    if (temp == null) {
                        sendJSONMessage("GAME DELETE FAIL", "clientId", clientId, "errorMessage", "Invalid Game Id");
                        return;
                    } else {
                        if (temp.owner.userid.compareTo(clientId) == 0) {
                            games.remove(gameId);
                            sendJSONMessage("GAME DELETE SUCCESS", "clientId", clientId);
                        } else {
                            sendJSONMessage("GAME DELETE FAIL", "clientId", clientId, "errorMessage", "User lack permission to delete");
                        }
                    }
                } catch (JSONException j) {
                    sendJSONMessage("GAME DELETE FAIL", "clientId", clientId, "errorMessage", "Invalid naming of JSON file");
                }
                break;
            default:
                // Handle invalid command type here
                break;
        }

    }

    private static JSONObject getJSONObject(ArrayList<String> args) {

        JSONObject obj = new JSONObject();
        for (int i = 0; i < args.size() - 1; i += 2) {
            obj.put(args.get(i), args.get(i + 1));
        }
        System.out.println(obj.toString());
        return obj;

    }

    public static void sendJSONMessage(String message, String... args) {
        JSONObject response = new JSONObject();
        for (int i = 0; i < args.length - 1; i += 2) {
            response.put(args[i], args[i + 1]);
        }
        System.out.println(message);
        server.SendMessage(message, response);
    }

    public void sendCardUpdate(String gID) {
        //Message:    GAME CARDS UPDATE - { gameId, [ clientId, ... ], [ card, ... ] } (this should only go to clients in the specific game)

        JSONObject response = new JSONObject();
        response.put("gameId", gID);

        Game game = (Game) games.get(gID);
        if (game == null) {
            sendJSONMessage("GAME CARD UPDATE ERROR", "gameID", gID);
            return;
        }

        JSONArray clients = new JSONArray();
        for (int i = 0; i < game.players.size(); i++) {
            clients.put(game.players.get(i).userid);
        }
        response.put("clients", clients);

        JSONArray cards = new JSONArray();
        for (int i = 0; i < game.board.size(); i++) {
            cards.put(game.board.get(i));
        }
        response.put("cards", cards);
        System.out.println("GAME CARDS UPDATE");
        server.SendMessage("GAME CARDS UPDATE", response);
    }

    public void sendLobbyUpdate() {
        //Message:    LOBBY UPDATE - { [ clientId, ... ], [ { gameId, name, members,started }, ... ] } (this should only go to clients that are not in any game)
        JSONObject response = new JSONObject();
        for (Object val : currentUsers.values()) {


        }

        server.SendMessage("LOBBY UPDATE", response);
    }

    public void sendGameScoreUpdate(String gID) {
        //Message:    GAME SCORE UPDATE - { gameId, [clientId: {username, score}, ... ] } (this should only go to clients in the specific game)
        JSONObject response = new JSONObject();
        response.put("gameId", gID);

        Game game = (Game) games.get(gID);
        if (game == null) {
            sendJSONMessage("GAME SCORE UPDATE ERROR", "gameId", gID);
            return;
        }

        JSONArray clients = new JSONArray();
        for (int i = 0; i < game.players.size(); i++) {
            JSONObject c = new JSONObject();
            c.put("clientId", game.players.get(i).userid);
            c.put("username", game.players.get(i).username);
            c.put("score", game.players.get(i).score);
            clients.put(c);
        }
        response.put("clients", clients);

        System.out.println("GAME SCORE UPDATE");
        server.SendMessage("GAME SCORE UPDATE", response);
    }

    public void sendGameMemberUpdate(String gID) {
        //Message:    GAME MEMBERS UPDATE - { gameId, [ clientId:{username}, ... ] } (this should only go to clients in the specific game)
        JSONObject response = new JSONObject();
        response.put("gameId", gID);

        Game game = (Game) games.get(gID);
        if (game == null) {
            sendJSONMessage("GAME MEMBER UPDATE ERROR", "gameId", gID);
            return;
        }

        JSONArray clients = new JSONArray();
        for (int i = 0; i < game.players.size(); i++) {
            JSONObject c = new JSONObject();
            c.put("clientId", game.players.get(i).userid);
            c.put("username", game.players.get(i).username);
            clients.put(c);
        }
        response.put("clients", clients);

        System.out.println("GAME MEMBERS UPDATE");
        server.SendMessage("GAME MEMBERS UPDATE", response);
    }

    public void sendGameFinishedUpdate(String gID, String winnerID) {
        //Message:    GAME FINISHED - { gameId, [ clientId, ... ], winnerClientId, winnerUsername, winnerScore }
        JSONObject response = new JSONObject();
        response.put("gameId", gID);

        Game game = (Game) games.get(gID);
        if (game == null) {
            sendJSONMessage("GAME FINISHED UPDATE ERROR", "gameId", gID);
            return;
        }

        JSONArray clients = new JSONArray();
        for (int i = 0; i < game.players.size(); i++) {
            clients.put(game.players.get(i).userid);
        }
        User winner = currentUsers.get(winnerID);
        if (winner == null) {
            sendJSONMessage("GAME FINISHED ERROR- WINNER NOT IN GAME", "gameId", gID);
            return;
        }
        response.put("winnerClientId", winnerID);
        response.put("winnerUsername", winner.username);
        response.put("winnerScore", winner.score);
        response.put("clientId", clients);

        System.out.println("GAME FINISHED");
        server.SendMessage("GAME FINISHED", response);
    }
}
