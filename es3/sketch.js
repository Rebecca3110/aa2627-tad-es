// Titolo: Per te che lotto
// Autore del testo: Kid Yugi
// Testo di partenza: "Il mondo intorno che sbiadisce, perde il suo colore."
// Font usato: BITTER-REGULAR
// Autore del font: Sol Matas
// Link del font: https://fonts.google.com/specimen/Bitter?query=bitter
// Composizione: frase centrata, disegnata carattere per carattere.
// Il puntatore attiva orbita, dissolvenza, caduta e colori casuali;
// velocità e tonalità dipendono anche dal caso. Per riattivare un effetto,
// il puntatore deve uscire dalla zona e rientrarvi.
// Obiettivo: creare una composizione tipografica animata o interattiva che
// cambi senza mai produrre lo stesso identico risultato.
// Vincoli:
// - canvas da 800x600 pixel;
// - usare solo caratteri tipografici con text();
// - il testo di partenza va scritto nel codice;
// - il risultato deve cambiare nel tempo o con l'interazione;
// - il font scelto va salvato nella cartella e caricato con loadFont().

let font;
let testo = " Il mondo intorno che sbiadisce, perde il suo colore.";
let dimensioneTesto = 32;
let parolaAnimata = "il mondo intorno";
let fraseLuminosita = "che sbiadisce";
let parolaCaduta = "perde";
let fraseAttivatrice = "il suo colore";
let durataOrbita = 4000;
let durataRitornoOrbita = 900;
let durataLuminosita = 7000;
let raggioOrbita = 60;
let marginePuntatore = 8;
let saturazioneColori = 85;
let luminositaColori = 45;
let velocitaMinima = 80;
let velocitaMassima = 220;
let ritardoMassimoRicomparsa = 0.7;
let larghezzeCaratteri = [];
let larghezzaRiga = 0;
let indiceParola = -1;
let indiceFraseLuminosita = -1;
let indiceParolaCaduta = -1;
let indiceFraseAttivatrice = -1;
let inizioAnimazione = 0;
let animazioneAttiva = false;
let inizioRitornoOrbita = 0;
let ritornoOrbitaAttivo = false;
let centroRitornoX = 0;
let centroRitornoY = 0;
let puntatoreSullaParola = false;
let inizioLuminosita = 0;
let luminositaAttiva = false;
let puntatoreSullaFrase = false;
let ritardiRicomparsa = [];
let inizioCaduta = 0;
let cadutaAttiva = false;
let inizioRisalita = 0;
let risalitaAttiva = false;
let puntatoreSullaParolaCaduta = false;
let velocitaCaduta = [];
let velocitaRisalita = [];
let durataCaduta = 0;
let durataRisalita = 0;
let coloriTesto = [];
let coloriAttivi = false;
let puntatoreSullaFraseAttivatrice = false;

async function setup() {
  createCanvas(800, 600);
  colorMode(HSL, 360, 100, 100);
  font = await loadFont('BITTER-REGULAR.TTF');
  textFont(font);
  textSize(dimensioneTesto);
  textAlign(LEFT, CENTER);

  indiceParola = testo.toLowerCase().indexOf(parolaAnimata.toLowerCase());
  indiceFraseLuminosita = testo.toLowerCase().indexOf(fraseLuminosita.toLowerCase());
  indiceParolaCaduta = testo.toLowerCase().indexOf(parolaCaduta.toLowerCase());
  indiceFraseAttivatrice = testo.toLowerCase().indexOf(fraseAttivatrice.toLowerCase());
  for (let i = 0; i < testo.length; i++) {
    let larghezza = fontWidth(testo.charAt(i));
    larghezzeCaratteri.push(larghezza);
    larghezzaRiga += larghezza;
  }
}

function draw() {
  background(0, 0, 99);

  let xInizioRiga = (width - larghezzaRiga) / 2;
  let xInizioParola = xInizioRiga;
  for (let i = 0; i < indiceParola; i++) {
    xInizioParola += larghezzeCaratteri[i];
  }

  let larghezzaParola = 0;
  for (let i = 0; i < parolaAnimata.length; i++) {
    larghezzaParola += larghezzeCaratteri[indiceParola + i];
  }

  let yRiga = height / 2;
  let puntatoreDentro = mouseX >= xInizioParola - marginePuntatore
    && mouseX <= xInizioParola + larghezzaParola + marginePuntatore
    && mouseY >= yRiga - dimensioneTesto / 2 - marginePuntatore
    && mouseY <= yRiga + dimensioneTesto / 2 + marginePuntatore;

  if (puntatoreDentro && !puntatoreSullaParola) {
    inizioAnimazione = millis();
    animazioneAttiva = true;
    ritornoOrbitaAttivo = false;
  }
  puntatoreSullaParola = puntatoreDentro;

  let tempoOrbita = millis() - inizioAnimazione;
  if (animazioneAttiva && tempoOrbita >= durataOrbita) {
    animazioneAttiva = false;
    ritornoOrbitaAttivo = true;
    inizioRitornoOrbita = millis();
    centroRitornoX = mouseX;
    centroRitornoY = mouseY;
  }

  let tempoRitornoOrbita = millis() - inizioRitornoOrbita;
  if (ritornoOrbitaAttivo && tempoRitornoOrbita >= durataRitornoOrbita) {
    ritornoOrbitaAttivo = false;
  }

  let xInizioFrase = xInizioRiga;
  for (let i = 0; i < indiceFraseLuminosita; i++) {
    xInizioFrase += larghezzeCaratteri[i];
  }

  let larghezzaFrase = 0;
  for (let i = 0; i < fraseLuminosita.length; i++) {
    larghezzaFrase += larghezzeCaratteri[indiceFraseLuminosita + i];
  }

  let puntatoreDentroFrase = mouseX >= xInizioFrase - marginePuntatore
    && mouseX <= xInizioFrase + larghezzaFrase + marginePuntatore
    && mouseY >= yRiga - dimensioneTesto / 2 - marginePuntatore
    && mouseY <= yRiga + dimensioneTesto / 2 + marginePuntatore;

  if (puntatoreDentroFrase && !puntatoreSullaFrase) {
    inizioLuminosita = millis();
    luminositaAttiva = true;
    ritardiRicomparsa = [];
    for (let i = 0; i < fraseLuminosita.length; i++) {
      ritardiRicomparsa.push(random(0, ritardoMassimoRicomparsa));
    }
  }
  puntatoreSullaFrase = puntatoreDentroFrase;

  let tempoLuminosita = millis() - inizioLuminosita;
  if (luminositaAttiva && tempoLuminosita >= durataLuminosita) {
    luminositaAttiva = false;
  }

  let progressoSbiadimento = luminositaAttiva
    ? tempoLuminosita / durataLuminosita
    : 0;

  let xInizioParolaCaduta = xInizioRiga;
  for (let i = 0; i < indiceParolaCaduta; i++) {
    xInizioParolaCaduta += larghezzeCaratteri[i];
  }

  let larghezzaParolaCaduta = 0;
  for (let i = 0; i < parolaCaduta.length; i++) {
    larghezzaParolaCaduta += larghezzeCaratteri[indiceParolaCaduta + i];
  }

  let puntatoreDentroParolaCaduta = mouseX >= xInizioParolaCaduta - marginePuntatore
    && mouseX <= xInizioParolaCaduta + larghezzaParolaCaduta + marginePuntatore
    && mouseY >= yRiga - dimensioneTesto / 2 - marginePuntatore
    && mouseY <= yRiga + dimensioneTesto / 2 + marginePuntatore;

  if (puntatoreDentroParolaCaduta && !puntatoreSullaParolaCaduta) {
    inizioCaduta = millis();
    cadutaAttiva = true;
    risalitaAttiva = false;
    velocitaCaduta = [];
    velocitaRisalita = [];
    durataCaduta = 0;
    durataRisalita = 0;

    for (let i = 0; i < parolaCaduta.length; i++) {
      let velocitaGiù = random(velocitaMinima, velocitaMassima);
      let velocitaSu = random(velocitaMinima, velocitaMassima);
      velocitaCaduta.push(velocitaGiù);
      velocitaRisalita.push(velocitaSu);
      let distanzaFondo = height - dimensioneTesto / 2 - yRiga;
      durataCaduta = max(durataCaduta, distanzaFondo / velocitaGiù * 1000);
      durataRisalita = max(durataRisalita, distanzaFondo / velocitaSu * 1000);
    }
  }
  puntatoreSullaParolaCaduta = puntatoreDentroParolaCaduta;

  let tempoCaduta = millis() - inizioCaduta;
  if (cadutaAttiva && tempoCaduta >= durataCaduta) {
    cadutaAttiva = false;
    inizioRisalita = millis();
    risalitaAttiva = true;
  }

  let tempoRisalita = millis() - inizioRisalita;
  if (risalitaAttiva && tempoRisalita >= durataRisalita) {
    risalitaAttiva = false;
  }

  let xInizioFraseAttivatrice = xInizioRiga;
  for (let i = 0; i < indiceFraseAttivatrice; i++) {
    xInizioFraseAttivatrice += larghezzeCaratteri[i];
  }

  let larghezzaFraseAttivatrice = 0;
  for (let i = 0; i < fraseAttivatrice.length; i++) {
    larghezzaFraseAttivatrice += larghezzeCaratteri[indiceFraseAttivatrice + i];
  }

  let puntatoreDentroFraseAttivatrice = mouseX >= xInizioFraseAttivatrice - marginePuntatore
    && mouseX <= xInizioFraseAttivatrice + larghezzaFraseAttivatrice + marginePuntatore
    && mouseY >= yRiga - dimensioneTesto / 2 - marginePuntatore
    && mouseY <= yRiga + dimensioneTesto / 2 + marginePuntatore;

  if (puntatoreDentroFraseAttivatrice && !puntatoreSullaFraseAttivatrice) {
    coloriTesto = [];
    for (let i = 0; i < testo.length; i++) {
      coloriTesto.push(random(360));
    }
    coloriAttivi = true;
  }
  puntatoreSullaFraseAttivatrice = puntatoreDentroFraseAttivatrice;

  let x = xInizioRiga;
  for (let i = 0; i < testo.length; i++) {
    let carattere = testo.charAt(i);
    let faParteDellaParola = i >= indiceParola
      && i < indiceParola + parolaAnimata.length;
    let faParteDellaFrase = i >= indiceFraseLuminosita
      && i < indiceFraseLuminosita + fraseLuminosita.length;
    let faParteDellaParolaCaduta = i >= indiceParolaCaduta
      && i < indiceParolaCaduta + parolaCaduta.length;

    if (faParteDellaFrase && luminositaAttiva) {
      let coloreIniziale = coloriAttivi
        ? color(coloriTesto[i], saturazioneColori, luminositaColori)
        : color(0, 0, 0);
      let coloreBianco = color(0, 0, 100);
      let fattoreBianco;
      if (progressoSbiadimento < 0.5) {
        fattoreBianco = progressoSbiadimento * 2;
      } else {
        let posizioneRicomparsa = (progressoSbiadimento - 0.5) * 2;
        let ritardo = ritardiRicomparsa[i - indiceFraseLuminosita];
        let progressoRicomparsa = constrain(
          (posizioneRicomparsa - ritardo) / (1 - ritardo),
          0,
          1
        );
        fattoreBianco = 1 - progressoRicomparsa;
      }
      fill(lerpColor(coloreIniziale, coloreBianco, fattoreBianco));
    } else if (coloriAttivi) {
      fill(coloriTesto[i], saturazioneColori, luminositaColori);
    } else {
      fill(0, 0, 0);
    }

    if ((cadutaAttiva || risalitaAttiva) && faParteDellaParolaCaduta) {
      let posizioneNellaParola = i - indiceParolaCaduta;
      let distanzaFondo = height - dimensioneTesto / 2 - yRiga;
      let yCaduta;
      let schiarimento;

      if (cadutaAttiva) {
        let distanza = constrain(
          tempoCaduta * velocitaCaduta[posizioneNellaParola] / 1000,
          0,
          distanzaFondo
        );
        yCaduta = yRiga + distanza;
        schiarimento = distanza / distanzaFondo;
      } else {
        let risalita = constrain(
          tempoRisalita * velocitaRisalita[posizioneNellaParola] / 1000,
          0,
          distanzaFondo
        );
        yCaduta = yRiga + distanzaFondo - risalita;
        schiarimento = 1 - risalita / distanzaFondo;
      }

      let xCaduta = x;
      let coloreIniziale = coloriAttivi
        ? color(coloriTesto[i], saturazioneColori, luminositaColori)
        : color(0, 0, 0);
      let coloreBianco = color(0, 0, 100);
      fill(lerpColor(coloreIniziale, coloreBianco, schiarimento));
      text(carattere, xCaduta, yCaduta);
    } else if (animazioneAttiva && faParteDellaParola) {
      let posizioneNellaParola = i - indiceParola;
      let angolo = TWO_PI * (posizioneNellaParola / parolaAnimata.length
        + tempoOrbita / durataOrbita);
      let xOrbita = mouseX + cos(angolo) * raggioOrbita;
      let yOrbita = mouseY + sin(angolo) * raggioOrbita;

      push();
      textAlign(CENTER, CENTER);
      text(carattere, xOrbita, yOrbita);
      pop();
    } else if (ritornoOrbitaAttivo && faParteDellaParola) {
      let posizioneNellaParola = i - indiceParola;
      let angoloFinale = TWO_PI * (posizioneNellaParola / parolaAnimata.length + 1);
      let xInizioRitorno = centroRitornoX + cos(angoloFinale) * raggioOrbita;
      let yInizioRitorno = centroRitornoY + sin(angoloFinale) * raggioOrbita;
      let progresso = constrain(tempoRitornoOrbita / durataRitornoOrbita, 0, 1);
      let raccordo = progresso * progresso * (3 - 2 * progresso);
      let xCentroRiga = x + larghezzeCaratteri[i] / 2;
      let xRitorno = lerp(xInizioRitorno, xCentroRiga, raccordo);
      let yRitorno = lerp(yInizioRitorno, yRiga, raccordo);

      push();
      textAlign(CENTER, CENTER);
      text(carattere, xRitorno, yRitorno);
      pop();
    } else {
      text(carattere, x, yRiga);
    }

    x += larghezzeCaratteri[i];
  }
}
