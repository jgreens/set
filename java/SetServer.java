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

    public SetServer() {
        msgCount = 0;

        // Initialize java server and listen for messages
        try {
            server = new ServerSocket(1010);
            client = server.accept();
            out = new PrintWriter(client.getOutputStream(), true);
            in = new BufferedReader(new InputStreamReader(client.getInputStream()));
            // Initiate conversation with client
            String outputLine;
            outputLine = SetServer.processInput(null, null);
            System.out.println(outputLine);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void Listen(Lobby lobby) {
        try {
            // Listen for input
            String inputLine, outputLine;
            while ((inputLine = in.readLine()) != null) {
                outputLine = SetServer.processInput(lobby, inputLine);
                System.out.println(outputLine);

                // Send ack back to server
                String ackMessage = SetServer.generateAck(inputLine);
                out.println(ackMessage);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static String processInput(Lobby lobby, String input) {
        // Parse JSON string and separate into message type and data strings
        // Note: The structure of the data string will vary based on the message type
        if (input != null) {
            JSONObject obj = new JSONObject(input);
            int msgId = obj.getInt("msgId");
            String msgType = obj.getString("msgType");
            String dataString = obj.getJSONObject("data").toString();
            String executeResult = lobby.executeCommand(msgType, dataString);
            return "Processed message " + msgId + ": type '" + msgType + "' with result " + executeResult;
        } else {
            return "Initialized link";
        }
    }

    private static String generateAck(String input) {
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
