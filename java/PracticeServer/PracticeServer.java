import java.io.*;
import java.net.*;
import java.util.*;
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
public class PracticeServer{
  ServerSocket server;
  Socket connection;
  ObjectOutputStream output;
  ObjectInputStream input;
  int portnum;
  int maxPeople;
  public PracticeServer(int p, int m)
  {
    portnum = p;
    maxPeople = m;
  }
  
  public void startRunning(){
    try{
      server = new ServerSocket(portnum, maxPeople); //6789 is a dummy port for testing, this can be changed. The 100 is the maximum people waiting to connect.
      while(true){
        try{
          //Trying to connect and have conversation
          System.out.println("Waiting for someone to connect...");
          connection = server.accept();
          System.out.println("Connected to" +connection.getInetAddress().getHostName());
          
          //setup streams to send and recieve data
          output = new ObjectOutputStream(connection.getOutputStream());
          output.flush();
          input = new ObjectInputStream(connection.getInputStream());
          
          sendMessage("You have been connected!");
          chat();
          
        }catch(EOFException eofException){
          System.out.println("\n Server ended the connection! ");
        } finally{
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
    } catch (IOException ioException){
      ioException.printStackTrace();
    }
  }
  
  private void sendMessage(String message)
  {
    try{
      output.writeObject("SERVER - "+message);
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
        System.out.println("The user has sent an unknown object!");
      }
    }while(!message.equals("CLIENT - END"));
  }
}