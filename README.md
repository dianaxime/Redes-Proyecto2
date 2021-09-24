# Networks course - Cheat Game

![cheatGame](https://github.com/dianaxime/Redes-Proyecto2/blob/main/cheatgame.PNG?raw=true)

![Board](https://github.com/dianaxime/Redes-Proyecto2/blob/main/tablero.PNG?raw=true)

## Requirements

- Node JS
- npm

> Server

``` shell
$ cd server
$ npm install
$ npm start
```

> Client

``` shell
$ cd client
$ npm install
$ npm start
```

## Protocol

### Client to Server

> Join Room
```json
{
  "room": "room1",
  "username": "Camila"
}
```

> User Joined
```json
{
  "room": "room1",
  "username": "Camila"
}
```

> Chat
```json
{
  "text": "Este es un mensaje"
}
```

> Play
```json
{
  "room": "room1"
}
```

> Move
```json
{
  "room": "room1",
  "r_cards": [
    {
      "palo": "oro",
      "valor": 5,
      "desc": "Five of Coins"
    }
  ],
  "lie": [
    {
      "palo": "oro",
      "valor": 5,
      "desc": "Five of Coins"
    }
  ]
}
```

> Guesser choice
```json
{
  "room": "room1",
  "choice": true
}
```

> Finish
```json
{
  "room": "room1"
}
```

### Server to Client

> Full Room
```json
{
  "userId": "528dnhwjuuw23",
  "username": "Camila",
  "text": "Sorry, the game has already started."
}
```

> Allowed Room
```json
{
  "userId": "528dnhwjuuw23",
  "username": "Camila",
  "text": "Allowed."
}
```

> Message
```json
{
  "userId": "528dnhwjuuw23",
  "username": "Camila",
  "text": "Distintos mensajes...",
  "flag": "broadcast"
}
```

> Player
```json
{
  "userId": "528dnhwjuuw23",
  "username": "Camila",
  "turn": "liar",
  "deck": [
    {
      "palo": "oro",
      "valor": 5,
      "desc": "Five of Coins"
    }
  ]
}
```

> Can´t Start
```json
{
  "userId": "528dnhwjuuw23",
  "username": "Camila",
  "text": "You need three or more players."
}
```

> Change Turn
```json
{
  "userId": "528dnhwjuuw23",
  "username": "Camila",
  "turn": "guesser",
  "deck": [
    {
      "palo": "oro",
      "valor": 5,
      "desc": "Five of Coins"
    }
  ]
```

> Turn Winner
```json
{
  "userId": "528dnhwjuuw23",
  "username": "Camila",
  "turn": "inactive",
  "deck": [
    {
      "palo": "oro",
      "valor": 5,
      "desc": "Five of Coins"
    }
  ]
```

> Winner
```json
{
  "text": "The winner is Diana."
}
```

## Demo

> Watch the video [here](https://youtu.be/S-OWB7jaVOs)

> [Play now](http://cheatgame.s3-website.us-east-2.amazonaws.com/) Cheat Game 

## Team

| Maria Ines Vasquez | Camila Gonzalez | Maria Jose Castro | Diana de Leon | 
| :---: |:---:| :---:|:---:|
| [![Ines](https://avatars1.githubusercontent.com/u/35271285?s=400&u=9a19bb36e7c63cae0cd06f4036edce52439567d1&v=4)](https://github.com/18250MariaInes)    | [![Camila](https://avatars1.githubusercontent.com/u/35585500?s=400&u=eed198781e208e628be4ab10461c1f4008cedb44&v=4)](https://github.com/CamilaGO) | [![Majo](https://avatars0.githubusercontent.com/u/42973036?s=400&u=5ef4281a74a68dbeed54b1acec649b88bed06a5d&v=4)](https://github.com/iconicmajo)  | [![Diana](https://avatars3.githubusercontent.com/u/35496688?s=400&u=0c1d5e9002fdbe49590e935fc5c926ea58c94740&v=4)](https://github.com/dianaxime)  |
| <a href="https://github.com/18250MariaInes" target="_blank">`github.com/18250MariaInes`</a> | <a href="https://github.com/CamilaGO" target="_blank">`github.com/CamilaGO`</a> | <a href="https://github.com/iconicmajo" target="_blank">`github.com/iconicmajo`</a> | <a href="https://github.com/dianaxime" target="_blank">`github.com/dianaxime`</a> |
