export function attachRadioDisplay(source,{career=false}={}){
 const needle='const added = radio.lines.slice(n);';if(source.split(needle).length!==2||source.split('radio = new Commentary();').length!==2)throw Error('Review native post-acceptance radio/reset seam');
 const label=career?'careerRadioText(line)':'line.text';
 return `import {createRadioDisplay} from '../../presentation/content/m3-bc.js';
const m3bcRadioDisplay=createRadioDisplay();
globalThis.__BNT_SET_RADIO_PRESENTATION__=presentation=>{
 globalThis.__BNT_CAREER_PRESENTATION__=presentation;
 const lines=m3bcRadioDisplay.refresh(presentation),children=document.getElementById('radio')?.children;
 if(children&&children.length===lines.length)for(let i=0;i<lines.length;i++){const line=lines[i];children[i].textContent=line.time.toFixed(2)+' · '+${label};}
};
`+source.replace(needle,'const added = m3bcRadioDisplay.accept(radio.lines.slice(n), batch ?? s.events, globalThis.__BNT_CAREER_PRESENTATION__);').replace('radio = new Commentary();','radio = new Commentary(); m3bcRadioDisplay.reset();');
}
