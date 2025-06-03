import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

export function useConfig() {
	// Get item can accept any number of arguments, which will be nested object keys for the config
	const getItem = (...keys) => {
		const { config } = storeToRefs(useInstanceStore());

		return keys.reduce((acc, key) => {
			if (acc && acc[key] !== undefined) {
				return acc[key];
			}
			return undefined;
		}, config.value);
	};

	return {
		getItem,
	};
}
