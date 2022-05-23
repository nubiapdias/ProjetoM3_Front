const baseURL = "http://localhost:3000/jogos";

//  get all
async function findAllJogos() {
  const response = await fetch(`${baseURL}/find-jogos`);

  const jogos = await response.json();

  jogos.forEach(function (jogo) {
    document.querySelector("#jogoList").insertAdjacentHTML(
      "beforeend",
      `
  <div>
    <div class="JogosListaItem" id="JogosListaItem_${jogo.id}">

            <div class="JogosListaItem__title">${jogo.title}</div>
            <div class="JogosListaItem__preco">R$ ${jogo.preco}</div>
            <div class="JogosListaItem__type">${jogo.type}</div>

            <div class="JogosListaItem__acoes Acoes">
              <button class="Acoes__editar btn" onclick="abrirModal(${jogo.id})">Editar</button>
              <button class="Acoes__apagar btn" onclick="abrirModalDelete(${jogo.id})">Apagar</button>

            </div>

        <img class="JogosListaItem__foto" src="${jogo.foto}" alt="jogo ${jogo.title}" />
      </div>

    `
    );
  });
}

// get by id

const findByIdJogos = async () => {
  const id = document.getElementById('idJogo').value;

  const response = await fetch(`${baseURL}/find-jogos/${id}`);

  const jogo = await response.json();

  if (jogo.message) {
    const jogo = document.getElementById('jogo-escolhido');
    jogo.innerHTML = '';
    document.getElementById('idJogo').value = '';
    abrirModalAlerta(jogo.message);
  } else {
    const jogo = document.getElementById('jogo-escolhido');

    jogo.innerHTML = `
      <div class="JogosCardItem" id="JogosListaItem_${jogo.id}">
      <div>
          <div class="JogosCardItem__title">${jogo.title}</div>
          <div class="JogosCardItem__preco">R$ ${jogo.preco}</div>
          <div class="JogosCardItem__type">${jogo.type}</div>
    
          <div class="JogosListaItem__acoes Acoes">
              <button class="Acoes__editar btn" onclick="abrirModal(${jogo.id})">Editar</button>
              <button class="Acoes__apagar btn" onclick="abrirModalDelete(${jogo.id})">Apagar</button>
          </div>
      </div>
      <img class="JogosCardItem__foto" src="${jogo.foto}" alt="jogo ${jogo.title} poster" />
    </div>`;
    }
  }
  


findAllJogos();

// modal

async function abrirModal(id = null) {
  if (id != null) {
    document.querySelector("#title-header-modal").innerText =
      "Atualizar um Jogo";
    document.querySelector("#button-form-modal").innerText = "Atualizar";

    const response = await fetch(`${baseURL}/jogos/${id}`);
    const jogo = await response.json();

    document.querySelector("#title").value = jogo.title;
    document.querySelector("#preco").value = jogo.preco;
    document.querySelector("#type").value = jogo.type;
    document.querySelector("#foto").value = jogo.foto;
    document.querySelector("#id").value = jogo.id;
  } else {
    document.querySelector("#title-header-modal").innerText =
      "Cadastrar um Jogo";
    document.querySelector("#button-form-modal").innerText = "Cadastrar";
  }

  document.querySelector("#overlay").style.display = "flex";
}

function fecharModalCadastro() {
  document.querySelector(".modal-overlay").style.display = "none";

  document.querySelector("#title").value = "";
  document.querySelector("#preco").value = 0;
  document.querySelector("#type").value = "";
  document.querySelector("#foto").value = "";
}

async function createJogo() {
  const id = document.querySelector("#id").value;
  const title = document.querySelector("#title").value;
  const preco = document.querySelector("#preco").value;
  const type = document.querySelector("#type").value;
  const foto = document.querySelector("#foto").value;

  const jogo = {
    id,
    title,
    preco,
    type,
    foto,
  };

  const modoEdicaoAtivado = id > 0;

  const endpoint = baseURL + (modoEdicaoAtivado ? `/update/${id}` : `/create`);

  const response = await fetch(endpoint, {
    method: modoEdicaoAtivado ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(jogo),
  });

  const novoJogo = await response.json();
  console.log(novoJogo.message)
  if (novoJogo.message) {
    alert(novoJogo.message);
  }
  document.querySelector('#jogoList').innerHTML = '';
  findAllJogos();

  if (modoEdicaoAtivado) {
    document.querySelector(`#JogosListaItem_${id}`).outerHTML = html;
  } else {
    document.querySelector("#jogoList").insertAdjacentHTML("beforeend", html);
  }

  fecharModal();
}

function abrirModalDelete(id) {
  document.querySelector("#overlay-delete").style.display = "flex";

  const btnSim = document.querySelector(".btn_delete_yes")

  btnSim.addEventListener("click", function() {
    deleteJogo(id);
  })
}

function fecharModalDelete() {
  document.querySelector("#overlay-delete").style.display = "none";
}

async function deleteJogo(id) {
  const response = await fetch(`${baseURL}/delete/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });

  const result = await response.json();
  alert(result.message);

  document.getElementById("#jogoList").innerHTML = ""

  fecharModalDelete();
  findAllJogos();
}



