// --- списки блюд ---
const breakfast=[/* ... (оставляем как было) */];
const soups=[/* ... */];
const mains=[/* ... */];

function draw(list,id){
  const box=document.getElementById(id);
  list.forEach(name=>{
    const div=document.createElement("div");
    div.className="menu-item";
    div.innerHTML=`<span>${name}</span><input type="number" name="${name}" min="0">`;
    box.appendChild(div);
  });
}
draw(breakfast,"breakfast"); draw(soups,"soups"); draw(mains,"mains");

document.getElementById("orderForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const f=e.target, fd=new FormData(f);
  let filtered="", niceList="", i=1, qty=0;
  fd.forEach((v,k)=>{
    if(!["name","contact_type","contact_value","comment","access_key","subject","filteredOrder","to"].includes(k)){
      const n=parseInt(v)||0;
      if(n>0){ filtered+=`${k} — ${n}\\n`; niceList+=`${i++}. ${k} — ${n}\\n`; qty+=n; }
    }
  });
  if(qty===0){ alert("Выберите хотя бы одно блюдо!"); return; }
  document.getElementById("filteredOrder").value=filtered;

  const payload=Object.fromEntries(fd.entries());

  try{
    const res=await fetch("https://api.web3forms.com/submit",{
      method:"POST", headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(payload)
    }).then(r=>r.json());

    if(res.success){
      document.getElementById("thankYou").textContent=`${fd.get("name")}! Ваша заявка отправлена!`;
      document.getElementById("resultText").textContent=`Ваш заказ:\\n${niceList}\\nВ ближайшее время с вами свяжутся.\\nБлагодарим, что выбрали YUMMY!`;
      document.getElementById("resultModal").classList.remove("hidden");
      f.reset();
    }else{ alert("Ошибка Web3Forms: "+res.message); }
  }catch(err){ alert("Сеть недоступна, попробуйте позже."); }
});
document.getElementById("closeModal").onclick=()=>document.getElementById("resultModal").classList.add("hidden");