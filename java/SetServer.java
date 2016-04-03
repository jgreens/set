import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import org.json.*;

public class SetServer {

    private static int msgCounter = 0;

    public static void main(String[] args) {
        // Initialize java server and listen for messages
        try (
            ServerSocket server = new ServerSocket(1010);
            Socket client = server.accept();
            PrintWriter out = new PrintWriter(client.getOutputStream(), true);
            BufferedReader in = new BufferedReader(new InputStreamReader(client.getInputStream()));
        ) {
            String inputLine, outputLine;

            // Initiate conversation with client
            outputLine = SetServer.processInput(null);
            System.out.println(outputLine);
            out.println(outputLine);

            while ((inputLine = in.readLine()) != null) {
                outputLine = SetServer.processInput(inputLine);
                System.out.println(outputLine);
                out.println(outputLine);
                if (outputLine.equals("STOP")) {
                    break;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String processInput(String input) {
        // Parse JSON string and separate into message type and data strings
        // Note: The structure of the data string will vary based on the message type
        if (input != null) {
            JSONObject obj = new JSONObject(input);
            String msgType = obj.getString("msgType");
            String dataString = obj.getJSONObject("data").toString();
            return "Processed message " + msgCounter++ + ": type '" + msgType + "'";
        } else {
            return "Processed null message";
        }
    }

}
