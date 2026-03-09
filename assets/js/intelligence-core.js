function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function average(values) { return values && values.length ? values.reduce((a,b)=>a+b,0)/values.length : 0; }
function normalizeGroup(values, cap) {
  if (!values || !values.length) return 0;
  return average(values.map(v => clamp(v, -cap, cap) / cap));
}
function computeTemperatureModel(dataset, windowKey) {
  const windowData = dataset.windows[windowKey];
  const weights = dataset.meta.groupWeights;
  const cap = windowData.cap;
  const sCrypto = normalizeGroup(windowData.groups.crypto, cap);
  const sIndices = normalizeGroup(windowData.groups.indices, cap);
  const sCommod = normalizeGroup(windowData.groups.commodities, cap);
  const sBonds = -normalizeGroup(windowData.groups.bonds, cap);
  const sForex = normalizeGroup(windowData.groups.forex, cap);
  const T = weights.crypto*sCrypto + weights.indices*sIndices + weights.commodities*sCommod + weights.bonds*sBonds + weights.forex*sForex;
  let temperature = 'Cautious';
  if (T >= 0.35) temperature = 'Risk-On';
  else if (T >= 0.15) temperature = 'Constructive';
  else if (T <= -0.35) temperature = 'Defensive';
  else if (T <= -0.15) temperature = 'Risk-Off';
  const sameSignCount = [sCrypto,sIndices,sCommod,sBonds,sForex].filter(score => (T===0 ? score===0 : Math.sign(score)===Math.sign(T))).length;
  const align = sameSignCount / 5;
  let confidence = 'Low';
  if (align >= 0.8) confidence = 'High';
  else if (align >= 0.6) confidence = 'Moderate';
  const V = average(windowData.proxyAbsReturns);
  let volatility = 'Volatile';
  if (V < windowData.volatilityThresholds.calm) volatility = 'Calm';
  else if (V < windowData.volatilityThresholds.cautious) volatility = 'Cautious';
  const deltaT = T - windowData.previousT;
  let pressure = 'Stable';
  if (deltaT <= -0.08) pressure = 'Rising pressure';
  else if (deltaT >= 0.08) pressure = 'Easing pressure';
  const insight = `Tone is ${temperature} with ${volatility} conditions; confidence is ${confidence} as cross-asset alignment remains ${align >= 0.8 ? 'broad' : align >= 0.6 ? 'mixed but usable' : 'fragile'}.`;
  return {windowKey,T,align,deltaT,temperature,confidence,volatility,pressure,insight};
}
