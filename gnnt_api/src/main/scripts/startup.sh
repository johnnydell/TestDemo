./stop.sh
cp=./bin
for file in ./lib/*.jar
do
   cp=$cp:$file
done
nohup java -classpath $cp gnnt.mebs.api.ServerStart gnntApi >>./logs/sys.log & 
