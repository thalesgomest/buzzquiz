// ! Thales Scripts

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
    promise.catch(() => alert("Erro coleta de dados API"))
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
    allQuizzesScreen1.innerHTML += `<div class="container_img" style="background-image: url('${coverQuizz}');" onclick="acessarQuizz(${idQuizz})"><span>${titleQuizz}</span></div>`
    allQuizzesScreen2.innerHTML += `<div class="container_img" style="background-image: url('${coverQuizz}');" onclick="acessarQuizz(${idQuizz})"><span>${titleQuizz}</span></div>`
}

function acessarQuizz(idQuizz) {
    let promise = axios.get(`${URL_API}/quizzes/${idQuizz}`);
    promise.then(mostrarTelaQuizz)
    promise.catch(()=> alert("Erro de acesso ao Quizz"))
}


function mostrarTelaQuizz(quizzData) {
    let quizzScreen = document.querySelector(".quizzes_screen");
    if (localStorage.length === 0) {
        let screen1 = document.querySelector(".screen_1")
        let quizzScreen = document.querySelector(".quizzes_screen");
        quizzScreen.classList.toggle("display-off")
        screen1.classList.toggle("display-off");
        window.scrollTo(0,0);
    } else if (localStorage.length !== 0) {
        let screen2 = document.querySelector(".screen_2")
        let quizzScreen = document.querySelector(".quizzes_screen");
        quizzScreen.classList.toggle("display-off")
        screen2.classList.toggle("display-off");
        window.scrollTo(0,0);
    }
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
    if (localStorage.length === 0) {
        let homePage = document.querySelector(".screen_1");
        let quizzScreen = document.querySelector(".quizzes_screen");
        quizzScreen.classList.toggle("display-off")
        homePage.classList.toggle("display-off");
        window.scrollTo(0,0);
    } else if (localStorage.length !== 0) {
        let homePage2 = document.querySelector(".screen_2")
        let quizzScreen = document.querySelector(".quizzes_screen");
        quizzScreen.classList.toggle("display-off")
        homePage2.classList.toggle("display-off");
        window.scrollTo(0,0);
    }
    
    quizzScreen.innerHTML = "";
    questoesRespondidas = 0;
    acertos = 0;
    numeroQuestoes = 0;
    window.scrollTo(0,0);
}

function telaCriarQuizz() {
    if (localStorage.length ===0) {
    document.querySelector(".screen_1").classList.add("display-off");
    document.querySelector(".main").classList.remove("display-off");
    document.querySelector(".tela_3-1").classList.remove("hidden");
} else if (localStorage.length !==0) {
    document.querySelector(".screen_2").classList.add("display-off");
    document.querySelector(".main").classList.remove("display-off");
    document.querySelector(".tela_3-1").classList.remove("hidden");
}
}

// !<-- Chamando Funções -->

if (localStorage.length === 0) {
    document.querySelector(".screen_1").classList.remove("display-off")
} else {
    document.querySelector(".screen_2").classList.remove("display-off")
}

obterQuizzes();


// ! Victor Hugo Scripts

const section1 = document.querySelector(".tela_3-1")
const section2 = document.querySelector(".tela_3-2")
const section3 = document.querySelector(".tela_3-3")
const section4 = document.querySelector(".tela_3-4")

let quizzTittle = null;
let UrlImage = null;
let numberOfQuestions = null;
let numberOfLevels = null;

let allCheck = null;

let object = {
    title: '',
    image: '',
    questions: [],
    levels: []
}

function validateSimpleQuestions () {
    
    quizzTittle = document.querySelector("#input_1").value
    UrlImage = document.querySelector("#input_2").value
    numberOfQuestions = document.querySelector("#input_3").value
    numberOfLevels = document.querySelector("#input_4").value

    let levelsAndQuestionsOk = (numberOfLevels >= 2 && numberOfQuestions >= 3) 
    console.log(levelsAndQuestionsOk)
    
    let titleOk = (quizzTittle.length > 20 && quizzTittle.length < 65) 
    console.log(titleOk)

    let UrlImageOk = checkUrl(UrlImage) 
    console.log(UrlImageOk)

    if (levelsAndQuestionsOk && titleOk && UrlImageOk) {
        
        object.title = quizzTittle
        object.image = UrlImage

        section1.classList.add("hidden")
        section2.classList.remove("hidden")

        printQuestions()

        window.scrollTo(0, 0);
    
    }else{
        alert("Algum dado está inválido, tente novamente!")
    }
}

function printQuestions() {
    let section_questions = document.querySelector(".tela_3-2");

    for (let i = 1; i <= numberOfQuestions; i++) {
        
        section_questions.innerHTML += `
        <div class= "inside" onclick ="openDivQuestions(${i})">
            <h2>Pergunta ${i}</h2>
            <ion-icon class="opneDiv" name="create-outline"></ion-icon>
        </div> 
        <div class="question${i} escondido">
            <article class="question_1">
                <input id="${i}-question" type="text" placeholder="Texto da pergunta">
                <input id="${i}-color" type="text" placeholder="Cor de fundo da pergunta">

                <h3>Resposta correta</h3>
                <input id="${i}-correct-answer" type="text" placeholder="Resposta correta">
                <input id="${i}-correct-url" type="url" placeholder="URL da imagem correta">

                <h3>Respostas incorretas</h3>
                <input id="${i}-wrong-answer1" type="text" placeholder="Texto da pergunta">
                <input id="${i}-wrong-url1" type="url" placeholder="URL da imagem 1">
                
                <input id="${i}-wrong-answer2" id="input_11" type="text" placeholder="Texto da pergunta">
                <input id="${i}-wrong-url2" type="url" placeholder="URL da imagem 2">
                
                <input id="${i}-wrong-answer3" type="text" placeholder="Texto da pergunta">
                <input id="${i}-wrong-url3" type="url" placeholder="URL da imagem 3">
            </article>
        </div>`

    }
    section_questions.innerHTML += `
        <button id="botao_tela2 class=".main button" onclick="checkQuestions ()">
            <p>Prosseguir pra criar níveis</p>
        </button>
        `
}

function openDivQuestions (i) {  
    const question = document.querySelector(`.question${i}`);
    question.classList.toggle("escondido")
}

function validateQuestions(i) {

    // object.questions = []

        let objectQuestions = {
            title: '',
            color: '',
            answers: []
        }

        let objectCorrectAnswer = {
            text: '',
            image: '',
            isCorrectAnswer: true
        }

        let objectWrongAnswer1 = {
            text: '',
            image: '',
            isCorrectAnswer: false
        }

        let objectWrongAnswer2 = {
            text: '',
            image: '',
            isCorrectAnswer: false
        }

        let objectWrongAnswer3 = {
            text: '',
            image: '',
            isCorrectAnswer: false
        }

        /*pegando os valores dos inputs*/

        let textQuestion = document.getElementById(`${i + 1}-question`).value
        let backgroundColor = document.getElementById(`${i + 1}-color`).value

        let correctAnswer = document.getElementById(`${i + 1}-correct-answer`).value
        let correctUrl = document.getElementById(`${i + 1}-correct-url`).value

        let wrongAnswer1 = document.getElementById(`${i + 1}-wrong-answer1`).value
        let wrongUrl1 = document.getElementById(`${i + 1}-wrong-url1`).value

        let wrongAnswer2 = document.getElementById(`${i + 1}-wrong-answer2`).value
        let wrongUrl2 = document.getElementById(`${i + 1}-wrong-url2`).value

        let wrongAnswer3 = document.getElementById(`${i + 1}-wrong-answer3`).value
        let wrongUrl3 = document.getElementById(`${i + 1}-wrong-url3`).value

        /*Passando os valores dos inputs para o objeto*/

        objectQuestions.title = textQuestion
        objectQuestions.color = backgroundColor
        
        objectCorrectAnswer.text = correctAnswer
        objectCorrectAnswer.image = correctUrl
        objectQuestions.answers.push(objectCorrectAnswer)

        objectWrongAnswer1.text = wrongAnswer1
        objectWrongAnswer1.image = wrongUrl1
        objectQuestions.answers.push(objectWrongAnswer1)

        objectWrongAnswer2.text =  wrongAnswer2
        objectWrongAnswer2.image = wrongUrl2
        objectQuestions.answers.push(objectWrongAnswer2)

        objectWrongAnswer3.text = wrongAnswer3
        objectWrongAnswer3.image = wrongUrl3
        objectQuestions.answers.push(objectWrongAnswer3)

        console.log(objectQuestions)

        object.questions.push(objectQuestions)

        /*Validações dos Inputs*/

        let textQuestionCheck = (textQuestion.length > 20 && textQuestion.length !== "");

        let backgroundColorCheck = checkHex(backgroundColor);

        let correctAnswerCheck = (correctAnswer !== "");

        let correctUrlCheck = checkUrl(correctUrl)

        let wrongAnswersCheck = (wrongAnswer1 !== "" || wrongAnswer2 !== "" || wrongAnswer3 !== "");

        let wrongUrlCheck = checkUrl(wrongUrl1) || checkUrl(wrongUrl2) || checkUrl(wrongUrl3);

        allCheck = (textQuestionCheck && backgroundColorCheck && correctAnswerCheck && correctUrlCheck && wrongAnswersCheck && wrongUrlCheck === true);
        return allCheck;
}

function checkQuestions () {

    let validate = true;
    
    for (let i = 0; i < numberOfQuestions; i++) {
        
        let validateAtual = validateQuestions(i)
        validate = (validate && validateAtual)
    }  

    console.log(validate)
        
    if(allCheck && object.questions.length == numberOfQuestions && validate) {
            console.log("Testes ok", object.questions, numberOfQuestions);
    printLevels()
            section2.classList.add("hidden")
            section3.classList.remove("hidden")
            window.scrollTo(0, 0);
        } else {
            alert("Algo deu errado, tente novamente!")
            object.questions = []
        }
}

function printLevels() {

    for (let i = 1; i <= numberOfLevels; i++) {

        const section_levels = document.querySelector(".tela_3-3");
        section_levels.innerHTML += `
        <div class= "inside" onclick ="openDivLevels(${i})">
            <h2>Nível ${i}</h2>
            <ion-icon class="opneDiv" name="create-outline"></ion-icon>
        </div> 
        <div class = "levels${i} escondido">
        <article class="level_1">
            <input id="${i}-Tittle_level" type="text" placeholder="Título do nível" minlength="10">
            <input id="${i}-minimum_Hits" type="number" placeholder="% de acerto mínima">
            <input id="${i}-levelUrl" type="url" placeholder="URL da imagem">
            <textarea id="${i}-LevelDescription" wrap="hard" placeholder="Descrição do nível" minlength="30"></textarea>
        </article>
        </div>`
    }
    const section_levels = document.querySelector(".tela_3-3");
    section_levels.innerHTML += `
        <button onclick="validateLevels ()">
            <p>Finalizar Quizz</p>
        </button>`

    document.getElementById("1-minimum_Hits").placeholder="O nível 1 deve ser igual a 0";
}

function openDivLevels(i) {
    let levels = document.querySelector(`.levels${i}`)
    levels.classList.toggle("escondido")
}

function validateLevels () {

    object.levels = []
    
    for(let i = 0; i < numberOfLevels; i++) {

        let objectLevels = {
            title: '',
            image: '',
            text: '',
            minValue: ''
        }
        
        let LevelTittle = document.getElementById(`${i + 1}-Tittle_level`).value
        let MinimunHits = document.getElementById(`${i + 1}-minimum_Hits`).value
        let levelUrl = document.getElementById(`${i + 1}-levelUrl`).value
        let LevelDescription = document.getElementById(`${i + 1}-LevelDescription`).value

        objectLevels.title = LevelTittle
        objectLevels.image = levelUrl
        objectLevels.text = LevelDescription
        objectLevels.minValue = parseInt(MinimunHits)

        object.levels.push(objectLevels)

        let LevelTittleCheck = (LevelTittle.length > 10 && LevelTittle !== "");

        let MinimunHitsCheck = (parseInt(MinimunHits) >= 0 && parseInt(MinimunHits) <= 100);

        let levelUrlCheck = checkUrl(levelUrl)

        let LevelDescriptionCheck = (LevelDescription.length > 30 && LevelDescription !== "");

        if (LevelTittleCheck && MinimunHitsCheck && levelUrlCheck && LevelDescriptionCheck ) {
            console.log("Primeiros testes ok")
        } else {
            alert("Algum dado está inválido, tente novamente!")
            break
        }
    }
        
        if (parseInt(document.getElementById("1-minimum_Hits").value) !== 0) {
            alert("O nivel 1 deve ser igual a 0 e os demais em ordem crescente de valor")
        } else {
            alert("OK")
            printLastScreen()
            section3.classList.add("hidden")
            section4.classList.remove("hidden")
            window.scrollTo(0, 0);
            PostQuizz ()
        }
            console.log(object)
}

function printLastScreen () {

        const section_last = document.querySelector(".tela_3-4");
        section_last.innerHTML += `<article class="last_screen" style="background-image: url('${UrlImage}')">
                                        <span>${quizzTittle}</span>
                                    </article>
                                    <button>
                                        <p>Acessar Quizz</p>
                                    </button>
                                    <button onclick= "backScreen()">
                                        <p class="button_home">Voltar pra home</p>
                                    </button>`
}

/*Funções para validações: checagem url e cor hexadecimal*/

function checkHex(str) {
    const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i;
    return regex.test(str);
}

function checkUrl(str){
    if (str != null && str != '') {
        let regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        return regex.test(str);
    }else{
        return false;
    }
}

/* Funções para postar o Quizz criado */

function cleanQuestion () {
    for (let i = 0; i < numberOfQuestions; i++) {
        object.questions[i].answers = object.questions[i].answers.filter(function(item){
            return item.title !== "" && item.image !== ""
        })
    }
}

function PostQuizz () {
    cleanQuestion ()
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", object)

    promise.then(postValido)
    promise.catch(postInvalido)
}

function postValido (response){
    console.log(response.data)
    alert("deu tudo certo")

    saveLocalStorage(response)
}

function postInvalido (erro) {
    const statusCode = erro.response.data
    console.log(statusCode)
    alert("Deu ruim")
}

function saveLocalStorage (response) {
    var meusQuizzes = JSON.parse(localStorage.getItem('meusQuizzes') || '[]');

    meusQuizzes.push({
        id: response.data.id,
        title: response.data.title,
        background_image: response.data.image
    });

      // Salva a lista alterada
    localStorage.setItem("meusQuizzes", JSON.stringify(meusQuizzes));
}

function backScreen () {
    if (localStorage.length !== 0) {
        document.querySelector(".tela_3-4").classList.add("hidden")
        document.querySelector(".screen_2").classList.remove("display-off")
        window.scrollTo(0,0);
    } else if (localStorage.length === 0) {
        document.querySelector(".tela_3-4").classList.add("hidden")
        document.querySelector(".screen_1").classList.remove("display-off")
        window.scrollTo(0,0);
    }
}

