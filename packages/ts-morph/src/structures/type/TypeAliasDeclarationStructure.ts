import { WriterFunction } from "../../types";
import {
  AmbientableNodeStructure,
  ExportableNodeStructure,
  JSDocableNodeStructure,
  NamedNodeStructure,
  TypedNodeStructure,
  TypeParameteredNodeStructure,
} from "../base";
import { KindedStructure, Structure } from "../Structure.generated";
import { StructureKind } from "../StructureKind";

export interface TypeAliasDeclarationStructure
  extends
    Structure,
    TypeAliasDeclarationSpecificStructure,
    NamedNodeStructure,
    TypedNodeStructure,
    TypeParameteredNodeStructure,
    JSDocableNodeStructure,
    AmbientableNodeStructure,
    ExportableNodeStructure
{
  type: string | WriterFunction; // make required (from base)
}

export interface TypeAliasDeclarationSpecificStructure extends KindedStructure<StructureKind.TypeAlias> {
  type: string | WriterFunction; // make required (from base)
}
