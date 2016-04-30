import java.util.*;
public class Test{
  public static void main(String[] args)
  {
    Game g = new Game("hu7cha","hula");
    Card c3 = new Card(0,0,0,0);
    Card o = new Card(0,0,2,0);
    ArrayList<Card> poop = new ArrayList<Card>();
    poop.add(c3);
    poop.add(o);
    poop.remove(new Card(0,0,0,0));
    for(int i = 0; i < poop.size(); i++) {
      System.out.println("ppop "+poop.get(i));
    }
    g.printBoard();
    System.out.println(g.hasSet());
    g.removeCard(0);
    g.printBoard();
    System.out.println(g.hasSet());
  } 
}