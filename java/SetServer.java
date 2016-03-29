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
        String json = "{\"method\": \"methodTest\", \"data\": \"dataTest\"}";
        RequestObject obj = RequestObject.fromJSON(json);
        System.out.println("METHOD: " + obj.method);
        System.out.println("DATA: " + obj.data);
        return;
        /*try (
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
        }*/
    }

    public static String processInput(String input) {
        if (input.equals("PING_ALL")) {
            // This isn't running...
            System.out.println("Pinging all clients");
        }
        return "Processed message " + msgCounter++ + ": " + input;
    }

    protected class RequestObject {
        public string method;
        public string data;

        public RequestObject(String method, String data) {
            this.method = method;
            this.data = data;
        }

        public static RequestObject fromJSON(string json) {
            JSONObject obj = new JSONObject(json);
            String m = obj.getString("method");
            String d = obj.getString("data");
            return RequestObject(m, d);
        }
    }

}
