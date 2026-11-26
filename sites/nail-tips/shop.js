"use strict";
const prices=Object.freeze({rose:2800,lilac:3100,pearl:3300,french:2900,check:3200,charm:3400});
const sizes=Object.freeze({S:[14,10,11,10,7],M:[16,11,12,11,8],L:[17,12,13,12,9]});
const shipFee=350;
const max=9;
function fitFor(widths){return Object.keys(sizes).find(size=>sizes[size].every((v,i)=>v>=widths[i]))||""}
function totals(rows){const subtotal=rows.reduce((sum,row)=>sum+prices[row.id]*row.qty,0);const shipping=rows.length?shipFee:0;return{subtotal,shipping,total:subtotal+shipping,count:rows.reduce((sum,row)=>sum+row.qty,0)}}
if(typeof module!=="undefined")module.exports={fitFor,totals};
if(typeof document!=="undefined"){
const by=id=>document.getElementById(id), yen=n=>"¥"+n.toLocaleString("ja-JP"), cards=Array.from(document.querySelectorAll("[data-product]")), product=by("product-dialog"), review=by("review-dialog");
const data=Object.fromEntries(cards.map(card=>{const img=card.querySelector("img");return [card.dataset.product,{name:card.querySelector("h3").textContent,desc:card.querySelector(".card-body>p:not(.tag)").textContent,img:img.getAttribute("src"),alt:img.alt}]}));
const el=(tag,value)=>{const n=document.createElement(tag);if(value)n.textContent=value;return n};
let items=[],selected="",recommended="";
const status=t=>{by("cart-status").textContent=t};
function control(label,visual,handler){
 const b=el("button",visual);b.type="button";b.setAttribute("aria-label",label);b.addEventListener("click",handler);return b;
}
function renderCart(focus=null){
 const ul=by("cart-lines");ul.replaceChildren();
 items.forEach(row=>{
  const {id,size,qty}=row,p=data[id],name=p.name+" サイズ"+size;
  const li=el("li");li.className="cart-row";
  const img=el("img");img.src=p.img;img.alt="";img.width=57;img.height=57;
  const text=el("div");text.append(el("strong",p.name),el("p",size+" ／ "+yen(prices[id])+" × "+qty+"セット"));
  const a=el("div");a.className="actions";
  const change=(delta,which)=>{row.qty+=delta;if(row.qty<1)items=items.filter(x=>x!==row);renderCart({id,size,which});status(name+"：残り"+Math.max(0,row.qty)+"セット");};
  const minus=control(name+"を1セット減らす","−",()=>change(-1,"minus"));
  const plus=control(name+"を1セット増やす","＋",()=>change(1,"plus"));plus.disabled=qty>=max;
  const remove=control(name+"を削除","削除",()=>{items=items.filter(x=>x!==row);renderCart({id,size,which:"remove"});status(name+"を削除しました");});
  a.append(minus,plus,remove);li.append(img,text,a);ul.append(li);
  if(focus?.id===id&&focus?.size===size){const dest=focus.which==="minus"?minus:plus.disabled?minus:plus;dest.focus()}
 });
 const total=totals(items);
 by("count").textContent=total.count;by("cart-empty").hidden=Boolean(items.length);
 by("sub").textContent=yen(total.subtotal);by("shipping").textContent=yen(total.shipping);by("total").textContent=yen(total.total);
 by("review-btn").disabled=!items.length;
 if(focus&&!items.some(row=>focus.id===row.id&&focus.size===row.size))by("bag").querySelector(".text-link").focus();
}
document.querySelectorAll("[data-select]").forEach(b=>{
 b.addEventListener("click",()=>{
  selected=b.dataset.select;const p=data[selected];by("product-image").src=p.img;by("product-image").alt=p.alt;by("product-title").textContent=p.name;by("product-description").textContent=p.desc;
  by("product-price").textContent=yen(prices[selected])+"（税込）";
  by("product-size").value=recommended;by("product-qty").value="1";
  by("product-error").textContent="";product.showModal();by("product-size").focus();
 });b.disabled=false;
});
by("product-form").addEventListener("submit",event=>{
 event.preventDefault();const size=by("product-size").value,qty=Number(by("product-qty").value);
 if(!Object.hasOwn(prices,selected)||!Object.hasOwn(sizes,size)||!Number.isInteger(qty)||qty<1||qty>3)return;
 const same=items.find(row=>row.id===selected&&row.size===size);
 if(same&&same.qty+qty>max){by("product-error").textContent="同じデザイン・サイズは最大9セットまでです。";return}
 if(same)same.qty+=qty;else items.push({id:selected,size,qty});
 renderCart();product.close();status(data[selected].name+"・サイズ"+size+"をカートに追加しました");
});
by("size-help").addEventListener("click",()=>product.close());
by("measure").addEventListener("submit",event=>{
 event.preventDefault();const vals=Array.from(event.currentTarget.querySelectorAll("input"),x=>x.valueAsNumber);
 if(vals.some(x=>!Number.isFinite(x)||x<1||x>30))return;
 recommended=fitFor(vals);
 Array.from(by("size-rows").rows).forEach(row=>row.classList.toggle("is-fit",row.cells[0].textContent===recommended));
 by("fit-result").textContent=recommended?"サイズ"+recommended+"が目安です。商品を選ぶと候補に入ります。":"5本すべてに合う既定サイズがありません。無理に小さいサイズを選ばず、個別サイズをご検討ください。";
});
by("measure").querySelector("fieldset").disabled=false;
by("review-btn").addEventListener("click",()=>{
 if(!items.length)return;
 by("review-lines").replaceChildren(...items.map(row=>el("li",data[row.id].name+" ／ "+row.size+" ／ "+row.qty+"セット")));
 const t=totals(items);by("review-total").textContent="送料 "+yen(t.shipping)+" ／ 合計 "+yen(t.total);
 by("finish-demo").disabled=false;by("demo-result").textContent="";review.showModal();
});
by("finish-demo").addEventListener("click",()=>{
 by("finish-demo").disabled=true;by("demo-result").textContent="デモ完了。注文や決済は発生せず、情報も送信していません。";
});
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>b.closest("dialog").close()));
renderCart();
}
