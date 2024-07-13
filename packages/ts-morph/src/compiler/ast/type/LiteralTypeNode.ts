import { ts } from "@ts-morph/common";
import { BooleanLiteral } from "../aliases";
import { LiteralExpression, PrefixUnaryExpression } from "../expression";
import { NullLiteral } from "../literal";
import { TypeNode } from "./TypeNode";

export class LiteralTypeNode extends TypeNode<ts.LiteralTypeNode> {
  /**
   * Gets the literal type node's literal.
   */
  getLiteral(): NullLiteral | BooleanLiteral | LiteralExpression | PrefixUnaryExpression {
    // this statement is to be notified in case this changes
    const tsLiteral: ts.NullLiteral | ts.BooleanLiteral | ts.LiteralExpression | ts.PrefixUnaryExpression = this.compilerNode.literal;
    return this._getNodeFromCompilerNode(tsLiteral);
  }
}
