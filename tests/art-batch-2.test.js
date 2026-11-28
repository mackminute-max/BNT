import test from 'node:test';import assert from 'node:assert/strict';
import {readdirSync} from 'node:fs';
import {pickArt,buildVariant,parseArtName} from '../src/presentation/media/portraits.js';
const files=readdirSync('assets/art').filter(f=>f.endsWith('.webp')).map(f=>f.replace(/\.webp$/,''));
const withMedia=fn=>{const old=globalThis.__BNT_MEDIA__;globalThis.__BNT_MEDIA__={art:Object.fromEntries(files.map(f=>[f,'data:'+f]))};try{return fn();}finally{globalThis.__BNT_MEDIA__=old;}};
test('art batch 2 names parse: species, build variants and the Velmora "Elf"',()=>{
 assert.deepEqual([parseArtName('BNT_ART_Beast_CrownBoar_Strong_01').species,parseArtName('BNT_ART_Beast_GrunJho_Swift_01').variant],['B03','swift']);
 assert.equal(parseArtName('BNT_ART_Chariot_Ironhold_Combat_01').nation,'N4');assert(parseArtName('BNT_ART_Chariot_Generic_Speed_01').generic);
 assert.equal(parseArtName('BNT_ART_Portrait_Velmora_Elf_Male_01').ancestry,'A08');
});
test('beasts use their own species only, preferring the matching build',()=>withMedia(()=>{
 assert.equal(pickArt('Beast',{species:'B07',variant:'swift',key:'a'}).name,'BNT_ART_Beast_DireWolf_Swift_01');
 assert.equal(pickArt('Beast',{species:'B01',variant:'base',key:'a'}).name,'BNT_ART_Beast_Horse_Base_01');
 assert.match(pickArt('Beast',{species:'B02',variant:'swift',key:'a'}).name,/StormElk_(Base|Strong)/,'a missing build falls back to the same species');
 assert.equal(buildVariant('beast',{speed:60,agility:60,power:50,toughness:50}),'swift');assert.equal(buildVariant('beast',{speed:50,agility:50,power:50,toughness:50}),'base');
}));
test('chariots use their nation, or the generic set when the nation has none',()=>withMedia(()=>{
 assert.equal(pickArt('Chariot',{nation:'N4',variant:'combat'}).name,'BNT_ART_Chariot_Ironhold_Combat_01');
 assert.match(pickArt('Chariot',{nation:null,variant:'speed'}).name,/Generic_Speed/);
 assert.equal(buildVariant('chariot',{protection:60,durability:60,rollingEfficiency:50,maneuverability:50}),'combat');
}));
