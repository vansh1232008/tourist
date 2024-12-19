#To run the application, run the following commands

#Creating objects
g++ -c travelplanner.cpp 

#Creating library
ar ru travelplanner_library.a travelplanner.o  

#Client
g++ -o client client.cpp travelplanner_library.a  

#Running client
./client 
