export const useMapStore = defineStore("map", () => {
	const lng = ref(-128.0094);
	const lat = ref(50.6539);
	const zoom = ref(16);

	return { lat, lng, zoom };
});
