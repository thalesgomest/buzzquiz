// !<-- variáveis GLOBAIS -->

const URL_API = "https://mock-api.driven.com.br/api/v4/buzzquizz";




// !<-- Funções -->

function obterQuizzes() {
    const promise = axios.get(`${URL_API}/quizzes`);
    promise.then(renderizarQuizzes)
    promise.catch(()=> alert("Erro coleta de dados API"))
}


function renderizarQuizzes(quizzes) {
const allQuizzes = quizzes.data;
console.log(allQuizzes)
allQuizzes.forEach(renderizarQuizz);
}

function renderizarQuizz(quizz) {
    let titleQuizz = quizz.title;
    let coverQuizz = quizz.image;
    let idQuizz = (quizz.id).toString()
    let allQuizzesScreen1 = document.querySelector(".screen_1 .container_imgs")
    let allQuizzesScreen2 = document.querySelector(".screen_2 .all_quizzes .container_imgs")
    allQuizzesScreen1.innerHTML +=`<div class="container_img" style="background-image: url('${coverQuizz}');" onclick="acessarQuizz(${idQuizz})"><span>${titleQuizz}</span></div>`
    allQuizzesScreen2.innerHTML +=`<div class="container_img" style="background-image: url('${coverQuizz}');"><span>${titleQuizz}</span></div>`
}

function acessarQuizz(idQuizz) {
    let promise = axios.get(`${URL_API}/quizzes/${idQuizz}`);
    console.log(promise)
}


// !<-- Chamando Funções -->

obterQuizzes();


// ! Victor Hugo Scripts

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

