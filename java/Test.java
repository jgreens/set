import java.util.*;
public class Test{
  public static void main(String[] args)
  {
    Game g = new Game();
    g.printBoard();
    System.out.println(g.hasSet());
    g.removeCard(0);
    g.printBoard();
    
    
  } 
}