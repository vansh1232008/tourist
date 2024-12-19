#include "travelplanner.hpp"

// Initialize the Singleton instance to nullptr
TravelPlanner* TravelPlanner::travelPlannerInstance = nullptr;

// Constructor implementation
TravelPlanner::TravelPlanner(int numOfLocations, const std::vector<std::string>& places,
                             const std::vector<std::vector<std::string>>& paths, const std::string& city)
    : numLocations(numOfLocations), locations(places), routes(paths), cityName(city) {}

// Static method to get the Singleton instance
TravelPlanner* TravelPlanner::getTravelPlanner(int numOfLocations, const std::vector<std::string>& places,
                                              const std::vector<std::vector<std::string>>& paths, const std::string& city) {
    if (travelPlannerInstance == nullptr) {
        travelPlannerInstance = new TravelPlanner(numOfLocations, places, paths, city);
    }
    return travelPlannerInstance;
}

// Display the list of locations
void TravelPlanner::displayLocations() const {
    std::cout << "--------------- Welcome to Travel Planner of " << cityName << " ---------------\n";
    std::cout << "These are our famous locations:\n";
    for (const auto& location : locations) {
        std::cout << "- " << location << "\n";
    }
    std::cout << "----------------------------------------------------------------------\n";
}

// Display the list of routes with distances
void TravelPlanner::displayRoutes() const {
    std::cout << "These are the direct routes from source to destination with distances (kms):\n";
    for (const auto& route : routes) {
        std::cout << route[0] << " to " << route[1] << " takes " << route[2] << " kms\n";
    }
    std::cout << "----------------------------------------------------------------------\n";
}

// Create edge vectors and mappings
void TravelPlanner::createEdgeVector() {
    // Mapping locations to indices
    for (int i = 0; i < locations.size(); ++i) {
        std::string lowerLocation = locations[i];
        std::transform(lowerLocation.begin(), lowerLocation.end(), lowerLocation.begin(), ::tolower);
        locationToIndex[lowerLocation] = i;
        indexToLocation[i] = locations[i];
        locationToDisplayName[lowerLocation] = locations[i];
    }

    // Creating edge vectors
    edges.resize(routes.size(), std::vector<double>(3, 0.0));
    for (size_t i = 0; i < routes.size(); ++i) {
        std::string source = routes[i][0];
        std::string destination = routes[i][1];
        double distance = std::stod(routes[i][2]);

        // Convert to lowercase for mapping
        std::transform(source.begin(), source.end(), source.begin(), ::tolower);
        std::transform(destination.begin(), destination.end(), destination.begin(), ::tolower);

        // Store as {sourceIndex, destinationIndex, distance}
        edges[i][0] = static_cast<double>(locationToIndex[source]);
        edges[i][1] = static_cast<double>(locationToIndex[destination]);
        edges[i][2] = distance;
    }
}

// Create adjacency list from edge vectors
void TravelPlanner::createAdjacencyList() {
    adjacencyList.resize(numLocations, std::vector<std::pair<int, double>>());
    for (const auto& edge : edges) {
        int source = static_cast<int>(edge[0]);
        int destination = static_cast<int>(edge[1]);
        double distance = edge[2];
        adjacencyList[source].emplace_back(destination, distance);
    }
}

// Get the list of locations
const std::vector<std::string>& TravelPlanner::getLocations() const {
    return locations;
}

// Find the shortest path with minimum stops using Dijkstra's algorithm
void TravelPlanner::shortestPathWithMinimumStops(const std::string& src, const std::string& dst) const {
    // Priority queue: {currentDistance, {currentStops, node}}
    using pqElement = std::pair<double, std::pair<int, int>>;
    std::priority_queue<pqElement, std::vector<pqElement>, std::greater<pqElement>> pq;

    // Convert source and destination to lowercase for mapping
    std::string srcLower = src;
    std::string dstLower = dst;
    std::transform(srcLower.begin(), srcLower.end(), srcLower.begin(), ::tolower);
    std::transform(dstLower.begin(), dstLower.end(), dstLower.begin(), ::tolower);

    // Check if both locations exist
    auto srcIt = locationToIndex.find(srcLower);
    auto dstIt = locationToIndex.find(dstLower);
    if (srcIt == locationToIndex.end() || dstIt == locationToIndex.end()) {
        std::cout << "Sorry, one or both of the specified locations are not listed. Please try again!\n";
        return;
    }

    int source = srcIt->second;
    int destination = dstIt->second;

    // Initialize distances and stops
    std::vector<double> distance(numLocations, std::numeric_limits<double>::max());
    std::vector<int> stops(numLocations, std::numeric_limits<int>::max());
    std::vector<int> parent(numLocations, -1);

    distance[source] = 0.0;
    stops[source] = 0;
    parent[source] = source;

    pq.push({0.0, {0, source}});

    while (!pq.empty()) {
        auto current = pq.top();
        pq.pop();

        double currentDistance = current.first;
        int currentStops = current.second.first;
        int u = current.second.second;

        // Early termination if destination is reached
        if (u == destination) {
            break;
        }

        // Explore adjacent nodes
        for (const auto& neighbor : adjacencyList[u]) {
            int v = neighbor.first;
            double edgeDistance = neighbor.second;
            double totalDistance = currentDistance + edgeDistance;
            int totalStops = currentStops + 1;

            // Relaxation condition
            if (distance[v] > totalDistance || (distance[v] == totalDistance && stops[v] > totalStops)) {
                distance[v] = totalDistance;
                stops[v] = totalStops;
                parent[v] = u;
                pq.push({distance[v], {stops[v], v}});
            }
        }
    }

    // Check if destination is reachable
    if (distance[destination] == std::numeric_limits<double>::max()) {
        std::cout << "Sorry, there are no available routes from " << src << " to " << dst << ".\n";
    } else {
        // Reconstruct the path
        std::vector<std::string> path;
        int node = destination;
        while (node != source) {
            path.push_back(indexToLocation.at(node));
            node = parent[node];
        }
        path.push_back(indexToLocation.at(source));
        std::reverse(path.begin(), path.end());

        // Display the results
        std::cout << "-------------------------------------------------------------\n";
        std::cout << "Shortest Path from " << src << " to " << dst << ":\n";
        std::cout << "Total Distance: " << distance[destination] << " kms\n";
        std::cout << "Number of Stops: " << (stops[destination] > 0 ? stops[destination] - 1 : 0) << "\n";
        std::cout << "Path: ";
        for (size_t i = 0; i < path.size(); ++i) {
            std::cout << path[i];
            if (i != path.size() - 1) {
                std::cout << " -> ";
            } else {
                std::cout << ".\n";
            }
        }
        std::cout << "-------------------------------------------------------------\n";
    }
}
