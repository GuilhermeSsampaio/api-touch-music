# Usa a versão LTS do Node.js como base
FROM node:lts

# Define o diretório de trabalho no container
WORKDIR /usr/src/app

# Copia o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todo o restante do código para o diretório de trabalho
COPY . .

# Expõe a porta 80 para acesso externo
EXPOSE 3000

# Define o comando de inicialização da aplicação
CMD ["node", "index.js"]
