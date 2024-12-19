#ifndef TRAVELPLANNER_HPP
#define TRAVELPLANNER_HPP

#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <queue>
#include <algorithm>
#include <limits>

/**
 * @class TravelPlanner
 * @brief Singleton class to manage travel planning within a city.
 */
class TravelPlanner {
private:
    // Singleton instance
    static TravelPlanner* travelPlannerInstance;

    // Number of locations
    int numLocations;

    // Lists of locations and routes
    std::vector<std::string> locations;
    std::vector<std::vector<std::string>> routes;

    // Graph representations
    std::vector<std::vector<std::pair<int, double>>> adjacencyList;
    std::vector<std::vector<double>> edges;

    // Mappings between location names and indices
    std::unordered_map<std::string, int> locationToIndex;
    std::unordered_map<int, std::string> indexToLocation;
    std::unordered_map<std::string, std::string> locationToDisplayName;

    // City name for flexibility
    std::string cityName;

    /**
     * @brief Private constructor for Singleton pattern.
     * @param numOfLocations Number of locations in the city.
     * @param places Vector of location names.
     * @param paths Vector of routes between locations.
     * @param city Name of the city.
     */
    TravelPlanner(int numOfLocations, const std::vector<std::string>& places,
                 const std::vector<std::vector<std::string>>& paths, const std::string& city);

    // Deleted copy constructor and assignment operator to enforce Singleton
    TravelPlanner(const TravelPlanner&) = delete;
    TravelPlanner& operator=(const TravelPlanner&) = delete;

public:
    /**
     * @brief Static method to get the Singleton instance of TravelPlanner.
     * @param numOfLocations Number of locations in the city.
     * @param places Vector of location names.
     * @param paths Vector of routes between locations.
     * @param city Name of the city (default is "Bangalore").
     * @return Pointer to the TravelPlanner instance.
     */
    static TravelPlanner* getTravelPlanner(int numOfLocations, const std::vector<std::string>& places,
                                          const std::vector<std::vector<std::string>>& paths, const std::string& city = "Bangalore");

    /**
     * @brief Display all available locations.
     */
    void displayLocations() const;

    /**
     * @brief Display all available routes with distances.
     */
    void displayRoutes() const;

    /**
     * @brief Create edge vectors and mappings from routes.
     */
    void createEdgeVector();

    /**
     * @brief Create adjacency list from edge vectors.
     */
    void createAdjacencyList();

    /**
     * @brief Find and display the shortest path with minimum stops between two locations.
     * @param src Source location.
     * @param dst Destination location.
     */
    void shortestPathWithMinimumStops(const std::string& src, const std::string& dst) const;

    /**
     * @brief Get the list of locations.
     * @return A constant reference to the vector of location names.
     */
    const std::vector<std::string>& getLocations() const;
};

#endif // TRAVELPLANNER_HPP
