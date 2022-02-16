const section1 = document.querySelector(".tela_3-1")
const section2 = document.querySelector(".tela_3-2")
const section3 = document.querySelector(".tela_3-3")
const section4 = document.querySelector(".tela_3-4")

function MoveToQuestions (){
    section1.classList.add("hidden")
    section2.classList.remove("hidden")
}

function MoveToLevels (){
    section2.classList.add("hidden")
    section3.classList.remove("hidden")
}

function MoveToLastScreen (){
    section3.classList.add("hidden")
    section4.classList.remove("hidden")
}