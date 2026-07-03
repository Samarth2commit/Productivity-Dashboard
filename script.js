function AccessTabs(){
    const ele=document.querySelectorAll('.Elem');
    const elemAll=document.querySelectorAll('.fullElem');
    const Backbtn=document.querySelectorAll('.Back')
ele.forEach(function(elem){
    elem.addEventListener('click',function(){
        console.log(elemAll[elem.id]);
        
        elemAll[elem.id].style.display='block';
        
    })
})
Backbtn.forEach(function(elem){
    elem.addEventListener('click',function(){
        elemAll[elem.id].style.display='none';

    })
})
}
AccessTabs();
function Todo(){
    
let currTask=[];
if(localStorage.getItem('currTask')){
    currTask=JSON.parse(localStorage.getItem('currTask'));
    
}else{
    console.log("dont have");
    
}


function inputTasks(){
let form=document.querySelector('.Todo form');
let Task_input=document.querySelector('.Todo form #task-input')
let Task_area=document.querySelector('.Todo form #task-area')
let imp_check=document.querySelector('.mark-imp #task-check')
form.addEventListener('submit',function(e){
    e.preventDefault();
    if(Task_input.value.trim()===''){
        alert("Please enter a task name!");
        return;
    }
    currTask.push(
        {
            task:Task_input.value,
            details:Task_area.value,
            imp:imp_check.checked
        }
    )
localStorage.setItem('currTask',JSON.stringify(currTask))


  
RenderTasks();
Task_input.value='';
Task_area.value='';
imp_check.checked=false;

})
}
inputTasks();

function RenderTasks(){
    
let AllTasks=document.querySelector('.AllTasks');
var sum='';
currTask.forEach(function(elem,idx){
    let detailsHTML='';
    if(elem.details&&elem.details.trim()!==''){
        detailsHTML=`
            
            <details class ="task_details">
                <summary>View Details</summary>
                <p>${elem.details}</p>
            </details>    
        `
    }
    sum=sum+`<div class="tasks">
                    <div class="task-content">
                   
                    <h6>${elem.task}<span class=${elem.imp}>imp</span></h6>
                    <p class="task-details">${detailsHTML}</p>
                   </div>
                    <button id="${idx}">Done</button>
                </div>`
})
AllTasks.innerHTML=sum;
localStorage.setItem('currTask',JSON.stringify(currTask))
document.querySelectorAll('.tasks button').forEach(function(btn){
    btn.addEventListener('click',function(){
        currTask.splice(btn.id,1)
        RenderTasks();
        
    })
})


}
RenderTasks();

}
Todo();
function Scheduler(){
    var hours=Array.from({length:18},function(_,idx){
    return `${6+idx}:00 - ${7+idx}:00`
})

var hourly_tasks=JSON.parse(localStorage.getItem('hourly_tasks'))||{}



var contents=document.querySelector('.contents')
var wholeDaySum='';
hours.forEach(function(elem,idx){
   var savedData=(hourly_tasks[idx]||'');
    wholeDaySum=wholeDaySum+`<div class="timestamps">
                                <div class="time"><p>${elem}</p> </div>
                                <input id="${idx}"class="time_task_input"type="text" value='${savedData}'>
                            </div>`
})

contents.innerHTML=wholeDaySum;
    var time_inputs=document.querySelectorAll('.timestamps input');

time_inputs.forEach(function(elem){
    
    
    elem.addEventListener('input',function(){
       hourly_tasks[elem.id]=elem.value;
        localStorage.setItem('hourly_tasks',JSON.stringify(hourly_tasks))
        
    })

    
})
}
Scheduler();

function motivation(){
    let content=document.querySelector('.moti2 h1')
    let author=document.querySelector('.author h2')
    async function fetchQuote(){
    
    let response=await fetch('https://api.quotable.io/random')
   let data=(await response.json());
    content.innerHTML=data.content;
    author.innerHTML=data.author;
    
}
fetchQuote()
}
motivation();
function PomodoroTimer(){
    let timerInterval=null;
let startbtn=document.querySelector('.pomo-start');
let pausebtn=document.querySelector('.pomo-pause');
let resetbtn=document.querySelector('.pomo-reset');
let timer=document.querySelector('.pomo-timer h2');
let totalseconds=25*60
let isWorkSession=true;
let session=document.querySelector('.Pomodoro .Session h2');



function updateTimer(){
    let minutes=Math.floor(totalseconds/60);
    let seconds=totalseconds%60
    timer.innerHTML=`${String(minutes).padStart('2','0')}:${String(seconds).padStart('2','0')}`

}
function startTimer(){
    clearInterval(timerInterval);
    if(isWorkSession){
        
        session.innerHTML="WorkSession";
        timerInterval=setInterval(function(){
        if(totalseconds>0){
            totalseconds--;
            updateTimer();

        
        }else {
            isWorkSession=false;
            clearInterval(timerInterval);
            timer.innerHTML="05:00"
            session.innerHTML="BreakSession";
            totalseconds=5*60;
        }
    },1)
    }else{
        
        timerInterval=setInterval(function(){
        if(totalseconds>0){
            totalseconds--;
            updateTimer();
        
        }else {
            isWorkSession=true;
            session.innerHTML="WorkSession";
            clearInterval(timerInterval);
            timer.innerHTML="25:00"
            totalseconds=25*60;
        }
        
    },1000)
    } 
    

}
 function pauseTimer(){
    clearInterval(timerInterval)
 }
 function resetTimer(){
    totalseconds=25*60;
    clearInterval(timerInterval)
    updateTimer()
 }
startbtn.addEventListener('click',startTimer);
pausebtn.addEventListener('click',pauseTimer);
resetbtn.addEventListener('click',resetTimer);
}
PomodoroTimer();
function weatherandcity(){
    let city='Pune';
    async function coordinates(){
    let response=await fetch(
    "https://geocoding-api.open-meteo.com/v1/search?name=city&count=1&language=en&format=json"
)
let data=await response.json();
return{
    lat:data.results[0].latitude,
    long:data.results[0].longitude
}

}
coordinates();
let DTime=document.querySelector('.leftside h1');//day,time
let City=document.querySelector('.leftside h2');
let temp=document.querySelector('#temp')
let weather=document.querySelector('#weather')
let preci=document.querySelector('#preci')
let humi=document.querySelector('#humi')
let wind=document.querySelector('#wind')


async function weatherAPI(){
    let location=await coordinates();
    let response=await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.long}&current=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,precipitation&forecast_days=1`
)
let result=await response.json();
console.log(result);
preci.innerHTML=`Precipitation:${result.current.precipitation_probability}%`
humi.innerHTML=`Humidity:${result.current.relative_humidity_2m}%`
wind.innerHTML=`Wind:${result.current.wind_speed_10m}Kmph`
temp.innerHTML=`${result.current.temperature_2m}°C`


}weatherAPI();
function timeday(){
    const weekDays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const yearMonth=['January','February','March','April','May','June','July','August','September','October','November','December'];
    let date=new Date();
    let seconds=date.getSeconds();
    let minutes=date.getMinutes();
    let hours=date.getHours();
    let day=weekDays[date.getDay()];
    let month=yearMonth[date.getMonth()];
    let year =date.getFullYear();
    let tarik=date.getDate();

    if(hours>12){
        DTime.innerHTML=`${day},${String(hours).padStart('2','0')}:${String(minutes).padStart('2','0')}:${String(seconds).padStart('2','0')} PM`;
    }else{
        DTime.innerHTML=`${day},${String(hours).padStart('2','0')}:${String(minutes).padStart('2','0')}:${String(seconds).padStart('2','0')} AM`;
    }
}

setInterval(function(){
    timeday();
},1000)
}
weatherandcity();
function observer(){
    const elements=document.querySelectorAll('.Elem');
const scroller=document.querySelector('.scroller');
// set the observer
const observerOptions={
    root:null,
    rootMargin:'-40% 0px -40% 0px',
    threshold:0.1
}
const spot=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
        if(entry.isIntersecting){
            elements.forEach(function(el){
               el.classList.remove('is-active');
            })
            entry.target.classList.add('is-active');
        }
       
    })
},observerOptions)
elements.forEach(function(card){
    spot.observe(card);
})
}
observer();

function DailyGoals(){
    const titleInput=document.getElementById('goal-title');
    const descInput=document.getElementById('goal-desc');
    const addBtn=document.getElementById('add-goal-btn');
    const goalsList=document.getElementById('goals-list');

    let goals =JSON.parse(localStorage.getItem('daily_goals')) || [];

    function renderGoals(){
        goalsList.innerHTML='';
         goals.forEach((goal,index)=>{
            const isCompleted=goal.completed? 'completed' :'';
            const goalHTML=`
                <div class="goal-item ${isCompleted}" data-index="${index}">
                    <div class="goal-checkbox">
                    <i class="ri-check-line"></i>
                    </div>
                        <div class="goal-content">
                        <p class="goal-title">${goal.title}</p>
                        ${goal.desc ? `<p class="goal-desc">${goal.desc}</p>` : ''}   
                            </div>
                        <button class="delete-btn"><i class="ri-delete-bin-line"></i></button>
                        </div>            
                            `
            goalsList.insertAdjacentHTML('beforeend',goalHTML)
    })
}
 function addGoal(){
    const titleVal=titleInput.value.trim();
    const descVal=descInput.value.trim();

    if(titleVal==='')return;

    goals.push({
        title:titleVal,
        desc:descVal,
        completed:false
    });

    localStorage.setItem('daily_goals',JSON.stringify(goals))
    renderGoals();

    titleInput.value='';
    descInput.value='';
 }

 goalsList.addEventListener('click',function(e){

    const goalItem=e.target.closest('.goal-item');
    if(!goalItem) return;
    const index =goalItem.getAttribute('data-index');

    if(e.target.closest('.goal-checkbox')){
        goals[index].completed=!goals[index].completed;
        localStorage.setItem('daily_goals',JSON.stringify(goals))
        renderGoals();
    }

    if(e.target.closest('.delete-btn')){
        goals.splice(index,1);
        localStorage.setItem('daily_goals',JSON.stringify(goals));
        renderGoals();
    }
 })
 addBtn.addEventListener('click',addGoal);

 titleInput.addEventListener('keypress',function(e){
    if(e.key ==='Enter'){
        e.preventDefault();
        addGoal();
    }
 })
 renderGoals();

}

DailyGoals();
function ThemeToggle(){
    const themebtn=document.getElementById('theme-toggle');
    const htmlElem=document.documentElement;
    if(!themebtn){
        console.error("theme toggle button not found!")
        return;
    }

    const savedTheme=localStorage.getItem('dashboard_theme');
    if(savedTheme==='dark'){
        htmlElem.setAttribute('data-theme','dark');
        themebtn.classList.replace('ri-moon-line', 'ri-sun-line');

    }
    themebtn.addEventListener('click',()=>{
        const currTheme=htmlElem.getAttribute('data-theme');
        if(currTheme==='dark'){
            htmlElem.removeAttribute('data-theme');
            localStorage.setItem('dashboard_theme', 'light');
            themebtn.classList.replace('ri-sun-line', 'ri-moon-line');
        }else{
            htmlElem.setAttribute('data-theme', 'dark');
            localStorage.setItem('dashboard_theme', 'dark');
            themebtn.classList.replace('ri-moon-line', 'ri-sun-line');
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
ThemeToggle();
});