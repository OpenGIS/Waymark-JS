import { storeToRefs } from "pinia";

// Import Helpers
// import { getTypeData, getFeatureType, getIconData } from "@/helpers/Overlay.js";
// import { makeKey } from "@/helpers/Common.js";

// Import instanceStore
import { useInstanceStore } from "@/stores/instanceStore.js";

export function useUI() {
	const {
		config,
		map,
		overlays,
		activeLayer,
		activeFeatureType,
		panelOpen,
		activePanelKey,
	} = storeToRefs(useInstanceStore());

	// export function useUI() {}
}
