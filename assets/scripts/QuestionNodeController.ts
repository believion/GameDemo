import { AnswerNode } from "./AnswerNodeController";

const { ccclass, property } = cc._decorator;

@ccclass
export class QuestionNodeController extends cc.Component {
  private isDragging: boolean = false;
  private line: cc.Graphics = null;

  @property(AnswerNode)
  public options: AnswerNode[] = [];

  onLoad() {
    // Create a child node for the line drawing to avoid interfering with the main node's rendering
    const lineNode = new cc.Node("LineNode");
    this.node.parent.addChild(lineNode); // Add the line node to the same parent as the QuestionNode
    lineNode.setSiblingIndex(this.node.getSiblingIndex() - 1); // Ensure the line is drawn behind the QuestionNode

    // Position the lineNode at the origin, so the drawing coordinates align with the parent node's space
    lineNode.setPosition(cc.v2(0, 0));
    lineNode.zIndex = -2;

    // Add a Graphics component to the lineNode for drawing the line
    this.line = lineNode.addComponent(cc.Graphics);
    this.line.lineWidth = 5; // Set line width
    this.line.strokeColor = cc.Color.WHITE; // Set line color to white

    // Set up touch event listeners
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
      const endPos = this.node.parent.convertToNodeSpaceAR(event.getLocation()); // Convert the touch position to the node's space

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

    // Check if the drop position is on any of the answer nodes
    let found = false;
    this.node.parent.children.forEach((child) => {
      if (child instanceof cc.Node && child.getComponent(AnswerNode)) {
        const answerNode = child.getComponent(AnswerNode);
        if (this.isDropOnNode(answerNode.node, dropPos)) {
          found = true;
          answerNode.playAnimation(answerNode.isCorrect);
        }
      }
    });

    if (!found) {
      console.log("No valid drop detected.");
    }
  }

  isDropOnNode(targetNode: cc.Node, position: cc.Vec2): boolean {
    const boundingBox = targetNode.getBoundingBox();
    return boundingBox.contains(position);
  }
}
