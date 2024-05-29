// Import MapLibre
import * as lib from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export function useMaplibre() {
	// Default values
	const id = "map";

	const { lng, lat, zoom, data } = storeToRefs(useMapStore());

	const state = ref({
		map: null,
	});

	onMounted(() => {
		// Create Map
		const map = new lib.Map({
			container: id,
			style: {
				version: 8,
				sources: {
					"osm-tiles": {
						type: "raster",
						tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
						tileSize: 256,
						attribution:
							'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
					},
				},
				layers: [
					{
						id: "osm-tiles",
						type: "raster",
						source: "osm-tiles",
					},
				],
			},
			center: [lng.value, lat.value],
			zoom: zoom.value,
		});

		// Add data to Map
		map.on("load", () => {
			map.addSource("data", {
				type: "geojson",
				data: data.value,
			});

			map.addLayer({
				id: "data",
				type: "circle",
				source: "data",
				paint: {
					"circle-radius": 10,
					"circle-color": "#007cbf",
				},
			});
		});

		// Sync Map Store when Map view changes
		map.on("move", () => {
			lng.value = map.getCenter().lng;
			lat.value = map.getCenter().lat;
			zoom.value = map.getZoom();
		});

		state.value.map = ref(map);
	});

	//Watchers
	watch(lng, (value) => {
		if (state.value.map) {
			state.value.map.setCenter([value, lat.value]);
		}
	});

	watch(lat, (value) => {
		if (state.value.map) {
			state.value.map.setCenter([lng.value, value]);
		}
	});

	watch(zoom, (value) => {
		if (state.value.map) {
			state.value.map.setZoom(value);
		}
	});

	return {
		state,
	};
}
