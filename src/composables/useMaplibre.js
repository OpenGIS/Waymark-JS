import { onMounted, unref } from "vue";

// Import MapLibre
import * as MapLibreGL from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export function useMaplibre() {
	let id = "map";

	let lng = -128.0094;
	let lat = 50.6539;
	let zoom = 16;

	let map = null;

	const init = (config) => {
		console.log(config);

		if (config.id) {
			id = unref(config.id);
		}

		if (config.lng) {
			lng = unref(config.lng);
		}

		if (config.lat) {
			lat = unref(config.lat);
		}

		if (config.zoom) {
			zoom = unref(config.zoom);
		}

		// Create Map
		map = new MapLibreGL.Map({
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
	};

	return {
		map,
		init,
	};
}
