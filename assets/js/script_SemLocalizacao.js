let descricaoImagens = [
  { descricao: "Céu limpo", imagem: "./assets/img/ceulimpo.jpg" },
  { descricao: "Algumas nuvens", imagem: "./assets/img/ceulimpo.jpg" },
  { descricao: "Poucas nuvens", imagem: "./assets/img/ceulimpo.jpg" },
  { descricao: "Nuvens dispersas", imagem: "./assets/img/ceu_nublado.jpg" },
  { descricao: "Nublado", imagem: "./assets/img/ceu_nublado.jpg" },
  { descricao: "Garoa De Leve Intensidade", imagem: "./assets/img/ceu_nublado.jpg" },
  { descricao: "Chuva leve", imagem: "./assets/img/chuva.jpg" },
  { descricao: "Chuva moderada", imagem: "./assets/img/chuva.jpg" },
  { descricao: "Chuva forte", imagem: "./assets/img/chuva.jpg" },
  { descricao: "Trovoada", imagem: "./assets/img/chuva.jpg" },
  { descricao: "Neve fraca", imagem: "./assets/img/neve.jpg" },
  { descricao: "Neve moderada", imagem: "./assets/img/neve.jpg" },
  { descricao: "Nevasca", imagem: "./assets/img/neve.jpg" },
];

function trocarFundoPorImagem(descricao) {
  let imagem = "./assets/img/fundo-app.jpg";
  let descricaoImagem = descricaoImagens.find(
      (item) => item.descricao.toLowerCase() === descricao.toLowerCase()
  );

  if (descricaoImagem) {
      imagem = descricaoImagem.imagem;
  }

  // Aplica a imagem de fundo na div.wrapper
  document.querySelector(".wrapper").style.backgroundImage = `url('${imagem}')`;
}

let apiKey = "6087b855ab65dfa01cd32173e31e7ff0";

function exibirDadosPrevisao(dados) {
  // Exibe o info-container e a previsao-wrapper após a busca, aplicando o display vazio para respeitar o CSS
  document.querySelector(".info-container").style.display = "";
  document.querySelector(".previsao-wrapper").style.display = "";

  document.querySelector(".nome-cidade").innerHTML = "Previsão em " + dados.name;
  document.querySelector(".temperatura").innerHTML = Math.floor(dados.main.temp) + "°C";
  document.querySelector(".descricao-clima").innerHTML = dados.weather[0].description;
  document.querySelector(".icone-clima").src = "https://openweathermap.org/img/wn/" + dados.weather[0].icon + ".png";
  document.querySelector(".umidade").innerHTML = "Umidade do Ar: " + dados.main.humidity + "%";
  trocarFundoPorImagem(dados.weather[0].description);
}

async function buscarCidade(cidade) {
  let dadosPrevisao = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cidade +
      "&appid=" +
      apiKey +
      "&lang=pt_br" +
      "&units=metric"
  ).then((resposta) => resposta.json());

  exibirDadosPrevisao(dadosPrevisao);
}

async function buscarPrevisaoHoraria(cidade) {
  let dadosPrevisaoHoraria = await fetch(
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      cidade +
      "&appid=" +
      apiKey +
      "&lang=pt_br" +
      "&units=metric"
  ).then((resposta) => resposta.json());

  exibirHorariosPrevisao(dadosPrevisaoHoraria);
}

function exibirHorariosPrevisao(dados) {
  let containerPrevisao = document.querySelector(".container-previsao");
  containerPrevisao.innerHTML = "";

  let previsaoHoraria = dados.list;
  let totalHorarios = Math.min(previsaoHoraria.length, 48);

  for (let i = 0; i < totalHorarios; i++) {
      let horarioUTC = new Date(previsaoHoraria[i].dt_txt);
      let horarioLocal = horarioUTC.toLocaleString("pt-BR", { hour: "numeric", minute: "numeric" });
      let dataLocal = horarioUTC.toLocaleDateString("pt-BR");
      let temperatura = Math.floor(previsaoHoraria[i].main.temp) + "°C";

      let iconeClima = document.createElement("img");
      iconeClima.src = "https://openweathermap.org/img/wn/" + previsaoHoraria[i].weather[0].icon + ".png";

      let divHorario = document.createElement("div");
      divHorario.innerHTML = dataLocal + " " + horarioLocal + " " + temperatura;
      divHorario.appendChild(iconeClima);

      containerPrevisao.appendChild(divHorario);
  }
}

function pesquisarCidade() {
  let cidade = document.querySelector(".input-cidade").value;

  buscarCidade(cidade);
  buscarPrevisaoHoraria(cidade);
}

// Ocultar o info-container e previsao-wrapper ao iniciar a página
window.onload = function() {
  document.querySelector(".info-container").style.display = "none";
  document.querySelector(".previsao-wrapper").style.display = "none";
};
