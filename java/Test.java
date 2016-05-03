import java.util.*;
public class Test{
  public static void main(String[] args)
  {
    Game g = new Game("hi","hi");
    g.start();
    g.printBoard();
    System.out.println(g.hasSet());
      g.removeCard(2);
      g.removeCard(2);
      g.removeCard(0);
      g.drawThree(1,1,1);
    g.printBoard();
    System.out.println(g.hasSet());
  }
}