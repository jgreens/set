import java.util.*;
class Lobby{
  
 HashMap<Game,List<String>> games;//games with the user ids of all the participants
 
 
 public Lobby()
 {
   games = new HashMap<Game,List<String>>();
 }
  
  public String executeCommand(String command, String data)
  {
    if(command.length() == 0) {
      return "";
    }
    //String returnstr = "{\"msg\": \"Default return\"}";
    String returnstr = null;
    System.out.println("Executing " + command + " command");
    switch(command)
    {
      case "CLIENT CONNECT":
        // Create client with unique guid and no user logged in (user is null)
        break;
      case "CLIENT DISCONNECT":
        // Remove client with specified guid due to disconnect
        break;
      case "USER REGISTER":
        //create a User with the specified username and password and add into the database.
        break;
      case "USER LOGIN":
        //create a User with the specified username and password
        break;
      case "LOBBY LIST":
        //list all the current users in JSON
        break;
      case "GAME ADD":
        //create a game (add it to the lobby as created)
        break;
      case "GAME START":
        //start a game
        break;
      case "GAME SET":
        // check if the next three cards make a successful group, and if they exist on the board. 
        //If they do remove the three cards, update the corresponding score and returns three new cards if there are no more sets on the board. 
        break;
      default:
        // Handle invalid command type here
        break;
    }
    return returnstr;
  }
}
