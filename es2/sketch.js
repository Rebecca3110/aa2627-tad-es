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

// Quadro: WAZR Studio, "Pastel Construction IV", 2026
// Fonte: https://artesta.it/products/quadro-geometrico-blocchi-colore
// Regola cromatica: sei campi piatti su fondo bianco. Caldi: rosso (HSL 5/69/46)
//   e rosa chiaro (14/79/87); freddi: blu profondo (214/88/16), azzurro (209/43/63),
//   verde medio (147/23/38) e verde scuro (149/66/9). I caldi sono più saturi e chiari;
//   i blu e i verdi scuri sono più profondi, con l'azzurro come passaggio chiaro.
//   Il rosa occupa il centro, il blu e il rosso i campi ampi, il verde medio il campo
//   basso e il verde scuro la fascia superiore. Le variazioni scelgono insieme tinta,
//   saturazione e luminosità da questa palette (S 23-88%, L 9-87%); il pannello
//   di fondo resta chiaro e desaturato (S 0-20%, L 80-90%).

// misure della tela
let larghezzaTela = 600
let altezzaTela = 600

// riduco proporzionalmente la composizione dentro un'area di 550x550
let larghezzaSpazio = 550
let altezzaSpazio = 550
let larghezzaComposizione = 600
let altezzaComposizione = 800
let scalaComposizione = Math.min(larghezzaSpazio / larghezzaComposizione, altezzaSpazio / altezzaComposizione)
let margineSinistro = (larghezzaTela - larghezzaComposizione * scalaComposizione) / 2
let margineSuperiore = (altezzaTela - altezzaComposizione * scalaComposizione) / 2
let sovrapposizioneBordi = 2

// colore di sfondo, in HSL: tono, saturazione, luminosità
let coloreSfondo = { tinta: 0, saturazione: 0, luminosita: 98 }
let rettangoloGrigio = {
  x: 90, y: 23, larghezza: 404, altezza: 573,
  tinta: 0, saturazione: 0, luminosita: 85
}
let tintaBaseRettangoloGrigio = rettangoloGrigio.tinta
let saturazioneBaseRettangoloGrigio = rettangoloGrigio.saturazione
let luminositaBaseRettangoloGrigio = rettangoloGrigio.luminosita

// colori ammessi per le variazioni: tinta, saturazione e luminosità
// vengono scelti insieme, così ogni variazione resta nella palette del quadro
let paletteColori = [
  { tinta: 5, saturazione: 69, luminosita: 46 },   // rosso
  { tinta: 14, saturazione: 79, luminosita: 87 },  // rosa
  { tinta: 147, saturazione: 23, luminosita: 38 }, // verde
  { tinta: 149, saturazione: 66, luminosita: 9 },  // verde scuro
  { tinta: 209, saturazione: 43, luminosita: 63 }, // azzurro
  { tinta: 214, saturazione: 88, luminosita: 16 }  // blu
]

// il pannello resta chiaro: varia solo fra versioni desaturate della palette
let palettePannello = [
  { tinta: 0, saturazione: 0, luminosita: 85 },    // grigio
  { tinta: 5, saturazione: 18, luminosita: 87 },   // grigio rosato
  { tinta: 14, saturazione: 20, luminosita: 90 },  // grigio rosa
  { tinta: 147, saturazione: 14, luminosita: 82 }, // grigio verde
  { tinta: 149, saturazione: 16, luminosita: 80 }, // grigio verde scuro
  { tinta: 209, saturazione: 16, luminosita: 84 }, // grigio azzurro
  { tinta: 214, saturazione: 18, luminosita: 80 }  // grigio blu
]

// colori ammessi per il blu: restano nella palette del quadro
let paletteBlu = [
  { tinta: 214, saturazione: 88, luminosita: 16 }, // blu
  { tinta: 209, saturazione: 43, luminosita: 63 }, // azzurro
  { tinta: 147, saturazione: 23, luminosita: 38 }, // verde
  { tinta: 149, saturazione: 66, luminosita: 9 }   // verde scuro
]

// rettangoli dal fondo verso il davanti
let rettangoli = [
  { nome: "verde scuro", tinta: 149, saturazione: 66, luminosita: 9, x: 319, y: 0, larghezza: 261, altezza: 43},
  { nome: "rosso", tinta: 5, saturazione: 69, luminosita: 46, x: 318, y: 43, larghezza: 262, altezza: 367 },
  { nome: "blu", tinta: 214, saturazione: 88, luminosita: 16, x: 19, y: 43, larghezza: 296, altezza: 249 },
  { nome: "azzurro", tinta: 209, saturazione: 43, luminosita: 63, x: 19, y: 295, larghezza: 119, altezza: 183 },
  { nome: "verde", tinta: 147, saturazione: 23, luminosita: 38, x: 197, y: 413, larghezza: 358, altezza: 391 },
  { nome: "rosa", tinta: 14, saturazione: 79, luminosita: 87, x: 138, y: 252, larghezza: 263, altezza: 332 }
]

let limiteSinistroRettangoli = Math.min(...rettangoli.map((r) => r.x))
let limiteDestroRettangoli = Math.max(...rettangoli.map((r) => r.x + r.larghezza))
let limiteSuperioreRettangoli = Math.min(...rettangoli.map((r) => r.y))
let limiteInferioreRettangoli = Math.max(...rettangoli.map((r) => r.y + r.altezza))
let centroComposizioneX = margineSinistro + (limiteSinistroRettangoli + limiteDestroRettangoli) / 2 * scalaComposizione
let centroComposizioneY = margineSuperiore + (limiteSuperioreRettangoli + limiteInferioreRettangoli) / 2 * scalaComposizione

// conservo i valori iniziali per il reset e per il controllo dei clic
for (const r of rettangoli) {
  r.tintaBase = r.tinta
  r.saturazioneBase = r.saturazione
  r.luminositaBase = r.luminosita
  r.scalaXCorrente = 1
  r.scalaYCorrente = 1
  r.rotazioneCorrente = 0
  r.spostamentoXCorrente = 0
  r.spostamentoYCorrente = 0
}

let rettBlu = rettangoli.find((r) => r.nome === "blu")
let rettRosso = rettangoli.find((r) => r.nome === "rosso")
let rettAzzurro = rettangoli.find((r) => r.nome === "azzurro")
let rettRosa = rettangoli.find((r) => r.nome === "rosa")

// durata e ampiezza delle animazioni
let durataRosa = 7000
let pausaRosa = 2000
let durataFaseRosa = durataRosa / 2
let durataRiduzioneFinaleRosa = durataFaseRosa
let scalaMassimaRosaX = larghezzaTela / (rettRosa.larghezza * scalaComposizione)
let scalaMassimaRosaY = altezzaTela / (rettRosa.altezza * scalaComposizione)
let durataAzzurro = 5000
let intervalloColoreAzzurro = 1500
let durataVerde = 7000
let pausaVerde = 2000
let durataFaseVerde = durataVerde / 2
let scalaMassimaVerdeX = larghezzaTela / ((limiteDestroRettangoli - limiteSinistroRettangoli + 2 * sovrapposizioneBordi) * scalaComposizione)
let scalaMassimaVerdeY = altezzaTela / ((limiteInferioreRettangoli - limiteSuperioreRettangoli + 2 * sovrapposizioneBordi) * scalaComposizione)
let intervalloToni = 500
let ampiezzaRosso = 18
let periodoRosso = 10000
let luminositaMinima = 9
let luminositaMassima = 87

// stato delle animazioni
let inizioRosa = -1
let rosaVisibile = true
let progressoRosa = 0
let scalaRosaFinale = 1
let inizioAzzurro = -1
let rotazioneAzzurro = 0
let ultimoCambioColoreAzzurro = 0
let inizioVerde = -1
let progressoVerde = 0
let ultimoCambioToni = 0

function setup() {
  createCanvas(larghezzaTela, altezzaTela)
  colorMode(HSL, 360, 100, 100)
  noStroke()
}

function draw() {
  background(coloreSfondo.tinta, coloreSfondo.saturazione, coloreSfondo.luminosita)

  aggiornaAnimazioni()

  const progressoPannello = progressoVerde
  fill(rettangoloGrigio.tinta, rettangoloGrigio.saturazione, rettangoloGrigio.luminosita)
  rect(
    rettangoloGrigio.x * (1 - progressoPannello),
    rettangoloGrigio.y * (1 - progressoPannello),
    rettangoloGrigio.larghezza + (larghezzaTela - rettangoloGrigio.larghezza) * progressoPannello,
    rettangoloGrigio.altezza + (altezzaTela - rettangoloGrigio.altezza) * progressoPannello
  )

  // la luminosità del rosso oscilla intorno al valore scelto, senza uscire dalla palette
  let luceRosso = constrain(
    rettRosso.luminosita + ampiezzaRosso * cos(TWO_PI * millis() / periodoRosso),
    luminositaMinima,
    luminositaMassima
  )
  let scalaVerdeX = 1 + (scalaMassimaVerdeX - 1) * progressoVerde
  let scalaVerdeY = 1 + (scalaMassimaVerdeY - 1) * progressoVerde

  for (const r of rettangoli) {
    if (r.nome === "rosa" && !rosaVisibile) continue

    let scalaX = scalaVerdeX
    let scalaY = scalaVerdeY
    const centroX = margineSinistro + (r.x + r.larghezza / 2) * scalaComposizione
    const centroY = margineSuperiore + (r.y + r.altezza / 2) * scalaComposizione
    let spostamentoX = (larghezzaTela / 2 - centroComposizioneX) * progressoVerde + (centroX - centroComposizioneX) * (scalaVerdeX - 1)
    let spostamentoY = (altezzaTela / 2 - centroComposizioneY) * progressoVerde + (centroY - centroComposizioneY) * (scalaVerdeY - 1)
    if (r.nome === "rosa") {
      scalaX *= (1 + (scalaMassimaRosaX - 1) * progressoRosa) * scalaRosaFinale
      scalaY *= (1 + (scalaMassimaRosaY - 1) * progressoRosa) * scalaRosaFinale
      spostamentoX += (larghezzaTela / 2 - centroX) * progressoRosa
      spostamentoY += (altezzaTela / 2 - centroY) * progressoRosa
    }

    let rotazione = 0
    if (r.nome === "azzurro") rotazione = rotazioneAzzurro

    let luce = r.luminosita
    if (r.nome === "rosso") luce = luceRosso

    // conservo la trasformazione usata per disegnare, così il clic può
    // essere riportato nella stessa geometria
    r.scalaXCorrente = scalaX
    r.scalaYCorrente = scalaY
    r.rotazioneCorrente = rotazione
    r.spostamentoXCorrente = spostamentoX
    r.spostamentoYCorrente = spostamentoY

    disegnaRettangolo(r, scalaX, scalaY, rotazione, luce, spostamentoX, spostamentoY)
  }

  const formaSottoIlCursore = formaSottoIlMouse()
  const formaInterattiva = formaSottoIlCursore === "verde scuro" ||
    formaSottoIlCursore === "blu" ||
    (!animazioneInCorso() &&
      (formaSottoIlCursore === "azzurro" ||
       formaSottoIlCursore === "rosa" ||
       formaSottoIlCursore === "verde"))
  cursor(formaInterattiva ? "pointer" : "default")
}

function disegnaRettangolo(r, scalaX, scalaY, rotazione, luce, spostamentoX, spostamentoY) {
  push()
  // centro il quadro ridotto nella tela
  translate(margineSinistro + (r.x + r.larghezza / 2) * scalaComposizione + spostamentoX, margineSuperiore + (r.y + r.altezza / 2) * scalaComposizione + spostamentoY)
  if (rotazione !== 0) rotate(radians(rotazione))
  scale(scalaComposizione * scalaX, scalaComposizione * scalaY)
  fill(r.tinta, r.saturazione, luce)
  rect(
    -r.larghezza / 2 - sovrapposizioneBordi,
    -r.altezza / 2 - sovrapposizioneBordi,
    r.larghezza + sovrapposizioneBordi * 2,
    r.altezza + sovrapposizioneBordi * 2
  )
  pop()
}

function mousePressed() {
  const formaPremuta = formaSottoIlMouse()
  if (formaPremuta === "verde scuro") {
    resetta()
    return
  }

  if (formaPremuta === "blu") {
    cambiaColoreBlu()
    return
  }

  if (animazioneInCorso()) return

  if (formaPremuta === "azzurro") {
    inizioAzzurro = millis()
    rotazioneAzzurro = 0
    cambiaColoreAzzurro()
    ultimoCambioColoreAzzurro = millis()
  }
  if (formaPremuta === "rosa") avviaRosa()
  if (formaPremuta === "verde") avviaVerde()
}

function avviaRosa() {
  inizioRosa = millis()
  rosaVisibile = true
  progressoRosa = 0
  scalaRosaFinale = 1
}

function avviaVerde() {
  inizioVerde = millis()
  progressoVerde = 0
  ultimoCambioToni = millis()
  cambiaToni()
}

function aggiornaAnimazioni() {
  if (inizioRosa >= 0) {
    const trascorso = millis() - inizioRosa
    const inizioRitiro = durataFaseRosa + pausaRosa
    const fineRitiro = inizioRitiro + durataFaseRosa
    if (trascorso >= fineRitiro + durataRiduzioneFinaleRosa) {
      inizioRosa = -1
      rosaVisibile = false
      progressoRosa = 0
      scalaRosaFinale = 0
    } else if (trascorso < durataFaseRosa) {
      progressoRosa = sin(HALF_PI * trascorso / durataFaseRosa)
      scalaRosaFinale = 1
      rosaVisibile = true
    } else if (trascorso < inizioRitiro) {
      progressoRosa = 1
      scalaRosaFinale = 1
      rosaVisibile = true
    } else if (trascorso < fineRitiro) {
      progressoRosa = cos(HALF_PI * (trascorso - inizioRitiro) / durataFaseRosa)
      scalaRosaFinale = 1
      rosaVisibile = true
    } else {
      progressoRosa = 0
      scalaRosaFinale = 1 - (trascorso - fineRitiro) / durataRiduzioneFinaleRosa
      rosaVisibile = true
    }
  }

  if (inizioAzzurro >= 0) {
    const p = (millis() - inizioAzzurro) / durataAzzurro
    if (p >= 1) {
      inizioAzzurro = -1
      rotazioneAzzurro = 0
      rettAzzurro.tinta = rettAzzurro.tintaBase
      rettAzzurro.saturazione = rettAzzurro.saturazioneBase
      rettAzzurro.luminosita = rettAzzurro.luminositaBase
    } else {
      rotazioneAzzurro = 360 * p
      if (millis() - ultimoCambioColoreAzzurro >= intervalloColoreAzzurro) {
        cambiaColoreAzzurro()
        ultimoCambioColoreAzzurro = millis()
      }
    }
  }

  if (inizioVerde >= 0) {
    const trascorso = millis() - inizioVerde
    const inizioRitiro = durataFaseVerde + pausaVerde
    if (trascorso >= inizioRitiro + durataFaseVerde) {
      inizioVerde = -1
      progressoVerde = 0
    } else {
      if (trascorso < durataFaseVerde) {
        progressoVerde = sin(HALF_PI * trascorso / durataFaseVerde)
      } else if (trascorso < inizioRitiro) {
        progressoVerde = 1
      } else {
        progressoVerde = cos(HALF_PI * (trascorso - inizioRitiro) / durataFaseVerde)
      }
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

function cambiaColoreAzzurro() {
  const coloreBase = {
    tinta: rettAzzurro.tintaBase,
    saturazione: rettAzzurro.saturazioneBase,
    luminosita: rettAzzurro.luminositaBase
  }
  const scelte = paletteColori.filter((colore) => {
    return !stessoColore(colore, rettAzzurro) && !stessoColore(colore, coloreBase)
  })
  const nuovo = random(scelte.length > 0 ? scelte : paletteColori)
  rettAzzurro.tinta = nuovo.tinta
  rettAzzurro.saturazione = nuovo.saturazione
  rettAzzurro.luminosita = nuovo.luminosita
}

function cambiaToni() {
  for (const r of rettangoli) {
    const scelte = paletteColori.filter((colore) => !stessoColore(colore, r))
    const nuovo = random(scelte.length > 0 ? scelte : paletteColori)
    r.tinta = nuovo.tinta
    r.saturazione = nuovo.saturazione
    r.luminosita = nuovo.luminosita
  }

  const sceltePannello = palettePannello.filter((colore) => {
    return !stessoColore(colore, rettangoloGrigio)
  })
  const nuovoPannello = random(sceltePannello.length > 0 ? sceltePannello : palettePannello)
  rettangoloGrigio.tinta = nuovoPannello.tinta
  rettangoloGrigio.saturazione = nuovoPannello.saturazione
  rettangoloGrigio.luminosita = nuovoPannello.luminosita
}

function stessoColore(a, b) {
  return a.tinta === b.tinta &&
    a.saturazione === b.saturazione &&
    a.luminosita === b.luminosita
}

function resetta() {
  rettangoloGrigio.tinta = tintaBaseRettangoloGrigio
  rettangoloGrigio.saturazione = saturazioneBaseRettangoloGrigio
  rettangoloGrigio.luminosita = luminositaBaseRettangoloGrigio

  for (const r of rettangoli) {
    r.tinta = r.tintaBase
    r.saturazione = r.saturazioneBase
    r.luminosita = r.luminositaBase
  }

  inizioRosa = -1
  rosaVisibile = true
  progressoRosa = 0
  scalaRosaFinale = 1
  inizioAzzurro = -1
  rotazioneAzzurro = 0
  ultimoCambioColoreAzzurro = 0
  inizioVerde = -1
  progressoVerde = 0
  ultimoCambioToni = 0
}

function formaSottoIlMouse(px = mouseX, py = mouseY) {
  for (let i = rettangoli.length - 1; i >= 0; i--) {
    const r = rettangoli[i]
    if (r.nome === "rosa" && !rosaVisibile) continue

    const centroX = margineSinistro + (r.x + r.larghezza / 2) * scalaComposizione + r.spostamentoXCorrente
    const centroY = margineSuperiore + (r.y + r.altezza / 2) * scalaComposizione + r.spostamentoYCorrente
    const dx = px - centroX
    const dy = py - centroY
    const angolo = radians(r.rotazioneCorrente)
    const coseno = Math.cos(angolo)
    const seno = Math.sin(angolo)

    // riporto il mouse nelle coordinate locali del rettangolo, annullando
    // rotazione, scala e spostamento applicati in disegnaRettangolo()
    const xLocale = (dx * coseno + dy * seno) / (scalaComposizione * r.scalaXCorrente)
    const yLocale = (-dx * seno + dy * coseno) / (scalaComposizione * r.scalaYCorrente)

    const mezzoLarghezza = r.larghezza / 2 + sovrapposizioneBordi
    const mezzoAltezza = r.altezza / 2 + sovrapposizioneBordi
    if (xLocale >= -mezzoLarghezza && xLocale <= mezzoLarghezza &&
        yLocale >= -mezzoAltezza && yLocale <= mezzoAltezza) {
      return r.nome
    }
  }
  return ""
}
