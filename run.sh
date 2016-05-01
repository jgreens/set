cd java
javac -cp org.json.jar:com.mysql.jdbc.Driver.jar Set.java SetServer.java Lobby.java Game.java Card.java Database.java User.java
sudo java -cp .:org.json.jar:com.mysql.jdbc.Driver.jar Set SetServer Lobby Game Card Database User >../logs/java.log 2>../logs/java.err &
cd ..
mkdir -p logs
node node/app.js >logs/node.log 2>logs/node.err &
