function ajustarInput(str) {
  const adicionar = 11 - str.length;
  for (let i = 0; i < adicionar; i++) str = `0${str}`;
  return str.slice(0, 11);
}

module.exports = ajustarInput;
