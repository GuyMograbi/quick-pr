console.good = (message) => console.log(`✅ ${message}`);
console.bad = (message) => console.log(`❌ ${message}`);
console.verbose = (...message) => {
  const verbose = require('./input').get().verbose;
  if (verbose) {
    console.log(...message);
  }
};

module.exports = console;
