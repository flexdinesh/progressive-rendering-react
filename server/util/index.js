const simulateDelayMS = async function(ms = 1000) {
  return await new Promise(resolve => {
    let waitT = setTimeout(() => {
      clearTimeout(waitT);
      resolve();
    }, ms);
  });
};

module.exports = {
  simulateDelayMS
};
