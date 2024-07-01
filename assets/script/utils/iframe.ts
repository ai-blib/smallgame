export enum EVENT_TYPE {
    onGameStart = 'game_start',
    onGameOver = 'game_over',
    onGameScoreChange = 'game_score',
    onAddScore = 'add_score',
    onGoHome = 'on_go_home',

}

export enum RECEIVE_EVENT_TYPE {
    onSetScore = 'set_game_score',
    onPlayGame = 'play_game',
    gameReset = 'game_reset',
    onCloseMusic = 'close_music',
}

export default class Iframe {
    static Origin: string = window.location.origin;
    static callBacks: Array<{ type: RECEIVE_EVENT_TYPE; callback: Function }> = [];

    constructor() {

    }

    static trigger(type: RECEIVE_EVENT_TYPE, message?: string) {
        this.callBacks.forEach((item) => {
            if (item.type === type) {
                item.callback(message);
            }
        })
    }

    static start() {
        window.addEventListener('message', (event) => {
            if (event.origin !== this.Origin) {
                return;
            }
            const {type, data} = event.data;
            if ([RECEIVE_EVENT_TYPE.onSetScore, RECEIVE_EVENT_TYPE.onPlayGame, RECEIVE_EVENT_TYPE.gameReset, RECEIVE_EVENT_TYPE.onCloseMusic].indexOf(type) !== -1) {
                this.trigger(type, data)
            }
        })
    }

    static addEventListener(type: RECEIVE_EVENT_TYPE, callback: Function) {
        this.callBacks.push({type, callback});
    }

    static sendMessage(type: EVENT_TYPE, message?: string) {
        if (window.parent) {
            if (this.callBacks && [EVENT_TYPE.onAddScore, EVENT_TYPE.onGameStart, EVENT_TYPE.onGameOver, EVENT_TYPE.onGameScoreChange, EVENT_TYPE.onGoHome].indexOf(type) !== -1) {
                const eventData = {
                    type: type,
                    data: message,
                };
                window.parent.postMessage(eventData, this.Origin);
            }

        }
    }

}