public class RunServer{
  
  public static void main(String[] args)
  {
    PracticeServer server = new PracticeServer(6789,100);
    server.startRunning();
  }
  
}