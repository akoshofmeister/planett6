# T6-os bolygó
[![Build Status](https://travis-ci.org/akoshofmeister/planett6.svg?branch=add-vuejs-base)](https://travis-ci.org/akoshofmeister/planett6)
### A játék menete
Fred, egy fejvadász, akit azért küldtek a T6-os bolygóra, hogy megtisztítsa azt a bennszülött lényektől. 

### Dolgok, amiket lehet csinálni
- Meg kell ölni minden szörnyet ahhoz, hogy egy ellenörzőponton tovább tudj menni
- Ha meghalsz, akkor az utolsó ellenörzőponttól kezded újra
- Elérhetsz mérföldköveket, jó nehezek
- A pálya "végtelen"
- A pálya tele van akadályokkal, ugrálni kell, hogy átmenj rajtuk
- Ha egy szörny észrevett, addig követ téged amíg meg nem ölöd, vagy ő meg nem öl téged
- A szörnyeket a kezedben lévő fegyverrel tudod megölni, lőni kell hozzá
- Be tudsz jelentkezni, hogy a mérföldköveidet tárolhasd, illetve más dolgokat is meg tudsz nézni
- Tudsz játszani valaki mással is egyszerre, egy gépen, egy billentyűzeten. Ilyenkor együtt kell haladnotok, a másik játékos is 
bejelentkezhet, hogy tárolhassa a mérföldköveit, vagy játszhat idegen módban. Ha valamelyikőtök meghal, akkor csak ellenörzőponton
folytathatja a játékot

### Gépigény
- Modern böngésző (Google Chrome 64+)
- Szélessávú internetkapcsolat

### Ebben írjuk
- NodeJS
- HTML
- CSS
- Vue.js
- JavaScript ES6
- TypeScript

### Akik írják
- Hofmeister Ákos
- Molnár Máté
- Hugyecz Petra

### Aki rajzolta
- Bogyó Péter

### Amit rajzolt
![Fred megy](https://raw.githubusercontent.com/akoshofmeister/planett6/master/images/readme/1.png)
![Fred ugrik](https://raw.githubusercontent.com/akoshofmeister/planett6/master/images/readme/2.png)
![Játék indítása](https://raw.githubusercontent.com/akoshofmeister/planett6/master/images/readme/3.png)
![Fred és a lények](https://raw.githubusercontent.com/akoshofmeister/planett6/master/images/readme/4.png)

### Parancsok

- Telepítés
``` bash
# install dependencies
yarn install
```
- Kliens futtatása
```bash
# run client with hot reload for development 
yarn dev-app

# build client for production with minification
yarn build-app
```

- Szerver futtatása
```bash
# run server for development
yarn dev-server

# build server for production
yarn build-server
```

- Tesztelés
```bash
# run tests
yarn test

# run tests for client
yarn test-app

# run tests for client with watch
yarn test-app:watch

# run tests for server
yarn test-server

# run tests for client with watch
yarn test-server:watch
```

- Extra eszközök
    - ESLint a JavaScript kód stílusának analizálására
    - TSLint a TypeScript kód stílusának analizálására
```bash
# run static code analyzer for client and its tests (ESLint)
yarn lint-app
yarn lint-app-test

# run static code analyzer for server (TSLint)
yarn lint-server
```
