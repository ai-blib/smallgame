import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import {Constants} from '../data/constants'
@ccclass('gameLevelResult')
export class gameLevelResult extends Component {
    @property(Node)
    pageContinue: Node = null!;
    @property(Node)
    gameOver: Node = null!;

    start() {

    }

    update(deltaTime: number) {
        
    }
    
    onGameContinueClick(){
        Constants.game.gameContinue()
    }
   
    onGameOverClick(){
        Constants.game.gameOver()
    }
}

