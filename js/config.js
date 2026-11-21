/* Hell Co. - global config. Change the game name / save key here. */
window.HC = window.HC || {};
HC.CONFIG = {
  name: 'Hell Corp',
  version: '0.1.0',
  saveKey: 'hellcorp_save_v1',
  pixelHeight: 360,      // internal render height (retro crunch + fast on phones)
  textSpeed: 52,         // dialogue characters per second
  quotaBase: 8,          // souls per day at Intern rank
  logCap: 150            // max death files remembered in the Codex log
};
HC.data = HC.data || {};
HC.gen = HC.gen || {};
