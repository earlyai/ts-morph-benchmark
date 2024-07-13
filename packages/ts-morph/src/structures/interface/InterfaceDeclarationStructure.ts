import {
  AmbientableNodeStructure,
  ExportableNodeStructure,
  ExtendsClauseableNodeStructure,
  JSDocableNodeStructure,
  NamedNodeStructure,
  TypeElementMemberedNodeStructure,
  TypeParameteredNodeStructure,
} from "../base";
import { KindedStructure, Structure } from "../Structure.generated";
import { StructureKind } from "../StructureKind";

export interface InterfaceDeclarationStructure
  extends
    Structure,
    NamedNodeStructure,
    InterfaceDeclarationSpecificStructure,
    ExtendsClauseableNodeStructure,
    TypeParameteredNodeStructure,
    JSDocableNodeStructure,
    AmbientableNodeStructure,
    ExportableNodeStructure,
    TypeElementMemberedNodeStructure
{
}

export interface InterfaceDeclarationSpecificStructure extends KindedStructure<StructureKind.Interface> {
}
