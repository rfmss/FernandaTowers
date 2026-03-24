// === data.js — constantes, TDEFS, EDEFS, MAPS ===

var MAPS = [{
  name: 'Festival do Canal',
  num: '01',
  ceremony: 'Veneza · Set 2024',
  desc: 'Caminho em ziguezague. Entrada suave na temporada.',
  tag: '2 ondas',
  hasBoss: false,
  palette: {
    path: '#1A2D3A',
    floor: '#0E1820',
    accent: '#4AACCC'
  },
  startGold: 250,
  grid: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]],
  wp: [[2, 0], [2, 1], [2, 2], [2, 3], [3, 3], [4, 3], [4, 4], [4, 5], [4, 6], [5, 6], [6, 6], [6, 7], [6, 8], [7, 8], [8, 8], [8, 9], [8, 10], [9, 10], [10, 10], [11, 10]],
  waves: [[{
    t: 'academico',
    n: 6,
    iv: 1.5
  }], [{
    t: 'academico',
    n: 5,
    iv: 1.2
  }, {
    t: 'clickbait',
    n: 4,
    iv: .9
  }]],
  banners: [{
    ceremony: 'Festival do Canal · Onda 1',
    quote: 'O Canal aplaudiu de pé.'
  }, {
    ceremony: 'Festival do Canal · Onda 2',
    quote: 'Dez minutos. O mundo começou a olhar.'
  }]
}, {
  name: 'Esfera Dourada',
  num: '02',
  ceremony: 'Globo de Ouro · Jan 2025',
  desc: 'Rota em espiral. A imprensa chega em ondas.',
  tag: '3 ondas',
  hasBoss: false,
  palette: {
    path: '#2E1A08',
    floor: '#1A0E04',
    accent: '#D4A017'
  },
  startGold: 225,
  grid: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], [1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0], [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0], [1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0], [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0], [1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0], [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0], [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]],
  wp: [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [9, 1], [9, 2], [9, 3], [9, 4], [9, 5], [9, 6], [8, 6], [7, 6], [7, 5], [7, 4], [7, 3], [7, 2], [7, 1], [6, 1], [5, 1], [4, 1], [3, 1], [3, 2], [3, 3], [3, 4], [4, 4], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8], [5, 9], [6, 9], [7, 9], [8, 9], [9, 9], [10, 9], [11, 9]],
  waves: [[{
    t: 'academico',
    n: 7,
    iv: 1.3
  }], [{
    t: 'clickbait',
    n: 6,
    iv: .9
  }, {
    t: 'academico',
    n: 4,
    iv: 1.2
  }], [{
    t: 'lobby',
    n: 2,
    iv: 2.5
  }, {
    t: 'clickbait',
    n: 5,
    iv: .8
  }]],
  banners: [{
    ceremony: 'Esfera Dourada · Onda 1',
    quote: 'Pela primeira vez, o Brasil ergueu a Esfera.'
  }, {
    ceremony: 'Esfera Dourada · Onda 2',
    quote: 'Fernanda Towers. Melhor Atriz.'
  }, {
    ceremony: 'Esfera Dourada · Onda 3',
    quote: 'O lobby não descansaria.'
  }]
}, {
  name: 'O Chá das Cinco',
  num: '03',
  ceremony: 'BAFTA · Fev 2025',
  desc: 'Labirinto britânico. Burocracia por todos os lados.',
  tag: '3 ondas',
  hasBoss: false,
  palette: {
    path: '#1A2818',
    floor: '#0E1A0C',
    accent: '#6AAA50'
  },
  startGold: 200,
  grid: [[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], [0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0], [0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0], [0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0], [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
  wp: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10], [1, 10], [2, 10], [3, 10], [4, 10], [5, 10], [6, 10], [7, 10], [8, 10], [9, 10], [9, 9], [9, 8], [9, 7], [9, 6], [9, 5], [9, 4], [9, 3], [9, 2], [9, 1], [8, 1], [7, 1], [6, 1], [5, 1], [4, 1], [3, 1], [2, 1], [1, 1], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8], [6, 8], [5, 8], [4, 8], [3, 8], [3, 7], [3, 6], [3, 5], [3, 4], [3, 3], [4, 3], [5, 3], [6, 3], [6, 4], [6, 5], [5, 5], [4, 5], [4, 6], [5, 6], [5, 4]],
  waves: [[{
    t: 'academico',
    n: 8,
    iv: 1.2
  }], [{
    t: 'clickbait',
    n: 8,
    iv: .8
  }, {
    t: 'comite',
    n: 2,
    iv: 2.0
  }], [{
    t: 'lobby',
    n: 3,
    iv: 2.2
  }, {
    t: 'rumor',
    n: 4,
    iv: 1.0
  }]],
  banners: [{
    ceremony: 'O Chá das Cinco · Onda 1',
    quote: 'O chá estava frio. A batalha, quente.'
  }, {
    ceremony: 'O Chá das Cinco · Onda 2',
    quote: 'Comitês não assistem filmes. Votam em campanhas.'
  }, {
    ceremony: 'O Chá das Cinco · Onda 3',
    quote: 'O rumor voou antes da cerimônia.'
  }]
}, {
  name: 'A Voz da Crítica',
  num: '04',
  ceremony: 'Critics Choice · Jan 2025',
  desc: 'Diagonal cruzada. A crítica especializada converge.',
  tag: '3 ondas',
  hasBoss: false,
  palette: {
    path: '#221428',
    floor: '#140A18',
    accent: '#9B5FCC'
  },
  startGold: 200,
  grid: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]],
  wp: [[1, 0], [2, 0], [2, 1], [2, 2], [3, 2], [4, 2], [4, 3], [4, 4], [5, 4], [6, 4], [6, 5], [6, 6], [7, 6], [8, 6], [8, 7], [8, 8], [9, 8], [10, 8], [10, 9], [10, 10], [11, 10]],
  waves: [[{
    t: 'academico',
    n: 6,
    iv: 1.3
  }, {
    t: 'clickbait',
    n: 4,
    iv: .9
  }], [{
    t: 'clickbait',
    n: 9,
    iv: .7
  }, {
    t: 'comite',
    n: 3,
    iv: 1.8
  }], [{
    t: 'lobby',
    n: 3,
    iv: 2.0
  }, {
    t: 'rumor',
    n: 5,
    iv: 1.0
  }, {
    t: 'clickbait',
    n: 5,
    iv: .7
  }]],
  banners: [{
    ceremony: 'A Voz da Crítica · Onda 1',
    quote: 'Variety apostou. Hollywood Reporter confirmou.'
  }, {
    ceremony: 'A Voz da Crítica · Onda 2',
    quote: 'O comitê hesitou. O público não.'
  }, {
    ceremony: 'A Voz da Crítica · Onda 3',
    quote: 'O rumor tenta chegar antes do prêmio.'
  }]
}, {
  name: 'Os Sindicatos',
  num: '05',
  ceremony: 'SAG Awards · Fev 2025',
  desc: 'Rota em S duplo. Atores votam em atores.',
  tag: '3 ondas',
  hasBoss: false,
  palette: {
    path: '#2E1808',
    floor: '#180E04',
    accent: '#D4620A'
  },
  startGold: 180,
  grid: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], [1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
  wp: [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [7, 1], [7, 2], [7, 3], [8, 3], [9, 3], [10, 3], [10, 4], [10, 5], [10, 6], [10, 7], [10, 8], [10, 9], [9, 9], [8, 9], [7, 9], [6, 9], [5, 9], [4, 9], [4, 8], [4, 7], [4, 6], [4, 5], [3, 5], [2, 5], [1, 5], [1, 4], [1, 3], [1, 2], [1, 1]],
  waves: [[{
    t: 'academico',
    n: 8,
    iv: 1.1
  }, {
    t: 'clickbait',
    n: 4,
    iv: .8
  }], [{
    t: 'comite',
    n: 4,
    iv: 1.8
  }, {
    t: 'clickbait',
    n: 6,
    iv: .7
  }], [{
    t: 'lobby',
    n: 4,
    iv: 1.7
  }, {
    t: 'rumor',
    n: 6,
    iv: .9
  }, {
    t: 'academico',
    n: 5,
    iv: 1.0
  }]],
  banners: [{
    ceremony: 'Os Sindicatos · Onda 1',
    quote: 'Atores votam em atores. Justiça rara.'
  }, {
    ceremony: 'Os Sindicatos · Onda 2',
    quote: 'O comitê se organizou. Cuidado.'
  }, {
    ceremony: 'Os Sindicatos · Onda 3',
    quote: 'Lobby, boato e burocracia juntos.'
  }]
}, {
  name: 'A Velha Guarda',
  num: '06',
  ceremony: 'Academia · Votação Final',
  desc: 'Espiral dupla. Os conservadores resistem ao máximo.',
  tag: '4 ondas',
  hasBoss: false,
  palette: {
    path: '#2A2018',
    floor: '#181410',
    accent: '#A08060'
  },
  startGold: 160,
  grid: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0], [1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0], [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0], [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0], [1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0], [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
  wp: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9], [8, 9], [9, 9], [10, 9], [10, 8], [10, 7], [10, 6], [10, 5], [10, 4], [10, 3], [10, 2], [10, 1], [10, 0], [9, 0], [8, 0], [7, 0], [6, 0], [5, 0], [4, 0], [3, 0], [2, 0], [1, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [7, 6], [7, 5], [7, 4], [7, 3], [7, 2], [7, 1], [6, 1], [5, 1], [4, 1], [4, 3], [4, 4], [4, 5], [5, 5], [6, 5], [6, 4], [6, 3], [5, 3], [5, 4]],
  waves: [[{
    t: 'academico',
    n: 10,
    iv: 1.0
  }], [{
    t: 'lobby',
    n: 4,
    iv: 1.8
  }, {
    t: 'clickbait',
    n: 7,
    iv: .7
  }], [{
    t: 'comite',
    n: 5,
    iv: 1.5
  }, {
    t: 'rumor',
    n: 6,
    iv: .9
  }], [{
    t: 'lobby',
    n: 5,
    iv: 1.5
  }, {
    t: 'comite',
    n: 4,
    iv: 1.4
  }, {
    t: 'rumor',
    n: 7,
    iv: .8
  }]],
  banners: [{
    ceremony: 'A Velha Guarda · Onda 1',
    quote: 'Cinco mil votos conservadores. Cada um conta.'
  }, {
    ceremony: 'A Velha Guarda · Onda 2',
    quote: 'O lobby milionário chegou com cartazes.'
  }, {
    ceremony: 'A Velha Guarda · Onda 3',
    quote: 'Burocracia e boato. O pior combo.'
  }, {
    ceremony: 'A Velha Guarda · Onda 4',
    quote: 'A última barreira antes do Dourado.'
  }]
}, {
  name: 'O Dourado',
  num: '07',
  ceremony: 'Oscar · Mar 2025',
  desc: 'O mapa final. Todas as forças. E ela no fim.',
  tag: '3 ondas + BOSS',
  hasBoss: true,
  palette: {
    path: '#2E2400',
    floor: '#181400',
    accent: '#FFD700'
  },
  startGold: 150,
  grid: [[0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0], [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0], [1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0], [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0], [0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
  wp: [[3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [7, 1], [7, 2], [6, 2], [5, 2], [4, 2], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [7, 8], [7, 9], [7, 10], [6, 10], [5, 10], [4, 10], [4, 9], [4, 8], [3, 8], [2, 8], [2, 7], [2, 6], [2, 5], [2, 4], [2, 3], [2, 2], [1, 2], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [6, 7], [6, 6], [6, 5], [6, 4], [6, 3], [5, 3], [4, 3], [4, 4], [4, 5], [4, 6], [5, 6], [5, 5], [5, 4]],
  waves: [[{
    t: 'academico',
    n: 10,
    iv: .9
  }, {
    t: 'clickbait',
    n: 8,
    iv: .7
  }], [{
    t: 'lobby',
    n: 5,
    iv: 1.5
  }, {
    t: 'comite',
    n: 4,
    iv: 1.4
  }, {
    t: 'rumor',
    n: 6,
    iv: .8
  }], [{
    t: 'lobby',
    n: 6,
    iv: 1.2
  }, {
    t: 'comite',
    n: 5,
    iv: 1.2
  }, {
    t: 'rumor',
    n: 8,
    iv: .7
  }, {
    t: 'clickbait',
    n: 8,
    iv: .6
  }], [{
    t: 'amelia',
    n: 1,
    iv: 0
  }]],
  banners: [{
    ceremony: 'O Dourado · Onda 1',
    quote: 'A noite mais longa do cinema brasileiro.'
  }, {
    ceremony: 'O Dourado · Onda 2',
    quote: 'O lobby trouxe reforços. Tudo em jogo.'
  }, {
    ceremony: 'O Dourado · Onda 3',
    quote: 'Última barreira antes da favorita.'
  }, {
    ceremony: 'O Dourado · BOSS',
    quote: '"Ela perdeu tudo. E ficou de pé."'
  }]
}];
var MAP, ROWS, COLS, WP, WAVES, CURMAP, MAPOBJ;
var UP_COST_MULT = [0, .6, 1.0];
var UP_STAT_MULT = [{
  dmg: 1.0,
  range: 1.0,
  rate: 1.0
}, {
  dmg: 1.5,
  range: 1.2,
  rate: 1.35
}, {
  dmg: 2.4,
  range: 1.45,
  rate: 1.8
}];
function towerUpgradeCost(t) {
  var lv = t.level || 1;
  if (lv >= 3) return null;
  return Math.floor(TDEFS[t.type].cost * UP_COST_MULT[lv]);
}
function towerStats(t) {
  var base = TDEFS[t.type],
    m = UP_STAT_MULT[(t.level || 1) - 1];
  return {
    dmg: Math.round(base.dmg * m.dmg),
    range: +(base.range * m.range).toFixed(1),
    rate: +(base.rate * m.rate).toFixed(2)
  };
}
var TW = 64,
  TH = 32,
  TD = 10;
var TDEFS = {
  sonia: {
    cost: 50,
    dmg: 22,
    range: 3.2,
    rate: 1.2,
    col: '#2A2018',
    acc: '#D4A017',
    pcol: '#D4A017',
    psz: 4,
    splash: 0,
    slow: 1,
    sfx: function sfx() {
      return SFX.shoot();
    },
    label: 'Sônia Clássicos'
  },
  publico: {
    cost: 100,
    dmg: 70,
    range: 2.4,
    rate: .42,
    col: '#1A1210',
    acc: '#C8200A',
    pcol: '#666',
    psz: 7,
    splash: 42,
    slow: 1,
    sfx: function sfx() {
      return SFX.cannon();
    },
    label: 'O Público Brasileiro'
  },
  critica: {
    cost: 75,
    dmg: 9,
    range: 2.9,
    rate: .95,
    col: '#0A1820',
    acc: '#5BAAC8',
    pcol: '#5BAAC8',
    psz: 5,
    splash: 0,
    slow: .38,
    sfx: function sfx() {
      return SFX.critica();
    },
    label: 'A Crítica Especializada'
  }
};
var EDEFS = {
  academico: {
    hp: 100,
    spd: 1.1,
    reward: 10,
    col: '#C84820',
    r: 7,
    split: false,
    fly: false
  },
  clickbait: {
    hp: 55,
    spd: 2.3,
    reward: 15,
    col: '#B03020',
    r: 5,
    split: false,
    fly: false
  },
  lobby: {
    hp: 320,
    spd: .6,
    reward: 25,
    col: '#6A1400',
    r: 10,
    split: false,
    fly: false
  },
  comite: {
    hp: 150,
    spd: 1.0,
    reward: 18,
    col: '#8B4500',
    r: 9,
    split: true,
    fly: false
  },
  rumor: {
    hp: 80,
    spd: 1.9,
    reward: 20,
    col: '#4A3898',
    r: 6,
    split: false,
    fly: true
  },
  amelia: {
    hp: 2400,
    spd: .55,
    reward: 500,
    col: '#7B2FBE',
    r: 16,
    split: false,
    fly: false,
    isBoss: true
  }
};