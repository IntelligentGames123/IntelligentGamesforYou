// Anonymous player count. The first time this game is opened on a device, it adds 1 to the
// "angel-academy-naija" tally in Intelligent Games 4U's GoatCounter account, which the company
// website shows as "players". It sends no name, no ID and no cookie, and only once per device.
// The account name is AAN_CONFIG.goatcounter in js/config.js; leave it "" to switch counting off.
(function () {
  var code = (window.AAN_CONFIG || {}).goatcounter;
  var GAME = 'angel-academy-naija';
  var FLAG = 'aan.counted';
  var local = ['localhost', '127.0.0.1', '[::1]'].indexOf(location.hostname) >= 0;
  if (!code || !/^https?:$/.test(location.protocol) || local) return;  // never count local testing
  try { if (localStorage.getItem(FLAG)) return; } catch (e) { return; }
  var img = new Image();
  img.onload = function () { try { localStorage.setItem(FLAG, '1'); } catch (e) { /* storage unavailable */ } };
  img.src = 'https://' + code + '.goatcounter.com/count?p=' + encodeURIComponent('/' + GAME) +
    '&t=' + encodeURIComponent('Angel Academy Naija') + '&rnd=' + Math.random().toString(36).slice(2);
})();
