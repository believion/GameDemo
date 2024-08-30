// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class OptionController extends cc.Component {
  @property(cc.Boolean)
  public isCorrect: boolean = false;

  @property(cc.Node)
  public targetPosition: cc.Node = null;

  protected onLoad(): void {
    this.node.zIndex = -2;
  }

  public playRightAnim() {
    if (this.targetPosition) {
      cc.tween(this.node)
        .to(0.5, { position: this.targetPosition.position })
        .start();
    }
  }

  public playWrongAnim() {
    const shake = cc.sequence(
      cc.moveBy(0.05, cc.v2(10, 0)),
      cc.moveBy(0.05, cc.v2(-20, 0)),
      cc.moveBy(0.05, cc.v2(20, 0)),
      cc.moveBy(0.05, cc.v2(-10, 0))
    );

    this.node.runAction(shake);
  }
}
