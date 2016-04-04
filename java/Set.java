public class Set {

    public static void main(String[] args) {
        Lobby gameLobby = new Lobby();
        SetServer server = new SetServer();
        server.Listen(gameLobby);
    }

}
