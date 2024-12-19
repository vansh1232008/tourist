# travel-planner-bbsr

This is a DSA project that implements a modified Dijkstra's algorithm in C++, and a Singleton design pattern to create a travel planner for Bhubaneswar. 
<br>
# Problem statement
Navigating a city’s tourist attractions efficiently can enhance the travel experience for visitors. In a city with numerous famous spots, finding the shortest path and minimizing the number of stops between these locations can be challenging. This project aims to simplify this task by developing an algorithm that determines the optimal route between selected tourist spots.

# Solution
The project aims to provide users with the shortest path and minimum number of stops between famous spots in the city. By representing the city's locations and routes as a graph, the algorithm efficiently computes the optimal route. The project will focus on 11 key tourist attractions within the city.<br><br>
Implemented within a limited timeframe, this project showcases the application of graph algorithms in solving real-world travel planning problems, while also serving as a learning opportunity for students to reinforce their knowledge of data structures and algorithms.<br>

<br>
To run the application, run the following commands

# Creating objects
g++ -c travelplanner.cpp 

# Creating library
ar ru travelplanner_library.a travelplanner.o  

# Client
g++ -o client client.cpp travelplanner_library.a  

# Running client
./client 
