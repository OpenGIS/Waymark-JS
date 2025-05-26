import { shallowRef } from "vue";
import { storeToRefs } from "pinia";

import { useMap } from "@/composables/useMap.js";

// Import instanceStore
import { useInstanceStore } from "@/stores/instanceStore.js";

export function useUI() {
	const { mapResized } = useMap();

	const { panelOpen, activePanelKey } = storeToRefs(useInstanceStore());

	const uiContainer = shallowRef(null);

	// Set the UI container
	const setUIContainer = (container) => {
		uiContainer.value = container;

		// On resize
		const resizeObserver = new ResizeObserver(() => {
			mapResized();
		});

		resizeObserver.observe(uiContainer.value);
	};

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

	const getActivePanelKey = () => {
		return activePanelKey.value;
	};

	return {
		setUIContainer,
		isActivePanel,
		showPanel,
		togglePanel,
		setActivePanel,
		getActivePanelKey,
	};
}
