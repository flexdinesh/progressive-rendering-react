import { simulateDelayMS } from "../util";

const getSectionOneText = async (latencyFactor = 1) => {
  await simulateDelayMS(2000 * latencyFactor);
  return "The whole world is my oyester";
};

const getSectionTwoText = async (latencyFactor = 1) => {
  await simulateDelayMS(1500 * latencyFactor);
  return "And I will render it progressively from my server";
};

module.exports = {
  getSectionOneText,
  getSectionTwoText
};
