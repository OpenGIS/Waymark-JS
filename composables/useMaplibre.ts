// Import MapLibre
import * as lib from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export function useMaplibre(options) {
	// Default values
	const id = options.id || "map";

	const lng = options.lng || -1.826252;
	const lat = options.lat || 51.179026;
	const zoom = options.zoom || 16;

	const state = ref({
		map: null,
	});

	// Watch options and update map
	watch(options, (newOptions, oldOptions) => {
		if (state.value.map) {
			state.value.map.setCenter([newOptions.lng, newOptions.lat]);
			state.value.map.setZoom(newOptions.zoom);
		}
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
			center: [lng, lat],
			zoom: zoom,
		});

		state.value.map = ref(map);
	});

	return {
		state,
	};
}
