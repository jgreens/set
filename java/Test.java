import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class Test {

    private static int msgCounter = 0;

    public static void main(String[] args) {
        try (
            ServerSocket server = new ServerSocket(1010);
            Socket client = server.accept();
            PrintWriter out = new PrintWriter(client.getOutputStream(), true);
            BufferedReader in = new BufferedReader(new InputStreamReader(client.getInputStream()));
        ) {
            String inputLine, outputLine;

            // Initiate conversation with client
            outputLine = Test.processInput(null);
            System.out.println(outputLine);
            out.println(outputLine);

            while ((inputLine = in.readLine()) != null) {
                outputLine = Test.processInput(inputLine);
                System.out.println(outputLine);
                out.println(outputLine);
                if (outputLine.equals("STOP")) {
                    break;
                } else if (outputLine.equals("PING_ALL")) {
                    // I DON'T THINK THIS IS ACTUALLY RUNNING
                    System.out.println("Pinging all clients");
                    out.println("PING_ALL");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String processInput(String input) {
        return "Processed message " + msgCounter++ + ": " + input;
    }

}
