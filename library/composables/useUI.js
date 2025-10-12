import { computed, shallowRef } from "vue";
import { storeToRefs } from "pinia";

// Import instanceStore
import { useInstanceStore } from "@/stores/instanceStore.js";

export function useUI() {
	const { panelOpen, activePanelKey, overlays } =
		storeToRefs(useInstanceStore());

	const mapHasOverlays = computed(() => {
		return overlays.value.length > 0;
	});

	// Check if the panel is active
	const isActivePanel = (panelKey) => {
		return panelOpen.value && activePanelKey.value === panelKey;
	};

	const showPanel = (panelKey) => {
		return activePanelKey.value === panelKey && panelOpen.value;
	};

	const togglePanel = () => {
		panelOpen.value = !panelOpen.value;
	};

	const setActivePanel = (panelKey = "overlays") => {
		activePanelKey.value = panelKey;
		panelOpen.value = true;
	};

	const closePanel = () => {
		panelOpen.value = false;
		activePanelKey.value = "";
	};

	const getActivePanelKey = () => {
		return activePanelKey.value;
	};

	return {
		isActivePanel,
		showPanel,
		togglePanel,
		setActivePanel,
		getActivePanelKey,
		mapHasOverlays,
		closePanel,
	};
}
