document.documentElement.classList.add("js");

const toggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-site-nav]");
const pageRegions = [
  document.querySelector("main"),
  document.querySelector("footer"),
  document.querySelector(".brand"),
].filter(Boolean);

const setPageInert = (inert) => {
  pageRegions.forEach((region) => {
    region.inert = inert;
  });
};

const closeNavigation = (returnFocus = false) => {
  if (!toggle || !nav) return;

  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Navigation öffnen");
  document.body.classList.remove("nav-open");
  setPageInert(false);

  if (returnFocus) toggle.focus();
};

const openNavigation = () => {
  if (!toggle || !nav) return;

  nav.classList.add("open");
  toggle.setAttribute("aria-expanded", "true");
  toggle.setAttribute("aria-label", "Navigation schließen");
  document.body.classList.add("nav-open");
  setPageInert(true);

  const firstLink = nav.querySelector("a[href]");
  if (firstLink) firstLink.focus();
};

if (toggle && nav) {
  if (!nav.id) nav.id = "site-navigation";
  toggle.setAttribute("aria-controls", nav.id);

  toggle.addEventListener("click", () => {
    if (nav.classList.contains("open")) closeNavigation(true);
    else openNavigation();
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNavigation();
  });

  document.addEventListener("keydown", (event) => {
    if (!nav.classList.contains("open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeNavigation(true);
      return;
    }

    if (event.key !== "Tab") return;

    const links = [...nav.querySelectorAll("a[href]")];
    const focusable = [toggle, ...links];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      nav.classList.contains("open") &&
      !nav.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      closeNavigation();
    }
  });

  const desktopQuery = window.matchMedia("(min-width: 901px)");
  const handleDesktopChange = (event) => {
    if (event.matches) closeNavigation();
  };

  if (desktopQuery.addEventListener) desktopQuery.addEventListener("change", handleDesktopChange);
  else desktopQuery.addListener(handleDesktopChange);
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const pathName = window.location.pathname.split("/").pop() || "index.html";
const currentFile = pathName === "index" || pathName === "" ? "index.html" : pathName.includes(".") ? pathName : `${pathName}.html`;
const sectionPages = {
  "wlan-optimierung-wien-noe-burgenland.html": "heimnetz-glasfaserplaner.html",
  "glasfaser-heimnetz-wien-noe-burgenland.html": "heimnetz-glasfaserplaner.html",
  "heimnetzwerk-installation-wien-noe-burgenland.html": "heimnetz-glasfaserplaner.html",
  "netzwerkschrank-einrichten-wien-noe-burgenland.html": "heimnetz-glasfaserplaner.html",
  "lan-dose-funktioniert-nicht-wien-noe-burgenland.html": "heimnetz-glasfaserplaner.html",
  "homeway-installation-wien-noe-burgenland.html": "heimnetz-glasfaserplaner.html",
  "poe-doorbell-kamera-netzwerk-wien-noe-burgenland.html": "heimnetz-glasfaserplaner.html",
  "garage-garten-wlan-niederoesterreich-burgenland.html": "heimnetz-glasfaserplaner.html",
  "heimnetz-elektriker-partner.html": "heimnetz-glasfaserplaner.html",
  "access-point-installation-wien-noe-burgenland.html": "heimnetz-glasfaserplaner.html",
  "unifi-installation-wien-noe-burgenland.html": "heimnetz-glasfaserplaner.html",
  "omada-installation-wien-noe-burgenland.html": "heimnetz-glasfaserplaner.html",
  "netzwerk-pv-wallbox-waermepumpe-wien-noe-burgenland.html": "heimnetz-glasfaserplaner.html",
  "bauherren-netzwerkplan-2026.html": "ratgeber.html",
  "unifi-omada-homeway-fritz-vergleich.html": "ratgeber.html",
  "powerline-lan-wlan-vergleich.html": "ratgeber.html",
};
const activeFile = sectionPages[currentFile] || currentFile;

document.querySelectorAll(".site-nav a[href]").forEach((link) => {
  const href = link.getAttribute("href");
  if (!href || /^(https?:|mailto:|tel:)/.test(href)) return;

  const linkFile = href.split("#")[0].split("?")[0] || "index.html";
  if (linkFile === activeFile) link.setAttribute("aria-current", "page");
});

const createMobileActions = () => {
  if (document.querySelector(".mobile-actions")) return;

  const actions = document.createElement("nav");
  actions.className = "mobile-actions";
  actions.setAttribute("aria-label", "Schnellkontakt");
  actions.innerHTML = [
    '<a class="mobile-call" href="tel:+436644169873">Anrufen</a>',
    '<a class="mobile-request" href="kontakt.html#projektformular">Projekt anfragen</a>',
  ].join("");

  document.body.append(actions);
  pageRegions.push(actions);
  document.body.classList.add("has-mobile-actions");
};

createMobileActions();

const projectForm = document.querySelector("[data-project-form]");

if (projectForm) {
  const copyButton = projectForm.querySelector("[data-copy-request]");
  const whatsappButton = projectForm.querySelector("[data-whatsapp-request]");
  const copyStatus = projectForm.querySelector("[data-copy-status]");
  const emailInput = projectForm.querySelector("#email");
  const phoneInput = projectForm.querySelector("#telefon");
  const topicInput = projectForm.querySelector("#thema");

  const requestedTopic = new URLSearchParams(window.location.search).get("anliegen");
  if (topicInput && requestedTopic) {
    const matchingOption = [...topicInput.options].find((option) => option.value === requestedTopic);
    if (matchingOption) topicInput.value = matchingOption.value;
  }

  const validateContactRoute = () => {
    if (!emailInput || !phoneInput) return true;

    const hasContact = emailInput.value.trim() || phoneInput.value.trim();
    emailInput.setCustomValidity(hasContact ? "" : "Bitte geben Sie eine E-Mail-Adresse oder Telefonnummer an.");
    return Boolean(hasContact);
  };

  [emailInput, phoneInput].filter(Boolean).forEach((input) => {
    input.addEventListener("input", validateContactRoute);
  });

  const buildRequest = () => {
    const groupedValues = new Map();
    const formData = new FormData(projectForm);

    for (const [name, value] of formData.entries()) {
      const normalized = name === "Thema" && topicInput
        ? topicInput.selectedOptions[0]?.textContent.trim()
        : String(value).trim();
      if (!normalized) continue;

      const values = groupedValues.get(name) || [];
      values.push(normalized);
      groupedValues.set(name, values);
    }

    const lines = [
      "Guten Tag Herr Koschi,",
      "",
      "ich möchte mein Projekt kostenlos einschätzen lassen. Hier sind die Eckdaten:",
      "",
    ];

    for (const [name, values] of groupedValues.entries()) {
      lines.push(`${name}: ${values.join(", ")}`);
    }

    lines.push("", "Bitte kontaktieren Sie mich für die weitere Abstimmung.");
    return lines.join("\n");
  };

  const setCopyStatus = (message, isError = false) => {
    if (!copyStatus) return;
    copyStatus.textContent = message;
    copyStatus.dataset.error = String(isError);
  };

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const fallback = document.createElement("textarea");
    fallback.value = text;
    fallback.setAttribute("readonly", "");
    fallback.style.position = "fixed";
    fallback.style.opacity = "0";
    document.body.append(fallback);
    fallback.select();
    const copied = document.execCommand("copy");
    fallback.remove();
    if (!copied) throw new Error("Copy failed");
  };

  projectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    validateContactRoute();
    if (!projectForm.reportValidity()) return;

    const subject = encodeURIComponent("Kostenlose Ersteinschätzung Heimnetz");
    const body = encodeURIComponent(buildRequest());
    setCopyStatus("Die vorbereitete Anfrage wird jetzt in Ihrem E-Mail-Programm geöffnet.");
    window.location.href = `mailto:office@beratung-technik.at?subject=${subject}&body=${body}`;
  });

  if (whatsappButton) {
    whatsappButton.addEventListener("click", () => {
      validateContactRoute();
      if (!projectForm.reportValidity()) return;

      const text = encodeURIComponent(buildRequest());
      setCopyStatus("Die vorbereitete Anfrage wird jetzt in WhatsApp geöffnet.");
      window.location.href = `https://wa.me/436644169873?text=${text}`;
    });
  }

  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      validateContactRoute();
      if (!projectForm.reportValidity()) return;

      try {
        await copyText(buildRequest());
        setCopyStatus("Anfrage kopiert. Sie können sie jetzt in E-Mail oder WhatsApp einfügen.");
      } catch {
        setCopyStatus("Kopieren war nicht möglich. Bitte nutzen Sie E-Mail oder WhatsApp direkt.", true);
      }
    });
  }
}
