/**
 * Copyright (c) 2019 Xiamen Yaji Software Co.Ltd. All rights reserved.
 * Created by daisy on 2019/06/25.
 */
import {_decorator, Component, instantiate, Node, Prefab} from "cc";
import {Constants} from "../data/constants";
import {Ball} from "./ball";
import {BoardManager} from "./board-manager";
import {CameraCtrl} from "./camera-ctrl";
import {UIManager} from "./ui-manager";
import {AudioManager} from "./audio-manager";
import {AddScore} from "db://assets/script/api/score";
import {getUrlParam} from '../utils/GetUrlParam'
import Iframe, {EVENT_TYPE, RECEIVE_EVENT_TYPE} from "db://assets/script/utils/iframe";

const {ccclass, property} = _decorator;

/**
 * @zh 游戏管理类，同时也是事件监听核心对象。
 */
@ccclass("Game")
export class Game extends Component {
    @property(Prefab)
    ballPref: Prefab = null!;
    @property(BoardManager)
    boardManager: BoardManager = null!;
    @property(CameraCtrl)
    cameraCtrl: CameraCtrl = null!;
    @property(UIManager)
    uiManager: UIManager = null!;
    @property(AudioManager)
    audioManager: AudioManager = null!;

    // There is no diamond in first board
    initFirstBoard = false;

    get ball() {
        return this._ball;
    }

    state = Constants.GAME_STATE.READY;
    score = 0;
    hasRevive = false;
    _ball: Ball = null!;

    __preload() {
        Constants.game = this;
    }

    onLoad() {

        if (!this.ballPref) {
            console.log('There is no ball!!');
            this.enabled = false;
            return;
        }

        const ball = instantiate(this.ballPref) as Node;
        // @ts-ignore
        ball.parent = this.node.parent;
        this._ball = ball.getComponent(Ball)!;
        // 游戏开始
        Iframe.start();
        Iframe.sendMessage(EVENT_TYPE.onGameStart);
        // 更新分数
        Iframe.addEventListener(RECEIVE_EVENT_TYPE.onSetScore, (message: string) => {
            this.score = Number(message);
            this.node.emit(Constants.GAME_EVENT.SETSCORE, this.score);
        })
        Iframe.addEventListener(RECEIVE_EVENT_TYPE.onPlayGame, (message: string) => {
            this.gameStart();
        })
        Iframe.addEventListener(RECEIVE_EVENT_TYPE.gameReset, (message: string) => {
            this.resetGame();
        })
        Iframe.addEventListener(RECEIVE_EVENT_TYPE.onCloseMusic, (message: string) => {
            if (message) {
                let isPlay = JSON.parse(message);
                if (isPlay) {
                    this.audioManager.playSound();
                } else {
                    this.audioManager.playSound(false);
                }
            }
        })
    }

    start() {
        this.node.on(Constants.GAME_EVENT.RESTART, this.gameStart, this);
        this.node.on(Constants.GAME_EVENT.REVIVE, this.gameRevive, this);

        this.node.on(Constants.GAME_EVENT.OPENLEVEL, this.openLevelResult, this);

    }

    onDestroy() {
        this.node.off(Constants.GAME_EVENT.RESTART, this.gameStart, this);
        this.node.off(Constants.GAME_EVENT.REVIVE, this.gameRevive, this);
        this.node.off(Constants.GAME_EVENT.OPENLEVEL, this.gameRevive, this);

    }

    openLevelResult() {
        if (!this.uiManager.levelResultActive) {
            this.uiManager.showGameLevelResult(true);
        }
    }

    // 游戏继续
    gameContinue() {

        this.uiManager.showDialog(false);
        this.uiManager.showGameLevelResult(false);
        this.state = Constants.GAME_STATE.PLAYING;
        this._ball.gameContinue();
        this.cameraCtrl.reset();
        this.boardManager.reset();
        this.uiManager.showGameLevelResult(false)
        // this.uiManager.showDialog(true);
    }


    resetGame() {
        this.state = Constants.GAME_STATE.READY;
        this._ball.reset();
        this.cameraCtrl.reset();
        this.boardManager.reset();
        this.uiManager.showGameLevelResult(false)
        this.uiManager.showDialog(true);
        // Iframe.sendMessage(EVENT_TYPE.onGameOver);

    }

    gameStart() {
        this.audioManager.playSound();
        this.uiManager.showDialog(false);
        this.state = Constants.GAME_STATE.PLAYING;
        this.hasRevive = false;
        this._ball.restLevel();
    }

    gameDie() {
        this.audioManager.playSound(false);
        this.state = Constants.GAME_STATE.PAUSE;
        const score = Constants.game.score;
        Iframe.sendMessage(EVENT_TYPE.onGameOver, this.score + '');
        this.node.emit(Constants.GAME_EVENT.DYING);
        this.gameOver();

    }

    gameOver() {
        this.state = Constants.GAME_STATE.OVER;
        this.audioManager.playSound(false);

        this.resetGame();
    }

    gameRevive() {
        this.hasRevive = true;
        this.state = Constants.GAME_STATE.READY;
        this.ball.revive();
        this.scheduleOnce(() => {
            this.audioManager.playSound();
            this.state = Constants.GAME_STATE.PLAYING;
        }, 1);
    }

    addScore(score: number) {
        this.score += score;
        Iframe.sendMessage(EVENT_TYPE.onAddScore, this.score + '');
        this.node.emit(Constants.GAME_EVENT.ADDSCORE, this.score);
    }
}
