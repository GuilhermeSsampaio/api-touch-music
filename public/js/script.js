function mudarFundo() {
  const body = document.body;
  if (body.classList.contains("bg-dark")) {
    body.classList.remove("bg-dark", "text-white");
    body.classList.add("bg-light", "text-dark");
  } else {
    body.classList.remove("bg-light", "text-dark");
    body.classList.add("bg-dark", "text-white");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const audioUpload = document.getElementById("audioUpload");
  const fileNameInput = document.getElementById("fileName"); // Capturar o campo de nome do arquivo
  const audioForm = document.getElementById("audioForm");

  // Preview do audio
  audioUpload.addEventListener("change", () => {
    const file = audioUpload.files[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      document.getElementById("audioPreview").src = audioUrl;
    }
  });

  // Enviar arquivo
  audioForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData();
    const file = audioUpload.files[0];
    const fileName = fileNameInput.value; // Obter o nome do arquivo do input

    if (file) {
      formData.append("audio", file);

      // Fazer a requisição POST com o nome do arquivo incluído na URL
      fetch(`/upload?name=${encodeURIComponent(fileName)}`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Áudio enviado com sucesso:", data);
        })
        .catch((error) => {
          console.error("Erro ao enviar o áudio:", error);
        });
    } else {
      console.log("Nenhum arquivo de áudio foi selecionado.");
    }
  });
});
