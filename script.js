const allQuestions = {
  html: [
    {q:"What does HTML stand for?", a:["Hyper Trainer Marking Language","Hyper Text Markup Language","Hyper Text Marketing Language","Hyper Tool Markup Language"], c:1},
    {q:"Choose correct HTML element for largest heading", a:["<h6>","<heading>","<h1>","<head>"], c:2}
  ],
  css: [
    {q:"What does CSS stand for?", a:["Central Style Sheets","Cascading Style Sheets","Cascading Simple Sheets","Cars SUVs Sailboats"], c:1},
    {q:"Which property changes text color?", a:["font-style","color","background","text-align"], c:1}
  ],
  js: [
    {q:"Which language runs in browser?", a:["Java","C","Python","JavaScript"], c:3},
    {q:"Which is not a JS framework?", a:["React","Angular","Django","Vue"], c:2}
  ]
};

let questions=[], index=0, score=0, timer, timeLeft=15;

const categorySelect=document.getElementById("category");
const difficultySelect=document.getElementById("difficulty");
const questionEl=document.getElementById("question");
const optionsEl=document.getElementById("options");
const nextBtn=document.getElementById("nextBtn");
const resultBox=document.getElementById("resultBox");
const quizBox=document.getElementById("quizBox");
const scoreText=document.getElementById("scoreText");
const progress=document.getElementById("progress");
const timeEl=document.getElementById("time");
const leaderboardEl=document.getElementById("leaderboard");

const correctSound=document.getElementById("correctSound");
const wrongSound=document.getElementById("wrongSound");

function startQuiz(){
  questions=allQuestions[categorySelect.value];
  index=0; score=0;
  resultBox.style.display="none";
  quizBox.style.display="block";
  loadQuestion();
}

function setDifficulty(){
  let level=difficultySelect.value;
  timeLeft=level==="easy"?20:level==="hard"?10:15;
}

function loadQuestion(){
  setDifficulty();
  resetTimer();
  let q=questions[index];
  questionEl.textContent=q.q;
  optionsEl.innerHTML="";
  q.a.forEach((opt,i)=>{
    let btn=document.createElement("button");
    btn.textContent=opt;
    btn.onclick=()=>checkAnswer(i,btn);
    optionsEl.appendChild(btn);
  });
  progress.style.width=((index)/questions.length)*100+"%";
}

function checkAnswer(i,btn){
  clearInterval(timer);
  if(i===questions[index].c){btn.classList.add("correct");score++;correctSound.play();}
  else{btn.classList.add("wrong");wrongSound.play();}
}

nextBtn.onclick=()=>{
  index++;
  if(index<questions.length) loadQuestion();
  else showResult();
};

function showResult(){
  quizBox.style.display="none";
  resultBox.style.display="block";
  scoreText.textContent=`You scored ${score} out of ${questions.length}!`;
  saveScore(); showLeaderboard();
}

document.getElementById("playAgain").onclick=startQuiz;

function resetTimer(){
  timeEl.textContent=timeLeft;
  clearInterval(timer);
  timer=setInterval(()=>{
    timeLeft--; timeEl.textContent=timeLeft;
    if(timeLeft<=0) clearInterval(timer);
  },1000);
}

document.getElementById("themeToggle").onclick=()=>document.body.classList.toggle("light");

function saveScore(){
  let name=prompt("Enter your name:")||"Player";
  let data=JSON.parse(localStorage.getItem("quizScores"))||[];
  data.push({name,score});
  data.sort((a,b)=>b.score-a.score);
  localStorage.setItem("quizScores",JSON.stringify(data.slice(0,5)));
}

function showLeaderboard(){
  let data=JSON.parse(localStorage.getItem("quizScores"))||[];
  leaderboardEl.innerHTML="";
  data.forEach(d=>{
    let li=document.createElement("li");
    li.textContent=`${d.name} - ${d.score}`;
    leaderboardEl.appendChild(li);
  });
}

function clearLeaderboard(){
  localStorage.removeItem("quizScores");
  showLeaderboard();
}

showLeaderboard();
startQuiz();