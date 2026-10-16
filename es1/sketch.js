// Illusione: tunnel a scacchi (conosciuta anche come vortice a scacchiera, tunnel a spirale o griglia concentrica)
// Fonte: https://www.istockphoto.com/it/vettoriale/sfondo-a-scacchi-astratto-effetto-illusione-ottica-gm1257195476-368352039
// Regola (consigliata): L'immagine è composta da una griglia polare o cilindrica (anelli concentrici e raggi convergenti) in cui le celle alterne vengono colorate di nero e bianco (scacchiera). La deformazione prospettica e la curvatura a "ciambella" (toro) si ottengono mappando le coordinate cartesiane o polari su una funzione matematica che distorce la spaziatura delle celle, stringendole al centro e dilatandole verso i bordi.
// Parametri critici: curvature, numCols, numRows
//   effetto più evidente con curvature = 0.6 (numCols = 32, numRows = 16), nessun effetto con curvature = 0

// misure della tela (risoluzione di riferimento delle specifiche)
let larghezzaTela = 800
let altezzaTela = 600

// griglia polare: quanti settori ha ogni anello e quanti anelli ci sono
let numCols = 32      // settori (colonne) intorno al centro
let numRows = 16      // anelli (righe) dal centro verso l'esterno

// raggio interno: corrisponde al "buco" centrale della colonna
let raggioInterno = 4

// inclinazione: schiaccia la vista in verticale (1.0 = circolare)
let inclinazione = 1.0

// curvatura: controlla quanto i quadrati si incurvano verso i bordi del canvas
// maggiore = più incurvato (effetto tunnel/toro visto dall'interno)
let curvature = 0.6

// durata di un'oscillazione completa, in frame: più è alta, più il movimento è lento
let durataOscillazione = 300

function setup() {
  createCanvas(larghezzaTela, altezzaTela)
  noStroke()
}

function draw() {
  background(255)  // cancella il fotogramma precedente, senza toccare l'alfa

  let centroX = width / 2
  let centroY = height / 2
  let angolo = TWO_PI / numCols  // ampiezza di un settore

  // distanza massima dal centro per occupare tutto lo spazio (fino agli angoli)
  let R_max = sqrt((width / 2) * (width / 2) + (height / 2) * (height / 2))

  // movimento: alternanza fra effetto presente e assente
  // la curvatura oscilla con sin(frameCount) fra 0 (griglia piatta) e il valore massimo
  let fase = sin(TWO_PI * frameCount / durataOscillazione)
  let curvaturaAttuale = curvature * (fase + 1) / 2

  // un anello per volta, un settore per volta:
  // ogni cella è un quadrilatero fra due raggi e due angoli vicini
  for (let i = 0; i < numRows; i = i + 1) {
    let t0 = i / numRows                // 0 al buco centrale, 1 ai bordi
    let t1 = (i + 1) / numRows
    // mappatura non lineare: curva l'espansione verso i bordi
    let p = 1 + curvaturaAttuale
    let r0 = raggioInterno + (R_max - raggioInterno) * pow(t0, p)
    let r1 = raggioInterno + (R_max - raggioInterno) * pow(t1, p)

    for (let j = 0; j < numCols; j = j + 1) {
      if ((i + j) % 2 == 0) {  // scacchiera: alterna nero e bianco
        fill(0)
      } else {
        fill(255)
      }

      let a0 = j * angolo
      let a1 = a0 + angolo

      // quattro vertici, applicando inclinazione (in verticale)
      beginShape()
      // angolo a0
      vertex(centroX + r0 * cos(a0), centroY + r0 * sin(a0) * inclinazione)
      vertex(centroX + r1 * cos(a0), centroY + r1 * sin(a0) * inclinazione)
      // angolo a1
      vertex(centroX + r1 * cos(a1), centroY + r1 * sin(a1) * inclinazione)
      vertex(centroX + r0 * cos(a1), centroY + r0 * sin(a1) * inclinazione)
      endShape(CLOSE)
    }
  }
}
