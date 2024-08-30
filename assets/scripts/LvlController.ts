// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GAME_EVENTS } from "./constants/data";
import { EventSystem } from "./utils/EventSystem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LvlController extends cc.Component {
  @property(cc.Node)
  public levels: cc.Node[] = [];

  private currIndex: number = 0;

  @property(cc.Button)
  public nextBtn: cc.Button = null;

  protected onLoad(): void {
    this.levels.forEach((level) => {
      level.active = false;
    });
    this.levels[this.currIndex].active = true;
    this.toggleNextBtn(false);
  }

  protected onEnable(): void {
    EventSystem.getInstance().on(
      "correct",
      () => this.toggleNextBtn(true),
      this
    );
  }

  public toggleNextBtn(val: boolean) {
    this.nextBtn.node.active = val;
  }

  onClickNext() {
    this.levels[this.currIndex].active = false;
    this.currIndex++;
    this.levels[this.currIndex].active = true;
    this.toggleNextBtn(false);
  }
}
