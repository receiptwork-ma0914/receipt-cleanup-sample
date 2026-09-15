/* Original pure ten-frame model. MIT licensed. Works in browsers and Node. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TenModel=api;})(globalThis,function(){
  'use strict';
  function integer(n){return Number.isInteger(n)&&n>=0&&n<=10;}
  function create(mode='free',start=0){
    if(!['free','add','subtract'].includes(mode)||!integer(start))throw new RangeError('Invalid ten-frame state');
    return {mode,start,slots:Array.from({length:10},(_,i)=>i<start?1:0)};
  }
  function count(s){return s.slots.filter(Boolean).length;}
  function allowed(s,i){return Number.isInteger(i)&&i>=0&&i<10&&!(s.mode==='add'&&i<s.start)&&!(s.mode==='subtract'&&i>=s.start);}
  function toggle(s,i){
    if(!allowed(s,i))return s;
    const slots=s.slots.slice();slots[i]=slots[i]?0:(i<s.start?1:2);return {...s,slots};
  }
  function plant(s){const i=s.slots.findIndex((n,i)=>!n&&allowed(s,i));return i<0?s:toggle(s,i);}
  function lift(s){let i=9;while(i>=0&&(!s.slots[i]||!allowed(s,i)))i--;return i<0?s:toggle(s,i);}
  function result(a,op,b){if(!integer(a)||!integer(b)||!['+','-'].includes(op))throw new RangeError('Invalid operation');const n=op==='+'?a+b:a-b;if(!integer(n))throw new RangeError('Result outside ten');return n;}
  function correct(s,target){return integer(target)&&count(s)===target;}
  return {create,count,allowed,toggle,plant,lift,result,correct};
});
