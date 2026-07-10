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
    var RECIPIENT = "book@belloentertainment.com";

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
      var mailto =
        "mailto:" + RECIPIENT +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));

      // Reveal confirmation, then open the user's email client
      if (ok) {
        ok.classList.add("show");
        ok.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      window.location.href = mailto;
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
