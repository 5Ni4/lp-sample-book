"use strict";
const root=document.getElementById("journal-content"),status=document.getElementById("journal-status");
function el(tag,text="",cls=""){const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n;}
function link(label,href){const n=el("a",label);n.href=href;return n;}
function postLine(p){return [p.date.replaceAll("-","."),p.category].filter(Boolean).join(" / ");}
fetch("./posts.json",{cache:"no-cache"}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(d=>{
 if(!Array.isArray(d.posts))throw Error();
 const id=new URLSearchParams(location.search).get("post");
 if(id){
  const p=d.posts.find(x=>x.id===id);
  if(!p){status.textContent="指定された記事が見つかりません。";root.append(link("記事一覧に戻る","./"));return;}
  const a=el("article","","post-body"), back=link("‹ 記事一覧","./");back.className="text-link";
  a.append(el("p",postLine(p),"post-tag"),el("h1",p.title));
  for(const s of p.body.split(/\n\s*\n/))a.append(el("p",s,"paragraph"));
  root.replaceChildren(back,a);document.title=p.title+" | パン屋 あさまど";
 }else{
  status.remove();
  const list=el("div","","post-list");for(const p of d.posts){
   const a=el("article","","post-card"),h=el("h2");
   h.append(link(p.title,"?post="+encodeURIComponent(p.id)));
   a.append(el("p",postLine(p),"post-tag"),h,el("p",p.summary));list.append(a);
  }root.append(list);if(!d.posts.length)root.append(el("p","現在、公開中の記事はありません。"));
 }
 if(d.source==="sample")root.append(el("p","掲載記事は作例です。","bread-notice"));
}).catch(()=>{status.textContent="記事を読み込めませんでした。時間をおいてもう一度お試しください。";});
