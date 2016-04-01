# set
Multi-client card game for ECE-361.

## Running

### Node.js
```
cd node/
npm install
node app.js
```

### Java

#### org.json
```
curl -O http://central.maven.org/maven2/org/json/json/20160212/json-20160212.jar
mv json-20160212.jar org.json.jar
```
Use the classpath attribute when compiling and running the server:
```
javac -cp org.json.jar SetServer.java
java -cp .:org.json.jar SetServer.java
```
