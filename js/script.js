(function () {
  "use strict";

  var STORAGE_KEY = "scrapautoqc-lang";

  function applyLanguage(lang) {
    var dict = translations[lang] || translations.en;

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined) {
        el.setAttribute("placeholder", dict[key]);
      }
    });

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && dict["meta.desc"]) {
      metaDesc.setAttribute("content", dict["meta.desc"]);
    }
    if (dict["meta.title"]) {
      document.title = dict["meta.title"];
    }

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
    });

    localStorage.setItem(STORAGE_KEY, lang);
  }

  function initLangToggle() {
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLanguage(btn.getAttribute("data-lang"));
      });
    });

    var saved = localStorage.getItem(STORAGE_KEY);
    applyLanguage(saved || "fr");
  }

  function initMobileNav() {
    var header = document.querySelector(".header");
    var hamburger = document.getElementById("hamburger");
    if (!hamburger) return;

    hamburger.addEventListener("click", function () {
      var isOpen = header.classList.toggle("is-open");
      hamburger.setAttribute("aria-expanded", isOpen);
    });

    document.querySelectorAll("#mobileNav a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initAccordion() {
    document.querySelectorAll(".accordion__trigger").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var item = trigger.closest(".accordion__item");
        var panel = item.querySelector(".accordion__panel");
        var isOpen = item.classList.contains("is-open");

        document.querySelectorAll(".accordion__item.is-open").forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove("is-open");
            openItem.querySelector(".accordion__trigger").setAttribute("aria-expanded", "false");
            openItem.querySelector(".accordion__panel").style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.classList.remove("is-open");
          trigger.setAttribute("aria-expanded", "false");
          panel.style.maxHeight = null;
        } else {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  }

  function initQuoteForm() {
    var form = document.getElementById("quoteForm");
    var status = document.getElementById("formStatus");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var lang = document.documentElement.lang === "fr" ? "fr" : "en";
      var dict = translations[lang];

      if (!form.checkValidity()) {
        status.textContent = dict["form.errorMsg"];
        status.className = "form-status is-error";
        form.reportValidity();
        return;
      }

      var data = Object.fromEntries(new FormData(form).entries());
      var subject = "Cash for Car Quote Request — " + data.year + " " + data.make + " " + data.model;
      var body =
        "Year: " + data.year + "\n" +
        "Make: " + data.make + "\n" +
        "Model: " + data.model + "\n" +
        "Condition: " + data.condition + "\n" +
        "Name: " + data.name + "\n" +
        "Phone: " + data.phone + "\n" +
        "City: " + data.city + "\n" +
        "Details: " + (data.details || "-");

      var mailto = "mailto:dispatch@remorquagefederal.ca" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      status.textContent = dict["form.successMsg"];
      status.className = "form-status is-success";

      window.location.href = mailto;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLangToggle();
    initMobileNav();
    initAccordion();
    initQuoteForm();

    var footerYear = document.getElementById("footerYear");
    if (footerYear) footerYear.textContent = new Date().getFullYear();
  });
})();
