const fs = require("fs");
const path = require("path");
const { SquareCloudBlob, MimeTypes } = require("@squarecloud/blob");

const apiKey =
  "ed5180262c96560c19e17a459bad487451640343-da78c4413490d9ce905b7a09eeb552ee3f4c5aed0fa876d45c85cac98b60d166";
const blob = new SquareCloudBlob(apiKey);

async function teste() {
  try {
    // Listar objetos para verificar se a comunicação com a API está funcionando
    const objects = await blob.objects.list();
    console.log("Objetos listados:", objects);

    // Verificar se o arquivo de imagem existe
    const imagePath = path.join(__dirname, "uploads", "teste.png");
    if (!fs.existsSync(imagePath)) {
      throw new Error("Arquivo de imagem não encontrado em: " + imagePath);
    }

    // Ler o arquivo da imagem
    const fileBuffer = fs.readFileSync(imagePath);
    console.log("Tamanho do buffer lido:", fileBuffer.length);

    // Verificar se o buffer foi lido corretamente
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error("Erro ao ler o arquivo de imagem.");
    }

    // Criar objeto blob
    const blobObject = await blob.objects.create({
      file: fileBuffer,
      name: "teste-novo", // Alterei o nome para evitar possíveis conflitos
      mimeType: MimeTypes.IMAGE_PNG, // Também aceita uma string "image/jpeg"
    });

    console.log("URL do objeto blob criado:", blobObject.url);
  } catch (error) {
    // Imprimir uma mensagem de erro mais detalhada
    console.error("Erro durante a criação do blob:", error.message || error);
  }
}

teste();
