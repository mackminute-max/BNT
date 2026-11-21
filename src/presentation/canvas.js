export function canvasLayout(width,height,dpr,logicalWidth=1000,logicalHeight=550){if(![width,height,dpr,logicalWidth,logicalHeight].every(x=>Number.isFinite(x)&&x>0))throw Error('Invalid Canvas dimensions');const effectiveDPR=Math.min(2,dpr),backingWidth=Math.max(1,Math.round(width*effectiveDPR)),backingHeight=Math.max(1,Math.round(height*effectiveDPR));return {width,height,logicalWidth,logicalHeight,effectiveDPR,backingWidth,backingHeight,scaleX:backingWidth/logicalWidth,scaleY:backingHeight/logicalHeight};}
export function contentBox(canvas){
 const r=canvas.getBoundingClientRect(),s=getComputedStyle(canvas),number=k=>parseFloat(s[k])||0,
 left=number('borderLeftWidth')+number('paddingLeft'),top=number('borderTopWidth')+number('paddingTop'),right=number('borderRightWidth')+number('paddingRight'),bottom=number('borderBottomWidth')+number('paddingBottom'),
 cssWidth=parseFloat(s.width),cssHeight=parseFloat(s.height),bw=s.boxSizing==='border-box'?cssWidth:cssWidth+left+right,bh=s.boxSizing==='border-box'?cssHeight:cssHeight+top+bottom,
 sx=bw>0?r.width/bw:1,sy=bh>0?r.height/bh:1;
 return {left:r.left+left*sx,top:r.top+top*sy,width:Math.max(1,r.width-(left+right)*sx),height:Math.max(1,r.height-(top+bottom)*sy)};
}
export function sizeCanvas(canvas,w=1000,h=550){const b=contentBox(canvas),layout=canvasLayout(b.width,b.height,globalThis.devicePixelRatio||1,w,w*b.height/b.width);if(canvas.width!==layout.backingWidth||canvas.height!==layout.backingHeight){canvas.width=layout.backingWidth;canvas.height=layout.backingHeight;}canvas.dataset.dpr=String(layout.effectiveDPR);canvas.dataset.logicalSize=w+'x'+h;canvas.__bntLayout=layout;return layout;}
export function beginCanvas(canvas,w,h){const l=sizeCanvas(canvas,w,h),ctx=canvas.getContext('2d');ctx.setTransform(l.scaleX,0,0,l.scaleY,0,0);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';return {ctx,layout:l};}
export function pointerLogical(canvas,clientX,clientY){const b=contentBox(canvas),l=canvas.__bntLayout;if(!l)throw Error('Canvas not initialized');return {x:(clientX-b.left)/b.width*l.logicalWidth,y:(clientY-b.top)/b.height*l.logicalHeight};}
