/* списки блюд */
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

/* отрисовка меню */
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

/* обработчик формы */
document.getElementById("orderForm").addEventListener("submit", async e=>{
  e.preventDefault();
  const f=e.target, fd=new FormData(f);

  /* собираем заказ */
  let filtered="", qty=0;
  fd.forEach((v,k)=>{
    if(!["name","contact_type","contact_value","comment","access_key","subject","fullOrder","filteredOrder","to"].includes(k)){
      const n=parseInt(v)||0;
      if(n>0){ filtered+=`${k} — ${n}\n`; qty+=n; }
    }
  });
  if(qty===0){ alert("Выберите хотя бы одно блюдо."); return; }

  /* кладём строку заказа в скрытые поля */
  document.getElementById("filteredOrder").value = filtered;
  document.getElementById("fullOrder").value     = filtered; // админу тот же список

  /* готовим payload */
  const payload = Object.fromEntries(fd.entries());

  /* отправляем */
  try{
    const res = await fetch("https://api.web3forms.com/submit",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(payload)
    }).then(r=>r.json());

    if(res.success){
      /* показываем всплывашку */
      document.getElementById("resultText").textContent = filtered;
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

/* закрыть модалку */
document.getElementById("closeModal").onclick=()=>document.getElementById("resultModal").classList.add("hidden");