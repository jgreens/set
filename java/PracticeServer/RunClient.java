public class RunClient{
  
  public static void main(String[] args)
  {
    PracticeClient client = new PracticeClient(6789,"127.0.0.1");//127.0.0.1
    client.startRunning();
  }
  
}