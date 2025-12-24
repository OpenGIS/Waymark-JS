import { computed, ref } from "vue";
import { storeToRefs } from "pinia";

// Import instanceStore
import { useInstanceStore } from "@/stores/instanceStore.js";

export function useUI() {
	const {
		panelOpen,
		activePanelKey,
		activeNavKey,
		overlays,
		activeFeatureType,
		layerFilters,
	} = storeToRefs(useInstanceStore());

	const mapHasOverlays = computed(() => {
		return overlays.value.length > 0;
	});

	/* 
		Content Panels
	*/
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

	const openPanel = (panelKey = "overlays") => {
		// Close nav
		closeNav();

		// Toggle existing panel
		if (panelKey === activePanelKey.value) {
			togglePanel();
			// Switch to a different panel
		} else {
			setActivePanel(panelKey);
		}
	};

	const closePanel = () => {
		panelOpen.value = false;
		activePanelKey.value = "";
	};

	const getActivePanelKey = () => {
		return activePanelKey.value;
	};

	/*
		Nav Panels
	*/

	const showNav = (navKey = "") => {
		// Close other panels
		closePanel();

		// Toggle nav
		activeNavKey.value = activeNavKey.value === navKey ? "" : navKey;

		console.log("activeNavKey", activeNavKey.value);
	};

	const closeNav = () => {
		activeNavKey.value = "";
	};

	const isActiveNav = (navKey = "") => {
		return activeNavKey.value === navKey;
	};

	/*
		Feature Type
	*/
	const setActiveFeatureType = (type) => {
		activeFeatureType.value = type;
	};

	return {
		isActivePanel,
		openPanel,
		showPanel,
		closePanel,
		togglePanel,
		setActivePanel,
		getActivePanelKey,
		mapHasOverlays,
		showNav,
		closeNav,
		isActiveNav,
		activeFeatureType,
		setActiveFeatureType,
		layerFilters,
	};
}
