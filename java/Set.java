public class Set {

    public static void main(String[] args) {
        Lobby lobby = new Lobby();
        final SetServer server = SetServer.getSetServerSingleton();

        server.InitializeLobby(lobby);
        server.Listen();
    }

}
