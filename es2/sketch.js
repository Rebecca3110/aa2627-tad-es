// Obiettivo: riprodurre un quadro astratto geometrico semplice introducendo
// elementi casuali e colori che cambiano nel tempo o con il mouse, così da
// generare varianti diverse ma coerenti con l'estetica dell'opera.

// Vincoli:
// - tela di riferimento 800x600; con un rapporto diverso, solo uno dei due lati può essere inferiore
// - colori in HSL, HSB o OKLCH, impostati con colorMode()
// - colori e altri parametri variabili in variabili dichiarate all'inizio del file
// - variazioni casuali ottenute con random() e limitate da una regola cromatica
// - animazione o interazione applicata ai colori o all'estensione delle aree
// - anteprima preview.png con una variante rappresentativa
// - commento iniziale con autore, titolo, anno e fonte del quadro scelto

// Quadro: WAZR Studio, "Pastel Construction IV", 2026 (anno di pubblicazione sulla fonte).
// Fonte: https://artesta.it/products/quadro-geometrico-blocchi-colore
// Regola cromatica: blocchi a contrasto e bilanciamento, con toni caldi e freddi alternati.

// misure della tela: il quadro è verticale, quindi uso 600x800
let larghezzaTela = 600
let altezzaTela = 800

// colore di sfondo, in HSL: tono, saturazione, luminosità
let coloreSfondo = { tinta: 40, saturazione: 27, luminosita: 98 }

// toni ammessi per le variazioni dei rettangoli
let tintePalette = [5, 14, 40, 147, 149, 209, 214]

// colori ammessi per il blu: restano nella palette del quadro
let paletteBlu = [
  { tinta: 214, saturazione: 88, luminosita: 16 }, // blu
  { tinta: 209, saturazione: 43, luminosita: 63 }, // azzurro
  { tinta: 147, saturazione: 23, luminosita: 38 }, // verde
  { tinta: 149, saturazione: 66, luminosita: 9 }   // verde scuro
]

// rettangoli dal fondo verso il davanti
let rettangoli = [
  { nome: "verde scuro", tinta: 149, saturazione: 66, luminosita: 9, x: 318, y: 0, larghezza: 262, altezza: 43},
  { nome: "rosso", tinta: 5, saturazione: 69, luminosita: 46, x: 318, y: 43, larghezza: 262, altezza: 367 },
  { nome: "blu", tinta: 214, saturazione: 88, luminosita: 16, x: 19, y: 43, larghezza: 299, altezza: 249 },
  { nome: "azzurro", tinta: 209, saturazione: 43, luminosita: 63, x: 19, y: 292, larghezza: 119, altezza: 183 },
  { nome: "verde", tinta: 147, saturazione: 23, luminosita: 38, x: 197, y: 409, larghezza: 358, altezza: 391 },
  { nome: "rosa", tinta: 14, saturazione: 79, luminosita: 87, x: 138, y: 252, larghezza: 263, altezza: 332 }
]

// conservo i valori iniziali per il reset
for (const r of rettangoli) {
  r.tintaBase = r.tinta
  r.saturazioneBase = r.saturazione
  r.luminositaBase = r.luminosita
}

let rettBlu = rettangoli.find((r) => r.nome === "blu")
let rettRosso = rettangoli.find((r) => r.nome === "rosso")

// durata e ampiezza delle animazioni
let durataRosa = 7000
let scalaMassimaRosa = 2.6
let durataAzzurro = 5000
let durataVerde = 7000
let ampiezzaVerde = 0.35
let intervalloToni = 500
let ampiezzaRosso = 18
let periodoRosso = 10000

// stato delle animazioni
let inizioRosa = -1
let rosaVisibile = true
let scalaRosa = 1
let inizioAzzurro = -1
let rotazioneAzzurro = 0
let inizioVerde = -1
let scalaVerde = 1
let ultimoCambioToni = 0
let formaPrecedente = ""

function setup() {
  createCanvas(larghezzaTela, altezzaTela)
  colorMode(HSL, 360, 100, 100)
  noStroke()
}

function draw() {
  background(coloreSfondo.tinta, coloreSfondo.saturazione, coloreSfondo.luminosita)

  gestisciHover()
  aggiornaAnimazioni()

  // la luminosità del rosso parte dal massimo e scende ogni 5 s
  let luceRosso = rettRosso.luminosita + ampiezzaRosso * cos(TWO_PI * millis() / periodoRosso)

  for (const r of rettangoli) {
    if (r.nome === "rosa" && !rosaVisibile) continue

    let scala = scalaVerde
    if (r.nome === "rosa") scala *= scalaRosa

    let rotazione = 0
    if (r.nome === "azzurro") rotazione = rotazioneAzzurro

    let luce = r.luminosita
    if (r.nome === "rosso") luce = luceRosso

    disegnaRettangolo(r, scala, rotazione, luce)
  }
}

function disegnaRettangolo(r, scala, rotazione, luce) {
  push()
  translate(r.x + r.larghezza / 2, r.y + r.altezza / 2)
  if (rotazione !== 0) rotate(radians(rotazione))
  scale(scala)
  fill(r.tinta, r.saturazione, luce)
  rect(-r.larghezza / 2, -r.altezza / 2, r.larghezza, r.altezza)
  pop()
}

function gestisciHover() {
  const forma = formaSottoIlMouse()

  if (forma === "blu" && formaPrecedente !== "blu") {
    cambiaColoreBlu()
  }

  if (forma === "azzurro" && formaPrecedente !== "azzurro" && !animazioneInCorso()) {
    inizioAzzurro = millis()
    rotazioneAzzurro = 0
  }

  formaPrecedente = forma
}

function mousePressed() {
  // il verde scuro ora è coperto dal rosso: il reset resta sul blocco rosso
  const formaPremuta = formaSottoIlMouse()
  if (formaPremuta === "rosso" || formaPremuta === "verde scuro") {
    resetta()
    return
  }

  if (animazioneInCorso()) return

  if (formaPremuta === "rosa") avviaRosa()
  if (formaPremuta === "verde") avviaVerde()
}

function avviaRosa() {
  inizioRosa = millis()
  rosaVisibile = true
  scalaRosa = 1
}

function avviaVerde() {
  inizioVerde = millis()
  scalaVerde = 1
  ultimoCambioToni = millis()
  cambiaToni()
}

function aggiornaAnimazioni() {
  if (inizioRosa >= 0) {
    const p = (millis() - inizioRosa) / durataRosa
    if (p >= 1) {
      inizioRosa = -1
      rosaVisibile = false
      scalaRosa = 0
    } else {
      rosaVisibile = true
      scalaRosa = 1 + (scalaMassimaRosa - 1) * sin(PI * p)
    }
  }

  if (inizioAzzurro >= 0) {
    const p = (millis() - inizioAzzurro) / durataAzzurro
    if (p >= 1) {
      inizioAzzurro = -1
      rotazioneAzzurro = 0
    } else {
      rotazioneAzzurro = 360 * p
    }
  }

  if (inizioVerde >= 0) {
    const p = (millis() - inizioVerde) / durataVerde
    if (p >= 1) {
      inizioVerde = -1
      scalaVerde = 1
    } else {
      scalaVerde = 1 + ampiezzaVerde * sin(PI * p)
      if (millis() - ultimoCambioToni >= intervalloToni) {
        cambiaToni()
        ultimoCambioToni = millis()
      }
    }
  }
}

function animazioneInCorso() {
  return inizioRosa >= 0 || inizioAzzurro >= 0 || inizioVerde >= 0
}

function cambiaColoreBlu() {
  const scelte = paletteBlu.filter((c) => {
    return c.tinta !== rettBlu.tinta || c.saturazione !== rettBlu.saturazione || c.luminosita !== rettBlu.luminosita
  })
  const nuovo = random(scelte.length > 0 ? scelte : paletteBlu)
  rettBlu.tinta = nuovo.tinta
  rettBlu.saturazione = nuovo.saturazione
  rettBlu.luminosita = nuovo.luminosita
}

function cambiaToni() {
  for (const r of rettangoli) {
    const scelte = tintePalette.filter((tinta) => tinta !== r.tinta)
    r.tinta = random(scelte)
  }
}

function resetta() {
  for (const r of rettangoli) {
    r.tinta = r.tintaBase
    r.saturazione = r.saturazioneBase
    r.luminosita = r.luminositaBase
  }

  inizioRosa = -1
  rosaVisibile = true
  scalaRosa = 1
  inizioAzzurro = -1
  rotazioneAzzurro = 0
  inizioVerde = -1
  scalaVerde = 1
  ultimoCambioToni = 0
  formaPrecedente = ""
}

function formaSottoIlMouse() {
  for (let i = rettangoli.length - 1; i >= 0; i--) {
    const r = rettangoli[i]
    if (r.nome === "rosa" && !rosaVisibile) continue
    if (mouseX >= r.x && mouseX <= r.x + r.larghezza && mouseY >= r.y && mouseY <= r.y + r.altezza) {
      return r.nome
    }
  }
  return ""
}
