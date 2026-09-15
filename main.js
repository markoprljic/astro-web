(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setScrolled() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > header.offsetHeight);
  }

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }

  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });
  }

  document.querySelectorAll("[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var status = form.querySelector("[data-form-status]");
      var submit = form.querySelector("[type='submit']");
      var data = new FormData(form);

      if (status) {
        status.hidden = false;
        status.textContent = "Sending…";
        status.className = "form-status";
      }
      if (submit) submit.disabled = true;

      fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Request failed");
          form.reset();
          if (status) {
            status.textContent = "Message sent. We will be in touch.";
            status.className = "form-status is-success";
          }
        })
        .catch(function () {
          if (status) {
            status.textContent = "Something went wrong. Email us at info@astrosynapse.ai.";
            status.className = "form-status is-error";
          }
        })
        .finally(function () {
          if (submit) submit.disabled = false;
        });
    });
  });
})();
