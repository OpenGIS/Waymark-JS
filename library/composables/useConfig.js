import { shallowRef } from "vue";
import { Config } from "@/classes/Config.js";

const config = shallowRef(null);

export function useConfig() {
  const init = (data = {}) => {
    config.value = new Config(data);
  };

  return {
    config,
    init,
  };
}
