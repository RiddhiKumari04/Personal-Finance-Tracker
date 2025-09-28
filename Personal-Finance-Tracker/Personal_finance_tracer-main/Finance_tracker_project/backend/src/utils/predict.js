// simple linear regression predictor for monthly totals
function linearPredict(monthlyTotals){
  const n = monthlyTotals.length;
  if(n === 0) return 0;
  const xs = monthlyTotals.map(x=>x.monthIndex);
  const ys = monthlyTotals.map(x=>x.total);
  const sumX = xs.reduce((a,b)=>a+b,0), sumY = ys.reduce((a,b)=>a+b,0);
  const sumXY = xs.reduce((s,x,i)=>s + x*ys[i], 0);
  const sumX2 = xs.reduce((s,x)=>s + x*x, 0);
  const denom = n*sumX2 - sumX*sumX;
  const a = denom === 0 ? 0 : (n*sumXY - sumX*sumY) / denom; // slope
  const b = (sumY - a*sumX)/n; // intercept
  const nextX = xs[n-1] + 1;
  const prediction = a*nextX + b;
  return Math.max(0, prediction);
}

module.exports = { linearPredict };
