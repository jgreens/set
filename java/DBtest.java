import java.sql.*;
import java.util.*;

public class lobbytest{
  public static void main(String[] args){
	  Connection con = null;    	
	  try{
	  Class.forName("com.mysql.jdbc.Driver").newInstance();
		con = DriverManager.getConnection("jdbc:mysql://localhost:3306/testdatabase?useSSL=false","root","fontaine17");
		
		Statement s = con.createStatement();
		if (!con.isClosed())
			System.out.println("Successfully connected to MySQL Server...");
		s.executeUpdate("DROP TABLE IF EXISTS player");
		s.executeUpdate(
	    			"CREATE TABLE IF NOT EXISTS player("
	    			+ "pid INT UNSIGNED NOT NULL AUTO_INCREMENT,"
	    			+ "PRIMARY KEY (pid),"
	    			+ "username CHAR(40), password CHAR(40), "
	    			+ "UNIQUE KEY (username))");
		s.executeUpdate("INSERT INTO player (username,password) VALUES ('user1','pword1')");
		try{
			s.executeUpdate("INSERT INTO player (username,password) VALUES ('user2','pword2')");
			s.executeQuery("SELECT pid FROM player WHERE username = 'user2'");
			ResultSet rs=s.getResultSet();
			while(rs.next()){
			String playerid=rs.getString("pid");
			System.out.println("User registered, id = " + playerid );
			}
	   		s.executeQuery("SELECT EXISTS(SELECT 1 FROM player WHERE username='user2' AND password='pword2');");
    		ResultSet rs2=s.getResultSet();
    		while (rs2.next()){
    			int found=rs2.getInt("EXISTS(SELECT 1 FROM player WHERE username='user2' AND password='pword2')");
    			System.out.println("found:" + found);
    		}
		}
			catch(SQLException SE){
				System.out.println(SE.getErrorCode());
			}
		
		s.close();
  	} catch (Exception e) {
	System.err.println("Exception: " + e.getMessage());
}finally{
	try{ 
		if (con != null){
			con.close();
			System.out.println("Disconnected from MySQL Server");
		}
	} catch(SQLException e) {}
}
}
}