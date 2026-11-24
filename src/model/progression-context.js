// Optional, frozen player-only inputs. Absent context preserves the native path.
export function validateProgressionContext(c){if(c===undefined)return;if(!c||c.version!==1||Object.keys(c).sort().join(',')!=='signBonus,version,wearMultiplier'||![0,1].includes(c.signBonus)||!Number.isFinite(c.wearMultiplier)||c.wearMultiplier<.1||c.wearMultiplier>1)throw Error('Invalid progression context');}
