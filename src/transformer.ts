import * as ts from "typescript";
import * as jts from "typescript-json-schema";
// import Enjoi from "enjoi";
// import path from "path";

export default (program: ts.Program): ts.TransformerFactory<ts.SourceFile> => {
  return (ctx: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile): ts.SourceFile => {
      const visitor = (node: ts.Node): ts.Node => {
        return ts.visitEachChild(visitNode(node, program), visitor, ctx);
      };
      return ts.visitEachChild(
        visitNode(sourceFile, program),
        visitor,
        ctx
      ) as ts.SourceFile;
    };
  };
};

const visitNode = (node: ts.Node, program: ts.Program): ts.Node => {
  const typeChecker = program.getTypeChecker();
  if (!isSchemaCallExpression(node, typeChecker)) return node;
  const callType = getCallType(node, typeChecker);
  if (!callType) return node;
  const { typeArguments } = node;
  if (!typeArguments) return node;
  const thatType = typeArguments[0];
  // 处理两种情况：
  // 1. 是一个类型引用，直接求值
  // 2. 是一个泛型，这种情况下先给泛型一个alias，但现在先不处理了
  // TODO: 处理是泛型的情况
  const isGeneraic = "typeArguments" in thatType;
  if (isGeneraic) {
    throw new Error("not support generaic type now, need help!");
  }
  const schema = jts.generateSchema(program, thatType.getFullText());
  if (callType === "schemaOf") {
    return ts.createStringLiteral(JSON.stringify(schema));
  }
  if (callType === "validatorOf") {
    return createValidatorCall(JSON.stringify(schema));
  }
  if (callType === "factoryOf") {
    return createFactoryCall(JSON.stringify(schema));
  }
  return node;
};

const isSchemaCallExpression = (
  node: ts.Node,
  typeChecker: ts.TypeChecker
): node is ts.CallExpression => {
  if (!ts.isCallExpression(node)) return false;
  const signature = typeChecker.getResolvedSignature(node);
  if (typeof signature === "undefined") return false;
  const { declaration } = signature;
  return (
    !!declaration &&
    !ts.isJSDocSignature(declaration) &&
    !!declaration.name &&
    ["schemaOf", "validatorOf", "factoryOf"].includes(
      declaration.name.getText()
    )
  );
};

const getCallType = (
  node: ts.CallExpression,
  typeChecker: ts.TypeChecker
): string | false => {
  const signature = typeChecker.getResolvedSignature(node);
  if (typeof signature === "undefined") return false;
  const { declaration } = signature;
  return (
    !!declaration &&
    !ts.isJSDocSignature(declaration) &&
    !!declaration.name &&
    declaration.name.getText()
  );
};

const createFactoryCall = (schemaString: string) => {
  return ts.createCall(
    ts.createPropertyAccess(
      ts.createCall(
        ts.createPropertyAccess(
          ts.createCall(
            ts.createToken(ts.SyntaxKind.ImportKeyword) as any,
            undefined,
            [ts.createStringLiteral("json-schema-faker")]
          ),
          ts.createIdentifier("then")
        ),
        undefined,
        [
          ts.createArrowFunction(
            undefined,
            undefined,
            [
              ts.createParameter(
                undefined,
                undefined,
                undefined,
                ts.createIdentifier("x"),
                undefined,
                undefined,
                undefined
              )
            ],
            undefined,
            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            ts.createBinary(
              ts.createPropertyAccess(
                ts.createIdentifier("x"),
                ts.createIdentifier("default")
              ),
              ts.createToken(ts.SyntaxKind.BarBarToken),
              ts.createIdentifier("x")
            )
          )
        ]
      ),
      ts.createIdentifier("then")
    ),
    undefined,
    [
      ts.createArrowFunction(
        undefined,
        undefined,
        [
          ts.createParameter(
            undefined,
            undefined,
            undefined,
            ts.createIdentifier("jsf"),
            undefined,
            undefined,
            undefined
          )
        ],
        undefined,
        ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        ts.createArrowFunction(
          undefined,
          undefined,
          [],
          undefined,
          ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          ts.createBinary(
            ts.createCall(
              ts.createPropertyAccess(
                ts.createIdentifier("jsf"),
                ts.createIdentifier("option")
              ),
              undefined,
              [ts.createStringLiteral("alwaysFakeOptionals"), ts.createTrue()]
            ),
            ts.createToken(ts.SyntaxKind.CommaToken),
            ts.createCall(
              ts.createPropertyAccess(
                ts.createIdentifier("jsf"),
                ts.createIdentifier("generate")
              ),
              undefined,
              [
                ts.createCall(
                  ts.createPropertyAccess(
                    ts.createIdentifier("JSON"),
                    ts.createIdentifier("parse")
                  ),
                  undefined,
                  [ts.createStringLiteral(schemaString)]
                )
              ]
            )
          )
        )
      )
    ]
  );
};

const createValidatorCall = (schemaString: string) => {
  return ts.createCall(
    ts.createPropertyAccess(
      ts.createCall(
        ts.createPropertyAccess(
          ts.createCall(
            ts.createPropertyAccess(
              ts.createIdentifier("Promise"),
              ts.createIdentifier("all")
            ),
            undefined,
            [
              ts.createArrayLiteral(
                [
                  ts.createCall(
                    ts.createToken(ts.SyntaxKind.ImportKeyword) as any,
                    undefined,
                    [ts.createStringLiteral("enjoi")]
                  ),
                  ts.createCall(
                    ts.createToken(ts.SyntaxKind.ImportKeyword) as any,
                    undefined,
                    [ts.createStringLiteral("joi")]
                  )
                ],
                false
              )
            ]
          ),
          ts.createIdentifier("then")
        ),
        undefined,
        [
          ts.createArrowFunction(
            undefined,
            undefined,
            [
              ts.createParameter(
                undefined,
                undefined,
                undefined,
                ts.createArrayBindingPattern([
                  ts.createBindingElement(
                    undefined,
                    undefined,
                    ts.createIdentifier("x"),
                    undefined
                  ),
                  ts.createBindingElement(
                    undefined,
                    undefined,
                    ts.createIdentifier("y"),
                    undefined
                  )
                ]),
                undefined,
                undefined,
                undefined
              )
            ],
            undefined,
            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            ts.createArrayLiteral(
              [
                ts.createBinary(
                  ts.createPropertyAccess(
                    ts.createIdentifier("x"),
                    ts.createIdentifier("default")
                  ),
                  ts.createToken(ts.SyntaxKind.BarBarToken),
                  ts.createIdentifier("x")
                ),
                ts.createBinary(
                  ts.createPropertyAccess(
                    ts.createIdentifier("y"),
                    ts.createIdentifier("default")
                  ),
                  ts.createToken(ts.SyntaxKind.BarBarToken),
                  ts.createIdentifier("y")
                )
              ],
              false
            )
          )
        ]
      ),
      ts.createIdentifier("then")
    ),
    undefined,
    [
      ts.createArrowFunction(
        undefined,
        undefined,
        [
          ts.createParameter(
            undefined,
            undefined,
            undefined,
            ts.createArrayBindingPattern([
              ts.createBindingElement(
                undefined,
                undefined,
                ts.createIdentifier("Enjoi"),
                undefined
              ),
              ts.createBindingElement(
                undefined,
                undefined,
                ts.createIdentifier("Joi"),
                undefined
              )
            ]),
            undefined,
            undefined,
            undefined
          )
        ],
        undefined,
        ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        ts.createArrowFunction(
          undefined,
          undefined,
          [
            ts.createParameter(
              undefined,
              undefined,
              undefined,
              ts.createIdentifier("f"),
              undefined,
              undefined,
              undefined
            )
          ],
          undefined,
          ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          ts.createBlock(
            [
              ts.createVariableStatement(
                undefined,
                ts.createVariableDeclarationList(
                  [
                    ts.createVariableDeclaration(
                      ts.createObjectBindingPattern([
                        ts.createBindingElement(
                          undefined,
                          undefined,
                          ts.createIdentifier("error"),
                          undefined
                        ),
                        ts.createBindingElement(
                          undefined,
                          undefined,
                          ts.createIdentifier("value"),
                          undefined
                        )
                      ]),
                      undefined,
                      ts.createCall(
                        ts.createPropertyAccess(
                          ts.createIdentifier("Joi"),
                          ts.createIdentifier("validate")
                        ),
                        undefined,
                        [
                          ts.createIdentifier("f"),
                          ts.createCall(
                            ts.createPropertyAccess(
                              ts.createIdentifier("Enjoi"),
                              ts.createIdentifier("schema")
                            ),
                            undefined,
                            [
                              ts.createCall(
                                ts.createPropertyAccess(
                                  ts.createIdentifier("JSON"),
                                  ts.createIdentifier("parse")
                                ),
                                undefined,
                                [ts.createStringLiteral(schemaString)]
                              )
                            ]
                          )
                        ]
                      )
                    )
                  ],
                  ts.NodeFlags.Const
                )
              ),
              ts.createReturn(
                ts.createPrefix(
                  ts.SyntaxKind.ExclamationToken,
                  ts.createIdentifier("error")
                )
              )
            ],
            true
          )
        )
      )
    ]
  );
};
