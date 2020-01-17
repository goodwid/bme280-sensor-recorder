const outliers = require('./outliers');

function average(arr, decimal = 3) {
  return +(arr.reduce((a,b) => a+b, 0)/arr.length).toFixed(decimal)
}

class Normalizer {
  constructor(dataset, maxValues = 10) {
    this.values = dataset || [];
    this.max = maxValues;
  }
  add(value) {
    // TODO: filter data added if it's an outlier

    if (this.values.length >= this.max)
      this.values.shift();
    this.values.push(value);
  }
  report(q = Infinity) {
    const dataset = this.values.slice(this.values.length - q);
    const filtered = dataset.filter(outliers());
    let results = filtered.length ? filtered : dataset;
    return average(results);
  }
  disp() {
    return this.values;
  }
}

// export default Normalizer;

const F = new Normalizer(null, 200);

for (let i = 0; i < 100000; i++) {
  const num = +(Math.random(1) * 300).toFixed(3)
  F.add(num);
  if(i % 22 === 0) F.add(0);
  if(i % 19 === 0) F.add(2313);
  if(i % 50 === 0) {
    console.log('report: ',F.report())
  } 
}
console.log('End result: ', JSON.stringify(F.disp()));