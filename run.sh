cd java
javac -cp org.json.jar Set.java SetServer.java Lobby.java Game.java Card.java
sudo java -cp .:org.json.jar Set SetServer Lobby Game Card >../logs/java.log 2>../logs/java.err &
cd ..
mkdir logs
node node/app.js >logs/node.log 2>logs/node.err &
