// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventSystem } from "./utils/EventSystem";
import OptionController from "./OptionController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  private isDragging: boolean = false;
  private line: cc.Graphics = null;

  @property(OptionController)
  public options: OptionController[] = [];

  @property(cc.Node)
  public targetLocationQuestion: cc.Node = null;

  protected onLoad(): void {
    const lineNode = new cc.Node("LineNode");
    this.node.parent.addChild(lineNode);
    lineNode.zIndex = -1;

    lineNode.setPosition(cc.v2(0, 0));

    this.line = lineNode.addComponent(cc.Graphics);
    this.line.lineWidth = 5;
    this.line.strokeColor = cc.Color.WHITE;

    //setting up touch listeners
    this.node.on(cc.Node.EventType.TOUCH_START, this.startDrag, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.drag, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.endDrag, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.endDrag, this);
  }

  startDrag() {
    this.isDragging = true;
  }

  drag(event: cc.Event.EventTouch) {
    if (this.isDragging) {
      this.line.clear(); // Clear any previous line
      const startPos = this.node.getPosition(); // Start from the center of the QuestionNode
      const endPos = this.node.parent.convertToNodeSpaceAR(event.getLocation());

      // Draw the line from the center of the QuestionNode
      this.line.moveTo(startPos.x, startPos.y);
      this.line.lineTo(endPos.x, endPos.y);
      this.line.stroke(); // Draw the line
    }
  }

  endDrag(event: cc.Event.EventTouch) {
    this.isDragging = false;
    this.line.clear();

    const dropPos = this.node.parent.convertToNodeSpaceAR(event.getLocation());

    let found = false;
    this.options.forEach((option) => {
      if (this.isDropOnNode(option.node, dropPos)) {
        found = true;
        console.log("you clicked an option");
        if (!option.isCorrect) {
          option.playWrongAnim();
        } else {
          option.playRightAnim();
          this.disableAllWrongNodes();
          this.tweenToTarget();
          EventSystem.getInstance().emit("correct");
        }
      }
    });

    if (!found) {
      console.log("No Valid Drop Detected");
    }
  }

  isDropOnNode(targetNode: cc.Node, position: cc.Vec2): boolean {
    const boundingBox = targetNode.getBoundingBox();
    return boundingBox.contains(position);
  }

  disableAllWrongNodes() {
    this.options.forEach((option) => {
      if (!option.isCorrect) {
        option.node.active = false;
      }
    });
  }

  tweenToTarget() {
    if (this.targetLocationQuestion) {
      cc.tween(this.node)
        .to(0.5, { position: this.targetLocationQuestion.position })
        .start();
    }
  }
}
