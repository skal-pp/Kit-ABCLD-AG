/**
 * Utilitaire de rendu des graphiques analytiques en SVG natif.
 */

// Types ABC et leurs configurations de couleur
const ABC_TYPES = {
  acquisition: { label: "Acquisition", color: "var(--abc-acquisition)", text: "var(--abc-acquisition-dark)", icon: "book-open" },
  investigation: { label: "Investigation", color: "var(--abc-investigation)", text: "var(--abc-investigation-dark)", icon: "search" },
  discussion: { label: "Discussion", color: "var(--abc-discussion)", text: "var(--abc-discussion-dark)", icon: "messages-square" },
  practice: { label: "Pratique", color: "var(--abc-practice)", text: "var(--abc-practice-dark)", icon: "edit-3" },
  collaboration: { label: "Collaboration", color: "var(--abc-collaboration)", text: "var(--abc-collaboration-dark)", icon: "users" },
  production: { label: "Production", color: "var(--abc-production)", text: "var(--abc-production-dark)", icon: "award" }
};

// Niveaux ICAP
const ICAP_LEVELS = {
  interactive: { label: "Interactif", code: "I", color: "var(--icap-interactive)", desc: "Co-construction avec autrui" },
  constructive: { label: "Constructif", code: "C", color: "var(--icap-constructive)", desc: "Production active autonome" },
  active: { label: "Actif", code: "A", color: "var(--icap-active)", desc: "Interaction ou manipulation" },
  passive: { label: "Passif", code: "P", color: "var(--icap-passive)", desc: "Réception d'informations" }
};

/**
 * Calcule les statistiques globales à partir du storyboard
 */
function calculateStats(modules) {
  let totalCards = 0;
  let totalDuration = 0; // en minutes

  const abcDurations = { acquisition: 0, investigation: 0, discussion: 0, practice: 0, collaboration: 0, production: 0 };
  const icapDurations = { interactive: 0, constructive: 0, active: 0, passive: 0 };
  
  let presentialDuration = 0;
  let distanceDuration = 0;
  let synchronousDuration = 0;
  let asynchronousDuration = 0;

  modules.forEach(m => {
    m.cards.forEach(c => {
      totalCards++;
      const duration = parseInt(c.duration) || 0;
      totalDuration += duration;

      // Répartition ABC
      if (abcDurations.hasOwnProperty(c.type)) {
        abcDurations[c.type] += duration;
      }

      // Répartition ICAP
      if (icapDurations.hasOwnProperty(c.icap)) {
        icapDurations[c.icap] += duration;
      }

      // Modalité (Présentiel / Distanciel)
      if (c.modality === "presential") {
        presentialDuration += duration;
      } else {
        distanceDuration += duration;
      }

      // Rythme (Synchrone / Asynchrone)
      if (c.rhythm === "synchronous") {
        synchronousDuration += duration;
      } else {
        asynchronousDuration += duration;
      }
    });
  });

  // Pourcentages ABC (par rapport à la durée totale, ou 0 s'il n'y a pas d'activités)
  const abcPercentages = {};
  Object.keys(abcDurations).forEach(key => {
    abcPercentages[key] = totalDuration > 0 ? Math.round((abcDurations[key] / totalDuration) * 100) : 0;
  });

  // Pourcentages ICAP
  const icapPercentages = {};
  Object.keys(icapDurations).forEach(key => {
    icapPercentages[key] = totalDuration > 0 ? Math.round((icapDurations[key] / totalDuration) * 100) : 0;
  });

  // Pourcentages Modalité / Rythme
  const presentialPct = totalDuration > 0 ? Math.round((presentialDuration / totalDuration) * 100) : 0;
  const distancePct = totalDuration > 0 ? 100 - presentialPct : 0;
  
  const synchronousPct = totalDuration > 0 ? Math.round((synchronousDuration / totalDuration) * 100) : 0;
  const asynchronousPct = totalDuration > 0 ? 100 - synchronousPct : 0;

  return {
    totalCards,
    totalDuration,
    abcPercentages,
    abcDurations,
    icapPercentages,
    icapDurations,
    modalities: { presential: presentialPct, distance: distancePct },
    rhythms: { synchronous: synchronousPct, asynchronous: asynchronousPct }
  };
}

/**
 * Génère le graphique Radar en SVG pour la répartition ABC
 */
function renderRadarChart(containerId, stats) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const width = 220;
  const height = 220;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 75;

  const axes = ["acquisition", "investigation", "discussion", "practice", "collaboration", "production"];
  const numAxes = axes.length;

  // Calcul du max dynamique (soit 50%, soit le max s'il dépasse 50%)
  const values = axes.map(key => stats.abcPercentages[key] || 0);
  const maxValue = Math.max(...values, 50);

  let svgContent = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">`;

  // 1. Dessiner les cercles/polygones de la grille concentrique (10%, 20%, 30%, 40%, 50%...)
  const steps = 5;
  for (let s = 1; s <= steps; s++) {
    const r = (s / steps) * radius;
    const points = [];
    for (let i = 0; i < numAxes; i++) {
      const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    // Lignes de grille concentriques
    svgContent += `<polygon points="${points.join(" ")}" class="radar-poly-grid" />`;
    
    // Légende des valeurs sur l'axe vertical (seulement pour la dernière grille ou l'axe du haut)
    const valText = Math.round((s / steps) * maxValue);
    svgContent += `<text x="${cx + 4}" y="${cy - r + 3}" font-size="8" fill="var(--text-light)" font-weight="600">${valText}%</text>`;
  }

  // 2. Dessiner les axes radiaux et étiquettes
  axes.forEach((key, i) => {
    const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    // Ligne d'axe
    svgContent += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" class="radar-axis-line" />`;

    // Placement intelligent de l'étiquette texte
    const labelDistance = radius + 15;
    const labelX = cx + labelDistance * Math.cos(angle);
    // Légère déviation verticale pour les étiquettes du bas
    const labelY = cy + labelDistance * Math.sin(angle) + (angle > 0 && angle < Math.PI ? 4 : -2);
    
    let textAnchor = "middle";
    if (Math.cos(angle) > 0.1) textAnchor = "start";
    else if (Math.cos(angle) < -0.1) textAnchor = "end";

    const typeConfig = ABC_TYPES[key];
    svgContent += `<text x="${labelX}" y="${labelY}" text-anchor="${textAnchor}" class="radar-axis-label" font-weight="700" fill="${typeConfig.text}">${typeConfig.label}</text>`;
  });

  // 3. Dessiner la forme des données
  const dataPoints = [];
  axes.forEach((key, i) => {
    const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
    const val = stats.abcPercentages[key] || 0;
    const r = (val / maxValue) * radius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    dataPoints.push({ x, y, val, key });
  });

  if (stats.totalDuration > 0) {
    const pointsStr = dataPoints.map(p => `${p.x},${p.y}`).join(" ");
    // Polygone rempli
    svgContent += `<polygon points="${pointsStr}" class="radar-poly-data" />`;

    // Points de données individuels
    dataPoints.forEach(p => {
      svgContent += `<circle cx="${p.x}" cy="${p.y}" r="4" class="radar-poly-dot" style="fill: ${ABC_TYPES[p.key].color}; stroke: ${ABC_TYPES[p.key].text};" title="${ABC_TYPES[p.key].label} : ${p.val}%">
        <title>${ABC_TYPES[p.key].label} : ${p.val}% (${stats.abcDurations[p.key]} min)</title>
      </circle>`;
    });
  } else {
    // Centre vide si aucune activité
    svgContent += `<circle cx="${cx}" cy="${cy}" r="3" fill="var(--text-light)" />`;
  }

  svgContent += `</svg>`;
  container.innerHTML = svgContent;
}

/**
 * Génère un graphique Donut en SVG
 */
function renderDonutChart(containerId, percentage, colorPrimary, colorSecondary, centerLabel) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const width = 100;
  const height = 100;
  const cx = width / 2;
  const cy = height / 2;
  const r = 38;
  const circumference = 2 * Math.PI * r;

  // Calcul des dasharrays
  const val1Dash = (percentage / 100) * circumference;
  const val2Dash = circumference - val1Dash;

  let svgContent = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Cercle de fond (deuxième valeur)
  svgContent += `<circle cx="${cx}" cy="${cy}" r="${r}" class="donut-circle-bg" style="stroke: ${colorSecondary || "var(--bg-primary)"};" />`;
  
  // Cercle de premier plan (première valeur)
  if (percentage > 0) {
    // Si c'est 100%, pas besoin d'arrondi de ligne pour éviter des bugs d'affichage
    const isFull = percentage >= 100;
    svgContent += `<circle cx="${cx}" cy="${cy}" r="${r}" class="donut-circle-val1" 
      style="stroke: ${colorPrimary}; stroke-dasharray: ${val1Dash} ${val2Dash}; stroke-dashoffset: ${circumference / 4}; ${isFull ? 'stroke-linecap: butt;' : ''}" />`;
  }

  // Texte central
  svgContent += `<text x="${cx}" y="${cy}" class="donut-center-text">${percentage}%</text>`;
  
  svgContent += `</svg>`;
  container.innerHTML = svgContent;
}

/**
 * Rendu de la répartition ICAP (Barres horizontales empilées et détaillées)
 */
function renderIcapChart(containerId, stats) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const levels = ["interactive", "constructive", "active", "passive"];
  
  let html = `<div class="icap-bar-container">`;

  // 1. Barre cumulée (Stacked progress bar)
  if (stats.totalDuration > 0) {
    html += `<div class="icap-row-bar-bg" style="height: 16px; display: flex; overflow: hidden; margin-bottom: 12px;">`;
    levels.forEach(level => {
      const pct = stats.icapPercentages[level] || 0;
      if (pct > 0) {
        html += `<div style="width: ${pct}%; height: 100%; background-color: ${ICAP_LEVELS[level].color}; transition: width 0.3s ease;" title="${ICAP_LEVELS[level].label} : ${pct}%"></div>`;
      }
    });
    html += `</div>`;
  }

  // 2. Barres individuelles par niveau avec explications
  levels.forEach(level => {
    const pct = stats.icapPercentages[level] || 0;
    const levelConf = ICAP_LEVELS[level];
    
    html += `
      <div class="icap-bar-row">
        <div class="icap-row-label">
          <span class="icap-badge-pill level-${level.substring(0,1)}">${levelConf.code}</span>
          <span>${levelConf.label}</span>
        </div>
        <div class="icap-row-bar-bg">
          <div class="icap-row-bar-fill" style="width: ${pct}%; background-color: ${levelConf.color};"></div>
        </div>
        <div class="icap-row-value">${pct}%</div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;

  // 3. Mise à jour de la boîte d'analyse globale de l'engagement ICAP
  const summaryBox = document.getElementById("icap-level-summary");
  if (summaryBox) {
    const passive = stats.icapPercentages.passive || 0;
    const active = stats.icapPercentages.active || 0;
    const constructive = stats.icapPercentages.constructive || 0;
    const interactive = stats.icapPercentages.interactive || 0;

    let summaryText = "";
    if (stats.totalDuration === 0) {
      summaryText = "Aucune donnée disponible. Commencez à planifier en ajoutant des activités.";
    } else if (passive > 50) {
      summaryText = `⚠️ <strong>Engagement majoritairement passif (${passive}%)</strong>. Les étudiants passent beaucoup de temps à acquérir des connaissances. Essayez d'intégrer des sessions d'application (Active), de synthèse (Constructive) ou d'échange de groupe (Interactive) pour favoriser l'assimilation.`;
    } else if (interactive + constructive > 40) {
      summaryText = `✨ <strong>Excellent niveau d'engagement en profondeur (${interactive + constructive}% d'apprentissage actif supérieur)</strong>. Ce profil favorise la co-construction de connaissances et le développement de l'esprit critique.`;
    } else {
      summaryText = `💡 <strong>Mix d'engagement équilibré</strong>. Les phases de réception passive (${passive}%) alternent correctement avec des activités d'application et de co-construction (${active + constructive + interactive}% cumulés).`;
    }
    summaryBox.innerHTML = summaryText;
  }
}

/**
 * Analyse les données pour générer des conseils pédagogiques personnalisés ABC + ICAP
 */
function generateRecommendations(stats) {
  const recommendations = [];

  if (stats.totalDuration === 0) {
    return [`<div class="rec-item"><span class="text-muted">Ajoutez des cartes d'activité dans le storyboard pour recevoir des conseils d'optimisation pédagogique en temps réel.</span></div>`];
  }

  const acq = stats.abcPercentages.acquisition || 0;
  const inv = stats.abcPercentages.investigation || 0;
  const disc = stats.abcPercentages.discussion || 0;
  const prac = stats.abcPercentages.practice || 0;
  const coll = stats.abcPercentages.collaboration || 0;
  const prod = stats.abcPercentages.production || 0;

  const pres = stats.modalities.presential || 0;
  const dist = stats.modalities.distance || 0;
  const sync = stats.rhythms.synchronous || 0;

  // Règle 1: Trop d'Acquisition
  if (acq > 35) {
    recommendations.push({
      icon: "alert-triangle",
      color: "var(--danger-color)",
      text: `<strong>Trop d'Acquisition (${acq}%)</strong> : La charge de cours transmissif (cours magistral, lecture) est élevée. Proposez aux étudiants une activité de <strong>Discussion</strong> ou de <strong>Pratique</strong> suite aux lectures pour valider leur compréhension.`
    });
  }

  // Règle 2: Manque de Production
  if (prod < 10) {
    recommendations.push({
      icon: "lightbulb",
      color: "var(--accent-color)",
      text: `<strong>Manque de Production (${prod}%)</strong> : Les étudiants produisent peu de travaux personnels. Envisagez une activité de synthèse finale de type rapport, poster, présentation ou dossier de réflexion.`
    });
  }

  // Règle 3: Manque d'Investigation
  if (inv < 10) {
    recommendations.push({
      icon: "help-circle",
      color: "var(--text-muted)",
      text: `<strong>Investigation faible (${inv}%)</strong> : Les étudiants sont peu amenés à chercher des ressources par eux-mêmes. Essayez d'intégrer une recherche documentaire ou une étude comparative de cas.`
    });
  }

  // Règle 4: Collaboration vs Discussion
  if (coll < 10 && disc > 20) {
    recommendations.push({
      icon: "users",
      color: "var(--primary-color)",
      text: `<strong>Discussion vs Collaboration</strong> : Vos étudiants échangent beaucoup (${disc}%), mais travaillent peu sur des livrables communs (${coll}%). Transformez certains débats en ateliers de co-création en petits groupes.`
    });
  }

  // Règle 5: Hybridation et charge synchrone en ligne
  if (dist > 60 && sync > 50) {
    recommendations.push({
      icon: "clock",
      color: "var(--icap-active)",
      text: `<strong>Fatigue Zoom/Teams potentielle</strong> : Le cours est majoritairement en ligne (${dist}%) et en direct/synchrone (${sync}%). Pensez à basculer certaines présentations théoriques en asynchrone (vidéo enregistrée) pour libérer du temps d'atelier en ligne.`
    });
  }

  // Règle 6: Absence d'évaluation formative
  let hasFormative = false;
  let hasSummative = false;
  // Nous pourrions vérifier cela dans les modules
  
  // Conseil générique si tout va bien
  if (recommendations.length === 0) {
    recommendations.push({
      icon: "check-circle",
      color: "var(--success-color)",
      text: `<strong>Profil pédagogique équilibré !</strong> Votre scénarisation présente une bonne répartition des types d'apprentissage ABC et favorise un engagement diversifié.`
    });
  }

  return recommendations.map(rec => `
    <div class="rec-item">
      <i data-lucide="${rec.icon}" class="rec-icon" style="color: ${rec.color}; width: 16px; height: 16px;"></i>
      <div>${rec.text}</div>
    </div>
  `);
}

// Enregistrement global pour accès sans module ES6 (CORS local)
window.ABC_TYPES = ABC_TYPES;
window.ICAP_LEVELS = ICAP_LEVELS;
window.calculateStats = calculateStats;
window.renderRadarChart = renderRadarChart;
window.renderDonutChart = renderDonutChart;
window.renderIcapChart = renderIcapChart;
window.generateRecommendations = generateRecommendations;
