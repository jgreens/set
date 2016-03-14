import java.io.*;
import java.net.*;
import java.util.*;
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
public class PracticeClient{
  Socket connection;
  ObjectOutputStream output;
  ObjectInputStream input;
  int portnum;
  String serverip;
  public PracticeClient(int p, String n)
  {
    portnum = p;
    serverip = n;
  }
  
  public void startRunning(){
        try{
          //Trying to connect and have conversation
          System.out.println("Attempting to connect to host...");
          connection = new Socket(InetAddress.getByName(serverip),portnum);
          System.out.println("Connected to" +connection.getInetAddress().getHostName());
          
          //setup streams to send and recieve data
          output = new ObjectOutputStream(connection.getOutputStream());
          output.flush();
          input = new ObjectInputStream(connection.getInputStream());
          
          sendMessage("You have been connected!");
          chat();
          
        }catch(EOFException eofException){
          System.out.println("\n Client ended the connection! ");
        } catch(IOException io)
        {
          io.printStackTrace();
        }finally{
          System.out.println("Closing Connection");
          try{
            output.close();
            input.close();
            connection.close();
          }catch(IOException io)
          {
            io.printStackTrace(); 
          }
        }
  }
  
  private void sendMessage(String message)
  {
    try{
      output.writeObject("CLIENT - "+message);
      output.flush();
    }catch(IOException i)
    {
      System.out.println("ERROR: Cannot Send Message!");
    }
  }
  private void chat() throws IOException
  {
    Scanner scan = new Scanner(System.in);
    System.out.println("Type Message to send:");
    
    String message = scan.next();
    sendMessage(message);
    do{
      try{
        message = (String) input.readObject();
        System.out.println("\n" + message);
      }catch(ClassNotFoundException classNotFoundException){
        System.out.println("The Server has sent an unknown object!");
      }
    }while(!message.equals("SERVER - END"));
  }
}