// !<-- variáveis GLOBAIS -->

const URL_API = "https://mock-api.driven.com.br/api/v4/buzzquizz";
let acertos = 0;
let numeroQuestoes = 0;
let questoesRespondidas = 0;
let data = null;
let porcentagemAcertos = 0;




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
    promise.then(mostrarTelaQuizz)
    promise.catch(()=> alert("Erro de acesso ao Quizz"))
}


function mostrarTelaQuizz(quizzData) {
    let screen1 = document.querySelector(".screen_1")
    let quizzScreen = document.querySelector(".quizzes_screen");
    quizzScreen.classList.toggle("display-off")
    screen1.classList.toggle("display-off");
    window.scrollTo(0,0);
    data = quizzData.data
    let imgHeaderQuestion = data.image;
    let titleHeaderQuestion = data.title;
    quizzScreen.innerHTML += `<header class="header_quizzes_questions" style="background-image: url('${imgHeaderQuestion}')"><span>${titleHeaderQuestion}</span></header>`
    let questions = data.questions;
    numeroQuestoes = questions.length
    console.log(numeroQuestoes)
    for (let i = 0; i < questions.length; i++) {
        let titleQuestion = questions[i].title;
        let backgroundColorQuestion = questions[i].color;
        quizzScreen.innerHTML += `<section class="container_question">
            <div class="quizz_questions" style="background-color:${backgroundColorQuestion}">
                <span>${titleQuestion}</span>
            </div>
            <div class="options_question">
            </div>
            </section>` 
        let answers = questions[i].answers
        answers.sort(comparador); 
        function comparador() { 
	        return Math.random() - 0.5; 
        }
        for (let i = 0; i < answers.length; i++) {
            let textAnswer = answers[i].text;
            let imgAnswer = answers[i].image;
            let correctAnswer = (answers[i].isCorrectAnswer).toString();
            let optionQuestion = document.querySelectorAll(".container_question .options_question")
            optionQuestion[optionQuestion.length - 1].innerHTML += `<div class="question_img ${correctAnswer}" onclick="destacarRespostaEscolhida(this)">
                    <div class="option_question_img" style="background-image:
                        url('${imgAnswer}')">
                    </div>
                    <p>${textAnswer}</p>
                </div>`
        }
    }
}

function destacarRespostaEscolhida(resposta) {
    questoesRespondidas += 1;
    console.log(questoesRespondidas);
    resposta.classList.add("selected")
    if (resposta.classList.contains("true")) {
        acertos += 1
    }
    console.log(acertos)
    let divRespostaEscolhida = resposta.parentNode
    let Respostas = divRespostaEscolhida.querySelectorAll(".question_img");
    for (let i = 0; i < Respostas.length; i++) {
        Respostas[i].classList.add("opacity")
        Respostas[i].classList.add("no_click")
    }   
    divRespostaEscolhida.querySelector(".selected").classList.remove("opacity")
    
    let textoVermelho = divRespostaEscolhida.querySelectorAll(".false");
    for (let i = 0; i < textoVermelho.length; i++) {
        textoVermelho[i].querySelector("p").style.color="#FF4B4B"
    }
    let textoVerde = divRespostaEscolhida.querySelectorAll(".true");
    textoVerde[0].querySelector("p").style.color="#009C22"

    // ! Scroll para a próxima pergunta

    let nextQuestion = divRespostaEscolhida.parentNode.nextSibling;
    setTimeout(function () {
        nextQuestion.scrollIntoView();
    },2000)

    if(questoesRespondidas === numeroQuestoes) {
        renderizarResultados();
    }
    
}

function renderizarResultados() {
    let niveis = data.levels
    porcentagemAcertos = Math.round(((acertos/numeroQuestoes)*100))
    for (let i = 0; i < niveis.length-1; i++) {
        if (porcentagemAcertos>=niveis[i].minValue && porcentagemAcertos<niveis[i+1].minValue) {
            let titleNivel = niveis[i].title;
            let textNivel = niveis[i].text;
            let imagemNivel = niveis[i].image;
            let quizzScreen = document.querySelector(".quizzes_screen");
            quizzScreen.innerHTML += `<section class="result_quizz">
                                        <div class="hit_percentage">
                                            <span>${porcentagemAcertos}% de acerto: ${titleNivel}</span>
                                        </div>
                                        <div class="final_result">
                                            <div class="final_img_quizz" style="background-image: url('${imagemNivel}')">
                                            </div>
                                            <p>${textNivel}</p>
                                        </div>
                                    </section>
                                    <button class="restart_quizz" onclick="reiniciarQuizz()">Reiniciar Quizz</button>
                                    <p class="back_home" onclick="voltarHomePage()">Voltar pra home</p>`
        } 
    }
    if (porcentagemAcertos>=niveis[niveis.length-1].minValue) {
        let titleNivel = niveis[niveis.length-1].title;
        let textNivel = niveis[niveis.length-1].text;
        let imagemNivel = niveis[niveis.length-1].image
        let quizzScreen = document.querySelector(".quizzes_screen");
        quizzScreen.innerHTML += `<section class="result_quizz">
        <div class="hit_percentage">
            <span>${porcentagemAcertos}% de acerto: ${titleNivel}</span>
        </div>
        <div class="final_result">
            <div class="final_img_quizz" style="background-image:
                    url('${imagemNivel}')">
            </div>
            <p>${textNivel}</p>
        </div>
    </section>
    <button class="restart_quizz" onclick="reiniciarQuizz()">Reiniciar Quizz</button>
    <p class="back_home" onclick="voltarHomePage()">Voltar pra home</p>`
    }

    
    setTimeout(function () {
        let resultado = document.querySelector(".result_quizz")
        resultado.scrollIntoView();
    },2000)
}


function reiniciarQuizz() {
    let quizzScreen = document.querySelector(".quizzes_screen");
    let removeClasses = quizzScreen.querySelectorAll(".question_img")
    for (let i = 0; i < removeClasses.length; i++) {
        removeClasses[i].classList.remove("opacity")
        removeClasses[i].classList.remove("no_click")
        removeClasses[i].classList.remove("selected")
    }

    let colorTextQuestionsBlack = quizzScreen.querySelectorAll("p")
    for (let i = 0; i < colorTextQuestionsBlack.length; i++) {
        colorTextQuestionsBlack[i].style.color ="#000000";   
    }

    let resultQuizz = document.querySelector(".result_quizz"); 
    let restartButton = document.querySelector(".quizzes_screen button");
    let homePageButton = document.querySelector(".quizzes_screen .back_home");

    console.log(resultQuizz);
    console.log(restartButton);
    console.log(homePageButton);
    resultQuizz.remove();
    restartButton.remove();
    homePageButton.remove();

    questoesRespondidas = 0;
    acertos = 0;
    porcentagemAcertos = 0;
    window.scrollTo(0,0);
}


function voltarHomePage() {
    let quizzScreen = document.querySelector(".quizzes_screen");
    let homePage = document.querySelector(".screen_1");
    quizzScreen.classList.toggle("display-off");
    homePage.classList.toggle("display-off");
    quizzScreen.innerHTML = "";
    questoesRespondidas = 0;
    acertos = 0;
    numeroQuestoes = 0;
    window.scrollTo(0,0);
}


// !<-- Chamando Funções -->

obterQuizzes();


// ! Victor Hugo Scripts

/* const section1 = document.querySelector(".tela_3-1")
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

 */