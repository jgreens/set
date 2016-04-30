import org.json.*;

import java.util.*;

public class LobbyTest {
    public static void main(String[] args) {
        Lobby lobby = new Lobby();
        JSONObject connectd = getJSONObject("clientId", "a69");
        JSONObject connectd2 = getJSONObject("clientId", "yolo");
        JSONObject connectd3 = getJSONObject("clientId", "swag");
        JSONObject connectd4 = getJSONObject("clientId", "420");
        lobby.executeCommand("CLIENT CONNECT", connectd);
        lobby.executeCommand("CLIENT CONNECT", connectd2);
        lobby.executeCommand("CLIENT CONNECT", connectd3);
        lobby.executeCommand("CLIENT CONNECT", connectd4);

        JSONObject login = getJSONObject("clientId", "a69", "username", "agnavada", "password", "blazeit");
        JSONObject login2 = getJSONObject("clientId", "yolo", "username", "nebraska", "password", "blazeit");
        JSONObject login3 = getJSONObject("clientId", "swag", "username", "wyoming", "password", "blazeit");
        JSONObject login4 = getJSONObject("clientId", "420", "username", "montana", "password", "blazeit");
        lobby.executeCommand("USER LOGIN", login);
        lobby.executeCommand("USER LOGIN", login2);
        lobby.executeCommand("USER LOGIN", login3);
        lobby.executeCommand("USER LOGIN", login4);

        lobby.executeCommand("LOBBY LIST", null);

        JSONObject creationdata = getJSONObject("clientId", "a69", "username", "agnavada", "name", "set");
        JSONObject creationdata2 = getJSONObject("clientId", "yolo", "username", "nebraska", "name", "tictacto");
        lobby.executeCommand("GAME CREATE", creationdata);
        lobby.executeCommand("GAME CREATE", creationdata2);

        JSONObject joingame = getJSONObject("clientId", "swag", "username", "wyoming", "gameId", "game1");
        JSONObject joingame2 = getJSONObject("clientId", "420", "username", "montana", "gameId", "game2");
        lobby.executeCommand("GAME JOIN", joingame);
        lobby.executeCommand("GAME JOIN", joingame2);

        JSONObject gamestart = getJSONObject("clientId", "a69", "username", "agnavada", "gameId", "game1");
        JSONObject gamestart2 = getJSONObject("clientId", "yolo", "username", "nebraska", "gameId", "game2");
        lobby.executeCommand("GAME START", gamestart);
        lobby.executeCommand("GAME START", gamestart2);

        JSONArray cards1 = new JSONArray();
        cards1.put("1|1|0|1");
        cards1.put("1|0|1|1");
        cards1.put("1|2|2|1");
        JSONObject gameSet = getJSONObject("setClientId", "a69", "setGameId", "game1");
        gameSet.put("card", cards1);
        JSONArray cards2 = new JSONArray();
        cards2.put("1|2|0|1");
        cards2.put("2|1|1|1");
        cards2.put("0|0|2|1");
        JSONObject gameSet2 = getJSONObject("setClientId", "swag", "setGameId", "game1");
        gameSet2.put("card", cards2);
        JSONArray cards3 = new JSONArray();
        cards3.put("1|1|0|1");
        cards3.put("1|1|1|1");
        cards3.put("1|1|2|1");
        JSONObject gameSet3 = getJSONObject("setClientId", "420", "setGameId", "game2");
        gameSet3.put("card", cards3);
        JSONArray cards4 = new JSONArray();
        cards4.put("1|1|0|1");
        cards4.put("0|0|0|0");
        cards4.put("2|2|0|2");
        JSONObject gameSet4 = getJSONObject("setClientId", "yolo", "setGameId", "game2");
        gameSet4.put("card", cards4);
        lobby.executeCommand("GAME SET", gameSet);
        lobby.executeCommand("GAME SET", gameSet2);
        lobby.executeCommand("GAME SET", gameSet3);
        lobby.executeCommand("GAME SET", gameSet4);

        JSONObject gameleave = getJSONObject("clientId", "a69", "username", "agnavada", "gameId", "game1");
        JSONObject gameleave2 = getJSONObject("clientId", "yolo", "username", "nebraska", "gameId", "game2");
        JSONObject gameleave3 = getJSONObject("clientId", "swag", "username", "wyoming", "gameId", "game1");
        JSONObject gameleave4 = getJSONObject("clientId", "420", "username", "montana", "gameId", "game2");
        lobby.executeCommand("GAME LEAVE", gameleave);
        lobby.executeCommand("GAME LEAVE", gameleave2);
        lobby.executeCommand("GAME LEAVE", gameleave3);
        lobby.executeCommand("GAME LEAVE", gameleave4);

    }

    private static JSONObject getJSONObject(String... args) {
        JSONObject obj = new JSONObject();
        for (int i = 0; i < args.length - 1; i += 2) {
            obj.put(args[i], args[i + 1]);
        }
        return obj;
    }
}