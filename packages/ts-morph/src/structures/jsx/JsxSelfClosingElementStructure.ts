import { KindedStructure, Structure } from "../Structure.generated";
import { StructureKind } from "../StructureKind";
import { JsxAttributedNodeStructure, JsxTagNamedNodeStructure } from "./base";

export interface JsxSelfClosingElementStructure
  extends Structure, JsxTagNamedNodeStructure, JsxSelfClosingElementSpecificStructure, JsxAttributedNodeStructure
{
}

export interface JsxSelfClosingElementSpecificStructure extends KindedStructure<StructureKind.JsxSelfClosingElement> {
}
