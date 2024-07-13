import {
  CallExpression,
  CallLikeExpression,
  CallSignatureDeclaration,
  ClassDeclaration,
  ClassDeclarationStructure,
  ConstructSignatureDeclaration,
  createWrappedNode,
  Decorator,
  Diagnostic,
  DiagnosticMessageChain,
  Directory,
  EnumDeclaration,
  EnumMember,
  ExportAssignment,
  ExportDeclaration,
  ExportSpecifier,
  ExpressionWithTypeArguments,
  FileSystemHost,
  forEachStructureChild,
  FunctionDeclaration,
  GetAccessorDeclaration,
  Identifier,
  ImportDeclaration,
  ImportSpecifier,
  IndentationText,
  IndexSignatureDeclaration,
  InterfaceDeclaration,
  JSDoc,
  LanguageService,
  MethodDeclaration,
  MethodSignature,
  ModuleDeclaration,
  ModuleDeclarationKind,
  Node,
  NumericLiteral,
  ObjectLiteralExpression,
  ParameterDeclaration,
  Program,
  Project,
  PropertyAccessExpression,
  PropertyDeclaration,
  PropertySignature,
  QuoteKind,
  SetAccessorDeclaration,
  ShorthandPropertyAssignment,
  Signature,
  SourceFile,
  SourceFileStructure,
  SpreadAssignment,
  Structure,
  StructureKind,
  Structures,
  Symbol,
  SyntaxKind,
  ts,
  Type,
  TypeAliasDeclaration,
  TypeChecker,
  TypeFormatFlags,
  TypeNode,
  TypeParameterDeclaration,
  VariableDeclaration,
  VariableDeclarationKind,
  VariableStatement,
} from "../../packages/ts-morph/src/main";

let project: Project,
  node: Node,
  classDeclaration: ClassDeclaration,
  functionDeclaration: FunctionDeclaration,
  sourceFile: SourceFile,
  method: MethodDeclaration,
  decorator: Decorator,
  enumDeclaration: EnumDeclaration,
  enumMember: EnumMember,
  exportDeclaration: ExportDeclaration,
  namedExport: ExportSpecifier,
  importDeclaration: ImportDeclaration,
  namedImport: ImportSpecifier,
  interfaceDeclaration: InterfaceDeclaration,
  shorthandPropertyAssignment: ShorthandPropertyAssignment,
  spreadAssignment: SpreadAssignment,
  objectLiteralExpression: ObjectLiteralExpression,
  parameter: ParameterDeclaration,
  type: Type,
  symbol: Symbol,
  signature: Signature,
  moduleDeclaration: ModuleDeclaration,
  directory: Directory,
  diagnostic: Diagnostic,
  dmc: DiagnosticMessageChain,
  getAccessor: GetAccessorDeclaration,
  setAccessor: SetAccessorDeclaration,
  propertyDeclaration: PropertyDeclaration,
  jsDoc: JSDoc,
  exportAssignment: ExportAssignment,
  expressionWithTypeArgs: ExpressionWithTypeArguments,
  callExpression: CallExpression,
  functionOverload: FunctionDeclaration,
  identifier: Identifier,
  variableDeclaration: VariableDeclaration,
  constructSignature: ConstructSignatureDeclaration,
  callSignature: CallSignatureDeclaration,
  indexSignature: IndexSignatureDeclaration,
  methodSignature: MethodSignature,
  propertySignature: PropertySignature,
  typeAliasDeclaration: TypeAliasDeclaration,
  numericLiteral: NumericLiteral,
  variableStatement: VariableStatement,
  propertyAccessExpression: PropertyAccessExpression,
  languageService: LanguageService,
  program: Program,
  typeChecker: TypeChecker,
  typeParameter: TypeParameterDeclaration,
  callLikeExpression: CallLikeExpression;
