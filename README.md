# Guess The Elo

GTE is a fun challenge where the aim is to guess a player's elo by analyzing a game that they've played. The game idea was created by Gotham Chess,
who has an entertaining series of videos playing GTE. This project was built in order to allow anyone to try playing GTE themselves.

It selects a random chess.com game based on your GTE preferences and your goal can either be to guess either white or black's elo or the average between both.

![](./main.png)

![](./result.png)

## Setup

This stack is completely dockerized with docker compose, so that is the only prerequisite.

1. Clone the repository

```
git clone https://github.com/kamui-fin/guess-the-elo.git
cd guess-the-elo
```

2. Build and start all containers

```
docker-compose up
```

3. Open up [localhost:8080/](http://localhost:8080/)

## Contributing

All contributions in the form of pull requests, bug reports, etc. are gladly welcomed.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
