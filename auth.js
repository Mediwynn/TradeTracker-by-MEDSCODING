import {
  endLocalAdminTestSession,
  getAuthClient,
  hasLocalAdminTestSession,
  startLocalAdminTestSession,
} from "./auth-state.js";

const dialog = document.querySelector("#account-dialog");
const form = document.querySelector("#account-form");
const title = document.querySelector("#account-title");
const description = document.querySelector("#account-description");
const emailInput = document.querySelector("#account-email");
const passwordInput = document.querySelector("#account-password");
const confirmInput = document.querySelector("#account-confirm-password");
const emailField = document.querySelector("#account-email-field");
const passwordField = document.querySelector("#account-password-field");
const confirmField = document.querySelector("#account-confirm-field");
const message = document.querySelector("#account-message");
const submitButton = document.querySelector("#account-submit");
const regularActions = document.querySelector("#account-actions");
const pendingActions = document.querySelector("#account-pending-actions");
const sessionActions = document.querySelector("#account-session-actions");
const guestActions = document.querySelector("#account-guest-actions");
const continueGuestButton = document.querySelector("#account-continue-guest");
const exitGuestButton = document.querySelector("#account-exit-guest");
const accountButton = document.querySelector("#account-button");
const demoCredentials = {
  email: "demo@tradetracker.local",
  password: "TradeTrackerDemo2026!",
};
const localAdminTestCredentials = {
  username: "admin1234",
  password: "admin1234",
};

const modes = {
  signIn: {
    title: "Sign in",
    description: "Sign in to your TradeTracker account.",
    submit: "Sign in",
    email: true,
    password: true,
    confirm: false,
    actions: "regular",
  },
  signUp: {
    title: "Create account",
    description: "Create an account. We’ll email you a verification link before your account is confirmed.",
    submit: "Create account",
    email: true,
    password: true,
    confirm: true,
    actions: "regular",
  },
  resetRequest: {
    title: "Reset password",
    description: "Enter your email and we’ll send a password reset link.",
    submit: "Send reset link",
    email: true,
    password: false,
    confirm: false,
    actions: "regular",
  },
  updatePassword: {
    title: "Choose a new password",
    description: "Set a new password for your account.",
    submit: "Update password",
    email: false,
    password: true,
    confirm: true,
    actions: "none",
  },
  verificationPending: {
    title: "Verify your email",
    description: "Check your inbox for the verification link. You can request another email if needed.",
    submit: "",
    email: true,
    password: false,
    confirm: false,
    actions: "pending",
  },
  account: {
    title: "Your account",
    description: "",
    submit: "",
    email: false,
    password: false,
    confirm: false,
    actions: "session",
  },
  unavailable: {
    title: "Account sign-in unavailable",
    description: "Account access has not been configured for this deployment. The public dashboard is still available.",
    submit: "",
    email: false,
    password: false,
    confirm: false,
    actions: "none",
  },
};

let currentMode = "signIn";
let verificationEmail = "";
let pendingAction = "signup";
let client = null;
let currentUser = null;
let demoSession = false;
let demoEnabled = false;

function isLocalDevelopmentHost() {
  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

function showMessage(text, kind = "") {
  message.textContent = text;
  message.dataset.kind = kind;
}

function setMode(modeName, { keepMessage = false } = {}) {
  const mode = modes[modeName];
  if (!mode) throw new Error(`Unknown account view: ${modeName}`);
  if (currentMode !== modeName) {
    passwordInput.value = "";
    confirmInput.value = "";
  }
  currentMode = modeName;
  title.textContent = mode.title;
  description.textContent = mode.description;
  emailField.classList.toggle("hidden", !mode.email);
  passwordField.classList.toggle("hidden", !mode.password);
  confirmField.classList.toggle("hidden", !mode.confirm);
  emailInput.required = mode.email;
  passwordInput.required = mode.password;
  confirmInput.required = mode.confirm;
  emailInput.readOnly = modeName === "verificationPending";
  passwordInput.autocomplete = modeName === "signUp" || modeName === "updatePassword"
    ? "new-password"
    : "current-password";
  submitButton.classList.toggle("hidden", !mode.submit);
  submitButton.textContent = mode.submit;
  regularActions.classList.toggle("hidden", mode.actions !== "regular");
  pendingActions.classList.toggle("hidden", mode.actions !== "pending");
  sessionActions.classList.toggle("hidden", mode.actions !== "session");
  const guestMode = window.TradeTrackerGuest.isGuestMode();
  guestActions.classList.toggle(
    "hidden",
    modeName === "verificationPending" ||
    modeName === "updatePassword" ||
    (modeName === "account" && currentUser && !guestMode),
  );
  continueGuestButton.classList.toggle("hidden", guestMode);
  exitGuestButton.classList.toggle("hidden", !guestMode);
  if (!keepMessage) showMessage("");
  if (modeName === "account" && currentUser) {
    const verified = Boolean(currentUser.email_confirmed_at || currentUser.confirmed_at);
    const admin = currentUser.app_metadata?.role === "admin";
    description.textContent = demoSession
      ? `${currentUser.email} · local test session only; no real authentication or administrator privileges`
      : `${currentUser.email} · ${verified ? "Email verified" : "Email not yet verified"}${admin ? " · administrator role" : ""}`;
  }
  if (modeName === "verificationPending" && verificationEmail) {
    if (pendingAction === "recovery") {
      description.textContent = `If an account exists for ${verificationEmail}, a password reset link has been sent. Check your inbox and spam folder.`;
      document.querySelector("#account-resend").textContent = "Resend reset link";
    } else {
      description.textContent = `A verification link was sent to ${verificationEmail}. Check your inbox and spam folder.`;
      document.querySelector("#account-resend").textContent = "Resend verification email";
    }
  }
  if (mode.email) emailInput.focus();
  else if (mode.password) passwordInput.focus();
}

function openDialog() {
  if (!dialog.open) dialog.showModal();
}

function showDemoSignIn() {
  setMode("signIn");
  description.textContent = `LOCAL DEMO ONLY — Email: ${demoCredentials.email} · Password: ${demoCredentials.password}. Temporary local test: username ${localAdminTestCredentials.username} · password ${localAdminTestCredentials.password}. Neither creates an account or grants real administrator privileges.`;
}

function updateAccountButton(user) {
  if (user) {
    accountButton.textContent = (user.email || "account").slice(0, 2).toUpperCase();
    accountButton.setAttribute("aria-label", `Account: ${user.email}`);
  } else {
    accountButton.textContent = "Account";
    accountButton.setAttribute("aria-label", "Open account");
  }
}

function setBusy(busy) {
  submitButton.disabled = busy;
  submitButton.textContent = busy ? "Please wait…" : modes[currentMode].submit;
}

function displayAuthError(error) {
  console.error("[TradeTracker] Account action failed.", error);
  showMessage(error.message || "The account request failed. Please try again.", "error");
}

function clearAuthCallback() {
  const url = new URL(window.location.href);
  if (url.searchParams.has("auth")) {
    url.searchParams.delete("auth");
    history.replaceState(null, "", url);
  }
}

async function submitAccountForm(event) {
  event.preventDefault();
  if (!client) {
    const username = emailInput.value.trim().toLowerCase();
    if (
      demoEnabled &&
      currentMode === "signIn" &&
      username === localAdminTestCredentials.username &&
      passwordInput.value === localAdminTestCredentials.password
    ) {
      try {
        startLocalAdminTestSession();
        sessionStorage.removeItem("trade-tracker-guest-mode");
        window.location.reload();
      } catch (error) {
        showMessage(error.message, "error");
      }
      return;
    }
    if (
      demoEnabled &&
      currentMode === "signIn" &&
      emailInput.value.trim().toLowerCase() === demoCredentials.email &&
      passwordInput.value === demoCredentials.password
    ) {
      demoSession = true;
      currentUser = {
        email: demoCredentials.email,
        email_confirmed_at: new Date().toISOString(),
      };
      updateAccountButton(currentUser);
      setMode("account");
      showMessage("Demo sign-in successful. This local session is not real authentication.", "success");
      return;
    }
    showMessage(
      demoEnabled
        ? "Use the displayed local demo credentials. Account creation and email verification require Supabase."
        : "Account access is not configured for this deployment.",
      "error",
    );
    return;
  }
  if (!form.reportValidity()) return;

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmation = confirmInput.value;
  if ((currentMode === "signUp" || currentMode === "updatePassword") && password !== confirmation) {
    showMessage("The passwords do not match.", "error");
    confirmInput.focus();
    return;
  }

  setBusy(true);
  try {
    if (currentMode === "signUp") {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}${window.location.pathname}?auth=verified`,
        },
      });
      if (error) throw error;
      verificationEmail = email;
      if (data.session) {
        currentUser = data.user;
        updateAccountButton(currentUser);
        window.location.reload();
        return;
      } else {
        pendingAction = "signup";
        setMode("verificationPending");
        showMessage("Verification email sent. Open the link to confirm your account.", "success");
      }
    } else if (currentMode === "signIn") {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      currentUser = data.user;
      updateAccountButton(currentUser);
      window.location.reload();
      return;
    } else if (currentMode === "resetRequest") {
      const redirectTo = new URL(window.location.pathname, window.location.origin);
      redirectTo.searchParams.set("auth", "recovery");
      const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: redirectTo.href });
      if (error) throw error;
      verificationEmail = email;
      pendingAction = "recovery";
      setMode("verificationPending");
      showMessage("If an account exists for that email, a password reset link has been sent.", "success");
    } else if (currentMode === "updatePassword") {
      const { data, error } = await client.auth.updateUser({ password });
      if (error) throw error;
      currentUser = data.user;
      updateAccountButton(currentUser);
      clearAuthCallback();
      if (window.TradeTrackerGuest.isGuestMode()) {
        window.TradeTrackerGuest.exitGuestMode();
        return;
      }
      setMode("account");
      showMessage("Your password was updated.", "success");
    }
  } catch (error) {
    if (
      currentMode === "signIn" &&
      typeof error.message === "string" &&
      error.message.toLowerCase().includes("email not confirmed")
    ) {
      verificationEmail = email;
      pendingAction = "signup";
      setMode("verificationPending");
      showMessage("Verify your email before signing in. You can resend the verification link here.", "error");
      return;
    }
    displayAuthError(error);
  } finally {
    setBusy(false);
  }
}

async function resendVerification() {
  if (!client || !verificationEmail) {
    showMessage("Enter your email address and try again.", "error");
    return;
  }
  try {
    const result = pendingAction === "recovery"
      ? await client.auth.resetPasswordForEmail(verificationEmail, {
        redirectTo: `${window.location.origin}${window.location.pathname}?auth=recovery`,
      })
      : await client.auth.resend({ type: "signup", email: verificationEmail });
    const { error } = result;
    if (error) throw error;
    showMessage(
      pendingAction === "recovery"
        ? "If an account exists for that email, a new password reset link has been sent."
        : "If the address needs verification, a new email has been sent.",
      "success",
    );
  } catch (error) {
    displayAuthError(error);
  }
}

async function signOut() {
  if (!client) {
    if (demoSession) {
      try {
        if (hasLocalAdminTestSession()) {
          endLocalAdminTestSession();
          sessionStorage.removeItem("trade-tracker-guest-mode");
          window.location.reload();
          return;
        }
      } catch (error) {
        showMessage(error.message, "error");
        return;
      }
      demoSession = false;
      currentUser = null;
      updateAccountButton(null);
      setMode("signIn");
      showMessage("Demo session ended. No real account was signed out.", "success");
    }
    return;
  }
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    currentUser = null;
    updateAccountButton(null);
    window.location.reload();
  } catch (error) {
    displayAuthError(error);
  }
}

accountButton.addEventListener("click", () => {
  if (!client && !demoEnabled) setMode("unavailable");
  else if (currentUser) setMode("account");
  else if (demoEnabled) showDemoSignIn();
  else setMode("signIn");
  openDialog();
});
document.querySelector("#account-close").addEventListener("click", () => dialog.close());
document.querySelector("#account-switch").addEventListener("click", () => {
  if (currentMode === "signUp" && demoEnabled) showDemoSignIn();
  else setMode(currentMode === "signUp" ? "signIn" : "signUp");
});
document.querySelector("#account-forgot").addEventListener("click", () => setMode("resetRequest"));
document.querySelector("#account-back-signin").addEventListener("click", () => setMode("signIn"));
document.querySelector("#account-resend").addEventListener("click", resendVerification);
document.querySelector("#account-signout").addEventListener("click", signOut);
continueGuestButton.addEventListener("click", () => {
  try {
    window.TradeTrackerGuest.enterGuestMode();
  } catch (error) {
    showMessage(error.message, "error");
  }
});
exitGuestButton.addEventListener("click", () => {
  try {
    window.TradeTrackerGuest.exitGuestMode();
  } catch (error) {
    showMessage(error.message, "error");
  }
});
form.addEventListener("submit", submitAccountForm);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

const config = window.TRADE_TRACKER_AUTH_CONFIG;
if (config?.url && config?.anonKey) {
  try {
    client = await getAuthClient();
    client.auth.onAuthStateChange((event, session) => {
      currentUser = session?.user || null;
      updateAccountButton(currentUser);
      if (event === "PASSWORD_RECOVERY") {
        setMode("updatePassword");
        openDialog();
      }
    });
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    currentUser = data.session?.user || null;
    const authCallback = new URLSearchParams(window.location.search).get("auth");
    if (authCallback === "recovery") {
      setMode("updatePassword");
      openDialog();
    }
    if (authCallback === "verified") {
      clearAuthCallback();
      setMode(currentUser ? "account" : "signIn");
      openDialog();
      showMessage(currentUser ? "Your email was verified." : "Email verification completed. Sign in to continue.", "success");
    }
    if (authCallback === "signin") {
      clearAuthCallback();
      setMode("signIn");
      openDialog();
    }
    updateAccountButton(currentUser);
  } catch (error) {
    client = null;
    console.error("[TradeTracker] Unable to initialize Supabase Auth.", error);
    setMode("unavailable");
    showMessage("Could not connect to the account service. Check the Auth configuration and try again.", "error");
  }
} else {
  demoEnabled = isLocalDevelopmentHost();
  if (demoEnabled && hasLocalAdminTestSession()) {
    demoSession = true;
    currentUser = { email: "admin1234 (local test)", email_confirmed_at: "local-test" };
    updateAccountButton(currentUser);
  }
  if (demoEnabled) {
    if (demoSession) setMode("account");
    else showDemoSignIn();
  } else {
    setMode("unavailable");
  }
  if (new URLSearchParams(window.location.search).get("auth") === "signin") {
    if (demoEnabled) showDemoSignIn();
    else setMode("unavailable");
    openDialog();
  }
}
