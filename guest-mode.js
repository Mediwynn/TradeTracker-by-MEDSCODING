const GUEST_MODE_KEY = "trade-tracker-guest-mode";

function isGuestMode() {
  try {
    return sessionStorage.getItem(GUEST_MODE_KEY) === "true";
  } catch (error) {
    console.error("[TradeTracker] Unable to read guest-mode session state.", error);
    return false;
  }
}

function enterGuestMode() {
  try {
    sessionStorage.setItem(GUEST_MODE_KEY, "true");
    window.location.reload();
  } catch (error) {
    console.error("[TradeTracker] Unable to start a guest session.", error);
    throw new Error("Guest mode could not be started because browser session storage is unavailable.");
  }
}

function exitGuestMode() {
  try {
    sessionStorage.removeItem(GUEST_MODE_KEY);
    window.location.reload();
  } catch (error) {
    console.error("[TradeTracker] Unable to end the guest session.", error);
    throw new Error("Guest mode could not be ended because browser session storage is unavailable.");
  }
}

function renderGuestNotice(snapshotAt, access = null) {
  const banner = document.querySelector("#guest-mode-banner");
  if (!banner) return;
  const guest = isGuestMode();
  const delayed = access?.delayed ?? true;
  if (!guest && !delayed) {
    banner.classList.add("hidden");
    return;
  }

  const date = snapshotAt && !Number.isNaN(new Date(snapshotAt).getTime())
    ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(snapshotAt))
    : "snapshot date unavailable";
  const latestDate = access?.latestDate
    ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${access.latestDate}T00:00:00Z`))
    : "at least 150 days ago";
  banner.querySelector("[data-guest-copy]").textContent = guest
    ? `Guest mode shows up to 10 cached trade disclosures and 12 cached news stories published by ${latestDate}. Snapshot generated ${date}; information may be outdated.`
    : `Signed-out data is delayed by at least 150 days; only records published on or before ${latestDate} are shown. Sign in to see current data.`;
  const exitButton = banner.querySelector("[data-exit-guest]");
  const signInLink = banner.querySelector("[data-signin-link]");
  exitButton.classList.toggle("hidden", !guest);
  signInLink.classList.toggle("hidden", guest);
  banner.classList.remove("hidden");
}

window.TradeTrackerGuest = { isGuestMode, enterGuestMode, exitGuestMode, renderGuestNotice };

document.querySelectorAll("[data-exit-guest]").forEach((button) => {
  button.addEventListener("click", () => {
    try {
      exitGuestMode();
    } catch (error) {
      const copy = document.querySelector("[data-guest-copy]");
      if (copy) copy.textContent = error.message;
    }
  });
});
