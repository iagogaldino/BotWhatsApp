FROM --platform=linux/amd64 node:16-bullseye AS runner

WORKDIR /usr/src/app


COPY . .

# adicionar os repositórios (instalando a chave gpg) e instalar diretamente a partir deles, ignorando o download manual:
RUN apt-get install -y wget
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \ 
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
RUN apt-get update && apt-get -y install google-chrome-stable
# Instala as libs do node
RUN npm install

CMD ["npm", "start"]
