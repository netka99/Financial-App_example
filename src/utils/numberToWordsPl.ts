/**
 * Converts numeric value to Polish text representation of currency
 * e.g. 9.80 -> "dziewięć złotych 80/100"
 * 123.45 -> "sto dwadzieścia trzy złote 45/100"
 */

const JEDNOSCI = ['', 'jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć'];
const NASTKI = [
  'dziesięć', 'jedenaście', 'dwanaście', 'trzynaście', 'czternaście',
  'piętnaście', 'szesnaście', 'siedemnaście', 'osiemnaście', 'dziewiętnaście'
];
const DZIESIATKI = ['', 'dziesięć', 'dwadzieścia', 'trzydzieści', 'czterdzieści', 'pięćdziesiąt', 'sześćdziesiąt', 'siedemdziesiąt', 'osiemdziesiąt', 'dziewięćdziesiąt'];
const SETKI = ['', 'sto', 'dwieście', 'trzysta', 'czterysta', 'pięćset', 'sześćset', 'siedemset', 'osiemset', 'dziewięćset'];

const GRUPY = [
  ['', '', ''],
  ['tysiąc', 'tysiące', 'tysięcy'],
  ['milion', 'miliony', 'milionów'],
  ['miliard', 'miliardy', 'miliardów'],
];

function odmiana(liczba: number, [jeden, dwaCztery, piec]: [string, string, string]): string {
  if (liczba === 1) return jeden;
  const jednosci = liczba % 10;
  const dziesiatki = Math.floor((liczba % 100) / 10);
  if (dziesiatki !== 1 && jednosci >= 2 && jednosci <= 4) {
    return dwaCztery;
  }
  return piec;
}

function trojkaDoSlow(liczba: number): string {
  const setki = Math.floor(liczba / 100);
  const reszta = liczba % 100;
  const dziesiatki = Math.floor(reszta / 10);
  const jednosci = reszta % 10;

  const czesci: string[] = [];

  if (setki > 0) {
    czesci.push(SETKI[setki]);
  }

  if (dziesiatki === 1) {
    czesci.push(NASTKI[jednosci]);
  } else {
    if (dziesiatki > 0) {
      czesci.push(DZIESIATKI[dziesiatki]);
    }
    if (jednosci > 0) {
      czesci.push(JEDNOSCI[jednosci]);
    }
  }

  return czesci.join(' ');
}

export function kwotaSlownie(kwota: number): string {
  if (isNaN(kwota) || kwota < 0) return 'zero złotych 00/100';

  const zlote = Math.floor(kwota);
  const grosze = Math.round((kwota - zlote) * 100);

  if (zlote === 0) {
    const groszeStr = grosze < 10 ? `0${grosze}` : `${grosze}`;
    return `zero złotych ${groszeStr}/100`;
  }

  let temp = zlote;
  let grupaIdx = 0;
  const slowaGrupy: string[] = [];

  while (temp > 0) {
    const trojka = temp % 1000;
    if (trojka > 0) {
      const trojkaSlowa = trojkaDoSlow(trojka);
      const formaGrupy = odmiana(trojka, GRUPY[grupaIdx] as [string, string, string]);
      const czesc = formaGrupy ? `${trojkaSlowa} ${formaGrupy}` : trojkaSlowa;
      slowaGrupy.unshift(czesc);
    }
    temp = Math.floor(temp / 1000);
    grupaIdx++;
  }

  const formaZlote = odmiana(zlote, ['złoty', 'złote', 'złotych']);
  const groszeStr = grosze < 10 ? `0${grosze}` : `${grosze}`;

  return `${slowaGrupy.join(' ')} ${formaZlote} ${groszeStr}/100`.trim();
}
