// script.js

// List of locations in Bangalore
const locationsList = [
    "Bangalore City Railway Station",
    "Bangalore Palace",
    "Lalbagh Botanical Garden",
    "Cubbon Park",
    "UB City",
    "Commercial Street",
    "Vidhana Soudha",
    "ISKCON Temple",
    "Bannerghatta National Park",
    "Nandi Hills",
    "MG Road",
    "Koramangala",
    "Indiranagar",
    "Jayanagar",
    "Whitefield",
    "Electronic City",
    "Marathahalli",
    "HSR Layout",
    "Banashankari",
    "J.P. Nagar"
];

// Paths between locations with distances in kilometers
const paths = [
    ["Bangalore City Railway Station", "Bangalore Palace", 4.5],
    ["Bangalore City Railway Station", "Lalbagh Botanical Garden", 5],
    ["Bangalore City Railway Station", "Cubbon Park", 3],
    ["Bangalore Palace", "Lalbagh Botanical Garden", 6],
    ["Bangalore Palace", "UB City", 7],
    ["Lalbagh Botanical Garden", "Cubbon Park", 2],
    ["Cubbon Park", "Vidhana Soudha", 3.5],
    ["Vidhana Soudha", "ISKCON Temple", 5],
    ["ISKCON Temple", "Bannerghatta National Park", 12],
    ["Bannerghatta National Park", "Nandi Hills", 35],
    ["Commercial Street", "UB City", 2],
    ["Commercial Street", "Vidhana Soudha", 4],
    ["UB City", "ISKCON Temple", 8],
    ["Cubbon Park", "Commercial Street", 3],
    ["Bangalore City Railway Station", "Commercial Street", 4],
    ["Nandi Hills", "Bangalore Palace", 40],
    ["Lalbagh Botanical Garden", "ISKCON Temple", 10],
    ["Vidhana Soudha", "Nandi Hills", 38],
    ["MG Road", "Koramangala", 5],
    ["MG Road", "Indiranagar", 6],
    ["Indiranagar", "Jayanagar", 7],
    ["Jayanagar", "Whitefield", 15],
    ["Whitefield", "Electronic City", 12],
    ["Electronic City", "Marathahalli", 8],
    ["Marathahalli", "HSR Layout", 6],
    ["HSR Layout", "Banashankari", 10],
    ["Banashankari", "J.P. Nagar", 9],
    // Added connection to bridge MG Road to Commercial Street
    ["MG Road", "Commercial Street", 3]
];

// Graph representation using adjacency list
let graph = {};

// Initialize the graph
function initializeGraph() {
    locationsList.forEach(location => {
        graph[location] = [];
    });

    paths.forEach(path => {
        const [source, destination, distance] = path;
        graph[source].push({ node: destination, distance: distance });
        // Assuming bidirectional routes
        graph[destination].push({ node: source, distance: distance });
    });
}

// Priority Queue Implementation using Min-Heap
class PriorityQueue {
    constructor() {
        this.nodes = [];
    }

    enqueue(priority, key) {
        this.nodes.push({ priority, key });
        this.bubbleUp();
    }

    dequeue() {
        if (this.isEmpty()) return null;
        const smallest = this.nodes[0];
        const end = this.nodes.pop();
        if (this.nodes.length > 0) {
            this.nodes[0] = end;
            this.bubbleDown();
        }
        return smallest;
    }

    isEmpty() {
        return this.nodes.length === 0;
    }

    bubbleUp() {
        let idx = this.nodes.length - 1;
        const element = this.nodes[idx];

        while (idx > 0) {
            let parentIdx = Math.floor((idx - 1) / 2);
            let parent = this.nodes[parentIdx];

            if (element.priority >= parent.priority) break;

            this.nodes[parentIdx] = element;
            this.nodes[idx] = parent;
            idx = parentIdx;
        }
    }

    bubbleDown() {
        let idx = 0;
        const length = this.nodes.length;
        const element = this.nodes[0];

        while (true) {
            let leftChildIdx = 2 * idx + 1;
            let rightChildIdx = 2 * idx + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIdx < length) {
                leftChild = this.nodes[leftChildIdx];
                if (leftChild.priority < element.priority) {
                    swap = leftChildIdx;
                }
            }

            if (rightChildIdx < length) {
                rightChild = this.nodes[rightChildIdx];
                if (
                    (swap === null && rightChild.priority < element.priority) ||
                    (swap !== null && rightChild.priority < leftChild.priority)
                ) {
                    swap = rightChildIdx;
                }
            }

            if (swap === null) break;

            this.nodes[idx] = this.nodes[swap];
            this.nodes[swap] = element;
            idx = swap;
        }
    }
}

// Dijkstra's Algorithm Implementation
function findShortestPath(source, destination) {
    let distances = {};
    let previous = {};
    let pq = new PriorityQueue();

    // Initialize distances and previous
    locationsList.forEach(location => {
        distances[location] = Infinity;
        previous[location] = null;
    });

    distances[source] = 0;
    pq.enqueue(0, source);

    while (!pq.isEmpty()) {
        let current = pq.dequeue().key;

        if (current === destination) break;

        graph[current].forEach(neighbor => {
            let alt = distances[current] + neighbor.distance;
            if (alt < distances[neighbor.node]) {
                distances[neighbor.node] = alt;
                previous[neighbor.node] = current;
                pq.enqueue(alt, neighbor.node);
            }
        });
    }

    // Reconstruct the path
    let path = [];
    let u = destination;
    if (previous[u] !== null || u === source) {
        while (u !== null) {
            path.unshift(u);
            u = previous[u];
        }
    }

    return { distance: distances[destination], path: path };
}

// Initialize Leaflet Map
let map;
let markers = {};
let polyline;

// Coordinates for each location (Adjust as needed)
const locationCoordinates = {
    "Bangalore City Railway Station": [12.9716, 77.5946],
    "Bangalore Palace": [12.9984, 77.5946],
    "Lalbagh Botanical Garden": [12.9585, 77.5848],
    "Cubbon Park": [12.9762, 77.5903],
    "UB City": [12.9763, 77.6034],
    "Commercial Street": [12.9665, 77.6031],
    "Vidhana Soudha": [12.9716, 77.5950],
    "ISKCON Temple": [12.9454, 77.6175],
    "Bannerghatta National Park": [12.8008, 77.6870],
    "Nandi Hills": [13.3626, 77.6618],
    "MG Road": [12.9754, 77.6050],
    "Koramangala": [12.9279, 77.6271],
    "Indiranagar": [12.9716, 77.6411],
    "Jayanagar": [12.9141, 77.6144],
    "Whitefield": [12.9890, 77.7500],
    "Electronic City": [12.8256, 77.6785],
    "Marathahalli": [12.9820, 77.7194],
    "HSR Layout": [12.9123, 77.6470],
    "Banashankari": [12.9237, 77.5663],
    "J.P. Nagar": [12.9141, 77.6101]
};

function initializeMap() {
    map = L.map('map').setView([12.9716, 77.5946], 12); // Centered at Bangalore

    // Set up the OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add markers to the map
    for (const location in locationCoordinates) {
        markers[location] = L.marker(locationCoordinates[location])
            .addTo(map)
            .bindPopup(`<strong>${location}</strong>`)
            .on('click', function() {
                this.openPopup();
            });
    }
}

// Draw Path on the Map with Animation
function drawPath(path) {
    // Remove existing polyline if any
    if (polyline) {
        map.removeLayer(polyline);
    }

    // Prepare LatLngs for the path
    let latlngs = path.map(location => locationCoordinates[location]);

    // Initialize an empty polyline
    polyline = L.polyline([], { color: 'blue', weight: 5, opacity: 0.7 }).addTo(map);

    // Function to add points one by one for animation
    let i = 0;
    function addPoint() {
        if (i < latlngs.length) {
            polyline.addLatLng(latlngs[i]);
            i++;
            setTimeout(addPoint, 300); // Adjust speed of animation here (milliseconds)
        } else {
            map.fitBounds(polyline.getBounds());
        }
    }

    addPoint();
}

// Show Toast Notification
function showToast(message, bg = 'success') {
    const toastContainer = document.getElementById('liveToast');
    const toastBody = document.getElementById('toast-body');
    toastBody.innerText = message;
    const toast = new bootstrap.Toast(toastContainer);
    toastContainer.classList.remove('text-bg-success', 'text-bg-danger', 'text-bg-warning');
    toastContainer.classList.add(`text-bg-${bg}`);
    toast.show();
}

// Save Favorite Route to Local Storage
function saveFavoriteRoute(source, destination, distance, path) {
    let favorites = JSON.parse(localStorage.getItem('favoriteRoutes')) || [];
    // Check for duplicates
    const exists = favorites.some(route => route.source === source && route.destination === destination);
    if (!exists) {
        favorites.push({ source, destination, distance, path });
        localStorage.setItem('favoriteRoutes', JSON.stringify(favorites));
        showToast(`Route from ${source} to ${destination} saved to favorites!`, 'success');
    } else {
        showToast('This route is already in your favorites.', 'warning');
    }
}

// Display Favorite Routes
function displayFavorites() {
    const favoritesDiv = document.getElementById('favorites');
    favoritesDiv.innerHTML = ''; // Clear previous favorites
    let favorites = JSON.parse(localStorage.getItem('favoriteRoutes')) || [];

    if (favorites.length === 0) {
        favoritesDiv.innerHTML = `<p class="text-muted">No favorite routes saved.</p>`;
        return;
    }

    let list = document.createElement('ul');
    list.classList.add('list-group');

    favorites.forEach((route, index) => {
        let listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        listItem.innerHTML = `
            <span><strong>${route.source}</strong> &rarr; <strong>${route.destination}</strong> (${route.distance} kms)</span>
            <button class="btn btn-sm btn-danger" data-index="${index}" title="Delete Route"><i class="fas fa-trash"></i></button>
        `;
        list.appendChild(listItem);
    });

    favoritesDiv.appendChild(list);

    // Add event listeners to delete buttons
    favoritesDiv.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            deleteFavoriteRoute(index);
        });
    });
}

// Delete Favorite Route
function deleteFavoriteRoute(index) {
    let favorites = JSON.parse(localStorage.getItem('favoriteRoutes')) || [];
    favorites.splice(index, 1);
    localStorage.setItem('favoriteRoutes', JSON.stringify(favorites));
    displayFavorites();
    showToast('Favorite route deleted.', 'danger');
}

// Toggle Dark Mode
const themeToggleBtns = document.querySelectorAll('#theme-toggle');
themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        // Toggle icon
        if (document.body.classList.contains('dark-mode')) {
            btn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            btn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
});

// Handle Form Submission
document.getElementById('travel-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const source = document.getElementById('source').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const transport = document.getElementById('transport').value;

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results

    if (source === destination) {
        resultDiv.innerHTML = `<p class="text-danger"><i class="fas fa-exclamation-triangle"></i> Source and destination cannot be the same.</p>`;
        showToast('Source and destination cannot be the same.', 'danger');
        return;
    }

    // Validate entered locations
    if (!locationsList.includes(source) || !locationsList.includes(destination)) {
        resultDiv.innerHTML = `<p class="text-danger"><i class="fas fa-times-circle"></i> Please enter valid locations from the list.</p>`;
        showToast('Please enter valid locations from the list.', 'danger');
        return;
    }

    const result = findShortestPath(source, destination);

    if (result.distance === Infinity || result.path.length === 0) {
        resultDiv.innerHTML = `<p class="text-danger"><i class="fas fa-times-circle"></i> No available route from <strong>${source}</strong> to <strong>${destination}</strong>.</p>`;
        showToast('No available route for the selected locations.', 'warning');
    } else {
        const pathString = result.path.join(' &rarr; ');
        const averageSpeed = getAverageSpeed(transport); // km/h
        const estimatedTime = (result.distance / averageSpeed).toFixed(2);

        resultDiv.innerHTML = `
            <p><strong>Shortest Path from <em>${source}</em> to <em>${destination}</em>:</strong></p>
            <p><i class="fas fa-road"></i> Total Distance: <strong>${result.distance} kms</strong></p>
            <p><i class="fas fa-stopwatch"></i> Estimated Time: <strong>${estimatedTime} hours</strong></p>
            <p class="mt-2"><i class="fas fa-route"></i> Path: <span class="text-success">${pathString}</span></p>
            <button class="btn btn-outline-warning mt-3" id="save-favorite"><i class="fas fa-star"></i> Save to Favorites</button>
        `;
        drawPath(result.path);

        // Handle Save to Favorites
        document.getElementById('save-favorite').addEventListener('click', function() {
            saveFavoriteRoute(source, destination, result.distance, result.path);
            displayFavorites();
        });

        showToast('Path found successfully!', 'success');
    }
});

// Get Average Speed Based on Transportation Mode
function getAverageSpeed(mode) {
    switch(mode) {
        case 'driving':
            return 40; // km/h
        case 'walking':
            return 5; // km/h
        case 'cycling':
            return 15; // km/h
        case 'transit':
            return 25; // km/h
        default:
            return 40;
    }
}

// Handle Contact Form Submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (name === "" || email === "" || message === "") {
        showToast('Please fill in all fields.', 'danger');
        return;
    }

    // Here you can add code to send the data to your server or an email service
    // For demonstration, we'll just show a success toast and reset the form

    showToast('Your message has been sent successfully!', 'success');
    document.getElementById('contact-form').reset();
});

// Initialize Favorites and Autocomplete on Page Load
document.addEventListener('DOMContentLoaded', function() {
    initializeGraph();
    initializeMap();
    displayFavorites();

    // Initialize jQuery UI Autocomplete
    $(".autocomplete-input").autocomplete({
        source: locationsList,
        minLength: 1,
        select: function(event, ui) {
            // Optionally handle selection
        }
    });
});
