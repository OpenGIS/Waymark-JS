export const useMapStore = defineStore("map", () => {
	const lng = ref(-128.0094);
	const lat = ref(50.6539);
	const zoom = ref(16);

	const data = ref({
		type: "FeatureCollection",
		features: [
			{
				type: "Feature",
				geometry: { type: "Point", coordinates: [-128.0094, 50.6539] },
				properties: { type: "food" },
			},
		],
	});

	return { lat, lng, zoom, data };
});
