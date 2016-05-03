import java.util.*;

import org.json.*;

class Lobby {

    HashMap<String, Game> games;//key is game id, list of games each game has a arraylist with all the users in that game
    static SetServer server = null;
    HashMap<String, User> currentUsers;//key is clientId
    HashMap<String, User> lobbyClients;//these are the clients that are logged in but not in a game; they are also in Map currentUser

    public Lobby() {
        games = new HashMap<String, Game>();
        currentUsers = new HashMap<String, User>();
        lobbyClients = new HashMap<String, User>();
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
                } catch (JSONException j) {
                    sendJSONMessage("CLIENT CONNECT ERROR", "clientId", clientId);
                }
                break;
            case "CLIENT DISCONNECT":
                // Remove client with specified id due to disconnect
                try {
                    clientId = data.getString("clientId");

                    // If the client is logged in, clean up any leftovers
                    if (currentUsers.get(clientId) != null) {
                        username = currentUsers.get(clientId).getUsername();
                        // Remove user from any active games
                        try {
                            String clientGameID = currentUsers.get(clientId).gameId;
                            if (games.get(clientGameID) != null) {
                                int retval = games.get(clientGameID).removeUser(currentUsers.get(clientId));//removes user from the game they are a part of
                                // If no more players; game finished
                                if (retval == -1) {
                                    sendJSONMessage("CLIENT DISCONNECT ERROR", "clientId", clientId);
                                } else if (retval == 0) {
                                    finishGame(clientGameID);
                                } else {
                                    sendGameUpdate(clientGameID);
                                }
                                sendLobbyUpdate();
                            }

                        } catch (ConcurrentModificationException e) {
                            e.printStackTrace();
                        }

                        // Remove user from lobby
                        if (lobbyClients.get(clientId) != null) {
                            lobbyClients.remove(clientId);
                        }
                    }

                    currentUsers.remove(clientId);
                } catch (JSONException j) {
                    sendJSONMessage("CLIENT DISCONNECT ERROR", "clientId", clientId);
                }
                break;
            case "USER REGISTER":
                //create a User with the specified username and password and add into the database.
                try {
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
                } catch (JSONException j) {
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
                    if (login != username) {
                        sendJSONMessage("USER LOGIN FAIL", "clientId", clientId, "errorMessage", login);
                        return;
                    }
                    if (!currentUsers.containsKey(clientId)) {
                        sendJSONMessage("USER LOGIN FAIL", "clientId", clientId, "errorMessage", "Client was not connected");
                        return;
                    }
                    User newU = new User(username, clientId);
                    currentUsers.put(clientId, newU);
                    lobbyClients.put(clientId, newU);
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
                        // Remove user from currentUsers by making user associated with clientId null
                        currentUsers.put(clientId, null);
                        lobbyClients.remove(clientId);
                        // Add client to waiting clients list
                        sendJSONMessage("USER LOGOUT SUCCESS", "clientId", clientId);
                    }
                } catch (JSONException j) {
                    j.printStackTrace();
                    sendJSONMessage("USER LOGOUT FAIL", "clientId", clientId, "errorMessage", "Invalid naming of JSON file");
                }
                break;
            case "LOBBY LIST":
                sendLobbyUpdate();
                break;
            case "GAME CREATE":
                //Request:    GAME CREATE - { clientId, name }
                try {
                    clientId = data.getString("clientId");
                    gameName = data.getString("name");
                    gameId = ""+ (games.size() + 1);
                    Game g = new Game(gameId, gameName);
                    g.addUser(currentUsers.get(clientId), true);
                    games.put(gameId, g);
                    lobbyClients.remove(clientId);
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
                    lobbyClients.remove(clientId);

                    JSONObject obj = new JSONObject();
                    obj.put("clientId", clientId);
                    obj.put("username", newU.getUsername());
                    JSONArray omember = new JSONArray();
                    for (int i = 0; i < temp.players.size(); i++) {
                        omember.put(temp.players.get(i).username);
                    }
                    obj.put("membername", omember);
                    sendGameUpdate(gameId);
                    sendLobbyUpdate();
                    System.out.println("GAME JOIN SUCCESS");
                    server.SendMessage("GAME JOIN SUCCESS", obj);

                } catch (JSONException j) {
                    j.printStackTrace();
                    sendJSONMessage("GAME JOIN FAIL", "clientId", clientId, "errorMessage", "Invalid naming of JSON file");
                }
                break;
            case "GAME LEAVE":
                //Request:    GAME LEAVE - { clientId, gameId }
                //Response:    GAME LEAVE SUCCESS - { clientId }
                //GAME LEAVE FAIL - { clientId, errorMessage }

                try {
                    clientId = data.getString("clientId");
                    gameId = data.getString("gameId");
                    username = currentUsers.get(clientId).getUsername();

                    Game game1 = games.get(gameId);
                    if (game1 == null) {
                        sendJSONMessage("GAME LEAVE FAIL", "clientId", clientId, "errorMessage", "Invalid Game Id");
                        return;
                    } else {
                        Boolean success = false;
                        int max = 0;
                        for (int i = game1.players.size() - 1; i >= 0; i--) {//removes client from game
                            if (game1.players.get(i).username.compareTo(username) == 0 && game1.players.get(i).userid.compareTo(clientId) == 0) {
                                game1.players.remove(i);
                                success = true;
                                break;
                            }
                        }
                        if (game1.players.size() == 0)//no more players so game finished
                        {
                            finishGame(gameId);
                        } else {
                            sendGameUpdate(gameId);
                        }
                        if (!success) {
                            sendJSONMessage("GAME LEAVE FAIL", "clientId", clientId, "errorMessage", "User not in Game");
                            return;
                        } else {
                            lobbyClients.put(clientId, currentUsers.get(clientId));
                            sendLobbyUpdate();
                            sendJSONMessage("GAME LEAVE SUCCESS", "clientId", clientId);
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
                    sendGameUpdate(gameId);

                    JSONArray clients = new JSONArray();
                    JSONObject scores = new JSONObject();
                    for (int i = 0; i < game.players.size(); i++) {
                        clients.put(game.players.get(i).userid);
                        username = game.players.get(i).username;
                        scores.put(username, game.playerScores.get(username));
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
                //Request:    GAME SET - { clientId, gameId, cards: [card[0], card[1], card[2]] }
                //Response:    GAME SET SUCCESS - { clientId, gameId }
                //GAME SET INVALID - { clientId, gameId }
                //GAME SET FAIL - { clientId, errorMessage }
                //(Note: a successful set should trigger a GAME CARDS UPDATE message, specified below, and this should also check for a win condition)
                try {
                    clientId = data.getString("clientId");
                    gameId = data.getString("gameId");

                    JSONArray cards = data.getJSONArray("cards");

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
                            sendJSONMessage("GAME SET FAIL", "clientId", clientId, "errorMessage", "Cards are not on the board");
                            break;
                        case -1:
                            sendJSONMessage("GAME SET FAIL", "clientId", clientId, "errorMessage", "Cards are formatted wrong");
                            break;
                        case 0:
                            sendGameUpdate(gameId);
                            sendJSONMessage("GAME SET INVALID", "clientId", clientId, "gameId", gameId);
                            break;
                        case 1:
                            sendGameUpdate(gameId);
                            sendJSONMessage("GAME SET SUCCESS", "clientId", clientId, "gameId", gameId);
                            break;
                        case 2:
                            sendGameUpdate(gameId);
                            finishGame(gameId);//sends game finished update
                            sendJSONMessage("GAME SET SUCCESS", "clientId", clientId, "gameId", gameId);
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
                    gameId = data.getString("gameId");
                    username = currentUsers.get(clientId).getUsername();

                    Game temp = games.get(gameId);
                    if (temp == null) {
                        sendJSONMessage("GAME DELETE FAIL", "clientId", clientId, "errorMessage", "Invalid Game Id");
                        return;
                    } else {
                        if (temp.owner.getUsername().compareTo(username) == 0) {
                            if (finishGame(gameId) == 0) {
                                // Make all the players in the game go to the lobby
                                for (User u : temp.players) {
                                    lobbyClients.put(u.userid, u);
                                }

                                JSONObject response = new JSONObject();
                                JSONArray clients = new JSONArray();
                                for (User u : temp.players) {
                                    clients.put(u.userid);
                                }
                                response.put("clients", clients);
                                sendLobbyUpdate();
                                server.SendMessage("GAME DELETE SUCCESS", response);
                            } else {
                                sendJSONMessage("GAME DELETE FAIL", "clientId", clientId, "errorMessage", "Error in Finish Game");
                            }
                        } else {
                            sendJSONMessage("GAME DELETE FAIL", "clientId", clientId, "errorMessage", "User lack permission to delete");
                        }
                    }
                } catch (JSONException j) {
                    j.printStackTrace();
                    sendJSONMessage("GAME DELETE FAIL", "clientId", clientId, "errorMessage", "Invalid naming of JSON file");
                }
                break;
            case "GAME UPDATE SUBSCRIBE":
                gameId = data.getString("gameId");
                sendGameUpdate(gameId);
                break;
            default:
                // Handle invalid command type here
                break;
        }
    }

    public int finishGame(String gId) {
        Game g = games.get(gId);
        if (g == null) {
            return -1;
        }
        sendGameUpdate(gId);

        if (g.players.size() == 0) {
            games.remove(gId);
        }
        return 0;
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
        System.out.println(message + response);
        server.SendMessage(message, response);
    }

    public void sendGameUpdate(String gId) {
        // Message:     GAME UPDATE - { gameId, clients: [ clientId, ... ], cards: [ card, ... ], feed: [ msg, ... ], started, finished }

        JSONObject response = new JSONObject();
        response.put("gameId", gId);

        Game game = (Game) games.get(gId);
        if (game == null) {
            sendJSONMessage("GAME UPDATE FAIL", "gameId", gId);
            return;
        }

        JSONArray clients = new JSONArray();
        for (int i = 0; i < game.players.size(); ++i) {
            clients.put(game.players.get(i).userid);
        }
        response.put("clients", clients);

        JSONArray cards = new JSONArray();
        for (int i = 0; i < game.board.size(); ++i) {
            cards.put(game.board.get(i));
        }
        response.put("cards", cards);

        JSONObject scores = new JSONObject();
        for (int i = 0; i < game.players.size(); i++) {
            scores.put(game.players.get(i).username, game.playerScores.get(game.players.get(i).username));
        }
        response.put("scores", scores);

        JSONArray feed = new JSONArray();
        // TODO: Add feed items here
        response.put("feed", feed);

        response.put("owner", game.owner.username);

        response.put("started", (game.status != 0));
        response.put("finished", (game.status == 2));

        System.out.println("GAME UPDATE");
        server.SendMessage("GAME UPDATE", response);
    }

    public void sendLobbyUpdate() {
        //Message:    LOBBY UPDATE - { [ clientId, ... ], games:[ { gameId, name, [members],started }, ... ] } (this should only go to clients that are not in any game)
        JSONObject response = new JSONObject();
        JSONArray clients = new JSONArray();
        for (String c : lobbyClients.keySet()) {
            clients.put(c);
        }
        response.put("clients", clients);
        JSONArray gamearr = new JSONArray();
        for (Game g : games.values()) {
            JSONObject game = new JSONObject();
            game.put("gameId", g.gameid);
            game.put("name", g.name);
            JSONArray members = new JSONArray();
            for (User mem : g.players) {
                members.put(mem.username);
            }
            game.put("members", members);
            game.put("owner", g.owner.username);
            game.put("started", (g.status != 0));
            game.put("finished", (g.status == 2));
            gamearr.put(game);
        }
        response.put("games", gamearr);
        System.out.println("LOBBY UPDATE" + response.toString());
        server.SendMessage("LOBBY UPDATE", response);
    }

}
