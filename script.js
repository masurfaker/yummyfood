const breakfast = [
 "Блины кура овощи","Блины кура сливки","Блины с йогуртом и медом",
 "Блины с сыром и ветчиной","Блины с творогом и йогуртом","Драники с йогуртом",
 "Йогурт с гранолой и тыквенными семечками","Омлет с вялеными томатами",
 "Пенкейки с кленовым сиропом и йогуртом","Сырники"
];
const soups = [
 "Брокколи кремсуп","Грибной кремсуп","Кресуп цветная капуста","Куриный кремсуп",
 "Овощной кремсуп","Томатный кремсуп","Тыквенный кремсуп","Чечевичный кремсуп"
];
const mains = [
 "Бифстроганов с пюре и маринованными огурцами","Греча с овощами и говядиной",
 "Жульен с пюре","Креветки с цуккини и рисом","Куриная грудка с пюре",
 "Куриные котлеты с перцами","Миньон стейк с пюре","Овощи запеченые с мясом",
 "Паста карбонара","Паста с креветками в сливочном песто",
 "Паста с курой в сливочном соусе песто","Паста с уткой",
 "Печень в сметанном соусе с пюре","Рататуй",
 "Свинина в барбекю с пюре","Свинина в кислосладком соусе с овощами",
 "Сибас на пару с цукини и чесночным соусом","Форель стейк с цитроне и брокколи"
];

function draw(list, id){
  const box=document.getElementById(id);
  list.forEach(name=>{
    const line=document.createElement("div");
    line.className="menu-item";
    line.innerHTML=`<span>${name}</span><input type="number" name="${name}" min="0">`;
    box.appendChild(line);
  });
}
draw(breakfast,"breakfast");
draw(soups,"soups");
draw(mains,"mains");

document.getElementById("orderForm").addEventListener("submit", async e=>{
  e.preventDefault();
  const f=e.target, fd=new FormData(f);

  let filtered="", result="", qty=0, i=1;
  fd.forEach((v,k)=>{
    if(!["name","contact_type","contact_value","comment","access_key","subject","filteredOrder","to"].includes(k)){
      const n=parseInt(v)||0;
      if(n>0){ filtered+=`${k} — ${n}\n`; result+=`${i++}. ${k} — ${n}\n`; qty+=n; }
    }
  });
  if(qty===0){ alert("Выберите хотя бы одно блюдо."); return; }

  document.getElementById("filteredOrder").value = filtered;

  const payload = Object.fromEntries(fd.entries());

  try{
    const res = await fetch("https://api.web3forms.com/submit",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(payload)
    }).then(r=>r.json());

    if(res.success){
      document.getElementById("thankYou").textContent = `${fd.get("name")}! Ваша заявка отправлена!`;
      document.getElementById("resultText").textContent = `Ваш заказ:\n${result}\nВ ближайшее время с вами свяжутся.\nБлагодарим, что выбрали YUMMY!`;
      document.getElementById("resultModal").classList.remove("hidden");
      f.reset();
    } else {
      alert("Ошибка Web3Forms: "+res.message);
    }
  }catch(err){
    alert("Ошибка сети. Повторите позже.");
    console.error(err);
  }
});
document.getElementById("closeModal").onclick=()=>document.getElementById("resultModal").classList.add("hidden");