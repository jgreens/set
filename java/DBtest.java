import java.sql.*;
import java.util.*;

public class DBtest{
  public static void main(String[] args){  
	  Database d = new Database();	 
	  String s1="name1";
	  String s2="pword2";
	  String username = d.registerUser(s1, s2);
	  System.out.println(username);
	  String s3="name1";
	  String s4="pword2";
	  String username2 = d.registerUser(s3, s4);
	  System.out.println(username2);
	  String username3 = d.loginUser("name1", "pword2");
	  System.out.println(username3);
	  String username4 = d.loginUser("name1", "pword1");
	  System.out.println(username4);
	  d.disconnectDB();

}
}