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
    var onReveal = function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          // subtle stagger for siblings
          var delay = (el.dataset.delay ? +el.dataset.delay : (i % 4) * 90);
          setTimeout(function () { el.classList.add("in"); }, delay);
          obs.unobserve(el);
        }
      });
    };
    var io = new IntersectionObserver(onReveal, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    // Tall elements (long articles) can never reach a 12% visibility threshold
    // in a normal viewport — reveal those as soon as any part is on screen.
    var ioTall = new IntersectionObserver(onReveal, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) {
      (el.offsetHeight > window.innerHeight * 0.6 ? ioTall : io).observe(el);
    });
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

      // Also notify the Bello CRM (instant phone alerts). Fire-and-forget: the
      // email below is the source of truth, so a CRM hiccup never blocks the visitor.
      try {
        var params = new URLSearchParams(window.location.search);
        fetch("https://5if6myan97.execute-api.us-east-1.amazonaws.com/dev/webhooks/website", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Spam deterrent only — this repo is public; the email path is the safety net.
            "x-bello-secret": "4d862941d0fce19e953fb21c1ae4dd0fdde2ce81dea345c8",
          },
          body: JSON.stringify({
            name: name,
            email: get("email"),
            phone: get("phone"),
            event_type: get("eventType"),
            event_date: get("date"),
            venue: get("venue"),
            guest_count: get("guests"),
            budget: get("package"),
            message: get("message"),
            page: window.location.pathname,
            utm_campaign: params.get("utm_campaign") || "",
            utm_content: params.get("utm_content") || "",
            botcheck: get("botcheck"),
          }),
        }).catch(function () { /* email fallback covers it */ });
      } catch (crmErr) { /* never let CRM wiring break the form */ }

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

/* Events dropdown — opens on click */
(function () {
  "use strict";
  document.querySelectorAll(".nav-dd").forEach(function (dd) {
    var top = dd.querySelector(":scope > a");
    if (!top) return;
    top.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation(); // keep the mobile menu open while toggling
      dd.classList.toggle("open");
    });
  });
  document.addEventListener("click", function (e) {
    document.querySelectorAll(".nav-dd.open").forEach(function (dd) {
      if (!dd.contains(e.target)) dd.classList.remove("open");
    });
  });
})();
