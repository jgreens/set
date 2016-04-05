public class Set {

    public static void main(String[] args) {
        Lobby lobby = new Lobby();
        final SetServer server = new SetServer();

        server.InitializeLobby(lobby);
        server.Listen();

        System.out.println("hi");
    }

}
