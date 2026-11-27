"use strict";
const root=document.getElementById("journal-content"),status=document.getElementById("journal-status");
function el(tag,text="",cls=""){const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n;}
function link(label,href){const n=el("a",label);n.href=href;return n;}
const covers={
 "better-croissant": ["story-croissant.webp","層がふくらんだクロワッサンのイラスト",640,640],
 "first-bake": ["illustrated-hero.webp","天板にクロワッサンを並べる手元のイラスト",1060,707]
};
function cover(post,detail=false){
 if(!Object.hasOwn(covers,post.id))return null;
 const [src,alt,w,h]=covers[post.id],img=el("img","",detail?"journal-cover journal-cover-large":"journal-cover journal-cover-small");
 img.src="../photos/"+src; img.alt=detail?alt:""; img.width=w; img.height=h; img.decoding="async";
 if(!detail)img.loading="lazy";
 return img;
}
function postLine(p){return [p.date.replaceAll("-","."),p.category].filter(Boolean).join(" / ");}
fetch("./posts.json",{cache:"no-cache"}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(d=>{
 if(!Array.isArray(d.posts))throw Error();
 const id=new URLSearchParams(location.search).get("post");
 if(id){
  const p=d.posts.find(x=>x.id===id);
  if(!p){status.textContent="指定された記事が見つかりません。";root.append(link("記事一覧に戻る","./"));return;}
  const a=el("article","","post-body"), back=link("‹ 記事一覧","./");back.className="text-link";
  a.append(el("p",postLine(p),"post-tag"),el("h1",p.title));
  const photo=cover(p,true);if(photo)a.append(photo);
  for(const s of p.body.split(/\n\s*\n/))a.append(el("p",s,"paragraph"));
  root.replaceChildren(back,a);document.title=p.title+" | パン屋 あさまど";
 }else{
  status.remove();
  const list=el("div","","post-list");for(const p of d.posts){
   const a=el("article","","post-card"),h=el("h2");
   h.append(link(p.title,"?post="+encodeURIComponent(p.id)));
   const photo=cover(p),copy=el("div","","post-card-copy");
   if(photo){const preview=link("","?post="+encodeURIComponent(p.id));preview.setAttribute("aria-label",p.title+"を読む");preview.className="post-picture";preview.append(photo);a.append(preview);a.classList.add("has-cover");}
   copy.append(el("p",postLine(p),"post-tag"),h,el("p",p.summary));a.append(copy);list.append(a);
  }root.append(list);if(!d.posts.length)root.append(el("p","現在、公開中の記事はありません。"));
 }
}).catch(()=>{status.textContent="記事を読み込めませんでした。時間をおいてもう一度お試しください。";});
