// Obiettivo: realizzare un primo sketch seguendo la guida passo passo
//   (https://codestesie.it/guide/intro-grafica-p5js-vscode/),
//   e poi modificarlo con l'assistenza di un agente di programmazione.

// Vincoli ricavati dalle specifiche (https://codestesie.it/aa2627/tad/attivita/es0/):
// - fase 1: scrivere il codice a mano in sketch.js seguendo la guida dal
//   capitolo 1 alla fine, con l'anteprima aperta in Live Server
// - fase 2: descrivere a OpenCode due o tre modifiche, una per volta,
//   leggendo il codice proposto e verificando ogni modifica nel browser
// - le modifiche possono riguardare forme, colori, movimento o reazione al mouse
// - alla consegna serve preview.png, un'immagine del risultato finale

let tono

function setup() {
  createCanvas(800, 600)
  colorMode(HSL)
  tono = random(360)
  background(20)
}

function draw() {
  if (mouseIsPressed) {
    stroke(100)
    fill(tono, 100, 40)
    let x = mouseX
    let y = mouseY
    let dx = 2
    let dy = 2
    for (let i = 0; i < 50; i = i + 1) {
      x = x + dx
      y = y + dy
      square(x, y, (50 - i) / 2)
      if (random() < 0.1) {
        dx = random(-1, 1)
        dy = random(-1, 1)
      }
    }
    if (random() < 0.1) {
      tono = random(360)
    }
  }
}
