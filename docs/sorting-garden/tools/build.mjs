import {mkdir,copyFile,cp,rm} from 'node:fs/promises';
const root=new URL('../',import.meta.url), dist=new URL('../dist/',import.meta.url);
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
for(const file of ['index.html','style.css','app.mjs','model.mjs','content.mjs'])await copyFile(new URL(file,root),new URL(file,dist));
await cp(new URL('assets/',root),new URL('assets/',dist),{recursive:true});
console.log('Built static app in dist/.');
