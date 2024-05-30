import { defineStore } from "pinia";
import { ref } from "vue";

export const useMapStore = defineStore("map", () => {
	const lng = ref(-128.0094);
	const lat = ref(50.6539);
	const zoom = ref(16);

	const data = ref({});

	const setData = (newData) => {
		data.value = newData;
	};

	return { lat, lng, zoom, data, setData };
});
