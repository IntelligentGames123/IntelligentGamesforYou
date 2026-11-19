// Angel Academy Naija: settings for Intelligent Games 4U Limited.
// Nothing here is secret. Never put API keys or card details in this file.
//
// Donations: Paystack Payment Page (Paystack dashboard > Payments > Payment Pages > New page).
// Leave the amount blank so givers choose, and turn on international cards for diaspora givers.
// It is the same Paystack account as the Intelligent Games 4U website, so it settles to the company's own bank.
window.AAN_CONFIG = {
  publisherName: "Intelligent Games 4U Limited",
  contactEmail: "intelligentgames4u@gmail.com",

  // Anonymous player count (GoatCounter, Intelligent Games 4U's own account, not GiggleByte's).
  // Each device is counted once, with no name, ID or cookie. Leave "" to switch counting off.
  goatcounter: "intelligentgames4u",

  // Paste the Paystack payment-page link (https://paystack.com/pay/...). Leave "" to show "coming soon".
  donateLink: "",
  donateLabel: "Donate",
  donateNote: "Donations are received by Intelligent Games 4U Limited and paid securely through Paystack (card, bank transfer or USSD).",

  // The two funds on the choose-your-split slider.
  funds: ["New games & free church licences", "Data & devices for learners"],

  // Optional registered charity partner, given to directly through its own page.
  charityName: "",
  charityUrl: "",

  // Play = Give. Lessons only turn into real help once a sponsor has pledged.
  community: {
    sponsored: false,
    sponsorName: "",
    lessonsPerUnit: 10,
    unitLabel: "1 day of data for a student in need",
    goalLessons: 10000,
    totalLessons: 0,
    updated: ""
  },

  // "Where the Light Goes": publish real figures only.
  transparency: {
    raised: "",                  // e.g. "₦450,000"
    items: [],                   // e.g. [{ label: "Data bundles", amount: "₦120,000", note: "Monthly data for 24 students in Jos" }]
    reportUrl: ""
  },

  // Seasonal community events on Nigerian dates (YYYY-MM-DD, inclusive).
  events: [
    { id: "christmas", name: "Christmas Light", start: "2026-12-01", end: "2026-12-31", halo: "christmas" },
    { id: "easter", name: "Easter Dawn", start: "2027-03-21", end: "2027-04-04", halo: "easter" },
    { id: "childrens", name: "Children's Day Glow", start: "2027-05-20", end: "2027-05-31", halo: "childrens" },
    { id: "school", name: "Back-to-School Light", start: "2027-09-06", end: "2027-09-26", halo: "school" },
    { id: "independence", name: "Independence Light", start: "2027-09-27", end: "2027-10-07", halo: "independence" }
  ],

  // Optional code printed on donors' thank-you receipts. It unlocks a cosmetic halo only.
  supporterCode: ""
};
