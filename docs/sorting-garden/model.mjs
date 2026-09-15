import {activities,shapeRounds,sortRounds,countRounds,numberWords,shapeHints} from './content.mjs';
export function initialState(){return {view:'welcome',activity:null,stage:'demo',round:0,done:[],choices:3,muted:false,selected:null,placed:[],revealed:0,made:0,solved:false,hint:false,feedback:''};}
const freshRound = {selected:null,placed:[],revealed:0,made:0,solved:false,hint:false,feedback:''};
export function visibleShapes(s){const r=shapeRounds[s.round]; return s.choices===2 ? r.options.filter(x=>x===r.target||x===r.options.find(y=>y!==r.target)) : r.options;}
export function reduce(s,a){
 if(!s || !a || typeof a.type!=='string') return s;
 if(a.type==='reset') return {...initialState(),muted:s.muted,choices:s.choices,view:'map'};
 if(a.type==='mute') return {...s,muted:!s.muted};
 if(a.type==='choices') return {...s,choices:a.value===2?2:3};
 if(a.type==='home') return {...s,view:'map',activity:null,feedback:''};
 if(a.type==='exit') return {...s,view:'welcome',activity:null,feedback:''};
 if(a.type==='guide') return {...s,view:'guide'};
 if(a.type==='start' && activities[a.activity]) return {...s,...freshRound,view:'activity',activity:a.activity,stage:'demo',round:0};
 if(s.view!=='activity') return s;
 if(a.type==='restart') return {...s,...freshRound,stage:'demo',round:0};
 if(a.type==='try' && s.stage==='demo') return {...s,...freshRound,stage:'practice'};
 if(a.type==='hint') return {...s,hint:true,feedback:s.activity==='shapes'?shapeHints[shapeRounds[s.round].target]:s.activity==='sorting'?'Dots go with dots. Stripes go with stripes. Choose a flower, then its basket.':'Touch each flower as you count. Grow one of your flowers for each one you see.'};
 if(s.stage!=='practice') return s;
 if(a.type==='next' && s.solved){
  const length=s.activity==='shapes'?shapeRounds.length:s.activity==='sorting'?sortRounds.length:countRounds.length;
  if(s.round+1===length) return {...s,stage:'complete',done:[...new Set([...s.done,s.activity])],feedback:''};
  return {...s,...freshRound,round:s.round+1};
 }
 if(s.solved) return s;
 if(s.activity==='shapes' && a.type==='match' && visibleShapes(s).includes(a.shape)){
  const correct=a.shape===shapeRounds[s.round].target;
  return {...s,solved:correct,hint:!correct,feedback:correct?`Yes! Both are ${a.shape==='square'?'squares':a.shape==='circle'?'circles':'triangles'}.${shapeRounds[s.round].vary?' Turning a square does not change its shape.':''}`:`Let's look together. ${shapeHints[shapeRounds[s.round].target]} Try the outlined shape.`};
 }
 if(s.activity==='sorting'){
  const flowers=sortRounds[s.round];
  if(a.type==='select' && Number.isInteger(a.index) && a.index>=0 && a.index<flowers.length && !s.placed.includes(a.index)) return {...s,selected:a.index,hint:false,feedback:`Now find the ${flowers[a.index]==='red'?'red basket with dots':'blue basket with stripes'}.`};
  if(a.type==='place' && ['red','blue'].includes(a.bin)){
   if(s.selected===null) return {...s,feedback:'First tap a flower. Then tap its matching basket.',hint:true};
   const correct=flowers[s.selected]===a.bin;
   if(!correct) return {...s,hint:true,feedback:`Let's look: this flower has ${flowers[s.selected]==='red'?'dots. Find the basket with dots':'stripes. Find the basket with stripes'}.`};
   const placed=[...s.placed,s.selected];
   return {...s,placed,selected:null,hint:false,solved:placed.length===flowers.length,feedback:placed.length===flowers.length?'All the flowers have a matching basket!':'A match! Choose another flower.'};
  }
 }
 if(s.activity==='counting'){
  const target=countRounds[s.round];
  if(a.type==='reveal' && s.revealed<target) {const n=s.revealed+1;return {...s,revealed:n,feedback:`${numberWords[n]}${n===target?`. ${numberWords[n]} flowers altogether. Grow the same number below.`:'.'}`};}
  if(a.type==='add' && s.revealed===target && s.made<3) return {...s,made:s.made+1,feedback:`${numberWords[s.made+1]} in your garden.`};
  if(a.type==='remove' && s.made>0) return {...s,made:s.made-1,feedback:s.made===1?'Your garden is empty.':`${numberWords[s.made-1]} in your garden.`};
  if(a.type==='check' && s.revealed===target){const correct=s.made===target;return {...s,solved:correct,hint:!correct,feedback:correct?`The same! ${numberWords[target]} here, and ${numberWords[target]} in your garden.`:`Let's match one flower to one flower. ${s.made<target?'Grow another flower.':'Take a flower away.'}`};}
 }
 return s;
}
