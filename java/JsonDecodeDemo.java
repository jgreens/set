import org.json.*;

class JsonEncodeDemo {
  
  public static void main(String[] args){
    String clientId = "a90";
    String username = "agnavada";
    String gameid = "g10";
    sendJSONMessage("GAME CREATE SUCCESS", clientId,username,gameid);
    
    
    JSONObject jo = new JSONObject();
    jo.put("firstName", "John");
    jo.put("lastName", "Doe");
    
    JSONArray ja = new JSONArray();
    ja.put(jo);
    
    JSONObject mainObj = new JSONObject();
    mainObj.put("employees", ja);
    
    //unraveling an array
    JSONArray kaka = mainObj.getJSONArray("employees");
    JSONObject names = kaka.getJSONObject(0);
    System.out.println(names.getString("firstName"));
    System.out.println(mainObj.toString());
  }
  
  public static void sendJSONMessage(String message, String... args)
  {
    JSONObject response = new JSONObject();  
    for (int i = 0; i < args.length-1;i+=2){
      response.put(args[i],args[i+1]);
    }
    System.out.println(response.toString());
  }
}