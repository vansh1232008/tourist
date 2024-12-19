#include "travelplanner.hpp"
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <limits>

int main() {
    // Number of locations in Bangalore
    int n = 10;

    // List of famous places in Bangalore
    std::vector<std::string> places = {
        "Bangalore City Railway Station",
        "Bangalore Palace",
        "Lalbagh Botanical Garden",
        "Cubbon Park",
        "UB City",
        "Commercial Street",
        "Vidhana Soudha",
        "ISKCON Temple",
        "Bannerghatta National Park",
        "Nandi Hills"
    };

    // Paths between places with distances in kilometers
    std::vector<std::vector<std::string>> paths = {
        {"Bangalore City Railway Station", "Bangalore Palace", "4.5"},
        {"Bangalore City Railway Station", "Lalbagh Botanical Garden", "5"},
        {"Bangalore City Railway Station", "Cubbon Park", "3"},
        {"Bangalore Palace", "Lalbagh Botanical Garden", "6"},
        {"Bangalore Palace", "UB City", "7"},
        {"Lalbagh Botanical Garden", "Cubbon Park", "2"},
        {"Cubbon Park", "Vidhana Soudha", "3.5"},
        {"Vidhana Soudha", "ISKCON Temple", "5"},
        {"ISKCON Temple", "Bannerghatta National Park", "12"},
        {"Bannerghatta National Park", "Nandi Hills", "35"},
        {"Commercial Street", "UB City", "2"},
        {"Commercial Street", "Vidhana Soudha", "4"},
        {"UB City", "ISKCON Temple", "8"},
        {"Cubbon Park", "Commercial Street", "3"},
        {"Bangalore City Railway Station", "Commercial Street", "4"},
        {"Nandi Hills", "Bangalore Palace", "40"},
        {"Lalbagh Botanical Garden", "ISKCON Temple", "10"},
        {"Vidhana Soudha", "Nandi Hills", "38"}
    };

    // Initialize the TravelPlanner with "Bangalore"
    TravelPlanner* planner = TravelPlanner::getTravelPlanner(n, places, paths, "Bangalore");

    // Display locations and routes
    planner->displayLocations();
    planner->displayRoutes();

    // Create graph representations
    planner->createEdgeVector();
    planner->createAdjacencyList();

    // Retrieve the list of locations
    const std::vector<std::string>& locationList = planner->getLocations();

    // Interactive query loop
    std::string prompt;
    std::cout << "Do you want to get the shortest path between your source and destination? Type Y or y to proceed: ";
    std::cin >> prompt;
    while (prompt == "Y" || prompt == "y") {
        int sourceNum, destinationNum;

        // Display the numbered list of locations
        std::cout << "\nList of Locations:\n";
        for (size_t i = 0; i < locationList.size(); ++i) {
            std::cout << i + 1 << ". " << locationList[i] << "\n";
        }

        // Prompt user to enter source location number
        std::cout << "Enter the number corresponding to your source location: ";
        while (!(std::cin >> sourceNum) || sourceNum < 1 || sourceNum > static_cast<int>(locationList.size())) {
            std::cin.clear(); // Clear error flags
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // Discard invalid input
            std::cout << "Invalid input. Please enter a number between 1 and " << locationList.size() << ": ";
        }

        // Prompt user to enter destination location number
        std::cout << "Enter the number corresponding to your destination location: ";
        while (!(std::cin >> destinationNum) || destinationNum < 1 || destinationNum > static_cast<int>(locationList.size())) {
            std::cin.clear(); // Clear error flags
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // Discard invalid input
            std::cout << "Invalid input. Please enter a number between 1 and " << locationList.size() << ": ";
        }

        // Map numbers to location names
        std::string source = locationList[sourceNum - 1];
        std::string destination = locationList[destinationNum - 1];

        // Call the shortest path method
        planner->shortestPathWithMinimumStops(source, destination);

        std::cout << "Do you want to get another shortest path? Type Y or y to proceed: ";
        std::cin >> prompt;
    }

    std::cout << "\nThanks for using our Travel Planner application. Have a safe journey!\n";
    return 0;
}
