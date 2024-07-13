import { AmbientableNodeStructure, ExportableNodeStructure } from "../base";
import { KindedStructure, Structure } from "../Structure.generated";
import { StructureKind } from "../StructureKind";
import { ClassLikeDeclarationBaseStructure } from "./base";

export interface ClassDeclarationStructure
  extends Structure, ClassLikeDeclarationBaseStructure, ClassDeclarationSpecificStructure, AmbientableNodeStructure, ExportableNodeStructure
{
  /**
   * The class name.
   * @remarks Can be undefined. For example: `export default class { ... }`
   */
  name?: string;
}

export interface ClassDeclarationSpecificStructure extends KindedStructure<StructureKind.Class> {
}
