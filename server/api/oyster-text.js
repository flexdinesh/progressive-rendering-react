import { simulateDelayMS } from "../util";

const getSectionOneText = async () => {
  await simulateDelayMS(2000);
  return "The whole world is my oyester";
};

const getSectionTwoText = async () => {
  await simulateDelayMS(1500);
  return "And I will render it progressively from my server";
};

module.exports = {
  getSectionOneText,
  getSectionTwoText
};
