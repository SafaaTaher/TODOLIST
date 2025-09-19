class Register {
  constructor() {
    this.currentLang = "en";
    this.translations = {}; // store translations after loading

    // Elements
    this.title = document.getElementById("title");
    this.usernameInput = document.getElementById("username");
    this.emailInput = document.getElementById("email");
    this.passwordInput = document.getElementById("password");
    this.confirmInput = document.getElementById("confirmPassword");
    this.registerBtn = document.getElementById("registerBtn");
    this.message = document.getElementById("message");
    this.toggleLangBtn = document.getElementById("toggleLang");

    // Events
    this.toggleLangBtn.addEventListener("click", () =>
      this.setLanguage(this.currentLang === "en" ? "ar" : "en")
    );
    this.registerBtn.addEventListener("click", () => this.registerUser());

    // Load default language when page opens
    this.setLanguage(this.currentLang).then(() => {
      console.log("Default language loaded");
    });
  }

  // Load JSON translation file
  async loadLanguage(lang) {
    const res = await fetch(`lang/${lang}.json`); // ex : lang/en.json
    this.translations = await res.json();
  }

  async setLanguage(lang) {
    this.currentLang = lang;
    await this.loadLanguage(lang);

    document.querySelectorAll("[data-key]").forEach(el => {
      const key = el.getAttribute("data-key");
      if (el.tagName === "INPUT") {
        el.placeholder = this.translations[key] || el.placeholder;
      } else {
        el.innerHTML = this.translations[key] || el.innerHTML;
      }
    });
  }

  registerUser() {
    const username = this.usernameInput.value.trim();
    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value;
    const confirm = this.confirmInput.value;

    if (!username || !email || !password || !confirm) {
      this.message.innerText = this.translations.fill;
      return;
    }

    if (password !== confirm) {
      this.message.innerText = this.translations.mismatch;
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Uniqueness check
    if (users.some(u => u.email === email)) {
      this.message.innerText = this.translations.exists;
      return;
    }

    users.push({ username, email, password, todos: [] });
    localStorage.setItem("users", JSON.stringify(users));

    this.message.innerText = this.translations.success;

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  }
}

new Register();
