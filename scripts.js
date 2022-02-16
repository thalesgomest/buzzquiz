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