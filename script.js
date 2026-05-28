const properties = [
  {
    id: "ADI-ABE-001",
    title: "Oke-Mosan Residential Plots",
    state: "Ogun",
    city: "Abeokuta",
    type: "Residential Plot",
    status: "Available",
    size: "500 sqm",
    price: 4500000,
    document: "Registered Survey",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=85",
    summary: "Dry residential plots near Abeokuta's government and commercial corridor, suitable for family homes and medium-term investment.",
    tags: ["Dry land", "Road access", "Residential"]
  },
  {
    id: "ADI-OGU-002",
    title: "Obada Growth Corridor Estate",
    state: "Ogun",
    city: "Obada",
    type: "Estate Plot",
    status: "Inspection Ready",
    size: "600 sqm",
    price: 6200000,
    document: "Deed of Assignment",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
    summary: "Estate-style allocation for buyers who want planned development around the Abeokuta expansion corridor.",
    tags: ["Estate layout", "Gated plan", "Installment option"]
  },
  {
    id: "ADI-LAG-003",
    title: "Ibeju-Lekki Investment Land",
    state: "Lagos",
    city: "Ibeju-Lekki",
    type: "Residential Plot",
    status: "Limited Slots",
    size: "300 sqm",
    price: 9800000,
    document: "Excision in Process",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=85",
    summary: "Compact investment plots around the Lekki growth axis for buyers who want Lagos exposure with flexible entry size.",
    tags: ["Growth axis", "Buy and hold", "Lagos market"]
  },
  {
    id: "ADI-OYO-004",
    title: "Moniya Residential Layout",
    state: "Oyo",
    city: "Ibadan",
    type: "Estate Plot",
    status: "Available",
    size: "450 sqm",
    price: 5200000,
    document: "Registered Survey",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85",
    summary: "Residential allocation for buyers seeking Ibadan land near active road and rail-linked development zones.",
    tags: ["Residential", "Corner options", "Survey available"]
  },
  {
    id: "ADI-FCT-005",
    title: "Kuje Commercial Land",
    state: "FCT Abuja",
    city: "Kuje",
    type: "Commercial Land",
    status: "By Appointment",
    size: "1,000 sqm",
    price: 28000000,
    document: "Allocation Letter",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85",
    summary: "Commercial-use land for investors looking toward Abuja satellite town expansion and service businesses.",
    tags: ["Commercial", "Satellite town", "High visibility"]
  },
  {
    id: "ADI-OSU-006",
    title: "Osogbo Agro-Investment Acres",
    state: "Osun",
    city: "Osogbo",
    type: "Agricultural Land",
    status: "Available",
    size: "5 acres",
    price: 15000000,
    document: "Family Receipt and Survey",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85",
    summary: "Large parcel suited for agro-investment, land banking, and phased development outside the dense city core.",
    tags: ["Acreage", "Land banking", "Agriculture"]
  }
];

const formatNaira = (amount) => new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0
}).format(amount).replace("NGN", "NGN ");

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const propertyGrid = $("[data-property-grid]");
const propertyTemplate = $("[data-property-card-template]");
const propertySearch = $("[data-property-search]");
const stateFilter = $("[data-state-filter]");
const typeFilter = $("[data-type-filter]");
const budgetFilter = $("[data-budget-filter]");
const listingCount = $("[data-listing-count]");
const emptyState = $("[data-empty-state]");
const propertySelect = $("[data-property-select]");
const planSelect = $("[data-plan-select]");

function generateReference(prefix) {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${new Date().getFullYear()}-${suffix}`;
}

function saveRecord(key, record) {
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  existing.unshift(record);
  localStorage.setItem(key, JSON.stringify(existing.slice(0, 30)));
}

function populateFilters() {
  const states = [...new Set(properties.map((property) => property.state))].sort();
  states.forEach((state) => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateFilter.append(option);
  });

  properties.forEach((property) => {
    const option = document.createElement("option");
    option.value = property.id;
    option.textContent = `${property.title} - ${property.city}, ${property.state}`;
    propertySelect.append(option);
  });
}

function getFilteredProperties() {
  const query = propertySearch.value.trim().toLowerCase();
  const state = stateFilter.value;
  const type = typeFilter.value;
  const budget = budgetFilter.value === "all" ? Infinity : Number(budgetFilter.value);

  return properties.filter((property) => {
    const searchableText = [
      property.title,
      property.state,
      property.city,
      property.type,
      property.status,
      property.document,
      property.summary,
      property.tags.join(" ")
    ].join(" ").toLowerCase();

    return searchableText.includes(query)
      && (state === "all" || property.state === state)
      && (type === "all" || property.type === type)
      && property.price <= budget;
  });
}

function renderProperties() {
  const visibleProperties = getFilteredProperties();
  propertyGrid.innerHTML = "";

  visibleProperties.forEach((property) => {
    const card = propertyTemplate.content.firstElementChild.cloneNode(true);
    const image = $(".property-card__image img", card);
    image.src = property.image;
    image.alt = `${property.title} in ${property.city}, ${property.state}`;
    $(".property-card__status", card).textContent = property.status;
    $(".property-card__type", card).textContent = property.type;
    $(".property-card__location", card).textContent = `${property.city}, ${property.state}`;
    $("h3", card).textContent = property.title;
    $("p", card).textContent = property.summary;
    $("[data-size]", card).textContent = property.size;
    $("[data-price]", card).textContent = formatNaira(property.price);
    $("[data-document]", card).textContent = property.document;

    const tagList = $(".tag-list", card);
    property.tags.forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.textContent = tag;
      tagList.append(tagElement);
    });

    $(".property-card__button", card).addEventListener("click", () => {
      propertySelect.value = property.id;
      $("#inspection").scrollIntoView({ behavior: "smooth", block: "start" });
      propertySelect.focus({ preventScroll: true });
    });

    propertyGrid.append(card);
  });

  listingCount.textContent = `${visibleProperties.length} ${visibleProperties.length === 1 ? "property" : "properties"}`;
  emptyState.hidden = visibleProperties.length > 0;
}

function resetFilters() {
  propertySearch.value = "";
  stateFilter.value = "all";
  typeFilter.value = "all";
  budgetFilter.value = "all";
  renderProperties();
}

function initNavigation() {
  const toggle = $("[data-nav-toggle]");
  const nav = $("[data-nav]");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  $$(".site-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initListingFilters() {
  [propertySearch, stateFilter, typeFilter, budgetFilter].forEach((control) => {
    control.addEventListener("input", renderProperties);
    control.addEventListener("change", renderProperties);
  });

  $("[data-reset-filters]").addEventListener("click", resetFilters);
}

function initPlanButtons() {
  $$("[data-plan-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      planSelect.value = button.dataset.planChoice;
      $("#subscriptions").scrollIntoView({ behavior: "smooth", block: "center" });
      planSelect.focus({ preventScroll: true });
    });
  });
}

function initSubscriptionForm() {
  const form = $("[data-subscription-form]");
  const result = $("[data-subscription-result]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const reference = generateReference("ADI-SUB");

    saveRecord("adimulaSubscriptions", {
      reference,
      fullName: data.get("fullName"),
      email: data.get("email"),
      phone: data.get("phone"),
      plan: data.get("plan"),
      area: data.get("area"),
      budget: data.get("budget"),
      createdAt: new Date().toISOString()
    });

    result.textContent = `Subscription request received. Reference: ${reference}.`;
    form.reset();
  });
}

function initSellerForm() {
  const form = $("[data-seller-form]");
  const result = $("[data-seller-result]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const reference = generateReference("ADI-SELL");

    saveRecord("adimulaSellerRequests", {
      reference,
      sellerName: data.get("sellerName"),
      sellerPhone: data.get("sellerPhone"),
      location: data.get("location"),
      size: data.get("size"),
      document: data.get("document"),
      price: data.get("price"),
      notes: data.get("notes"),
      createdAt: new Date().toISOString()
    });

    result.textContent = `Property review request submitted. Reference: ${reference}.`;
    form.reset();
  });
}

function initInspectionForm() {
  const form = $("[data-inspection-form]");
  const result = $("[data-inspection-result]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const reference = generateReference("ADI-INSP");
    const property = properties.find((item) => item.id === data.get("property"));

    saveRecord("adimulaInspections", {
      reference,
      fullName: data.get("fullName"),
      phone: data.get("phone"),
      propertyId: data.get("property"),
      propertyTitle: property ? property.title : "",
      date: data.get("date"),
      buyerType: data.get("buyerType"),
      message: data.get("message"),
      createdAt: new Date().toISOString()
    });

    result.textContent = `Inspection request received for ${property ? property.title : "selected property"}. Reference: ${reference}.`;
    form.reset();
  });
}

function initContactForm() {
  const form = $("[data-contact-form]");
  const result = $("[data-contact-result]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const reference = generateReference("ADI-ENQ");

    saveRecord("adimulaEnquiries", {
      reference,
      name: data.get("name"),
      email: data.get("email"),
      type: data.get("type"),
      message: data.get("message"),
      createdAt: new Date().toISOString()
    });

    result.textContent = `Thank you, ${data.get("name")}. Your enquiry has been logged as ${reference}.`;
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  $("[data-year]").textContent = new Date().getFullYear();
  populateFilters();
  renderProperties();
  initNavigation();
  initListingFilters();
  initPlanButtons();
  initSubscriptionForm();
  initSellerForm();
  initInspectionForm();
  initContactForm();
});
