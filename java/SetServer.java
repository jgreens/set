import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import org.json.*;

public class SetServer {

    private static int msgCount;
    ServerSocket server;
    Socket client;
    PrintWriter out;
    BufferedReader in;

    Lobby lobby;

    // Singleton design pattern
    private static SetServer setServerSingleton;
    public static synchronized SetServer getSetServerSingleton() {
        if (setServerSingleton == null) {
            setServerSingleton = new SetServer();
        }
        return setServerSingleton;
    }
    public Object clone() throws CloneNotSupportedException {
        throw new CloneNotSupportedException();
    }

    private SetServer() {
        msgCount = 0;

        // Initialize java server and listen for messages
        try {
            server = new ServerSocket(1010);
            client = server.accept();
            out = new PrintWriter(client.getOutputStream(), true);
            in = new BufferedReader(new InputStreamReader(client.getInputStream()));
            // Initiate conversation with client
            String outputLine;
            processInput(null, null);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void InitializeLobby(Lobby l) {
        lobby = l;
    }

    public void Listen() {
        if (lobby == null) {
            System.err.println("Error listening for clients: must initialize lobby first");
        }

        Thread t = new Thread(new Runnable() {
            public void run() {
                try {
                    // Listen for input
                    String inputLine, outputLine;
                    while ((inputLine = in.readLine()) != null) {
                        processInput(lobby, inputLine);

                        // Send ack back to server
                        String ackMessage = generateAck(inputLine);
                        out.println(ackMessage);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
        t.start();
    }

    private void processInput(Lobby lobby, String input) {
        if (input != null) {
            // Parse JSON object
            JSONObject obj = new JSONObject(input);
            int msgId = obj.getInt("msgId");
            String msgType = obj.getString("msgType");
            String dataString = obj.getJSONObject("data").toString(); // The structure will vary, so leave as String

            System.out.println("Processing message " + msgId + ": type '" + msgType + "'");

            // Execute command (null response indicates no result to hand back to client)
            String executeResult = lobby.executeCommand(msgType, dataString);
            if (executeResult != null) {
                System.out.println("Sending response:");
                System.out.println(executeResult);
                out.println(executeResult);
            }
        } else {
            System.out.println("Initialized link");
        }
    }

    private String generateAck(String input) {
        // Assume valid input string (not null; proper JSON format)
        JSONObject obj = new JSONObject(input);
        int ackId = obj.getInt("msgId");
        JSONObject response = new JSONObject();
        response.put("msgId", msgCount++);
        response.put("msgType", "ack");
        response.put("data", new JSONObject("{ ackNum: " + ackId + " }"));
        return response.toString();
    }

}
