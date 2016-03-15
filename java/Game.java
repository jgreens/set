import java.util.*;
public class Game{
  /**
   * 2-D ArrayList the contains all the cards.
   */
  List<List<Card>> board;
  /**
   * The number of cards on the board.
   */
  int boardsize;
  /**
   * Hash Table of all the cards on the board. Used to improve effiency when determining if a set exists on the board
   */
  HashMap<Card,String> cardmap;
  
  /**
   * Constructor creates a board of 12 cards.
   * Also initializes the internal ArrayList and HashMap of Cards.
   * 
   */
  public Game(){
    board = new ArrayList<List<Card>>();  
    cardmap = new HashMap<Card,String>();
    boardsize = 0;
    drawThree();
    drawThree();
    drawThree();
    drawThree();    
  }
  
  /**
   * Draws three cards and sticks them on the board.
   *
   */
  public void drawThree()
  {
    ArrayList<Card> temp = new ArrayList<Card>(3);
    Random r = new Random();
    for(int j = 0; j < 3; j ++){
      Card card;
      int[] arr = new int[4];
      do{        
        for(int i = 0; i < 4; i ++)
        {        
          arr[i]=r.nextInt(3);
        }
        card = new Card(arr[0],arr[1],arr[2],arr[3]);
      }while(cardmap.containsKey(card));//make sure you generate a unique card
      
      temp.add(card);
      cardmap.put(card,arr[0] +" "+ arr[1]+ " "+ arr[2] +" "+ arr[3]);
    }
    board.add(temp);
    boardsize += 3;
  }
  /**
   * Prints the board. Used for debugging
   */
  public void printBoard(){
    
    for(int i = 0; i < board.size();i++)
    {
      for(int j = 0; j < board.get(i).size();j++)
      {
        board.get(i).get(j).print();
      }
      System.out.println("");
    }
    
  }
  /**
   * Checks if the board has a Set.
   * 
   * @return Boolean-Returns true if there is a set on the board, false otherwise
   */
  public Boolean hasSet()
  {
    for(int i = 0; i <boardsize-1; i++)
    {
      for(int j = i+1; j < boardsize;j++)
      {
        int rowi = i%3;
        int coli = i/3;
        int rowj = j%3;
        int colj = j/3;
        Card c1 = board.get(rowi).get(coli);
        Card c2 = board.get(rowj).get(colj);
        if(cardmap.containsKey(nextCard(c1,c2)))
        {
          return true; 
        }
      }
    }
    return false;
  }
  /**
   * Checks if the parameters form a Set
   * 
   * @param  c1 card one
   * @param  c2 card two
   * @param  c3 card three
   * @return Boolean- Returns true if these three cards form a set, returns false otherwise
   */
  public Boolean isSet(Card c1, Card c2, Card c3)
  {
    return nextCard(c1,c2).equals(c3);
  } 
  /**
   * Returns the card necessary to complete a set given two cards.
   * 
   * @param  c1 card one
   * @param  c2 card two
   * @return Card- Returns the card to complete the set
   */
  public Card nextCard(Card c1, Card c2)
  {
    Card c3 = new Card(0,0,0,0);
    
    if(c1.color == c2.color){
      c3.color = c1.color;
    }else{
      c3.color = (3-c2.color-c1.color);
    }
    
    if(c1.shape == c2.shape){
      c3.shape = c1.shape;
    }else{
      c3.shape = (3-c2.shape-c1.shape);
    }
    
    if(c1.fill == c2.fill){
      c3.fill = c1.fill;
    }else{
      c3.fill = (3-c2.fill-c1.fill);
    }
    
    if(c1.number == c2.number){
      c3.number = c1.number;
    }else{
      c3.number = (3-c2.number-c1.number); 
    }
    return c3;
  }
  /**
   * Removes the card at the specified index.
   * 
   * @param  i row number
   * @param  j column number
   * @return Boolean-whether or not the card at that index was removed
   */
  public Boolean removeCard(int i, int j)
  {
    if(j>3 || j < 0 || i <0 || i>=board.size())
    { return false;}
    board.get(i).remove(j).print();
    boardsize--;
    if(board.get(i).isEmpty())
    {
      board.remove(i);
    }else{
      //shift elements into proper place 
      //you wont need to shift if the last row was being removed because its the last row
      shift(i);
    }
    
    return true;
  }
  /**
   * ArrayList.Remove shifts the list down automagically, ensuring that there are no holes within individual rows
   * However there could still be rows with less than 3 elements. This method shifts the board so that there are no such empty holes.
   * 
   * @param row- shifts everything after and including this row. Row numbers start with 0.
   */
  public void shift(int row)
  {
   //basically checks if any row has less than 3 elements and fills it in
   //if row equals the last row then it skips this loop and doesnt do anything
   for(int i = row; i < board.size()-1; i++)
   {
     if(board.get(i).size() < 3)
     {//gets the first element of the next row and puts it at the end of this row
       board.get(i).add(board.get(i+1).remove(0));//
     }
   }
  }
}