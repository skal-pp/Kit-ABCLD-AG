/**
 * LOGIQUE PRINCIPALE DE L'APPLICATION ABC LEARNING DESIGN
 */

// L'application utilise désormais des scripts globaux séquentiels pour compatibilité CORS en local (file://).
// Les objets TEMPLATES et les utilitaires de tracé sont chargés à partir de window.

// ==========================================================================
// STATE DE L'APPLICATION
// ==========================================================================
let state = {
  title: "Nom de la formation",
  code: "ABC-01",
  discipline: "Innovation pédagogique",
  objGeneraux: "Saisir les objectifs globaux de la formation...",
  objPedag: "Saisir les objectifs d'apprentissage...",
  contexte: "Présenter le cadre du projet...",
  modalites: "Ex: Hybride...",
  acteurs: "Pascal Pagny",
  methodes: "Ex: Classe inversée...",
  calendrier: "Dates clés...",
  ressources: "Matériels nécessaires...",
  publicConcerne: "Public visé...",
  productions: "Livrables attendus...",
  evaluationDesc: "Modalités d'évaluation de la formation...",
  modules: [
    {
      id: "m-default-1",
      title: "Semaine 1 : Introduction",
      cards: [
        {
          id: "c-default-1",
          type: "acquisition",
          title: "Introduction au domaine",
          desc: "Lire le chapitre d'introduction du manuel de cours (pages 10 à 25).",
          duration: 45,
          modality: "distance",
          rhythm: "asynchronous",
          icap: "passive",
          evaluation: "none",
          tools: "Livre, PDF"
        },
        {
          id: "c-default-2",
          type: "practice",
          title: "Quiz de mémorisation",
          desc: "Répondre au questionnaire d'auto-évaluation rapide en ligne.",
          duration: 15,
          modality: "distance",
          rhythm: "asynchronous",
          icap: "active",
          evaluation: "formative",
          tools: "Moodle"
        }
      ]
    },
    {
      id: "m-default-2",
      title: "Semaine 2 : Pratique & Échanges",
      cards: [
        {
          id: "c-default-3",
          type: "discussion",
          title: "Débat de synthèse",
          desc: "Débattre en sous-groupes sur les limites des théories abordées.",
          duration: 30,
          modality: "presential",
          rhythm: "synchronous",
          icap: "interactive",
          evaluation: "none",
          tools: "En présence"
        }
      ]
    }
  ]
};

// Variable globale pour garder la carte en cours d'édition ou de déplacement
let activeDraggedCard = null;

// ==========================================================================
// INITIALISATION DE L'APPLICATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Charger les données sauvegardées (ou utiliser le State par défaut)
  loadFromLocalStorage();

  // 2. Initialiser les écouteurs d'événements globaux
  initEventListeners();

  // 3. Effectuer le premier rendu
  renderApp();
  
  // 4. Initialiser Lucide Icons
  lucide.createIcons();
});

// ==========================================================================
// RENDER FONCTIONS
// ==========================================================================

function renderApp() {
  // A. Métadonnées - Champs texte courts
  document.getElementById("course-title").value = state.title || "";
  document.getElementById("course-code").value = state.code || "";
  document.getElementById("course-discipline").value = state.discipline || "";

  // A2. Métadonnées - Zones de texte longues
  const textareaFields = {
    "course-obj-generaux": "objGeneraux",
    "course-obj-pedag": "objPedag",
    "course-contexte": "contexte",
    "course-modalites": "modalites",
    "course-acteurs": "acteurs",
    "course-methodes": "methodes",
    "course-calendrier": "calendrier",
    "course-ressources": "ressources",
    "course-public": "publicConcerne",
    "course-productions": "productions",
    "course-evaluation-desc": "evaluationDesc"
  };
  Object.entries(textareaFields).forEach(([htmlId, stateKey]) => {
    const el = document.getElementById(htmlId);
    if (el) el.value = state[stateKey] || "";
  });

  // A3. Calcul automatique du volume horaire total
  updateCalculatedHours();

  // B. Rendre les Modules et Cartes
  renderStoryboard();

  // C. Rendre le Tableau de Bord
  renderDashboard();

  // D. Re-déclencher Lucide Icons pour les éléments créés dynamiquement
  lucide.createIcons();
}

/**
 * Calcule et affiche le volume horaire total à partir de la somme des durées de toutes les cartes
 */
function updateCalculatedHours() {
  let totalMinutes = 0;
  state.modules.forEach(m => {
    m.cards.forEach(c => {
      totalMinutes += parseInt(c.duration) || 0;
    });
  });
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const display = totalMinutes > 0 ? `${hrs}h${mins > 0 ? (mins < 10 ? '0' + mins : mins) : '00'}` : '0h00';
  const el = document.getElementById("course-calculated-hours");
  if (el) el.textContent = display;
}

/**
 * Dessine les modules et les cartes d'activité dans le storyboard
 */
function renderStoryboard() {
  const container = document.getElementById("modules-container");
  container.innerHTML = "";

  if (state.modules.length === 0) {
    container.innerHTML = `
      <div class="empty-list-placeholder" style="flex-grow: 1; padding: 60px;">
        <i data-lucide="folder-open" style="width: 48px; height: 48px; margin-bottom: 12px;"></i>
        <h3>Aucun module dans votre storyboard</h3>
        <p>Cliquez sur "Ajouter un Module" en haut à droite pour commencer à scénariser.</p>
      </div>
    `;
    return;
  }

  state.modules.forEach(m => {
    // Colonne de module
    const moduleCol = document.createElement("div");
    moduleCol.className = "module-column";
    moduleCol.setAttribute("data-module-id", m.id);
    
    // Contenu HTML du Module
    moduleCol.innerHTML = `
      <div class="module-header" draggable="false">
        <h3 title="${m.title}">${m.title}</h3>
        <div class="module-actions">
          <button class="btn-icon-small edit-module-trigger" data-module-id="${m.id}" title="Renommer/Supprimer">
            <i data-lucide="edit-2" style="width: 14px; height: 14px;"></i>
          </button>
        </div>
      </div>
      <div class="cards-list" data-module-id="${m.id}">
        <!-- Cartes insérées ici -->
      </div>
      <button class="add-card-btn add-card-trigger" data-module-id="${m.id}">
        <i data-lucide="plus" style="width: 14px; height: 14px;"></i> Ajouter une activité
      </button>
    `;

    const cardsListContainer = moduleCol.querySelector(".cards-list");

    if (m.cards.length === 0) {
      cardsListContainer.innerHTML = `
        <div class="empty-list-placeholder">
          <i data-lucide="plus-square" style="width: 20px; height: 20px;"></i>
          <span>Déposez ou créez une activité</span>
        </div>
      `;
    } else {
      m.cards.forEach(c => {
        const cardEl = createCardElement(c, m.id);
        cardsListContainer.appendChild(cardEl);
      });
    }

    container.appendChild(moduleCol);

    // Initialiser le Drag & Drop pour cette liste de cartes
    setupCardDragAndDrop(cardsListContainer);
  });
}

/**
 * Crée le composant DOM d'une carte d'activité
 */
function createCardElement(c, moduleId) {
  const card = document.createElement("div");
  card.className = `activity-card`;
  card.setAttribute("draggable", "true");
  card.setAttribute("data-card-id", c.id);
  card.setAttribute("data-module-id", moduleId);
  
  // Appliquer la variable CSS pour la couleur de type ABC
  card.style.setProperty('--abc-color', `var(--abc-${c.type})`);
  card.style.setProperty('--abc-text-color', `var(--abc-${c.type}-dark)`);

  const typeConfig = ABC_TYPES[c.type] || ABC_TYPES.acquisition;
  const icapConf = ICAP_LEVELS[c.icap] || ICAP_LEVELS.passive;

  // Modality & Rhythm text formatting
  const modalityText = c.modality === "presential" ? "Présentiel" : "En ligne";
  const rhythmText = c.rhythm === "synchronous" ? "Synchrone" : "Asynchrone";
  const evalBadge = c.evaluation !== "none" ? `<span class="badge badge-eval ${c.evaluation}">${c.evaluation === "formative" ? "Formative" : "Sommative"}</span>` : "";

  card.innerHTML = `
    <div class="activity-card-header">
      <span class="abc-badge-pill">${typeConfig.label}</span>
      <span class="card-duration"><i data-lucide="clock" style="width: 11px; height: 11px;"></i> ${c.duration}m</span>
    </div>
    <h4>${c.title}</h4>
    ${c.desc ? `<p class="card-desc">${c.desc}</p>` : ""}
    <div class="activity-card-footer">
      <div class="card-badges">
        <span class="icap-badge-pill level-${c.icap.substring(0,1)}" title="Engagement ICAP: ${icapConf.label} - ${icapConf.desc}">${icapConf.code}</span>
        <span class="badge badge-format">${modalityText} (${rhythmText.substring(0,4)}.)</span>
        ${evalBadge}
      </div>
      ${c.tools ? `<div class="card-tools" title="Outils: ${c.tools}"><i data-lucide="pocket" style="width: 11px; height: 11px;"></i> ${c.tools}</div>` : ""}
    </div>
  `;

  // Événement d'édition au clic sur la carte (sauf si on est en train de draguer)
  card.addEventListener("click", (e) => {
    // Si on clique sur un sous-bouton ou si on drag, on ignore
    if (e.target.closest("button") || card.classList.contains("dragging")) return;
    openCardModal(moduleId, c.id);
  });

  return card;
}

/**
 * Calcule et dessine tous les graphiques analytiques
 */
function renderDashboard() {
  const stats = calculateStats(state.modules);

  // Mettre à jour les indicateurs textuels simples
  document.getElementById("stat-total-cards").textContent = stats.totalCards;
  
  // Formatage de la durée globale en Heures + Minutes
  const totalMin = stats.totalDuration;
  if (totalMin >= 60) {
    const hrs = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    document.getElementById("stat-total-duration").textContent = `${hrs}h${mins > 0 ? mins : ""}`;
  } else {
    document.getElementById("stat-total-duration").textContent = `${totalMin} min`;
  }

  // A. Dessiner le Radar ABC
  renderRadarChart("radar-chart-wrapper", stats);

  // Générer la légende ABC avec pourcentages
  const legendContainer = document.getElementById("abc-legend");
  legendContainer.innerHTML = Object.keys(ABC_TYPES).map(key => {
    const type = ABC_TYPES[key];
    const pct = stats.abcPercentages[key] || 0;
    const dur = stats.abcDurations[key] || 0;
    return `
      <div class="legend-item" title="${dur} minutes d'activité">
        <span class="legend-color" style="background-color: ${type.color}; border: 1.5px solid ${type.text};"></span>
        <span>${type.label} : <strong>${pct}%</strong></span>
      </div>
    `;
  }).join("");

  // B. Dessiner le graphique ICAP
  renderIcapChart("icap-chart-wrapper", stats);

  // C. Dessiner les Donuts Modalité & Rythme
  // 1. Lieu : % Présentiel (Donut simple)
  renderDonutChart("modality-chart-wrapper", stats.modalities.presential, "var(--primary-color)", "var(--accent-color)");
  document.getElementById("modality-label").innerHTML = `
    <span style="color: var(--primary-color); font-weight:700;">${stats.modalities.presential}% Prés.</span> / 
    <span style="color: var(--accent-color); font-weight:700;">${stats.modalities.distance}% En ligne</span>
  `;

  // 2. Rythme : % Synchrone
  renderDonutChart("rhythm-chart-wrapper", stats.rhythms.synchronous, "var(--primary-color)", "var(--accent-color)");
  document.getElementById("rhythm-label").innerHTML = `
    <span style="color: var(--primary-color); font-weight:700;">${stats.rhythms.synchronous}% Sync.</span> / 
    <span style="color: var(--accent-color); font-weight:700;">${stats.rhythms.asynchronous}% Async.</span>
  `;

  // D. Générer les Conseils Pédagogiques personnalisés
  const recommendationsContent = document.getElementById("recommendations-content");
  recommendationsContent.innerHTML = generateRecommendations(stats).join("");
}

// ==========================================================================
// DRAG & DROP LOGIQUE
// ==========================================================================

function setupCardDragAndDrop(cardsListElement) {
  // Quand on commence à survoler la zone avec une carte draguée
  cardsListElement.addEventListener("dragenter", (e) => {
    e.preventDefault();
    cardsListElement.classList.add("drag-over");
  });

  cardsListElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    cardsListElement.classList.add("drag-over");
    
    // Déterminer la carte la plus proche sous la souris pour insérer avant elle
    const afterElement = getDragAfterElement(cardsListElement, e.clientY);
    const draggedCardDOM = document.querySelector(".activity-card.dragging");
    
    if (draggedCardDOM) {
      if (afterElement == null) {
        cardsListElement.appendChild(draggedCardDOM);
      } else {
        cardsListElement.insertBefore(draggedCardDOM, afterElement);
      }
    }
  });

  cardsListElement.addEventListener("dragleave", () => {
    cardsListElement.classList.remove("drag-over");
  });

  cardsListElement.addEventListener("drop", (e) => {
    e.preventDefault();
    cardsListElement.classList.remove("drag-over");
    syncStateFromDOM();
  });
}

/**
 * Gère le cycle de drag des cartes individuelles
 */
document.addEventListener("dragstart", (e) => {
  const card = e.target.closest(".activity-card");
  if (!card) return;

  activeDraggedCard = card;
  card.classList.add("dragging");
});

document.addEventListener("dragend", (e) => {
  const card = e.target.closest(".activity-card");
  if (!card) return;

  card.classList.remove("dragging");
  activeDraggedCard = null;
  syncStateFromDOM();
});

/**
 * Détermine quelle carte se trouve directement sous le curseur de souris verticalement
 */
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".activity-card:not(.dragging)")];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/**
 * Reconstruit le State JS en fonction de l'ordre réel des cartes dans le DOM.
 * Permet un glisser-déposer sans latence et hautement synchronisé.
 */
function syncStateFromDOM() {
  const newModulesState = [];

  const moduleColumns = document.querySelectorAll(".module-column");
  moduleColumns.forEach(col => {
    const moduleId = col.getAttribute("data-module-id");
    const moduleTitle = col.querySelector(".module-header h3").textContent;
    const cardElements = col.querySelectorAll(".activity-card");

    const newCards = [];
    cardElements.forEach(cardDOM => {
      const cardId = cardDOM.getAttribute("data-card-id");
      
      // Retrouver l'objet carte originel dans le state par son ID
      let originalCard = null;
      for (const m of state.modules) {
        const found = m.cards.find(c => c.id === cardId);
        if (found) {
          originalCard = found;
          break;
        }
      }

      if (originalCard) {
        newCards.push(originalCard);
      }
    });

    newModulesState.push({
      id: moduleId,
      title: moduleTitle,
      cards: newCards
    });
  });

  // Mettre à jour le state et le LocalStorage sans redessiner tout le storyboard pour éviter le clignotement
  state.modules = newModulesState;
  saveToLocalStorage();
  
  // Mettre simplement à jour le Dashboard en temps réel
  renderDashboard();
}

// ==========================================================================
// ACTIONS & LISTENERS DES MODALS
// ==========================================================================

function initEventListeners() {
  // A. Métadonnées du cours (Mise à jour en temps réel lors de la saisie)
  // Champs texte courts
  const shortInputMap = {
    "course-title": "title",
    "course-code": "code",
    "course-discipline": "discipline"
  };
  Object.entries(shortInputMap).forEach(([htmlId, stateKey]) => {
    const el = document.getElementById(htmlId);
    if (el) {
      el.addEventListener("input", () => {
        state[stateKey] = el.value;
        saveToLocalStorage();
      });
    }
  });

  // Zones de texte longues (textareas)
  const textareaMap = {
    "course-obj-generaux": "objGeneraux",
    "course-obj-pedag": "objPedag",
    "course-contexte": "contexte",
    "course-modalites": "modalites",
    "course-acteurs": "acteurs",
    "course-methodes": "methodes",
    "course-calendrier": "calendrier",
    "course-ressources": "ressources",
    "course-public": "publicConcerne",
    "course-productions": "productions",
    "course-evaluation-desc": "evaluationDesc"
  };
  Object.entries(textareaMap).forEach(([htmlId, stateKey]) => {
    const el = document.getElementById(htmlId);
    if (el) {
      el.addEventListener("input", () => {
        state[stateKey] = el.value;
        saveToLocalStorage();
      });
    }
  });

  // Toggle du panneau Métadonnées
  const toggleMetaBtn = document.getElementById("toggle-metadata");
  toggleMetaBtn.addEventListener("click", () => {
    const form = document.getElementById("metadata-form");
    const icon = toggleMetaBtn.querySelector("i");
    form.classList.toggle("collapsed");
    
    if (form.classList.contains("collapsed")) {
      icon.setAttribute("data-lucide", "chevron-down");
    } else {
      icon.setAttribute("data-lucide", "chevron-up");
    }
    lucide.createIcons();
  });

  // B. Thème Toggle (Clair / Sombre)
  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("theme-dark");
    document.body.classList.toggle("theme-light");
    const isDark = document.body.classList.contains("theme-dark");
    themeToggle.querySelector("i").setAttribute("data-lucide", isDark ? "sun" : "moon");
    lucide.createIcons();
    localStorage.setItem("abc_theme", isDark ? "dark" : "light");
    // Redessiner le radar pour s'adapter à la couleur des textes
    renderDashboard();
  });

  // Charger le thème sauvegardé
  const savedTheme = localStorage.getItem("abc_theme");
  if (savedTheme === "dark") {
    document.body.className = "theme-dark";
    themeToggle.querySelector("i").setAttribute("data-lucide", "sun");
  }

  // C. Ajouter un module
  document.getElementById("add-module-btn").addEventListener("click", () => {
    openModuleModal();
  });

  // D. Event delegation pour ajouter une activité et éditer un module
  document.addEventListener("click", (e) => {
    const addCardBtn = e.target.closest(".add-card-trigger");
    if (addCardBtn) {
      const moduleId = addCardBtn.getAttribute("data-module-id");
      openCardModal(moduleId);
      return;
    }

    const editModuleBtn = e.target.closest(".edit-module-trigger");
    if (editModuleBtn) {
      const moduleId = editModuleBtn.getAttribute("data-module-id");
      openModuleModal(moduleId);
      return;
    }
  });

  // E. Boutons de fermeture des modals
  document.querySelectorAll(".close-modal-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      closeAllModals();
    });
  });

  // F. Soumission des Formulaires (Modals)
  document.getElementById("save-card-btn").addEventListener("click", handleSaveCard);
  document.getElementById("delete-card-btn").addEventListener("click", handleDeleteCard);
  
  document.getElementById("save-module-btn").addEventListener("click", handleSaveModule);
  document.getElementById("delete-module-btn").addEventListener("click", handleDeleteModule);

  // G. Boutons d'action Fichiers
  document.getElementById("export-btn").addEventListener("click", exportProject);
  document.getElementById("import-btn").addEventListener("click", () => {
    document.getElementById("import-file-input").click();
  });
  document.getElementById("import-file-input").addEventListener("change", importProject);
  document.getElementById("print-btn").addEventListener("click", () => window.print());

  // H. Menu Modèles (Templates)
  document.querySelectorAll("#templates-dropdown a").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const templateKey = link.getAttribute("data-template");
      loadTemplate(templateKey);
    });
  });

  // I. Guide / Mode d'emploi
  const guideBtn = document.getElementById("guide-btn");
  const guideModal = document.getElementById("guide-modal");
  
  if (guideBtn && guideModal) {
    guideBtn.addEventListener("click", () => {
      guideModal.classList.add("active");
      lucide.createIcons();
    });

    // Gestion des onglets du guide
    const guideTabBtns = document.querySelectorAll(".guide-tab-btn");
    const guideTabPanels = document.querySelectorAll(".guide-tab-panel");

    guideTabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        guideTabBtns.forEach(b => b.classList.remove("active"));
        guideTabPanels.forEach(p => p.classList.remove("active"));

        btn.classList.add("active");
        const tabId = btn.getAttribute("data-tab");
        const panel = document.getElementById(tabId);
        if (panel) {
          panel.classList.add("active");
        }
        lucide.createIcons();
      });
    });
  }
}

/**
 * Ouvre le modal de création/édition d'activité
 */
function openCardModal(moduleId, cardId = null) {
  const modal = document.getElementById("card-modal");
  const form = document.getElementById("card-form");
  form.reset();

  document.getElementById("card-module-id").value = moduleId;
  document.getElementById("card-id").value = cardId || "";
  
  const deleteBtn = document.getElementById("delete-card-btn");

  if (cardId) {
    // Mode Édition
    document.getElementById("card-modal-title").textContent = "Modifier l'Activité";
    deleteBtn.style.display = "inline-flex";

    // Retrouver la carte dans le state
    const module = state.modules.find(m => m.id === moduleId);
    const card = module ? module.cards.find(c => c.id === cardId) : null;

    if (card) {
      // Remplir les champs du formulaire
      document.querySelector(`input[name="abc-type"][value="${card.type}"]`).checked = true;
      document.querySelector(`input[name="icap-level"][value="${card.icap}"]`).checked = true;
      document.getElementById("card-title-input").value = card.title;
      document.getElementById("card-duration-input").value = card.duration;
      document.getElementById("card-desc-input").value = card.desc || "";
      document.getElementById("card-modality-input").value = card.modality;
      document.getElementById("card-rhythm-input").value = card.rhythm;
      document.getElementById("card-evaluation-input").value = card.evaluation;
      document.getElementById("card-tools-input").value = card.tools || "";
    }
  } else {
    // Mode Création
    document.getElementById("card-modal-title").textContent = "Créer une Activité";
    deleteBtn.style.display = "none";
    
    // Valeurs par défaut
    document.getElementById("type-acq").checked = true;
    document.getElementById("icap-p").checked = true;
  }

  modal.classList.add("active");
  lucide.createIcons();
}

/**
 * Enregistre ou modifie l'activité dans le state
 */
function handleSaveCard(e) {
  e.preventDefault();
  const form = document.getElementById("card-form");
  if (!form.reportValidity()) return;

  const moduleId = document.getElementById("card-module-id").value;
  const cardId = document.getElementById("card-id").value;

  const type = document.querySelector('input[name="abc-type"]:checked').value;
  const icap = document.querySelector('input[name="icap-level"]:checked').value;
  const title = document.getElementById("card-title-input").value;
  const duration = parseInt(document.getElementById("card-duration-input").value) || 0;
  const desc = document.getElementById("card-desc-input").value;
  const modality = document.getElementById("card-modality-input").value;
  const rhythm = document.getElementById("card-rhythm-input").value;
  const evaluation = document.getElementById("card-evaluation-input").value;
  const tools = document.getElementById("card-tools-input").value;

  const moduleIndex = state.modules.findIndex(m => m.id === moduleId);
  if (moduleIndex === -1) return;

  if (cardId) {
    // Modifier existant
    const cardIndex = state.modules[moduleIndex].cards.findIndex(c => c.id === cardId);
    if (cardIndex !== -1) {
      state.modules[moduleIndex].cards[cardIndex] = {
        id: cardId, type, icap, title, duration, desc, modality, rhythm, evaluation, tools
      };
    }
  } else {
    // Nouveau
    const newCard = {
      id: "c-" + Date.now(),
      type, icap, title, duration, desc, modality, rhythm, evaluation, tools
    };
    state.modules[moduleIndex].cards.push(newCard);
  }

  saveToLocalStorage();
  closeAllModals();
  renderApp();
}

/**
 * Supprime une carte
 */
function handleDeleteCard() {
  const moduleId = document.getElementById("card-module-id").value;
  const cardId = document.getElementById("card-id").value;
  
  if (!cardId || !confirm("Voulez-vous vraiment supprimer cette activité ?")) return;

  const moduleIndex = state.modules.findIndex(m => m.id === moduleId);
  if (moduleIndex === -1) return;

  state.modules[moduleIndex].cards = state.modules[moduleIndex].cards.filter(c => c.id !== cardId);
  
  saveToLocalStorage();
  closeAllModals();
  renderApp();
}

/**
 * Gestion du modal de Module
 */
function openModuleModal(moduleId = null) {
  const modal = document.getElementById("module-modal");
  const form = document.getElementById("module-form");
  form.reset();

  document.getElementById("module-id").value = moduleId || "";
  const deleteBtn = document.getElementById("delete-module-btn");

  if (moduleId) {
    document.getElementById("module-modal-title").textContent = "Gérer le Module";
    deleteBtn.style.display = "inline-flex";

    const module = state.modules.find(m => m.id === moduleId);
    if (module) {
      document.getElementById("module-title-input").value = module.title;
    }
  } else {
    document.getElementById("module-modal-title").textContent = "Ajouter un Module / Semaine";
    deleteBtn.style.display = "none";
  }

  modal.classList.add("active");
  lucide.createIcons();
}

function handleSaveModule(e) {
  e.preventDefault();
  const form = document.getElementById("module-form");
  if (!form.reportValidity()) return;

  const moduleId = document.getElementById("module-id").value;
  const title = document.getElementById("module-title-input").value;

  if (moduleId) {
    // Modifier titre du module
    const m = state.modules.find(m => m.id === moduleId);
    if (m) m.title = title;
  } else {
    // Nouveau module
    state.modules.push({
      id: "m-" + Date.now(),
      title: title,
      cards: []
    });
  }

  saveToLocalStorage();
  closeAllModals();
  renderApp();
}

function handleDeleteModule() {
  const moduleId = document.getElementById("module-id").value;
  if (!moduleId || !confirm("Attention, la suppression de ce module supprimera toutes ses activités. Voulez-vous continuer ?")) return;

  state.modules = state.modules.filter(m => m.id !== moduleId);
  
  saveToLocalStorage();
  closeAllModals();
  renderApp();
}

function closeAllModals() {
  document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("active"));
}

// ==========================================================================
// TEMPLATES ET SAUVEGARDE
// ==========================================================================

function loadTemplate(key) {
  if (key === "empty") {
    if (confirm("Voulez-vous vraiment effacer tout votre travail actuel ?")) {
      state = {
        title: "Nouveau Cours",
        code: "",
        discipline: "",
        objGeneraux: "",
        objPedag: "",
        contexte: "",
        modalites: "",
        acteurs: "",
        methodes: "",
        calendrier: "",
        ressources: "",
        publicConcerne: "",
        productions: "",
        evaluationDesc: "",
        modules: []
      };
      saveToLocalStorage();
      renderApp();
    }
    return;
  }

  const template = TEMPLATES[key];
  if (!template) return;

  if (confirm(`Charger le modèle "${template.title}" ? Votre travail actuel sera remplacé.`)) {
    // Cloner en profondeur le template pédagogique pour éviter les références directes
    state = JSON.parse(JSON.stringify(template));
    saveToLocalStorage();
    renderApp();
  }
}

function saveToLocalStorage() {
  localStorage.setItem("abc_course_storyboard", JSON.stringify(state));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem("abc_course_storyboard");
  if (saved) {
    try {
      state = JSON.parse(saved);
    } catch (e) {
      console.error("Erreur lors de la lecture des données sauvegardées", e);
    }
  }
}

// ==========================================================================
// IMPORTS ET EXPORTS DE FICHIERS
// ==========================================================================

function exportProject() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  
  const fileName = `${state.code || "cours"}_matrice_abc_${new Date().toISOString().slice(0,10)}.json`;
  
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", fileName);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importProject(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const importedState = JSON.parse(evt.target.result);
      
      // Validation simple de la structure
      if (importedState.title && Array.isArray(importedState.modules)) {
        state = importedState;
        saveToLocalStorage();
        renderApp();
        alert("Projet importé avec succès !");
      } else {
        alert("Erreur : le fichier sélectionné ne possède pas une structure de matrice ABC valide.");
      }
    } catch (err) {
      alert("Erreur lors de la lecture du fichier JSON.");
      console.error(err);
    }
  };
  reader.readAsText(file);
}
