// Intelligent Games 4U Limited: website settings. Nothing here is secret.
//
// Payments go to the company's own Paystack account (Paystack dashboard > Payments > Payment Pages).
//
// 1. Ark Builder unlock: a "Product" page with a one-time price in NGN. Under "Extra settings"
//    set "Redirect after payment" to
//      https://intelligentgames123.github.io/IntelligentGamesforYou/ark-builder/unlocked.html
//    so Level 3 unlocks when the player returns. Paste the page link into unlockLink.
//
// 2. Donations: a page with the amount left blank so givers choose, and international cards on.
//    Paste its link into donateLink. Angel Academy Naija and Crowns & Character have their own
//    donateLink in their js/config.js: use the same Paystack link there.
//
// Leave a link empty ('') and its button shows "coming soon" instead.
window.IG4U_CONFIG = {
  unlockLink: '',
  unlockPrice: '₦2,000',
  donateLink: '',

  // Visit and player counts: the company's own free GoatCounter account (not GiggleByte's).
  // In GoatCounter's settings, tick "Allow adding visitor counts on your website".
  // Leave '' to switch off the visit count, the player counters and Ark Builder's count.
  goatcounter: 'intelligentgames4u'
};
