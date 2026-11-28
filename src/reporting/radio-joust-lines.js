// Jousting calls (Phase 4c). Tokens as in radio-lines.js: {da} winner's driver,
// {db} loser's driver.
export const JOUST_LINES = Object.freeze({
  joust_wreck: [
    '{db} is down! {da} wins the joust!',
    'That’s the end of it! {da} has broken {db} across the partition!',
    'Unhorsed! {db} is finished, and the lists belong to {da}!',
  ],
  joust_points: [
    'Time in the lists! Nobody broke, so the stewards give it to {da} on points.',
    'Both still standing at the bell. The cards say {da}, the less battered of the two.',
  ],
});
