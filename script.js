const breakfast=["Блины кура овощи","Блины кура сливки","Блины с йогуртом и медом","Блины с сыром и ветчиной","Блины с творогом и йогуртом","Драники с йогуртом","Йогурт с гранолой и тыквенными семечками","Омлет с вялеными томатами","Пенкейки с кленовым сиропом и йогуртом","Сырники"];
const soups=["Брокколи кремсуп","Грибной кремсуп","Кресуп цветная капуста","Куриный кремсуп","Овощной кремсуп","Томатный кремсуп","Тыквенный кремсуп","Чечевичный кремсуп"];
const mains=["Бифстроганов с пюре и маринованными огурцами","Греча с овощами и говядиной","Жульен с пюре","Креветки с цуккини и рисом","Куриная грудка с пюре","Куриные котлеты с перцами","Миньон стейк с пюре","Овощи запеченые с мясом","Паста карбонара","Паста с креветками в сливочном песто","Паста с курой в сливочном соусе песто","Паста с уткой","Печень в сметанном соусе и пюре","Рататуй","Свинина в барбекю с пюре","Свинина в кислосладком соусе с овощами","Сибас на пару с цукини и чесночным соусом","Форель стейк с цитроне и брокколи"];

function render(list,id){
  const box=document.getElementById(id);
  list.forEach(n=>{
    const div=document.createElement("div");
    div.className="dish";
    div.innerHTML=`<span>${n}</span><input type="number" name="${n}" min="0">`;
    box.appendChild(div);
  });
}
render(breakfast,"breakfast"); render(soups,"soups"); render(mains,"mains");

document.getElementById("orderForm").addEventListener("submit", async e=>{
  e.preventDefault();
  const f=e.target,fd=new FormData(f);
  let full="",filtered="",qty=0;
  fd.forEach((v,k)=>{
    if(!["name","email","comment","contact_type","contact_value","stassser_email","filteredOrder","fullOrder"].includes(k)){
      const n=parseInt(v)||0;
      full+=`${k} — ${n}\n`;
      if(n>0){filtered+=`${k} — ${n}\n`;qty+=n}
    }
  });
  if(qty===0){alert("Выберите хотя бы одно блюдо.");return;}
  document.getElementById("fullOrder").value=full;
  document.getElementById("filteredOrder").value=filtered;
  try{
    const res=await fetch(f.action,{method:"POST",body:new FormData(f)});
    if(res.ok){const p=document.getElementById("popup");p.textContent="Заявка отправлена!\n\n"+filtered;p.style.display="block";setTimeout(()=>p.style.display="none",8000);f.reset();}
    else alert("Ошибка отправки. Проверьте форму.");
  }catch(err){alert("Ошибка сети. Повторите позже.");console.error(err);}
});