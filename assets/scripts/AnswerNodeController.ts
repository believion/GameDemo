const { ccclass, property } = cc._decorator;

@ccclass
export class AnswerNode extends cc.Component {
  @property
  isCorrect: boolean = false; // Indicates if the answer is correct or not

  @property(cc.Node)
  targetPosition: cc.Node = null; // The target position to tween to when the answer is correct

  // Method to play the animation based on correctness
  playAnimation(isCorrect: boolean) {
    if (isCorrect) {
      this.playCorrectAnimation();
    } else {
      this.playWrongAnimation();
    }
  }

  private playCorrectAnimation() {
    if (this.targetPosition) {
      cc.tween(this.node)
        .to(0.5, { position: this.targetPosition.position })
        .start();
    }
  }

  private playWrongAnimation() {
    const shake = cc.sequence(
      cc.moveBy(0.05, cc.v2(10, 0)),
      cc.moveBy(0.05, cc.v2(-20, 0)),
      cc.moveBy(0.05, cc.v2(20, 0)),
      cc.moveBy(0.05, cc.v2(-10, 0))
    );

    this.node.runAction(shake);
  }
}
