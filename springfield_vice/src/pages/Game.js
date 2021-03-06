import React, { Component } from "react";
import Homer from "../components/Homer";
import Grid from "../components/Grid";
import config from "../components/configSpringfieldVice.json";
import JoyWrapper from "../components/Joystick";
import Timer from "../components/Timer";
import { Donut } from "../components/Item";
import { Beer } from "../components/Item";
import DonutCounter from "../components/DonutCounter";
import BoutonA from "../components/BoutonA";
import "./game.css";
import Modal from "../components/Modal";
import Selma from "../components/Selma";
import Health from "../components/Health";
import { getRandomArbitrary } from "../components/helpers";
import Obstacle from "../components/Obstacle";
import Bart from "../components/Bart";
import Seymour from "../components/Seymour";
import Milhouse from "../components/Milhouse";
import Grandpa from "../components/Grandpa";
import pink_ground from "../components/img/pink_ground.png";
import springfield80s from "../components/img/background_80s_repeat.png";
import Sound from "../components/Sound";

const donutStatus = {
	GROUND: "ground",
	PICKED: "picked",
	THROWN: "thrown"
};
const beerStatus = {
	GROUND: "ground",
	PICKED: "picked",
};
const obstacleStatus = {
	GROUND: "ground",
	PICKED: "picked",
	KILLED: "killed"
};
const selmaStatus = {
	KILLED: "killed",
	ALIVE: "alive"
};
const seymourStatus = {
	KILLED: "killed",
	ALIVE: "alive"
};
const milhouseStatus = {
	KILLED: "killed",
	ALIVE: "alive"
};
const grandpaStatus = {
	KILLED: "killed",
	ALIVE: "alive"
};

class Game extends Component {
	constructor(props) {
		super(props);
		this.state = {
			soundsPlay: true,
			positionX: config.initialPosition.x,
			positionY: config.initialPosition.y,
			showModal: false,
			seconds: config.timer.seconds,
			paused: false,
			donutPosition: 0,
			obstaclePosition: 0,
			positionDecal: 0,
			catchDonut: false,
			moving: false,
			isBlocked: false,
			isThrowing: false,
			homerCollisionHue: 0,
			donutPopped: [
				{
					positionDonutX: parseInt(
						getRandomArbitrary(config.limits.leftLimit, 1000)
					),
					positionDonutY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: donutStatus.GROUND,
					display: true
				},
				{
					positionDonutX: parseInt(getRandomArbitrary(1000, 2000)),
					positionDonutY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: donutStatus.GROUND,
					display: true
				},
				{
					positionDonutX: parseInt(getRandomArbitrary(1000, 2000)),
					positionDonutY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: donutStatus.GROUND,
					display: true
				},
				{
					positionDonutX: parseInt(getRandomArbitrary(2000, 3000)),
					positionDonutY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: donutStatus.GROUND,
					display: true
				},
				{
					positionDonutX: parseInt(getRandomArbitrary(2000, 3000)),
					positionDonutY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: donutStatus.GROUND,
					display: true
				},
				{
					positionDonutX: parseInt(getRandomArbitrary(3000, 4000)),
					positionDonutY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: donutStatus.GROUND,
					display: true
				},
				{
					positionDonutX: parseInt(getRandomArbitrary(3000, 4000)),
					positionDonutY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: donutStatus.GROUND,
					display: true
				},
				{
					positionDonutX: parseInt(getRandomArbitrary(3000, 4000)),
					positionDonutY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: donutStatus.GROUND,
					display: true
				},
				{
					positionDonutX: parseInt(getRandomArbitrary(4000, 5000)),
					positionDonutY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: donutStatus.GROUND,
					display: true
				},
				{
					positionDonutX: parseInt(getRandomArbitrary(4500, 5500)),
					positionDonutY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: donutStatus.GROUND,
					display: true
				},
				{
					positionDonutX: parseInt(getRandomArbitrary(4500, 5500)),
					positionDonutY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: donutStatus.GROUND,
					display: true
				}
			],
			beerPopped: [

				{
					positionBeerX: parseInt(getRandomArbitrary(1000, 2000)),
					positionBeerY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: beerStatus.GROUND
				},
				{
					positionBeerX: parseInt(getRandomArbitrary(2000, 3000)),
					positionBeerY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: beerStatus.GROUND
				},
				{
					positionBeerX: parseInt(getRandomArbitrary(3000, 4000)),
					positionBeerY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: beerStatus.GROUND
				},
				{
					positionBeerX: parseInt(getRandomArbitrary(4000, 5000)),
					positionBeerY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: beerStatus.GROUND
				},
			],
			obstaclePopped: [
				{
					positionObstacleX: parseInt(
						getRandomArbitrary(config.limits.leftLimit + 100, 1000)
					),
					positionObstacleY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: obstacleStatus.GROUND
				},
				{
					positionObstacleX: parseInt(
						getRandomArbitrary(config.limits.leftLimit + 100, 1000)
					),
					positionObstacleY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: obstacleStatus.GROUND
				},
				{
					positionObstacleX: parseInt(getRandomArbitrary(1000, 2000)),
					positionObstacleY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: obstacleStatus.GROUND
				},
				{
					positionObstacleX: parseInt(getRandomArbitrary(1000, 2000)),
					positionObstacleY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: obstacleStatus.GROUND
				},
				{
					positionObstacleX: parseInt(getRandomArbitrary(2000, 3000)),
					positionObstacleY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: obstacleStatus.GROUND
				},
				{
					positionObstacleX: parseInt(getRandomArbitrary(2000, 3000)),
					positionObstacleY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: obstacleStatus.GROUND
				},
				{
					positionObstacleX: parseInt(getRandomArbitrary(3000, 4000)),
					positionObstacleY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: obstacleStatus.GROUND
				},
				{
					positionObstacleX: parseInt(getRandomArbitrary(3000, 4000)),
					positionObstacleY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: obstacleStatus.GROUND
				},
				{
					positionObstacleX: parseInt(getRandomArbitrary(3000, 4000)),
					positionObstacleY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: obstacleStatus.GROUND
				},
				{
					positionObstacleX: parseInt(getRandomArbitrary(3000, 4000)),
					positionObstacleY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: obstacleStatus.GROUND
				},
				{
					positionObstacleX: parseInt(getRandomArbitrary(4000, 5000)),
					positionObstacleY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: obstacleStatus.GROUND
				},
				{
					positionObstacleX: parseInt(getRandomArbitrary(4000, 5000)),
					positionObstacleY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: obstacleStatus.GROUND
				},
				{
					positionObstacleX: parseInt(getRandomArbitrary(5000, 5500)),
					positionObstacleY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: obstacleStatus.GROUND
				},
				{
					positionObstacleX: parseInt(getRandomArbitrary(5000, 5500)),
					positionObstacleY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: obstacleStatus.GROUND
				},
				{
					positionObstacleX: parseInt(getRandomArbitrary(5000, 5500)),
					positionObstacleY: parseInt(
						getRandomArbitrary(
							config.limits.topLimit,
							config.limits.bottomLimit
						)
					),
					status: obstacleStatus.GROUND
				}
			],

			selmaPos: {
				positionX: 1510,
				positionY: 180,
				SelmaMovX: [
					10,
					10,
					10,
					10,
					10,
					10,
					10,
					10,
					-10,
					-10,
					-10,
					-10,
					-10,
					-10
				],
				SelmaMovY: [5, 5, 5, 5, 5, 5, 5, -5, -5, -5, -5, -5, -5, -5],
				status: selmaStatus.ALIVE
			},
			seymourPos: {
				positionX: 400,
				positionY: 250,
				SeymourMovX: [
					-10,
					-10,
					-10,
					-10,
					-10,
					10,
					10,
					10,
					10,
					10,
				],
				SeymourMovY: [5, 5, 5, 5, 5, -5, -5, -5, -5, -5],
				status: seymourStatus.ALIVE

			},
			bartPos: {
				positionBartX: 6000,
				positionBartY: 200,
				BartMovX: [
					6000,
					6000,
					6000,
					6020,
					6020,
					6050,
					6050,
					6100,
					6100,
					6150,
					6150,
					6200,
					6250,
					6250,
					6300,
					6300,
					6250,
					6250,
					6200,
					6200,
					6100,
					6050
				],
				BartMovY: [
					200,
					250,
					250,
					250,
					300,
					300,
					300,
					300,
					250,
					250,
					300,
					300,
					250,
					250,
					200,
					200,
					230,
					230,
					200,
					200,
					180,
					180
				]
			},
			milhousePos: {
				positionX: 2000,
				positionY: 250,
				MilhouseMovX: [
					10,
					10,
					10,
					10,
					10,
					10,
					-10,
					-10,
					-10,
					-10,
					-10,
					-10
				],
				MilhouseMovY: [
					[5, 5, 5, 5, 5, 5, -5, -5, -5, -5, -5, -5],
				],
				status: milhouseStatus.ALIVE

			},
			grandpaPos: {
				positionX: 3000,
				positionY: 250,
				GrandpaMovX: [
					10,
					10,
					10,
					10,
					10,
					10,
					-10,
					-10,
					-10,
					-10,
					-10,
					-10
				],
				GrandpaMovY: 
					[5, 5, 5, 5, 5, 5, 5, -5, -5, -5, -5, -5],
				
				status: grandpaStatus.ALIVE

			},
			relativePositionX: config.initialPosition.x,
			isRunning: false,
			isHomerRunningLeft: false,
			beerSound: false,
			obstSound: false,
			donutSound: false,
			opponentSound: false,
			globalPosition: 0,
			defilement: 0,
			bartSeBarreX: 400,
			bartSeBarreY: 250,
			gunSound: false,
			globalPosition: 0,
			defilement: 0,
			beerCountOrigin: 3
		};

		this.stepX = 0;
		this.stepY = 0;
		this.tick = this.tick.bind(this);
		this.interval = undefined;
		this.intObs = undefined;
		this.displayBarrel = "none";
	}







	//---------------------------------------








	testLimitsOfMap = () => {
		if (this.state.positionY < config.limits.topLimit)
			this.setState({ positionY: config.limits.topLimit });
		else if (this.state.positionY > config.limits.bottomLimit)
			this.setState({ positionY: config.limits.bottomLimit });
		else if (this.state.positionX > config.limits.rightLimit)
			this.setState({ positionX: config.limits.rightLimit });
		else if (this.state.positionX < config.limits.leftLimit)
			this.setState({ positionX: config.limits.leftLimit });
	};

	setStep = (stepX, stepY) => {
		this.stepX = stepX;
		this.stepY = stepY;
	};

	move = () => {
		const { positionX, positionY } = this.state;

		this.setState({
			positionX: positionX + this.stepX,
			positionY: positionY + this.stepY,
			moving: true
		});

		if (this.stepX < 0) {
			this.setState({ isHomerRunningLeft: true });
		} else if (this.stepX > 0) {
			this.setState({ isHomerRunningLeft: false });
		}
		// if (this.state.isRunning)
		// 	this.timeOut = setTimeout(() => this.move(), 10);

		if (this.state.isRunning === false) this.stopRunning();

		if (positionX !== config.limits.leftLimit)
			this.setState({
				relativePositionX: this.state.positionX - this.state.defilement,
				defilement:
					this.state.defilement - this.stepX / config.background.defilement
			});
	};

	startRunning = () => {
		this.setState({ isRunning: true });
		this.state.intervalHomer = setInterval(() => this.move(), 50);
	};
	stopRunning = () => {
		this.setState({ isRunning: false });
		clearInterval(this.state.intervalHomer);
	};


	moveSelma = () => {
		let i = 0;
		this.intSelma = setInterval(() => {
			let newPosX =
				this.state.selmaPos.positionX + this.state.selmaPos.SelmaMovX[i];
			let newPosY =
				this.state.selmaPos.positionY + this.state.selmaPos.SelmaMovY[i];
			this.setState({
				selmaPos: {
					...this.state.selmaPos,
					positionX: newPosX,
					positionY: newPosY
				}
			});
			i++;
			if (i >= this.state.selmaPos.SelmaMovX.length) {
				i = 0;
			}
		}, 300);
	};

	moveSeymour = () => {
		let i = 0;
		this.intSeymour = setInterval(() => {
			let newPosX =
				this.state.seymourPos.positionX +
				this.state.seymourPos.SeymourMovX[i];
			let newPosY =
				this.state.seymourPos.positionY +
				this.state.seymourPos.SeymourMovY[i];
			this.setState({
				seymourPos: {
					...this.state.seymourPos,
					positionX: newPosX,
					positionY: newPosY
				}
			});
			i++;
			if (i >= this.state.seymourPos.SeymourMovX.length) {
				i = 0;
			}
		}, 300);
	};


	moveBart = () => {
		let i = 0;
		this.intBart = setInterval(() => {
			let newPosX = this.state.bartPos.BartMovX[i];
			let newPosY = this.state.bartPos.BartMovY[i];
			this.setState({
				bartPos: {
					...this.state.bartPos,
					positionBartX: newPosX,
					positionBartY: newPosY
				}
			});
			i++;
			if (i >= this.state.bartPos.BartMovX.length) {
				i = 0;
			}
		}, 1000);
	};

	moveMilhouse = () => {
		let i = 0;
		this.intMilhouse = setInterval(() => {
			let newPosX = this.state.milhousePos.positionX + this.state.milhousePos.MilhouseMovX[i];
			let newPosY = this.state.milhousePos.positionY + this.state.milhousePos.MilhouseMovY[i];
			this.setState({
				milhousePos: { ...this.state.milhousePos, positionX: newPosX, positionMihouseY: newPosY }
			});
			i++;
			if (i >= this.state.milhousePos.MilhouseMovX.length) {
				i = 0;
			}
		}, 1000);
	};

	moveGrandpa = () => {
		let i = 0;
		this.intGrandpa = setInterval(() => {
			let newPosX = this.state.grandpaPos.positionX + this.state.grandpaPos.GrandpaMovX[i];
			let newPosY = this.state.grandpaPos.positionY + this.state.grandpaPos.GrandpaMovY[i];
			this.setState({
				grandpaPos: { ...this.state.grandpaPos, positionX: newPosX, positionY: newPosY }
			});
			i++;
			if (i >= this.state.grandpaPos.GrandpaMovX.length) {
				i = 0;
			}
		}, 1000);
	};

	bartSeBarre = () => {
		setTimeout(() => {
			this.setState({ bartSeBarreX: 15000 });
		}, 3000);
	};

	tick = () => {
		let { seconds } = this.state;
		this.setState({ seconds: seconds - 1 });
		// GAME_OVER
		if (seconds === 0) {
			this.setState({ seconds: 0 });
			clearInterval(this.interval);
		}
	};

	isGameOver = () => {
		const health = this.beerCount(this.state.beerCountOrigin) - this.obstacleCollisionCount();
		if (this.state.seconds === 0 || health <= 0) {
			// Si perdant :
			this.stopRunning();
			clearInterval(this.interval);
			setTimeout(() => {
				this.props.history.push("game/?modal=true&go=true");
				this.setState({ origin: "go_lost" });
				return;
			}, 2000);
		}
		if (this.beerCount(this.state.beerCountOrigin) === 100) {
			// Si gagnant :
			this.stopRunning();
			clearInterval(this.interval);
			this.props.history.push("game/?modal=true&go=true");
			this.setState({ origin: "go_win" });
			return;
		}
	};

	componentDidMount = () => {
		this.interval = setInterval(() => {
			this.tick();
			this.isGameOver();
		}, 1000);
		setInterval(() => this.gameLoop(), 80);
		this.moveSelma();
		this.moveBart();
		this.moveSeymour();
		this.moveMilhouse();
		this.moveGrandpa();
		this.bartSeBarre();
	};

	pauseTimer = () => {
		if (this.state.paused === false || this.state.seconds === 0) {
			clearInterval(this.interval);
			clearInterval(this.intSelma);
			clearInterval(this.intBart);
			clearInterval(this.intSeymour);
			clearInterval(this.intMilhouse);
			clearInterval(this.intGrandpa);
		} else {
			this.componentDidMount();
		}
	};

	pauseGame = () => {
		this.setState({ paused: !this.state.paused });
		this.pauseTimer();
		document.getElementById("root").classList.remove("background_opacity")
	};

	collisionDetection = item => {
		if (
			this.state.relativePositionX > item.positionDonutX - 30 &&
			this.state.relativePositionX < item.positionDonutX + 30 &&
			this.state.positionY < item.positionDonutY + 30 &&
			this.state.positionY > item.positionDonutY - 30 &&
			item.status === "ground"
		) {
			item.status = "picked";
			this.setState({ donutSound: true });
			setTimeout(() => {
				this.setState({ donutSound: false });
			}, 500);
		}
	};
	collisionDetectionBeer = item => {
		if (
			this.state.relativePositionX > item.positionBeerX - 30 &&
			this.state.relativePositionX < item.positionBeerX + 30 &&
			this.state.positionY < item.positionBeerY + 30 &&
			this.state.positionY > item.positionBeerY - 30 &&
			item.status === "ground"
		) {
			if (this.state.homerCollisionHue > 0)
				this.setState({ homerCollisionHue: this.state.homerCollisionHue - 30 });
			item.status = "picked";
			this.setState({ beerSound: true });
			setTimeout(() => {
				this.setState({ beerSound: false });
			}, 800);
		}
	};
	collisionDetectionOpponent = item => {
		if (
			this.state.relativePositionX > item.positionX - 30 &&
			this.state.relativePositionX < item.positionX + 30 &&
			this.state.positionY < item.positionY + 30 &&
			this.state.positionY > item.positionY - 30 &&
			item.status === "alive"
		) {
/*ici*/
			item.status = "killed";
			this.setState({ opponentSound: true, beerCountOrigin: this.state.beerCountOrigin - 1 });
			setTimeout(() => {
				this.setState({ opponentSound: false });
			}, 2000);
		}
	};


	collisionDetectionObstacle = item => {
		if (
			this.state.relativePositionX > item.positionObstacleX - 10 &&
			this.state.relativePositionX < item.positionObstacleX + 10 &&
			this.state.positionY < item.positionObstacleY + 30 &&
			this.state.positionY > item.positionObstacleY - 30 &&
			item.status === 'ground'
		) {
			this.setState({
				isRunning: false,
				isBlocked: true,
				homerCollisionHue: this.state.homerCollisionHue + 30
			});
			item.status = "picked";
			this.setState({ obstSound: true });
			setTimeout(() => {
				this.setState({ obstSound: false });
			}, 2000);
		}
	};

	collisionBart = item => {
		//		console.log(item.positionBartX, this.state.relativePositionX + this.state.defilement)
		if (
			this.state.relativePositionX > item.positionBartX - 15 &&
			this.state.relativePositionX < item.positionBartX + 20 &&
			this.state.positionY < item.positionBartY + 40 &&
			this.state.positionY > item.positionBartY - 60
		) {
			this.props.history.push("game/?modal=true&go=true");
			this.setState({ origin: "go_win" });
			this.stopRunning();
			clearInterval(this.interval);
			return;
		}
	};

	collisionDonutLauncher = () => {
		if (
			this.state.selmaPos.positionY < this.state.positionY + 20 &&
			this.state.selmaPos.positionY > this.state.positionY - 50 &&
			this.state.selmaPos.positionX < this.state.relativePositionX + 500 &&
			this.state.selmaPos.positionX > this.state.relativePositionX &&
			this.state.selmaPos.status === "alive" &&
			this.donutCount() > 0
		) {
			this.state.selmaPos.status = "killed";
			clearInterval(this.intSelma);
			console.log('Kill Selma')
		}

		if (
			this.state.seymourPos.positionY < this.state.positionY + 20 &&
			this.state.seymourPos.positionY > this.state.positionY - 50 &&
			this.state.seymourPos.positionX < this.state.relativePositionX + 500 &&
			this.state.seymourPos.positionX > this.state.relativePositionX &&
			this.state.seymourPos.status === "alive" &&
			this.donutCount() > 0
		) {
			this.state.seymourPos.status = "killed";
			clearInterval(this.intSeymour);
			console.log('Kill Seymour')

		}
		if (
			this.state.grandpaPos.positionY < this.state.positionY + 20 &&
			this.state.grandpaPos.positionY > this.state.positionY - 50 &&
			this.state.grandpaPos.positionX < this.state.relativePositionX + 500 &&
			this.state.grandpaPos.positionX > this.state.relativePositionX &&
			this.state.grandpaPos.status === "alive" &&
			this.donutCount() > 0
		) {
			this.state.grandpaPos.status = "killed";
			clearInterval(this.intGrandpa);
			console.log('Kill Grandpa')
		}

		if (
			this.state.milhousePos.positionY < this.state.positionY + 20 &&
			this.state.milhousePos.positionY > this.state.positionY - 50 &&
			this.state.milhousePos.positionX < this.state.relativePositionX + 500 &&
			this.state.milhousePos.positionX > this.state.relativePositionX &&
			this.state.milhousePos.status === "alive" &&
			this.donutCount() > 0
		) {
			this.state.milhousePos.status = "killed";
			clearInterval(this.intMilhouse);
			console.log('Kill Milhouse')

		}
		this.state.obstaclePopped.map(item => {
			//console.log(item.positionObstacleX)
			if (
				item.positionObstacleY < this.state.positionY + 15 &&
				item.positionObstacleY > this.state.positionY - 50 &&
				item.positionObstacleX < this.state.relativePositionX + 500 &&
				item.positionObstacleX > this.state.relativePositionX &&
				item.status === "ground" &&
				this.donutCount() > 0
			) {
				item.status = "killed";
				console.log('Kill barril')
			}
		});

	};

	donutCount = () => {
		let donutCount = 10;
		this.state.donutPopped.map(item =>
			item.status === "picked"
				? (donutCount = donutCount + 1)
				: (donutCount = donutCount + 0)
		);

		return donutCount;
	};
	beerCount = (beerCountOrigin) => {
		let beerCount = beerCountOrigin;
		this.state.beerPopped.map(item =>
			item.status === "picked"
				? (beerCount = beerCount + 1)
				: (beerCount = beerCount + 0)

		);


		return beerCount;
	};
	obstacleCollisionCount = () => {
		let obstacleCount = 0;
		this.state.obstaclePopped.map(item =>
			item.status === "picked"
				? (obstacleCount = obstacleCount + 1)
				: (obstacleCount = obstacleCount + 0)
		);


		return obstacleCount;
	};

	throwingDonut = () => {
		this.setState({ gunSound: true });
		setTimeout(() => {
			this.setState({ gunSound: false });
		}, 500);
		this.setState({
			isThrowing: true
			// donutPopped: {...this.state.donutPopped, picked: false}
		});
		let donutIndex = this.state.donutPopped.findIndex(
			item => item.status === "picked"
		);
		if (donutIndex < 0) donutIndex = 0;
		const { donutPopped } = this.state;
		donutPopped[donutIndex].status = donutStatus.THROWN;
		// donutPopped[donutIndex].display = false;
		this.setState({ donutPopped });
		this.collisionDonutLauncher();
		// console.log("throw")
	};

	stopThrowingDonut = () => {
		this.setState({ isThrowing: false, displayDonut: false });
		// console.log("stopthrow")
	};

	gameLoop = () => {
		this.state.donutPopped.map(item => this.collisionDetection(item));
		this.state.beerPopped.map(item => this.collisionDetectionBeer(item));

		this.collisionBart(this.state.bartPos);
		this.state.obstaclePopped.map(item => {
			this.collisionDetectionObstacle(item);
		});
		this.collisionDetectionOpponent(this.state.selmaPos)
		this.collisionDetectionOpponent(this.state.seymourPos)
		this.collisionDetectionOpponent(this.state.milhousePos)
		this.collisionDetectionOpponent(this.state.grandpaPos)
		this.testLimitsOfMap();
	};

	hideButtons = () => {
		// MODAL
		clearInterval(this.interval);
		document.getElementById("root").className = "background_opacity";
	};


	toggleSounds = (stateSounds) => {
		this.setState({soundsPlay : stateSounds});
	}

	render() {
		// Modal
		let params = new URLSearchParams(this.props.location.search);

		const bgStyle = {
			backgroundPositionY: config.background.position,
			backgroundPositionX: -this.state.positionX / config.background.defilement,
			height: config.background.height
		};

		let diff1 = 3 + this.beerCount(this.state.beerCountOrigin) - this.obstacleCollisionCount();

		return (
			<div className="game" style={bgStyle}>
				<audio
					ref="audio_tag"
					src="http://www.allard-jacquin.com/simpsons2.mp3"
					controls
					autoPlay
					type="audio/mp3"
				/>
				<Grid
					isRunning={this.state.isRunning}
					isHomerRunningLeft={this.state.isHomerRunningLeft}
				/>

				<Selma
					positionSelmaX={this.state.selmaPos.positionX}
					positionSelmaY={this.state.selmaPos.positionY}
					defilement={this.state.defilement}
					status={this.state.selmaPos.status}
				/>
				<Seymour
					positionSeymourX={this.state.seymourPos.positionX}
					positionSeymourY={this.state.seymourPos.positionY}
					defilement={this.state.defilement}
					status={this.state.seymourPos.status}
				/>
				<Milhouse
					positionMilhouseX={this.state.milhousePos.positionX}
					positionMilhouseY={this.state.milhousePos.positionY}
					defilement={this.state.defilement}
					status={this.state.milhousePos.status}
				/>
				<Grandpa
					positionGrandpaX={this.state.grandpaPos.positionX}
					positionGrandpaY={this.state.grandpaPos.positionY}
					defilement={this.state.defilement}
					status={this.state.grandpaPos.status}
				/>
				<Donut
					donutPopped={this.state.donutPopped}
					donutPosition={this.state.defilement}
				/>
				<Beer
					beerPopped={this.state.beerPopped}
					beerPosition={this.state.defilement}
				/>
				<div id="obstacle_full">
					<Obstacle
						obstaclePopped={this.state.obstaclePopped}
						obstaclePosition={this.state.defilement}
					/>
				</div>
				<Bart
					positionBartX={
						this.state.bartPos.positionBartX + this.state.defilement
					}
					positionBartY={this.state.bartPos.positionBartY}
					bartSeBarreX={this.state.bartSeBarreX}
					bartSeBarreY={this.state.bartSeBarreY}
				/>
				<Homer
					positionX={this.state.positionX}
					positionY={this.state.positionY}
					isRunning={this.state.isRunning}
					isHomerRunningLeft={this.state.isHomerRunningLeft}
					donutCount={this.donutCount()}
					isThrowing={this.state.isThrowing}
					isDead={diff1}
					hue={this.state.homerCollisionHue}
				/>

				<DonutCounter donutCount={this.donutCount()} />
				<Health
					beerCounter={this.beerCount(this.state.beerCountOrigin)}
					obstCounter={this.obstacleCollisionCount()}
				/>

				<JoyWrapper
					setStep={this.setStep}
					startRunning={this.startRunning}
					stopRunning={this.stopRunning}
					toTheRight={this.toTheRight}
					toTheLeft={this.toTheLeft}
					toTheTop={this.toTheTop}
					toTheBottom={this.toTheBottom}
					displayJoystick={this.state.paused}
				/>

				<BoutonA
					throwingDonut={this.throwingDonut}
					stopThrowingDonut={this.stopThrowingDonut}
					displayButtonA={this.state.paused}
				/>

				<Timer pauseGame={this.pauseGame} seconds={this.state.seconds} />

				{params.get("modal") && (
					<Modal
						toggleSounds = {this.toggleSounds}
					  	getStateSounds={this.state.soundsPlay}
						close={() => {
							this.props.history.push(this.props.location.pathname);
						}}
						modal={this.props.location.search}
						origin={this.state.origin}
						resume={() => this.pauseGame()}
						hide={() => this.hideButtons()}
					/>
				)}
				{this.state.beerSound === true ? <Sound beerSound soundsPlay={this.state.soundsPlay} /> : ""}
				{this.state.obstSound === true ? <Sound obstSound soundsPlay={this.state.soundsPlay} /> : ""}
				{this.state.donutSound === true ? <Sound donutSound soundsPlay={this.state.soundsPlay} /> : ""}
				{this.state.opponentSound === true ? <Sound opponentSound soundsPlay={this.state.soundsPlay}/> : ""}
				{this.state.gunSound === true ? <Sound gunSound soundsPlay={this.state.soundsPlay}/> : ""}
			</div>
		);
	}
}

export default Game;
