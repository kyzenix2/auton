(function () {
  var SOL = "So11111111111111111111111111111111111111112";
  var body = document.body;
  var raw = (body.getAttribute("data-contract") || "").trim();
  var chain = (body.getAttribute("data-chain") || "solana").trim().toLowerCase();
  var real = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(raw);
  var display = real ? raw : "TBA";

  document.querySelectorAll("[data-ca-text]").forEach(function (el) {
    el.textContent = display;
  });

  function copyText(text) {
    function fallback() {
      return new Promise(function (resolve, reject) {
        var area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.left = "-9999px";
        document.body.appendChild(area);
        area.select();
        try {
          document.execCommand("copy") ? resolve() : reject();
        } catch (err) {
          reject(err);
        }
        document.body.removeChild(area);
      });
    }

    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(fallback);
    }
    return fallback();
  }

  document.querySelectorAll("[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      var label = button.querySelector("[data-copy-label]");
      copyText(display).then(function () {
        var original = button.getAttribute("data-label") || label.textContent;
        button.setAttribute("data-label", original);
        label.textContent = "Copied!";
        button.classList.add("is-copied");
        window.clearTimeout(button._timer);
        button._timer = window.setTimeout(function () {
          label.textContent = original;
          button.classList.remove("is-copied");
        }, 1600);
      });
    });
  });

  if (real) {
    var buy = "https://swap.pump.fun/?input=" + SOL + "&output=" + encodeURIComponent(raw);
    var chart = "https://dexscreener.com/" + chain + "/" + encodeURIComponent(raw);
    var embed = chart + "?embed=1&theme=dark&trades=0&info=0";

    document.querySelectorAll("[data-buy]").forEach(function (link) {
      link.href = buy;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });

    document.querySelectorAll("[data-chart-link]").forEach(function (link) {
      link.href = chart;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });

    var frame = document.querySelector("[data-chart-frame]");
    var placeholder = document.querySelector("[data-chart-placeholder]");
    if (frame) {
      frame.src = embed;
      frame.hidden = false;
    }
    if (placeholder) placeholder.hidden = true;
  }

  document.querySelectorAll('a[href="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
    });
  });

  var nav = document.querySelector("[data-nav]");
  var onScroll = function () {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var menuButton = document.querySelector("[data-menu]");
  var menu = document.querySelector("[data-menu-panel]");

  function setMenu(open) {
    menu.classList.toggle("hidden", !open);
    menuButton.setAttribute("aria-expanded", open ? "true" : "false");
  }

  menuButton.addEventListener("click", function () {
    setMenu(menu.classList.contains("hidden"));
  });

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setMenu(false);
  });

  var links = document.querySelectorAll(".nav-link");
  var sections = ["about", "how-to-buy", "community", "chart"]
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    var current = "";
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) current = entry.target.id;
        });
        links.forEach(function (link) {
          var active = link.getAttribute("href") === "#" + current;
          link.classList.toggle("is-active", active);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();
