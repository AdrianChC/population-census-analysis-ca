#!/usr/bin/env bash
# create_pmtiles.sh
# ---------------------------------------------------------------------------
# Converts the neighborhood density GeoJSON from Lesson 2.3 into a PMTiles
# file for use with MapLibre GL JS.
#
# PMTiles is a single-file archive of vector tiles — no tile server needed.
# The browser fetches only the tiles it needs using HTTP range requests.
#
# Input:   ./data/processed/anch_june.geojson
#          (58,594 Point features with anchorage points data)
#
# Output:  data.pmtiles
#
# Prerequisites:
#   - tippecanoe installed (tippecanoe --version to check)
#     macOS:   brew install tippecanoe
#     Ubuntu:  see https://github.com/felt/tippecanoe#installation
#     Docker:  docker run -v $(pwd):/data ghcr.io/felt/tippecanoe:latest ...
#
# Usage:   bash create_pmtiles.sh
# ---------------------------------------------------------------------------

set -e

GEOJSON_INPUT="./data/processed/anch_june.geojson"
OUTPUT="./data/data.pmtiles"

# --- Check prerequisites --------------------------------------------------
if ! command -v tippecanoe &> /dev/null; then
    echo "❌ tippecanoe is not installed."
    echo ""
    echo "Install it:"
    echo "  macOS:  brew install tippecanoe"
    echo "  Ubuntu: git clone https://github.com/felt/tippecanoe.git && cd tippecanoe && make -j && sudo make install"
    echo "  Docker: docker run -v \$(pwd):/data ghcr.io/felt/tippecanoe:latest tippecanoe ..."
    exit 1
fi

# --- Check input file -----------------------------------------------------
if [ ! -f "$GEOJSON_INPUT" ]; then
    echo "❌ Input file not found: $GEOJSON_INPUT"
    echo "   Make sure you completed Lesson 2.3 and the GeoJSON export."
    echo "   Expected: ./data/output/anch_june.geojson"
    exit 1
fi

echo "📁 Input:  $GEOJSON_INPUT"
echo "📦 Output: $OUTPUT"
echo ""

# --- Convert to PMTiles ---------------------------------------------------
echo "🔄 Running tippecanoe..."
# -Z0       -> min zoom level 0 Includes features starting at zoom level 0 - the whole world
# -z4       -> max zoom level 4 Medium-sized country (e.g. France, Spain, Peru)
# -r1       -> Drop rate = 1 Disables point thinning. Keep every point instead of reducing density at low zooms.
# -pk       -> Preserve attributes, keeps all feature properties from the input dataset
# -pf       -> Preserve full precision, does not simplify or round geometries
# -l        -> layer name inside the tileset (referenced in MapLibre style)
# -o        -> output file
# --force   -> overwrite if output already exists

tippecanoe \
    -Z0 \
    -z4 \
    -r1 \
    -pk \
    -pf \
    -l anch_june \
    -o "$OUTPUT" \
    --force \
    "$GEOJSON_INPUT"

# --- Verify ---------------------------------------------------------------
echo ""
FILE_SIZE=$(wc -c < "$OUTPUT" | tr -d ' ')
echo "✅ Created $OUTPUT ($FILE_SIZE bytes)"
echo ""
echo "🎉 Done! Open index.html with a local server to see the map:"
echo "   python3 -m http.server 8080"
echo "   Then open http://localhost:8080"
