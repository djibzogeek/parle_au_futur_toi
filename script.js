// ============================================
// SCRIPT.JS — Site NSI Première
// Description : Interactions et effets dynamiques
// ============================================

// DOMContentLoaded : le code s'exécute une fois la page HTML entièrement chargée
document.addEventListener("DOMContentLoaded", function () {

  // --- 1. LIEN ACTIF DANS LA NAVIGATION ---
  // On compare l'URL de chaque lien avec la page en cours
  const liens = document.querySelectorAll("nav a");
  const pageCourante = window.location.pathname.split("/").pop() || "index.html";
  liens.forEach(function (lien) {
    if (lien.getAttribute("href") === pageCourante) {
      lien.classList.add("actif");
    }
  });

  // --- 2. ANIMATION DES BARRES DE PROGRESSION ---
  // On lit l'attribut data-valeur et on anime la largeur via CSS transition
  const barres = document.querySelectorAll(".barre-fill");
  setTimeout(function () {
    barres.forEach(function (b) {
      b.style.width = b.getAttribute("data-valeur") + "%";
    });
  }, 400);

  // --- 3. COMPTEURS ANIMÉS ---
  animerCompteurs();

  // --- 4. QUIZ ---
  initialiserQuiz();

});

// ============================================
// COMPTEURS ANIMÉS
// Cible les éléments avec class="compteur" et data-cible="X"
// ============================================
function animerCompteurs() {
  const els = document.querySelectorAll(".compteur");
  els.forEach(function (el) {
    const cible = parseInt(el.getAttribute("data-cible"), 10);
    let actuel = 0;
    const pas = Math.max(1, Math.ceil(cible / 60));

    // setInterval répète l'incrémentation toutes les 25ms
    const timer = setInterval(function () {
      actuel += pas;
      if (actuel >= cible) {
        actuel = cible;
        clearInterval(timer); // On arrête quand on atteint la cible
      }
      el.textContent = actuel;
    }, 25);
  });
}

// ============================================
// QUIZ INTERACTIF
// ============================================

// Tableau d'objets : chaque objet = une question avec ses réponses
const questions = [
  {
    q: "Quelle balise HTML crée un titre principal ?",
    opts: ["&lt;title&gt;", "&lt;h1&gt;", "&lt;header&gt;", "&lt;p&gt;"],
    bonne: 1
  },
  {
    q: "Quelle propriété CSS change la couleur du texte ?",
    opts: ["background-color", "font-color", "color", "text-color"],
    bonne: 2
  },
  {
    q: "Que signifie HTML ?",
    opts: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Mode Language",
      "Home Tool Markup Language"
    ],
    bonne: 0
  },
  {
    q: "En JavaScript, comment déclare-t-on une variable ?",
    opts: ["var x = 5", "let x = 5", "int x = 5", "variable x = 5"],
    bonne: 1
  },
  {
    q: "Quel sélecteur CSS cible un élément par son identifiant ?",
    opts: [".monId", "#monId", "*monId", "!monId"],
    bonne: 1
  },
  {
    q: "Quel protocole est utilisé pour naviguer sur le Web ?",
    opts: ["FTP", "SMTP", "HTTP", "SSH"],
    bonne: 2
  },
  {
    q: "En Python, comment affiche-t-on du texte ?",
    opts: ["echo('Bonjour')", "console.log('Bonjour')", "print('Bonjour')", "alert('Bonjour')"],
    bonne: 2
  }
];

let idx = 0;   // Index de la question courante
let score = 0; // Score du joueur

function initialiserQuiz() {
  // On vérifie que la div#quiz existe sur la page
  if (!document.getElementById("quiz")) return;
  afficherQuestion();
}

// Affiche la question courante dans la div#quiz
function afficherQuestion() {
  const div = document.getElementById("quiz");
  if (!div) return;

  // Si toutes les questions sont passées, on affiche le résultat
  if (idx >= questions.length) {
    afficherFin();
    return;
  }

  const q = questions[idx];

  // On construit le HTML du quiz dynamiquement
  div.innerHTML = `
    <div class="quiz-box">
      <div style="display:flex;justify-content:space-between;margin-bottom:1rem;">
        <span style="color:var(--texte-doux);font-size:0.85rem;">
          Question ${idx + 1} / ${questions.length}
        </span>
        <span style="color:var(--bleu);font-size:0.85rem;">Score : ${score}</span>
      </div>
      <p class="quiz-q">${q.q}</p>
      <div class="quiz-opts">
        ${q.opts.map((o, i) =>
          `<button class="quiz-opt" onclick="verifier(${i})">${o}</button>`
        ).join("")}
      </div>
      <p class="quiz-msg" id="qmsg"></p>
    </div>
  `;
}

// Vérifie la réponse sélectionnée par l'utilisateur
function verifier(choix) {
  const q = questions[idx];
  const btns = document.querySelectorAll(".quiz-opt");
  const msg = document.getElementById("qmsg");

  // Désactivation de tous les boutons pour éviter les double-clics
  btns.forEach(function (b) { b.disabled = true; });

  if (choix === q.bonne) {
    btns[choix].classList.add("ok");
    msg.style.color = "var(--vert)";
    msg.textContent = "✓ Bonne réponse !";
    score++; // Incrémentation du score
  } else {
    btns[choix].classList.add("ko");
    btns[q.bonne].classList.add("ok");
    msg.style.color = "#ff5252";
    // On affiche la bonne réponse (on retire les balises HTML pour l'affichage)
    msg.textContent = "✗ Mauvaise réponse. Bonne réponse : " + q.opts[q.bonne].replace(/&lt;|&gt;/g, m => m === "&lt;" ? "<" : ">");
  }

  idx++; // On passe à la question suivante
  // Délai de 1.6 secondes avant d'afficher la prochaine question
  setTimeout(afficherQuestion, 1600);
}

// Affiche le résultat final après toutes les questions
function afficherFin() {
  const div = document.getElementById("quiz");
  if (!div) return;

  let msg = "";
  if (score === questions.length)       msg = "🏆 Parfait, tu maîtrises tout !";
  else if (score >= questions.length * 0.6) msg = "👍 Bien joué ! Encore un effort.";
  else                                   msg = "📚 Revois les cours, tu peux faire mieux !";

  div.innerHTML = `
    <div class="quiz-box" style="text-align:center;">
      <p style="font-size:3rem;margin-bottom:1rem;">🎯</p>
      <h3 style="font-family:var(--titre);font-size:1.4rem;margin-bottom:0.5rem;">Quiz terminé !</h3>
      <p style="color:var(--bleu);font-size:2rem;font-weight:700;margin:1rem 0;">
        ${score} / ${questions.length}
      </p>
      <p style="color:var(--texte-doux);margin-bottom:1.5rem;">${msg}</p>
      <button class="btn btn-p" onclick="recommencer()">Recommencer</button>
    </div>
  `;
}

// Remet le quiz à zéro
function recommencer() {
  idx = 0;
  score = 0;
  afficherQuestion();
}
