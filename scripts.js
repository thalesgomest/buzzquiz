// !<-- variáveis GLOBAIS -->

const URL_API = "https://mock-api.driven.com.br/api/v4/buzzquizz";




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
    allQuizzesScreen2.innerHTML += `<div class="container_img" style="background-image: url('${coverQuizz}');"><span>${titleQuizz}</span></div>`
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

        allCheck = (textQuestionCheck && backgroundColorCheck && correctAnswerCheck && correctUrlCheck && wrongAnswersCheck && wrongUrlCheck === true)
}

function checkQuestions () {

    let validate = null;
    
    for (let i = 0; i < numberOfQuestions; i++) {
        
        validate = validateQuestions(i)
    }  

    console.log(validate)
        
    if(allCheck && object.questions.length == numberOfQuestions && validate) {
            console.log("Testes ok", object.questions, numberOfQuestions);
            printLevels()
            section2.classList.add("hidden")
            section3.classList.remove("hidden")
            window.scrollTo(0, 0);
        }else {
            alert("Algo deu errado, tente novamente!")
        }
    
}

/*function MoveToLevels() {
    /*section2.classList.add("hidden")
    section3.classList.remove("hidden")

    checkQuestions ()
    
    
}*/

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

/*function MoveToLastScreen() {

    validateLevels ()

    window.scrollTo(0, 0);

    PostQuizz ()
}*/

function printLastScreen () {

        const section_last = document.querySelector(".tela_3-4");
        section_last.innerHTML += `<article class="last_screen" style="background-image: url('${UrlImage}')">
                                        <span>${quizzTittle}</span>
                                    </article>
                                    <button>
                                        <p>Acessar Quizz</p>
                                    </button>
                                    <button>
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

function PostQuizz () {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", object)

    promise.then(postVálido)
    promise.catch(postInvalido)
}

function postVálido (response){
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
    const quizzSerializado = JSON.stringify(response);
    localStorage.setItem(response.id, quizzSerializado)
}



