/*
  Copyright (c) 2013, 2014, Oracle and/or its affiliates. All rights reserved.

  The MySQL Connector/J is licensed under the terms of the GPLv2
  <http://www.gnu.org/licenses/old-licenses/gpl-2.0.html>, like most MySQL Connectors.
  There are special exceptions to the terms and conditions of the GPLv2 as it is applied to
  this software, see the FOSS License Exception
  <http://www.mysql.com/about/legal/licensing/foss-exception.html>.

  This program is free software; you can redistribute it and/or modify it under the terms
  of the GNU General Public License as published by the Free Software Foundation; version 2
  of the License.

  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
  without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with this
  program; if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth
  Floor, Boston, MA 02110-1301  USA

 */
import java.util.*;
import java.sql.*;

public class Database {
    	public Connection con = null;     
    	public Statement s;
    	
    	
    	public Database() {
    		connectDB();
    		try {
				s = con.createStatement();
			} catch (SQLException e) {
				e.printStackTrace();
			}
    		createTable();
    	} 
    	
		//Connect to database
		public void connectDB(){
    	try{
    		Class.forName("com.mysql.jdbc.Driver").newInstance();
    		con = DriverManager.getConnection("jdbc:mysql://localhost:3306/set","guest","password");
    		if (!con.isClosed())
    			System.out.println("Successfully connected to MySQL Server...");
    	}
    	catch (Exception e) {
    		System.err.println("Exception: " + e.getMessage());
    	}
		}
		
		//reset tables
		public void resetTable(){
			try {
				s.executeUpdate("DROP TABLE IF EXISTS player");
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		
        // Create Table
		public void createTable(){
    	try {
			s.executeUpdate(
					"CREATE TABLE IF NOT EXISTS player("
					+ "userId INT UNSIGNED NOT NULL AUTO_INCREMENT,"
					+ "PRIMARY KEY (userId),"
					+ "userName CHAR(40), passWord CHAR(64), gameID CHAR(40), owner INT(1), "
					+ "UNIQUE KEY (userName))");
		} catch (SQLException e) {
			e.printStackTrace();
		}
		}
    	
		
    	//RegisterUser
    	public String registerUser(String username,String password){
    		try{    		
    			String updateString = "INSERT INTO set.player (userName,passWord) VALUES (?,SHA2(?,256))";
    			PreparedStatement updateName = con.prepareStatement(updateString);
    			updateName.setString(1,username);
    			updateName.setString(2,password);
    			updateName.executeUpdate();
    		}
    		catch(SQLException SE){
    			if (SE.getErrorCode()==1062) return "User " + username + " is already registered.";
    			else return SE.getMessage();
    		}
    		return username;
    	}

    	
    	//Login User
    	public String loginUser(String username, String password){
    		String loginresult="No match found";
    		try {
    			String updateString = "SELECT EXISTS(SELECT 1 FROM player WHERE username=? AND password=SHA2(?,256))";
    			PreparedStatement updateName = con.prepareStatement(updateString);
    			updateName.setString(1,username);
    			updateName.setString(2,password);
    			ResultSet rs = updateName.executeQuery();
    			ResultSetMetaData rsmd = rs.getMetaData();
    			 String columnname = rsmd.getColumnName(1);
				while (rs.next()){
					if (rs.getInt(columnname)==1) loginresult = username;
				}
    		}
    		catch (SQLException SE) {
			return SE.getMessage();
    		}
			return loginresult;
    	}
    	
    	
    	//clean up
    	public void disconnectDB(){
    		try{ 
    			s.close();
    			if (con != null){
    				con.close();
    				System.out.println("Disconnected from MySQL Server");
    			}
    		} catch(SQLException e) {}
    	}
	}




