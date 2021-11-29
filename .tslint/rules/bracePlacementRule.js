"use strict";
// tslint:disable: no-submodule-imports file-name-casing
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rule = void 0;
// HACK: Resolve imports from the same `node_modules` folder as the running `tslint` instance.
if (require.main) {
    module.paths.unshift(...require.main.paths);
}
// tslint:disable: no-require-imports
const ts = require("typescript");
const tslint = require("tslint/lib");
// tslint:enable
const OPTION_ALLOW_SINGLE_LINE_BLOCKS = "allow-single-line-blocks";
/**
 * Represents a custom TSLint rule for validating that braces are placed on separate lines.
 * Note the configuration option, which allows single-line blocks - you probably want to enable this.
 */
class Rule extends tslint.Rules.AbstractRule {
    apply(sourceFile) {
        const oneLineWalker = new OneLineWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(oneLineWalker);
    }
}
exports.Rule = Rule;
Rule.OPEN_BRACE_FAILURE_STRING = "misplaced opening brace";
Rule.CLOSE_BRACE_FAILURE_STRING = "misplaced closing brace";
Rule.CATCH_FAILURE_STRING = "misplaced 'catch'";
Rule.FINALLY_FAILURE_STRING = "misplaced 'finally'";
Rule.ELSE_FAILURE_STRING = "misplaced 'else'";
Rule.WHILE_FAILURE_STRING = "misplaced 'while'";
class OneLineWalker extends tslint.RuleWalker {
    visitIfStatement(node) {
        const sourceFile = node.getSourceFile();
        const thenStatement = node.thenStatement;
        if (thenStatement.kind === ts.SyntaxKind.Block) {
            const expressionCloseParen = node.getChildAt(3);
            const thenOpeningBrace = thenStatement.getChildAt(0);
            const thenClosingBrace = thenStatement.getChildAt(node.thenStatement.getChildCount() - 1);
            this.handleOpeningAndClosingBrace(expressionCloseParen, thenOpeningBrace, thenClosingBrace);
        }
        const elseStatement = node.elseStatement;
        if (elseStatement != null) {
            const elseKeyword = this.getFirstChildOfKind(node, ts.SyntaxKind.ElseKeyword);
            if (elseStatement.kind === ts.SyntaxKind.Block) {
                const elseOpeningBrace = elseStatement.getChildAt(0);
                const thenClosingBrace = elseStatement.getChildAt(elseStatement.getChildCount() - 1);
                this.handleOpeningAndClosingBrace(elseKeyword, elseOpeningBrace, thenClosingBrace);
            }
            const thenStatementEndLine = sourceFile.getLineAndCharacterOfPosition(thenStatement.getEnd()).line;
            const elseKeywordLine = sourceFile.getLineAndCharacterOfPosition(elseKeyword.getStart()).line;
            if (thenStatementEndLine === elseKeywordLine) {
                this.addFailureAt(elseKeyword.getStart(), elseKeyword.getWidth(), Rule.ELSE_FAILURE_STRING);
            }
        }
        super.visitIfStatement(node);
    }
    visitCatchClause(node) {
        const catchKeyword = node.getChildAt(0);
        const catchOpeningBrace = node.block.getChildAt(0);
        const catchClosingBrace = node.block.getChildAt(node.block.getChildCount() - 1);
        this.handleOpeningAndClosingBrace(catchKeyword, catchOpeningBrace, catchClosingBrace);
        super.visitCatchClause(node);
    }
    customVisitFinallyClause(finallyKeyword, finallyBlock) {
        const catchOpeningBrace = finallyBlock.getChildAt(0);
        const catchClosingBrace = finallyBlock.getChildAt(finallyBlock.getChildCount() - 1);
        this.handleOpeningAndClosingBrace(finallyKeyword, catchOpeningBrace, catchClosingBrace);
    }
    visitTryStatement(node) {
        const sourceFile = node.getSourceFile();
        const catchClause = node.catchClause;
        const finallyBlock = node.finallyBlock;
        const tryKeyword = node.getChildAt(0);
        const tryBlock = node.tryBlock;
        const tryOpeningBrace = tryBlock.getChildAt(0);
        const tryClosingBrace = tryBlock.getChildAt(tryBlock.getChildCount() - 1);
        const tryClosingBraceLine = sourceFile.getLineAndCharacterOfPosition(tryClosingBrace.getEnd()).line;
        this.handleOpeningAndClosingBrace(tryKeyword, tryOpeningBrace, tryClosingBrace);
        if (catchClause != null) {
            const catchKeyword = catchClause.getChildAt(0);
            const catchKeywordLine = sourceFile.getLineAndCharacterOfPosition(catchKeyword.getStart()).line;
            if (tryClosingBraceLine === catchKeywordLine) {
                this.addFailureAt(catchKeyword.getStart(), catchKeyword.getWidth(), Rule.CATCH_FAILURE_STRING);
            }
        }
        if (finallyBlock != null) {
            // HACK: The `findChildOfKind` method is marked as internal, but it's there and is used for this purpose:
            // https://github.com/Microsoft/TypeScript/blob/65125791d2692a54e5eb4183846486993e38040e/src/services/documentHighlights.ts#L489
            const finallyKeyword = ts.findChildOfKind(node, ts.SyntaxKind.FinallyKeyword, sourceFile);
            const finallyKeywordLine = sourceFile.getLineAndCharacterOfPosition(finallyKeyword.getStart()).line;
            if (tryClosingBraceLine === finallyKeywordLine) {
                this.addFailureAt(finallyKeyword.getStart(), finallyKeyword.getWidth(), Rule.FINALLY_FAILURE_STRING);
            }
            if (catchClause != null) {
                const catchBlock = catchClause.block;
                const catchClosingBrace = catchBlock.getChildAt(tryBlock.getChildCount() - 1);
                const catchClosingBraceLine = sourceFile.getLineAndCharacterOfPosition(catchClosingBrace.getEnd()).line;
                if (catchClosingBraceLine === finallyKeywordLine) {
                    this.addFailureAt(finallyKeyword.getStart(), finallyKeyword.getWidth(), Rule.FINALLY_FAILURE_STRING);
                }
            }
            // HACK: There's currently no 'visitFinallyClause' method in TSLint, so for now, we have to explicitly call a custom method.
            this.customVisitFinallyClause(finallyKeyword, finallyBlock);
        }
        super.visitTryStatement(node);
    }
    visitForStatement(node) {
        this.handleIterationStatement(node);
        super.visitForStatement(node);
    }
    visitForInStatement(node) {
        this.handleIterationStatement(node);
        super.visitForInStatement(node);
    }
    visitForOfStatement(node) {
        this.handleIterationStatement(node);
        super.visitForOfStatement(node);
    }
    visitWhileStatement(node) {
        this.handleIterationStatement(node);
        super.visitWhileStatement(node);
    }
    visitBinaryExpression(node) {
        const rightkind = node.right.kind;
        const opkind = node.operatorToken.kind;
        if (opkind === ts.SyntaxKind.EqualsToken && rightkind === ts.SyntaxKind.ObjectLiteralExpression) {
            const equalsToken = node.getChildAt(1);
            const openBraceToken = node.right.getChildAt(0);
            const closeBraceToken = node.right.getChildAt(node.right.getChildCount() - 1);
            this.handleOpeningAndClosingBrace(equalsToken, openBraceToken, closeBraceToken);
        }
        super.visitBinaryExpression(node);
    }
    visitVariableDeclaration(node) {
        const initializer = node.initializer;
        if (initializer != null && initializer.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            const equalsToken = node.getChildAt(1);
            const openBraceToken = initializer.getChildAt(0);
            const closeBraceToken = initializer.getChildAt(initializer.getChildCount() - 1);
            this.handleOpeningAndClosingBrace(equalsToken, openBraceToken, closeBraceToken);
        }
        super.visitVariableDeclaration(node);
    }
    visitDoStatement(node) {
        const doKeyword = node.getChildAt(0);
        const statement = node.statement;
        if (statement.kind === ts.SyntaxKind.Block) {
            const openBraceToken = statement.getChildAt(0);
            const closeBraceToken = statement.getChildAt(statement.getChildCount() - 1);
            this.handleOpeningAndClosingBrace(doKeyword, openBraceToken, closeBraceToken);
            this.handleWhileAfterDoClosingBrace(doKeyword, openBraceToken, closeBraceToken);
        }
        super.visitDoStatement(node);
    }
    visitModuleDeclaration(node) {
        const nameNode = node.name;
        const body = node.body;
        if (body != null && body.kind === ts.SyntaxKind.ModuleBlock) {
            const openBraceToken = body.getChildAt(0);
            const closeBraceToken = body.getChildAt(body.getChildCount() - 1);
            this.handleOpeningAndClosingBrace(nameNode, openBraceToken, closeBraceToken);
        }
        super.visitModuleDeclaration(node);
    }
    visitEnumDeclaration(node) {
        const nameNode = node.name;
        const openBraceToken = this.getFirstChildOfKind(node, ts.SyntaxKind.OpenBraceToken);
        const closeBraceToken = this.getLastChildOfKind(node, ts.SyntaxKind.CloseBraceToken);
        this.handleOpeningAndClosingBrace(nameNode, openBraceToken, closeBraceToken);
        super.visitEnumDeclaration(node);
    }
    visitSwitchStatement(node) {
        const closeParenToken = node.getChildAt(3);
        const openBraceToken = node.caseBlock.getChildAt(0);
        const closeBraceToken = node.caseBlock.getChildAt(node.caseBlock.getChildCount() - 1);
        this.handleOpeningAndClosingBrace(closeParenToken, openBraceToken, closeBraceToken);
        super.visitSwitchStatement(node);
    }
    visitInterfaceDeclaration(node) {
        this.handleClassLikeDeclaration(node);
        super.visitInterfaceDeclaration(node);
    }
    visitClassDeclaration(node) {
        this.handleClassLikeDeclaration(node);
        super.visitClassDeclaration(node);
    }
    visitFunctionDeclaration(node) {
        this.handleFunctionLikeDeclaration(node);
        super.visitFunctionDeclaration(node);
    }
    visitMethodDeclaration(node) {
        this.handleFunctionLikeDeclaration(node);
        super.visitMethodDeclaration(node);
    }
    visitConstructorDeclaration(node) {
        this.handleFunctionLikeDeclaration(node);
        super.visitConstructorDeclaration(node);
    }
    visitArrowFunction(node) {
        const body = node.body;
        if (body != null && body.kind === ts.SyntaxKind.Block) {
            const arrowToken = this.getFirstChildOfKind(node, ts.SyntaxKind.EqualsGreaterThanToken);
            const openBraceToken = node.body.getChildAt(0);
            const closeBraceToken = node.body.getChildAt(node.body.getChildCount() - 1);
            this.handleOpeningAndClosingBrace(arrowToken, openBraceToken, closeBraceToken);
        }
        super.visitArrowFunction(node);
    }
    handleFunctionLikeDeclaration(node) {
        const body = node.body;
        if (body != null && body.kind === ts.SyntaxKind.Block) {
            const openBraceToken = body.getChildAt(0);
            const closeBraceToken = body.getChildAt(body.getChildCount() - 1);
            if (node.type != null) {
                this.handleOpeningAndClosingBrace(node.type, openBraceToken, closeBraceToken);
            }
            else {
                const closeParenToken = this.getFirstChildOfKind(node, ts.SyntaxKind.CloseParenToken);
                this.handleOpeningAndClosingBrace(closeParenToken, openBraceToken, closeBraceToken);
            }
        }
    }
    handleClassLikeDeclaration(node) {
        let lastNodeOfDeclaration = node.name;
        const openBraceToken = this.getFirstChildOfKind(node, ts.SyntaxKind.OpenBraceToken);
        const closeBraceToken = this.getLastChildOfKind(node, ts.SyntaxKind.CloseBraceToken);
        if (node.heritageClauses != null) {
            lastNodeOfDeclaration = node.heritageClauses[node.heritageClauses.length - 1];
        }
        else if (node.typeParameters != null) {
            lastNodeOfDeclaration = node.typeParameters[node.typeParameters.length - 1];
        }
        this.handleOpeningAndClosingBrace(lastNodeOfDeclaration, openBraceToken, closeBraceToken);
    }
    handleIterationStatement(node) {
        const closeParenToken = node.getChildAt(node.getChildCount() - 2);
        const statement = node.statement;
        if (statement.kind === ts.SyntaxKind.Block) {
            const openBraceToken = statement.getChildAt(0);
            const closeBraceToken = statement.getChildAt(statement.getChildCount() - 1);
            this.handleOpeningAndClosingBrace(closeParenToken, openBraceToken, closeBraceToken);
        }
    }
    handleOpeningAndClosingBrace(previousNode, openBraceToken, closeBraceToken) {
        if (previousNode == null || openBraceToken == null || closeBraceToken == null) {
            return;
        }
        const sourceFile = previousNode.getSourceFile();
        const previousNodeLine = sourceFile.getLineAndCharacterOfPosition(previousNode.getEnd()).line;
        const openBraceLine = sourceFile.getLineAndCharacterOfPosition(openBraceToken.getStart()).line;
        const closeBraceLine = sourceFile.getLineAndCharacterOfPosition(closeBraceToken.getStart()).line;
        if (previousNodeLine === openBraceLine && (!this.hasOption(OPTION_ALLOW_SINGLE_LINE_BLOCKS) || openBraceLine !== closeBraceLine)) {
            this.addFailureAt(openBraceToken.getStart(), openBraceToken.getWidth(), Rule.OPEN_BRACE_FAILURE_STRING);
        }
        if (openBraceLine !== closeBraceLine) {
            const closeBraceLineStart = sourceFile.getPositionOfLineAndCharacter(closeBraceLine, 0);
            const textBeforeCloseBrace = sourceFile.text.substring(closeBraceLineStart, closeBraceToken.getStart());
            const failureMatch = textBeforeCloseBrace.match(/[^\s]/);
            if (failureMatch) {
                this.addFailureAt(closeBraceToken.getStart(), closeBraceToken.getWidth(), Rule.CLOSE_BRACE_FAILURE_STRING);
            }
        }
    }
    handleWhileAfterDoClosingBrace(doNode, openBraceToken, closeBraceToken) {
        if (doNode == null || openBraceToken == null || closeBraceToken == null) {
            return;
        }
        const sourceFile = doNode.getSourceFile();
        const openBraceLine = sourceFile.getLineAndCharacterOfPosition(openBraceToken.getStart()).line;
        const closeBraceLine = sourceFile.getLineAndCharacterOfPosition(closeBraceToken.getStart()).line;
        if (openBraceLine !== closeBraceLine) {
            const nextLineStart = sourceFile.getPositionOfLineAndCharacter(closeBraceLine + 1, 0);
            const textAfterCloseBrace = sourceFile.text.substring(closeBraceToken.getStart() + 1, nextLineStart);
            const failureMatch = textAfterCloseBrace.match(/(\s*)while[\s(]/);
            if (failureMatch) {
                const failureStart = closeBraceToken.getStart() + failureMatch[1].length + 1;
                const failureWidth = closeBraceToken.getWidth() + failureMatch[1].length + 1;
                this.addFailureAt(failureStart, failureWidth, Rule.WHILE_FAILURE_STRING);
            }
        }
    }
    getFirstChildOfKind(node, kind) {
        const matches = node.getChildren().filter((child) => child.kind === kind);
        return matches[0];
    }
    getLastChildOfKind(node, kind) {
        const matches = node.getChildren().filter((child) => child.kind === kind);
        return matches[matches.length - 1];
    }
}
//# sourceMappingURL=bracePlacementRule.js.map