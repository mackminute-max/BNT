export function travel(v, a, dt) {
  return v * dt + 0.5 * a * dt * dt;
}
export function arrival(v, a, distance) {
  if (distance <= 0) return 0;
  if (Math.abs(a) < 1e-12) return v > 0 ? distance / v : Infinity;
  const disc = v * v + 2 * a * distance;
  if (disc < 0) return Infinity;
  // Rational form avoids cancellation when distance is small.
  const denom = v + Math.sqrt(disc);
  return denom > 0 ? (2 * distance) / denom : Infinity;
}
