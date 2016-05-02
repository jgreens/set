public class Card{
  public int shape,color, number, fill;
  public Card(int s,int c, int n, int f){
    shape = s;
    color = c;
    number = n;
    fill = f;
  }
  public int parseCard(String c)
  {
    if (c.length() != 4) {
      return -1;
    }
    shape = getValidNum(c.charAt(0));
    color = getValidNum(c.charAt(1));
    number = getValidNum(c.charAt(2));
    fill = getValidNum(c.charAt(3));
    if(shape == -1 || color == -1 || number == -1 || fill == -1)
    {
      return -1; 
    }
    return 0;
  }
  public int getValidNum(char c)
  {
    if(c == '0'){
      return 0;
    }else if(c == '1'){
      return 1;
    }else if(c == '2'){
      return 2;
    }
    else{
      return -1; 
    }
  }
  public String toString()
  {
    return Integer.toString(shape) + Integer.toString(color) + Integer.toString(number) + Integer.toString(fill);
  }
  
  public void print()
  {
    System.out.print(toString()+" ");
  }
  /**
   * Overwriting the equals method so the HashMap understands what equivalent cards are.
   * 
   * @param  obj checks if the Object has the same value as the current card
   * @return boolean true if this and obj have the same value for all the fields
   */
  public boolean equals(Object obj){
    if (obj instanceof Card) {
      Card pp = (Card) obj;
      return (pp.shape == shape && pp. color == color && pp.number == number && pp.fill == fill);
    } else {
      return false;
    }
  }
  /**
   * Overwrites the hashCode function. This was necessary to accurately find if a specefic card exists in a HashMap
   * 
   * @return int hash value of the Card
   */
  public int hashCode(){
    Integer hashcode = new Integer(color*3+shape*3+fill*3+number*3);
    int hashv = hashcode.hashCode();
    return hashv;
  }
  
}
