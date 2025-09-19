class Login {
  constructor() {
    this.currentLang = "en";
    this.translations = {};

    this.title = document.getElementById("title");
    this.emailInput = document.getElementById("email");
    this.passwordInput = document.getElementById("password");
    this.loginBtn = document.getElementById("loginBtn");
    this.message = document.getElementById("message");
    this.toggleLangBtn = document.getElementById("toggleLang");

    this.toggleLangBtn.addEventListener("click", () =>
      this.setLanguage(this.currentLang === "en" ? "ar" : "en")
    );
    // this.loginBtn.addEventListener("click", () => this.loginUser());

    this.loginBtn.addEventListener("click", (e) => {
      e.preventDefault(); // stop form submit
      this.loginUser();
    });
    // أول ما الصفحة تفتح، حمل اللغة الافتراضية
    this.setLanguage(this.currentLang).then(() => {
      console.log("Default language loaded");
    });
  }
  async loadLanguage(lang) {
    const res = await fetch(`lang/${lang}.json`);
    this.translations = await res.json();
  }

  async setLanguage(lang) {
    this.currentLang = lang;
    await this.loadLanguage(lang);

    document.querySelectorAll("[data-key]").forEach((el) => {
      const key = el.getAttribute("data-key");
      if (el.tagName === "INPUT") {
        el.placeholder = this.translations[key];
      } else {
        el.innerHTML = this.translations[key];
      }
    });
  }

  loginUser() {
    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email);

    if (!user) {
      this.message.innerText = this.translations.notFound;
      return;
    }

    if (user.password !== password) {
      this.message.innerText = this.translations.wrong;
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "todo.html";
  }
}

new Login();
