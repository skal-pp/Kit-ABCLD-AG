/**
 * Templates pédagogiques prédéfinis basés sur la méthode ABC Learning Design et ICAP.
 * Structure mise à jour avec les rubriques de description de la formation.
 */
window.TEMPLATES = {
  flipped: {
    title: "Classe Inversée - Fondamentaux",
    code: "CI-01",
    discipline: "Innovation Pédagogique",
    objGeneraux: "Concevoir un cours interactif centré sur l'activité des étudiants en s'appuyant sur des méthodes actives.",
    objPedag: "Être capable de scénariser une séquence pédagogique en classe inversée en intégrant le modèle ABC et la taxonomie ICAP.",
    contexte: "Dispositif d'auto-formation professionnelle continue pour les enseignants de l'académie.",
    modalites: "Mode hybride : phase de préparation en ligne asynchrone, puis atelier collaboratif synchrone en présentiel.",
    acteurs: "Pascal Pagny, Concepteur pédagogique",
    methodes: "Classe inversée, apprentissage collaboratif, évaluation formative croisée.",
    calendrier: "Déroulement sur 3 semaines. Session présentielle calée en semaine 2.",
    ressources: "Espace Moodle, capsules vidéo interactives (Panopto), document collaboratif partagé.",
    publicConcerne: "Enseignants du second degré.",
    productions: "Matrice de scénarisation finalisée d'une séquence de cours.",
    evaluationDesc: "Quiz d'auto-évaluation en ligne (semaine 1) et évaluation formative du livrable par les pairs (semaine 3).",
    modules: [
      {
        id: "m-1",
        title: "Phase 1 : Préparations en autonomie (À distance)",
        cards: [
          {
            id: "c-1-1",
            type: "acquisition",
            title: "Capsules vidéo : Les notions clés",
            desc: "Visionner les deux courtes vidéos explicatives sur les concepts fondamentaux de la semaine et prendre des notes.",
            duration: 25,
            modality: "distance",
            rhythm: "asynchronous",
            icap: "active",
            evaluation: "none",
            tools: "Moodle, Panopto"
          },
          {
            id: "c-1-2",
            type: "acquisition",
            title: "Lecture de l'article scientifique",
            desc: "Lire le texte de cadrage pour approfondir la théorie.",
            duration: 35,
            modality: "distance",
            rhythm: "asynchronous",
            icap: "passive",
            evaluation: "none",
            tools: "PDF, Moodle"
          },
          {
            id: "c-1-3",
            type: "practice",
            title: "Test de positionnement (Quiz)",
            desc: "Vérifier la bonne compréhension des lectures et vidéos à travers un questionnaire à choix multiples interactif.",
            duration: 15,
            modality: "distance",
            rhythm: "asynchronous",
            icap: "active",
            evaluation: "formative",
            tools: "Moodle Quiz"
          }
        ]
      },
      {
        id: "m-2",
        title: "Phase 2 : Séance Synchrone (En Présentiel)",
        cards: [
          {
            id: "c-2-1",
            type: "discussion",
            title: "Q&A et Clarifications",
            desc: "Échanger en grand groupe sur les difficultés identifiées lors du quiz en ligne. Clarifications apportées par l'enseignant.",
            duration: 15,
            modality: "presential",
            rhythm: "synchronous",
            icap: "interactive",
            evaluation: "none",
            tools: "Tableau blanc"
          },
          {
            id: "c-2-2",
            type: "collaboration",
            title: "Étude de cas en équipe",
            desc: "Analyser un problème concret en groupe de 4 étudiants. Proposer des hypothèses de résolution.",
            duration: 45,
            modality: "presential",
            rhythm: "synchronous",
            icap: "interactive",
            evaluation: "none",
            tools: "Papier, Post-it"
          },
          {
            id: "c-2-3",
            type: "production",
            title: "Restitution de la solution",
            desc: "Synthétiser les propositions du groupe sur un poster ou document partagé et le présenter rapidement.",
            duration: 30,
            modality: "presential",
            rhythm: "synchronous",
            icap: "constructive",
            evaluation: "formative",
            tools: "Canva, Google Slides"
          }
        ]
      },
      {
        id: "m-3",
        title: "Phase 3 : Consolidation (À distance)",
        cards: [
          {
            id: "c-3-1",
            type: "investigation",
            title: "Recherche complémentaire libre",
            desc: "Identifier une ressource externe (article, vidéo, exemple) illustrant le problème résolu en cours et la poster sur le forum.",
            duration: 40,
            modality: "distance",
            rhythm: "asynchronous",
            icap: "constructive",
            evaluation: "none",
            tools: "Internet, Padlet"
          }
        ]
      }
    ]
  },

  mooc: {
    title: "MOOC - Auto-formation thématique",
    code: "MOOC-01",
    discipline: "Auto-formation",
    objGeneraux: "Permettre l'apprentissage de notions techniques en totale autonomie en ligne.",
    objPedag: "Savoir configurer et exécuter un environnement logiciel de test.",
    contexte: "Dispositif ouvert à grande échelle sans tutorat direct.",
    modalites: "100% en ligne, asynchrone.",
    acteurs: "Équipe d'ingénierie pédagogique de la plateforme",
    methodes: "Auto-apprentissage par la pratique et QCM.",
    calendrier: "4 semaines de formation (rythme libre, estimé à 2 heures par semaine).",
    ressources: "Plateforme LMS (Open edX), compilateur en ligne, forum communautaire.",
    publicConcerne: "Grand public, professionnels en reconversion.",
    productions: "Résultats d'exercices de codage en ligne et obtention de badges.",
    evaluationDesc: "Quiz d'étape (formatifs) et examen final sous forme de QCM (sommatif) pour obtention de l'attestation.",
    modules: [
      {
        id: "mooc-m1",
        title: "Module d'introduction théorique",
        cards: [
          {
            id: "mooc-c1",
            type: "acquisition",
            title: "Cours magistral en vidéo",
            desc: "Regarder les vidéos de présentation des principes fondamentaux.",
            duration: 45,
            modality: "distance",
            rhythm: "asynchronous",
            icap: "passive",
            evaluation: "none",
            tools: "Vimeo, YouTube"
          },
          {
            id: "mooc-c2",
            type: "practice",
            title: "Quiz d'auto-évaluation",
            desc: "Tester ses connaissances théoriques.",
            duration: 15,
            modality: "distance",
            rhythm: "asynchronous",
            icap: "active",
            evaluation: "formative",
            tools: "Quiz"
          },
          {
            id: "mooc-c3",
            type: "discussion",
            title: "Forum de discussion : Présentations",
            desc: "Présenter son parcours et poser ses premières questions sur le forum.",
            duration: 20,
            modality: "distance",
            rhythm: "asynchronous",
            icap: "interactive",
            evaluation: "none",
            tools: "Moodle Forum"
          }
        ]
      },
      {
        id: "mooc-m2",
        title: "Module d'application pratique",
        cards: [
          {
            id: "mooc-c4",
            type: "acquisition",
            title: "Tutoriel pas-à-pas",
            desc: "Suivre le guide de configuration pratique d'un environnement de test.",
            duration: 30,
            modality: "distance",
            rhythm: "asynchronous",
            icap: "active",
            evaluation: "none",
            tools: "PDF, Git"
          },
          {
            id: "mooc-c5",
            type: "practice",
            title: "Exercice d'application guidé",
            desc: "Réaliser le mini-exercice pratique à partir des codes fournis.",
            duration: 60,
            modality: "distance",
            rhythm: "asynchronous",
            icap: "constructive",
            evaluation: "formative",
            tools: "VS Code, Sandbox"
          },
          {
            id: "mooc-c6",
            type: "production",
            title: "Quiz final certifiant",
            desc: "Valider les acquis du module pour l'obtention du badge.",
            duration: 30,
            modality: "distance",
            rhythm: "asynchronous",
            icap: "active",
            evaluation: "summative",
            tools: "Moodle Quiz"
          }
        ]
      }
    ]
  },

  project: {
    title: "Pédagogie par Projet & Design Thinking",
    code: "PROJ-DT",
    discipline: "Design & Innovation",
    objGeneraux: "Résoudre un problème sociétal ou technique réel via une approche centrée utilisateur.",
    objPedag: "Concevoir un prototype fonctionnel répondant à un besoin utilisateur identifié sur le terrain.",
    contexte: "Atelier collaboratif (FabLab / Incubateur pédagogique).",
    modalites: "Principalement en présentiel, complété par de la recherche terrain en autonomie.",
    acteurs: "Facilitateurs, coachs, enseignants, experts extérieurs.",
    methodes: "Design Thinking, prototypage rapide, apprentissage par l'erreur.",
    calendrier: "Projet de 6 semaines. Soutenances programmées en semaine 6.",
    ressources: "Miro, FabLab (imprimantes 3D, matériel de maquettage), salle active modulable.",
    publicConcerne: "Étudiants en design ou ingénierie (niveau Master).",
    productions: "Dossier d'investigation utilisateur, prototype fonctionnel, pitch vidéo de 3 minutes.",
    evaluationDesc: "Évaluation continue des livrables intermédiaires (formative) et note finale attribuée par un jury lors du pitch de soutenance (sommative).",
    modules: [
      {
        id: "p-m1",
        title: "Étape 1 : Empathie et Définition du besoin",
        cards: [
          {
            id: "p-c1",
            type: "investigation",
            title: "Recherche documentaire & terrain",
            desc: "Mener des interviews avec des utilisateurs cibles et réaliser une étude de l'existant.",
            duration: 120,
            modality: "distance",
            rhythm: "asynchronous",
            icap: "constructive",
            evaluation: "none",
            tools: "Internet, Grille d'interview"
          },
          {
            id: "p-c2",
            type: "collaboration",
            title: "Brainstorming en équipe",
            desc: "Partager les retours d'interviews et formaliser le problème exact à résoudre sous forme de cartes d'empathie.",
            duration: 90,
            modality: "presential",
            rhythm: "synchronous",
            icap: "interactive",
            evaluation: "none",
            tools: "Mural, Miro, Post-its"
          }
        ]
      },
      {
        id: "p-m2",
        title: "Étape 2 : Idéation & Prototypage",
        cards: [
          {
            id: "p-c3",
            type: "collaboration",
            title: "Coconception de la solution",
            desc: "Esquisser les premiers prototypes rapides (wireframes, schémas de processus).",
            duration: 120,
            modality: "presential",
            rhythm: "synchronous",
            icap: "interactive",
            evaluation: "none",
            tools: "Figma, Papier"
          },
          {
            id: "p-c4",
            type: "production",
            title: "Développement du prototype",
            desc: "Créer un livrable fonctionnel ou une maquette finale simulant le service ou produit.",
            duration: 240,
            modality: "distance",
            rhythm: "asynchronous",
            icap: "constructive",
            evaluation: "none",
            tools: "Figma, Outils de code, Imprimante 3D"
          }
        ]
      },
      {
        id: "p-m3",
        title: "Étape 3 : Tests et Soutenance",
        cards: [
          {
            id: "p-c5",
            type: "discussion",
            title: "Phase de tests utilisateurs",
            desc: "Faire tester le prototype à d'autres groupes d'étudiants, recueillir et analyser leurs retours constructifs.",
            duration: 60,
            modality: "presential",
            rhythm: "synchronous",
            icap: "interactive",
            evaluation: "formative",
            tools: "Grille d'évaluation"
          },
          {
            id: "p-c6",
            type: "production",
            title: "Soutenance de projet (Pitch)",
            desc: "Présenter le projet final devant un jury d'enseignants et d'experts.",
            duration: 20,
            modality: "presential",
            rhythm: "synchronous",
            icap: "constructive",
            evaluation: "summative",
            tools: "Projecteur, Diaporama"
          }
        ]
      }
    ]
  },

  hybrid: {
    title: "Enseignement Hybride Équilibré",
    code: "HYB-EQ",
    discipline: "Méthodologie d'Étude",
    objGeneraux: "Varier les rythmes et lieux d'apprentissage pour optimiser la mémorisation.",
    objPedag: "Être capable de rédiger et structurer un rapport de synthèse argumenté sur un thème complexe.",
    contexte: "Cours universitaire semestriel classique réaménagé en formule hybride.",
    modalites: "Hybridation alternée : 1 semaine en ligne autonome, 1 semaine en présentiel interactif.",
    acteurs: "Équipe enseignante discipline",
    methodes: "Apprentissage autonome guidé, travaux pratiques en labo, classe virtuelle.",
    calendrier: "3 semaines d'apprentissage expérimental hybride.",
    ressources: "Matériel TP, espace Moodle, visioconférence.",
    publicConcerne: "Étudiants de Licence 2.",
    productions: "Fiche d'auto-positionnement hebdomadaire et rapport de synthèse final de 5 pages.",
    evaluationDesc: "Évaluation sommative sur table en fin de semestre (60%) et note du rapport de synthèse (40%).",
    modules: [
      {
        id: "h-m1",
        title: "Semaine 1 : Introduction & Cadrage (En ligne)",
        cards: [
          {
            id: "h-c1",
            type: "acquisition",
            title: "Lecture guidée du syllabus",
            desc: "Parcourir la structure du cours, les attendus et les modalités d'évaluation.",
            duration: 30,
            modality: "distance",
            rhythm: "asynchronous",
            icap: "passive",
            evaluation: "none",
            tools: "Moodle"
          },
          {
            id: "h-c2",
            type: "discussion",
            title: "Classe virtuelle d'accueil",
            desc: "Rencontre synchrone, questions/réponses sur l'organisation du semestre.",
            duration: 45,
            modality: "distance",
            rhythm: "synchronous",
            icap: "interactive",
            evaluation: "none",
            tools: "Zoom, Teams"
          }
        ]
      },
      {
        id: "h-m2",
        title: "Semaine 2 : Pratique & Expérimentation (En présence)",
        cards: [
          {
            id: "h-c3",
            type: "practice",
            title: "Atelier pratique en laboratoire",
            desc: "Mettre en œuvre les concepts théoriques sur le matériel de laboratoire ou poste informatique.",
            duration: 90,
            modality: "presential",
            rhythm: "synchronous",
            icap: "active",
            evaluation: "none",
            tools: "Matériel TP"
          },
          {
            id: "h-c4",
            type: "discussion",
            title: "Débriefing et partage d'expérience",
            desc: "Mise en commun des résultats des ateliers pratiques, repérage des erreurs classiques.",
            duration: 30,
            modality: "presential",
            rhythm: "synchronous",
            icap: "interactive",
            evaluation: "none",
            tools: "Tableau blanc"
          }
        ]
      },
      {
        id: "h-m3",
        title: "Semaine 3 : Recherche & Synthèse (Hybride)",
        cards: [
          {
            id: "h-c5",
            type: "investigation",
            title: "Enquête documentaire",
            desc: "Rechercher des exemples avancés en autonomie en ligne.",
            duration: 60,
            modality: "distance",
            rhythm: "asynchronous",
            icap: "active",
            evaluation: "none",
            tools: "Google Scholar"
          },
          {
            id: "h-c6",
            type: "production",
            title: "Rapport de synthèse personnel",
            desc: "Rédiger et déposer une note de synthèse argumentée.",
            duration: 120,
            modality: "distance",
            rhythm: "asynchronous",
            icap: "constructive",
            evaluation: "summative",
            tools: "Word, PDF"
          }
        ]
      }
    ]
  }
};
