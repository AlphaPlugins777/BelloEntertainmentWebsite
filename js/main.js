/* Bello Entertainment — interactions */
(function () {
  "use strict";

  // Sticky nav background on scroll
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") links.classList.remove("open");
    });
  }

  // Scroll-reveal animations
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            // subtle stagger for siblings
            var delay = (el.dataset.delay ? +el.dataset.delay : (i % 4) * 90);
            setTimeout(function () { el.classList.add("in"); }, delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Inquiry form
  var form = document.getElementById("inquiryForm");
  if (form) {
    var ok = document.getElementById("formOk");
    var RECIPIENT = "inquire@belloentertainmentnj.com";

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // native validation for required fields
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var get = function (id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : "";
      };

      var name = get("name");
      var lines = [
        "New event inquiry from the Bello Entertainment website:",
        "",
        "Name:          " + name,
        "Email:         " + get("email"),
        "Phone:         " + (get("phone") || "—"),
        "Event Type:    " + get("eventType"),
        "Event Date:    " + (get("date") || "—"),
        "Venue:         " + (get("venue") || "—"),
        "Guests:        " + (get("guests") || "—"),
        "Package:       " + (get("package") || "Not sure yet"),
        "",
        "Details:",
        get("message") || "—",
      ];

      var subject = "Event Inquiry — " + (get("eventType") || "New") + " — " + name;

      // Send via Web3Forms (emails the inquiry to RECIPIENT without opening a mail client)
      var WEB3FORMS_KEY = "48664774-87d0-414a-bdfe-daa826f16479";
      var btn = form.querySelector('button[type="submit"], .btn');
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: subject,
          from_name: "Bello Entertainment Website",
          name: name,
          email: get("email"),
          message: lines.join("\n"),
          botcheck: get("botcheck"),
        }),
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) throw new Error(res.message || "send failed");
          if (ok) {
            ok.textContent = "Thank you — your inquiry has been sent. We'll be in touch within 24 hours.";
            ok.classList.add("show");
            ok.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          form.reset();
        })
        .catch(function () {
          // Fallback: open the visitor's email client the old way
          window.location.href =
            "mailto:" + RECIPIENT +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(lines.join("\n"));
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = "Send Inquiry"; }
        });
    });
  }

  // Smooth-scroll for same-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
})();
