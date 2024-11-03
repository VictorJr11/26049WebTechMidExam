// Define translations for English and French
const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      rooms: "Rooms",
      services: "Services",
      events: "Events",
      gallery: "Gallery",
      family: "Family",
      update: "Update",
      contact: "Contact"
    },
    dropdown: {
      madeleine: "Who's Madeleine Safari?",
      dieudonne: "Dieudonne Unencan",
      binen: "Binen Gladys",
      "madeleine-family": "Madeleine's Family",
      victor: "Victor Jacker"
    },
    booking: {
      "check-in-label": "Check-in:",
      "check-out-label": "Check-out:",
      "adults-label": "Adults:",
      "children-label": "Children:",
      "search-button": "SEARCH"
    },
    about: {
      "comfort-heading": "RAISING COMFORT TO THE HIGHEST LEVEL",
      "welcome-heading": "Welcome to Madeleine Garden",
      "about-text-1": "Where comfort and inspiration converge in our collection of four charming guestrooms...",
      "about-text-2": "Enjoy the tranquil ambiance of our venue...",
      "facilities-button": "FACILITIES"
    },
    footer: {
      about: {
        "about-title": "About Us",
        "about-text": "Madeleine Garden is a beautiful venue for events..."
      },
      links: {
        quickLinks: "Quick Links",
        about: "About",
        gallery: "Gallery",
        family: "Family",
        contact: "Contact",
        booking: "Book Now"
      },
      contact: {
        contactTitle: "Contact Us",
        email: "Email: info@madeleinegarden.com",
        address: "Address: Madeleine Garden, Kinyinya..."
      },
      follow: "Follow Us"
    }
  },
  fr: {
    nav: {
      home: "Accueil",
      about: "À propos",
      rooms: "Chambres",
      services: "Services",
      events: "Événements",
      gallery: "Galerie",
      family: "Famille",
      update: "Mise à jour",
      contact: "Contact"
    },
    dropdown: {
      madeleine: "Qui est Madeleine Safari?",
      dieudonne: "Dieudonne Unencan",
      binen: "Binen Gladys",
      "madeleine-family": "La famille de Madeleine",
      victor: "Victor Jacker"
    },
    booking: {
      "check-in-label": "Enregistrement:",
      "check-out-label": "Départ:",
      "adults-label": "Adultes:",
      "children-label": "Enfants:",
      "search-button": "RECHERCHER"
    },
    about: {
      "comfort-heading": "ÉLEVONS LE CONFORT À SON NIVEAU LE PLUS ÉLEVÉ",
      "welcome-heading": "Bienvenue à Madeleine Garden",
      "about-text-1": "Où le confort et l'inspiration convergent dans notre collection de quatre chambres charmantes...",
      "about-text-2": "Profitez de l'ambiance tranquille de notre lieu...",
      "facilities-button": "INSTALLATIONS"
    },
    footer: {
      about: {
        "about-title": "À propos de nous",
        "about-text": "Madeleine Garden est un magnifique lieu pour des événements..."
      },
      links: {
        quickLinks: "Liens rapides",
        about: "À propos",
        gallery: "Galerie",
        family: "Famille",
        contact: "Contact",
        booking: "Réserver maintenant"
      },
      contact: {
        contactTitle: "Contactez-nous",
        email: "Email: info@madeleinegarden.com",
        address: "Adresse: Madeleine Garden, Kinyinya..."
      },
      follow: "Suivez-nous"
    }
  }
};

// Current language state
let currentLang = 'en';

// Function to update all translations
function updateTranslations() {
  const langData = translations[currentLang];

  // Get all elements with data-translate attribute
  const elements = document.querySelectorAll('[data-translate]');

  elements.forEach(element => {
    const translateKey = element.getAttribute('data-translate');

    // Navigate through the translations object to find the correct translation
    const keys = translateKey.split('-');
    let translation = langData;

    keys.forEach(key => {
      if (translation) {
        translation = translation[key];
      }
    });

    // Update element text if translation is found
    if (translation && typeof translation === 'string') {
      element.textContent = translation;
    }
  });

  // Update HTML lang attribute
  document.documentElement.lang = currentLang;

  // Dispatch event for other scripts that might need to know about language change
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: currentLang } }));
}

// Function to set language
function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    updateTranslations();
    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
  }
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
  // Check for saved language preference
  const savedLang = localStorage.getItem('preferredLanguage');
  if (savedLang && translations[savedLang]) {
    currentLang = savedLang;
  } else {
    // Default to English if no preference is set
    currentLang = 'en';
  }

  updateTranslations();

  // Set up language toggle button
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const newLang = currentLang === 'en' ? 'fr' : 'en';
      setLanguage(newLang);
    });
  }

  // Update button text to show current language
  const updateToggleButton = () => {
    if (langToggle) {
      langToggle.textContent = currentLang === 'en' ? 'FR' : 'EN';
    }
  };
  updateToggleButton();
});
