import {_decorator, Component, Node} from "cc";
import {Constants} from "../data/constants";
import {UpdateValueLabel} from "./update-value-label";
import {Revive} from "./revive";

const {ccclass, property} = _decorator;
let count =0
@ccclass("PageResult")
export class PageResult extends Component {
    @property({type: UpdateValueLabel})
    scoreLabel: UpdateValueLabel = null!;
    targetProgress: number = 0;

    @property(Node)
    nodeTips1: Node = null!;

    @property(Node)
    nodeTips2: Node = null!;

    @property(Node)
    result: Node = null!;

    init() {
        // this.targetProgress = 0;
        this.scoreLabel.playUpdateValue(this.targetProgress, this.targetProgress, 0);
        this.scoreLabel.isPlaying = false;

    }

    onEnable() {
        Constants.game.node.on(Constants.GAME_EVENT.HIDETIPS, this.hideTips, this);
        Constants.game.node.on(Constants.GAME_EVENT.ADDSCORE, this.addScore, this);
        Constants.game.node.on(Constants.GAME_EVENT.DYING, this.gameDie, this);
        Constants.game.node.on(Constants.GAME_EVENT.SETSCORE, this.setGameScore, this);

        this.showTips(true);
        this.showResult(false);
        this.init();
    }

    start() {
        const reviveComp = this.result.getComponent(Revive)!;
        reviveComp.pageResult = this;
    }

    onDisable() {
        Constants.game.node.off(Constants.GAME_EVENT.HIDETIPS, this.hideTips, this);
        Constants.game.node.off(Constants.GAME_EVENT.ADDSCORE, this.addScore, this);
    }

    setGameScore(score: number) {
        this.scoreLabel.string = String(score);
        this.targetProgress = score;
    }

    addScore(score: number) {
        this.targetProgress = score;
        let curProgress = Number(this.scoreLabel.string);
        this.scoreLabel.playUpdateValue(curProgress, this.targetProgress, 0);
    }

    gameDie() {
        this.showTips(false);
        // 不展示 结果弹窗
        // this.showResult(true);
    }

    showTips(show: boolean) {
        const visible = JSON.parse(localStorage.getItem('isShowTips') || 'false');
        if (show) {
            count++
            if (!visible && count===2) {
                this.nodeTips1.active = show;
                this.nodeTips2.active = show;

                localStorage.setItem('isShowTips', JSON.stringify(true));
            }
            if (visible){
                this.nodeTips1.active = false;
                this.nodeTips2.active = false;

            }
        } else {
            this.nodeTips1.active = show;
            this.nodeTips2.active = show;

        }
    }

    hideTips() {
        this.showTips(false);
    }

    showResult(isShow: boolean) {
        this.result.active = isShow;
    }
}
