
// --- Define the map ---
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/fiord',
    center: [-79.41213748, 43.70385454],
    maxZoom: 12, 
    minZoom: 7, 
});


// --- Function to Add Cluster Layers ---
function addClusterLayer(id, dataUrl, color, sourceId) {

    // Add GeoJSON source with clustering
    map.addSource(sourceId, {
        type: 'geojson',
        data: dataUrl,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 10
    });

    // Add cluster layer with common paint properties
    map.addLayer({
        id: id, // Layer ID
        type: 'circle',
        source: sourceId,
        filter: ['has', 'point_count'],
        paint: {
            'circle-radius': {
                'base': 2,
                'stops': [[5, 2], [12, 4]],
            },
            'circle-color': color,
        },
    }, 'boundary_country_z5-'); // Place data above 'boundary_country_z5-', //
    // beware if map style changes 'boundary_country_z5-' may not be found
}


// --- Add Geojson Layers ---
map.on('load', function() {
    
    // --- Add English Population Layer ---
    addClusterLayer('clusters-en', './data/source_English.geojson', '#e41a1c', 'population-points-en');

    // --- Add Irish Population Layer ---
    addClusterLayer('clusters-ir', './data/source_Irish.geojson', '#377eb8', 'population-points-ir');

    // --- Add Scottish Population Layer ---
    addClusterLayer('clusters-sc', './data/source_Scottish.geojson', '#4daf4a', 'population-points-sc');

     // --- Add Chinese Population Layer ---
    addClusterLayer('clusters-ch', './data/source_Chinese.geojson', '#984ea3', 'population-points-ch');
    
    // --- Add Indian Population Layer ---
    addClusterLayer('clusters-in', './data/source_Indian.geojson', '#ff7f00', 'population-points-in');

    // --- Add Italian Population Layer ---
    addClusterLayer('clusters-it', './data/source_Italian.geojson', '#ffff33', 'population-points-it');

    // --- Add German Population Layer ---
    addClusterLayer('clusters-ge', './data/source_German.geojson', '#a65628', 'population-points-ge');

    // --- Add Filipino Population Layer ---
    addClusterLayer('clusters-fi', './data/source_Filipino.geojson', '#f781bf', 'population-points-fi');

    // Handle the interactive legend
    const layers = [
        { id: 'clusters-en', checkboxId: 'en' },
        { id: 'clusters-ir', checkboxId: 'ir' },
        { id: 'clusters-sc', checkboxId: 'sc' },
        { id: 'clusters-ch', checkboxId: 'ch' },
        { id: 'clusters-in', checkboxId: 'in' },
        { id: 'clusters-it', checkboxId: 'it' },
        { id: 'clusters-ge', checkboxId: 'ge' },
        { id: 'clusters-fi', checkboxId: 'fi' }
    ];

    // Add event listeners for each checkbox
    layers.forEach(layer => {
        const checkbox = document.getElementById(layer.checkboxId);
        
        checkbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            map.setLayoutProperty(layer.id, 'visibility', isChecked ? 'visible' : 'none');
        });

        // Set initial visibility based on checkbox state
        const initialVisibility = checkbox.checked ? 'visible' : 'none';
        map.setLayoutProperty(layer.id, 'visibility', initialVisibility);
    });

});


