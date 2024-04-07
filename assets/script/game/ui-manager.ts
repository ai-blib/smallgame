/**
 * Copyright (c) 2019 Xiamen Yaji Software Co.Ltd. All rights reserved.
 * Created by daisy on 2019/06/25.
 */
import { _decorator, Component, Node,Label} from "cc";
import { Constants } from "../data/constants";
const { ccclass, property } = _decorator;

@ccclass("UIManager")
export class UIManager extends Component {
    @property(Node)
    pageStart: Node = null!;
    @property(Node)
    pageResult: Node = null!;
    
    @property(Label)
    pageLevel: Label = null!

    @property(Label)
    currentLevel: Label = null!

    @property(Node)
    gameLevelResult: Node = null!;

    onLoad(){
        Constants.game.uiManager = this;
    }

    start () {
        this.pageResult.active = false;
        this.gameLevelResult.active = false;
        this.currentLevel.string =`当前关卡：${Constants.LEVEL.toString()}` ;

    }
    
    get levelResultActive(){
        return this.gameLevelResult.active
    }

    showGameLevelResult(visible:boolean){
        this.currentLevel.string =`当前关卡：${Constants.LEVEL.toString()}` ;

        if(visible){
            Constants.LEVEL+=1;
        }
        this.pageLevel.string =`下一关：${Constants.LEVEL.toString()}` ;

        this.gameLevelResult.active = visible;
    }

    showDialog(isMain: boolean, ...args: any[]){
        // if(!isMain){
        //     this.gameLevelResult.active = false;
        // }
        this.pageResult.active = !isMain;
        this.pageStart.active = isMain;
    }

}
