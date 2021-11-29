// tslint:disable: no-submodule-imports file-name-casing

// HACK: Resolve imports from the same `node_modules` folder as the running `tslint` instance.
if (require.main)
{
    module.paths.unshift(...require.main.paths);
}

// tslint:disable: no-require-imports
import ts = require("typescript");
import tslint = require("tslint/lib");
// tslint:enable

const OPTION_ALLOW_SINGLE_LINE_BLOCKS = "allow-single-line-blocks";

/**
 * Represents a custom TSLint rule for validating that braces are placed on separate lines.
 * Note the configuration option, which allows single-line blocks - you probably want to enable this.
 */
export class Rule extends tslint.Rules.AbstractRule
{
    public apply(sourceFile: ts.SourceFile): tslint.RuleFailure[]
    {
        const oneLineWalker = new OneLineWalker(sourceFile, this.getOptions());

        return this.applyWithWalker(oneLineWalker);
    }

    public static OPEN_BRACE_FAILURE_STRING = "misplaced opening brace";
    public static CLOSE_BRACE_FAILURE_STRING = "misplaced closing brace";
    public static CATCH_FAILURE_STRING = "misplaced 'catch'";
    public static FINALLY_FAILURE_STRING = "misplaced 'finally'";
    public static ELSE_FAILURE_STRING = "misplaced 'else'";
    public static WHILE_FAILURE_STRING = "misplaced 'while'";
}

class OneLineWalker extends tslint.RuleWalker
{
    public visitIfStatement(node: ts.IfStatement): void
    {
        const sourceFile = node.getSourceFile();
        const thenStatement = node.thenStatement;

        if (thenStatement.kind === ts.SyntaxKind.Block)
        {
            const expressionCloseParen = node.getChildAt(3);
            const thenOpeningBrace = thenStatement.getChildAt(0);
            const thenClosingBrace = thenStatement.getChildAt(node.thenStatement.getChildCount() - 1);
            this.handleOpeningAndClosingBrace(expressionCloseParen, thenOpeningBrace, thenClosingBrace);
        }

        const elseStatement = node.elseStatement;

        if (elseStatement != null)
        {
            const elseKeyword = this.getFirstChildOfKind(node, ts.SyntaxKind.ElseKeyword);

            if (elseStatement.kind === ts.SyntaxKind.Block)
            {
                const elseOpeningBrace = elseStatement.getChildAt(0);
                const thenClosingBrace = elseStatement.getChildAt(elseStatement.getChildCount() - 1);
                this.handleOpeningAndClosingBrace(elseKeyword, elseOpeningBrace, thenClosingBrace);
            }

            const thenStatementEndLine = sourceFile.getLineAndCharacterOfPosition(thenStatement.getEnd()).line;
            const elseKeywordLine = sourceFile.getLineAndCharacterOfPosition(elseKeyword.getStart()).line;

            if (thenStatementEndLine === elseKeywordLine)
            {
                this.addFailureAt(elseKeyword.getStart(), elseKeyword.getWidth(), Rule.ELSE_FAILURE_STRING);
            }
        }

        super.visitIfStatement(node);
    }

    public visitCatchClause(node: ts.CatchClause): void
    {
        const catchKeyword = node.getChildAt(0);
        const catchOpeningBrace = node.block.getChildAt(0);
        const catchClosingBrace = node.block.getChildAt(node.block.getChildCount() - 1);
        this.handleOpeningAndClosingBrace(catchKeyword, catchOpeningBrace, catchClosingBrace);
        super.visitCatchClause(node);
    }

    public customVisitFinallyClause(finallyKeyword: ts.Node, finallyBlock: ts.Block): void
    {
        const catchOpeningBrace = finallyBlock.getChildAt(0);
        const catchClosingBrace = finallyBlock.getChildAt(finallyBlock.getChildCount() - 1);
        this.handleOpeningAndClosingBrace(finallyKeyword, catchOpeningBrace, catchClosingBrace);
    }

    public visitTryStatement(node: ts.TryStatement): void
    {
        const sourceFile = node.getSourceFile();
        const catchClause = node.catchClause;
        const finallyBlock = node.finallyBlock;

        const tryKeyword = node.getChildAt(0);
        const tryBlock = node.tryBlock;
        const tryOpeningBrace = tryBlock.getChildAt(0);
        const tryClosingBrace = tryBlock.getChildAt(tryBlock.getChildCount() - 1);
        const tryClosingBraceLine = sourceFile.getLineAndCharacterOfPosition(tryClosingBrace.getEnd()).line;
        this.handleOpeningAndClosingBrace(tryKeyword, tryOpeningBrace, tryClosingBrace);

        if (catchClause != null)
        {
            const catchKeyword: ts.Node = catchClause.getChildAt(0);
            const catchKeywordLine = sourceFile.getLineAndCharacterOfPosition(catchKeyword.getStart()).line;

            if (tryClosingBraceLine === catchKeywordLine)
            {
                this.addFailureAt(catchKeyword.getStart(), catchKeyword.getWidth(), Rule.CATCH_FAILURE_STRING);
            }
        }

        if (finallyBlock != null)
        {
            // HACK: The `findChildOfKind` method is marked as internal, but it's there and is used for this purpose:
            // https://github.com/Microsoft/TypeScript/blob/65125791d2692a54e5eb4183846486993e38040e/src/services/documentHighlights.ts#L489
            const finallyKeyword: ts.Node = (ts as any).findChildOfKind(node, ts.SyntaxKind.FinallyKeyword, sourceFile);
            const finallyKeywordLine = sourceFile.getLineAndCharacterOfPosition(finallyKeyword.getStart()).line;

            if (tryClosingBraceLine === finallyKeywordLine)
            {
                this.addFailureAt(finallyKeyword.getStart(), finallyKeyword.getWidth(), Rule.FINALLY_FAILURE_STRING);
            }

            if (catchClause != null)
            {
                const catchBlock = catchClause.block;
                const catchClosingBrace = catchBlock.getChildAt(tryBlock.getChildCount() - 1);
                const catchClosingBraceLine = sourceFile.getLineAndCharacterOfPosition(catchClosingBrace.getEnd()).line;

                if (catchClosingBraceLine === finallyKeywordLine)
                {
                    this.addFailureAt(finallyKeyword.getStart(), finallyKeyword.getWidth(), Rule.FINALLY_FAILURE_STRING);
                }
            }

            // HACK: There's currently no 'visitFinallyClause' method in TSLint, so for now, we have to explicitly call a custom method.
            this.customVisitFinallyClause(finallyKeyword, finallyBlock);
        }

        super.visitTryStatement(node);
    }

    public visitForStatement(node: ts.ForStatement): void
    {
        this.handleIterationStatement(node);
        super.visitForStatement(node);
    }

    public visitForInStatement(node: ts.ForInStatement): void
    {
        this.handleIterationStatement(node);
        super.visitForInStatement(node);
    }

    public visitForOfStatement(node: ts.ForOfStatement): void
    {
        this.handleIterationStatement(node);
        super.visitForOfStatement(node);
    }

    public visitWhileStatement(node: ts.WhileStatement): void
    {
        this.handleIterationStatement(node);
        super.visitWhileStatement(node);
    }

    public visitBinaryExpression(node: ts.BinaryExpression): void
    {
        const rightkind = node.right.kind;
        const opkind = node.operatorToken.kind;

        if (opkind === ts.SyntaxKind.EqualsToken && rightkind === ts.SyntaxKind.ObjectLiteralExpression)
        {
            const equalsToken = node.getChildAt(1);
            const openBraceToken = node.right.getChildAt(0);
            const closeBraceToken = node.right.getChildAt(node.right.getChildCount() - 1);
            this.handleOpeningAndClosingBrace(equalsToken, openBraceToken, closeBraceToken);
        }

        super.visitBinaryExpression(node);
    }

    public visitVariableDeclaration(node: ts.VariableDeclaration): void
    {
        const initializer = node.initializer;

        if (initializer != null && initializer.kind === ts.SyntaxKind.ObjectLiteralExpression)
        {
            const equalsToken = node.getChildAt(1);
            const openBraceToken = initializer.getChildAt(0);
            const closeBraceToken = initializer.getChildAt(initializer.getChildCount() - 1);
            this.handleOpeningAndClosingBrace(equalsToken, openBraceToken, closeBraceToken);
        }

        super.visitVariableDeclaration(node);
    }

    public visitDoStatement(node: ts.DoStatement): void
    {
        const doKeyword = node.getChildAt(0);
        const statement = node.statement;

        if (statement.kind === ts.SyntaxKind.Block)
        {
            const openBraceToken = statement.getChildAt(0);
            const closeBraceToken = statement.getChildAt(statement.getChildCount() - 1);
            this.handleOpeningAndClosingBrace(doKeyword, openBraceToken, closeBraceToken);
            this.handleWhileAfterDoClosingBrace(doKeyword, openBraceToken, closeBraceToken);
        }

        super.visitDoStatement(node);
    }

    public visitModuleDeclaration(node: ts.ModuleDeclaration): void
    {
        const nameNode = node.name;
        const body = node.body;

        if (body != null && body.kind === ts.SyntaxKind.ModuleBlock)
        {
            const openBraceToken = body.getChildAt(0);
            const closeBraceToken = body.getChildAt(body.getChildCount() - 1);
            this.handleOpeningAndClosingBrace(nameNode, openBraceToken, closeBraceToken);
        }

        super.visitModuleDeclaration(node);
    }

    public visitEnumDeclaration(node: ts.EnumDeclaration): void
    {
        const nameNode = node.name;
        const openBraceToken = this.getFirstChildOfKind(node, ts.SyntaxKind.OpenBraceToken);
        const closeBraceToken = this.getLastChildOfKind(node, ts.SyntaxKind.CloseBraceToken);
        this.handleOpeningAndClosingBrace(nameNode, openBraceToken, closeBraceToken);
        super.visitEnumDeclaration(node);
    }

    public visitSwitchStatement(node: ts.SwitchStatement): void
    {
        const closeParenToken = node.getChildAt(3);
        const openBraceToken = node.caseBlock.getChildAt(0);
        const closeBraceToken = node.caseBlock.getChildAt(node.caseBlock.getChildCount() - 1);
        this.handleOpeningAndClosingBrace(closeParenToken, openBraceToken, closeBraceToken);
        super.visitSwitchStatement(node);
    }

    public visitInterfaceDeclaration(node: ts.InterfaceDeclaration): void
    {
        this.handleClassLikeDeclaration(node);
        super.visitInterfaceDeclaration(node);
    }

    public visitClassDeclaration(node: ts.ClassDeclaration): void
    {
        this.handleClassLikeDeclaration(node);
        super.visitClassDeclaration(node);
    }

    public visitFunctionDeclaration(node: ts.FunctionDeclaration): void
    {
        this.handleFunctionLikeDeclaration(node);
        super.visitFunctionDeclaration(node);
    }

    public visitMethodDeclaration(node: ts.MethodDeclaration): void
    {
        this.handleFunctionLikeDeclaration(node);
        super.visitMethodDeclaration(node);
    }

    public visitConstructorDeclaration(node: ts.ConstructorDeclaration): void
    {
        this.handleFunctionLikeDeclaration(node);
        super.visitConstructorDeclaration(node);
    }

    public visitArrowFunction(node: ts.ArrowFunction): void
    {
        const body = node.body;

        if (body != null && body.kind === ts.SyntaxKind.Block)
        {
            const arrowToken = this.getFirstChildOfKind(node, ts.SyntaxKind.EqualsGreaterThanToken);
            const openBraceToken = node.body.getChildAt(0);
            const closeBraceToken = node.body.getChildAt(node.body.getChildCount() - 1);
            this.handleOpeningAndClosingBrace(arrowToken, openBraceToken, closeBraceToken);
        }

        super.visitArrowFunction(node);
    }

    private handleFunctionLikeDeclaration(node: ts.FunctionLikeDeclaration): void
    {
        const body = node.body;

        if (body != null && body.kind === ts.SyntaxKind.Block)
        {
            const openBraceToken = body.getChildAt(0);
            const closeBraceToken = body.getChildAt(body.getChildCount() - 1);

            if (node.type != null)
            {
                this.handleOpeningAndClosingBrace(node.type, openBraceToken, closeBraceToken);
            }
            else
            {
                const closeParenToken = this.getFirstChildOfKind(node, ts.SyntaxKind.CloseParenToken);
                this.handleOpeningAndClosingBrace(closeParenToken, openBraceToken, closeBraceToken);
            }
        }
    }

    private handleClassLikeDeclaration(node: ts.ClassDeclaration | ts.InterfaceDeclaration): void
    {
        let lastNodeOfDeclaration: ts.Node | undefined = node.name;
        const openBraceToken = this.getFirstChildOfKind(node, ts.SyntaxKind.OpenBraceToken);
        const closeBraceToken = this.getLastChildOfKind(node, ts.SyntaxKind.CloseBraceToken);

        if (node.heritageClauses != null)
        {
            lastNodeOfDeclaration = node.heritageClauses[node.heritageClauses.length - 1];
        }
        else if (node.typeParameters != null)
        {
            lastNodeOfDeclaration = node.typeParameters[node.typeParameters.length - 1];
        }

        this.handleOpeningAndClosingBrace(lastNodeOfDeclaration, openBraceToken, closeBraceToken);
    }

    private handleIterationStatement(node: ts.IterationStatement): void
    {
        const closeParenToken = node.getChildAt(node.getChildCount() - 2);
        const statement = node.statement;

        if (statement.kind === ts.SyntaxKind.Block)
        {
            const openBraceToken = statement.getChildAt(0);
            const closeBraceToken = statement.getChildAt(statement.getChildCount() - 1);
            this.handleOpeningAndClosingBrace(closeParenToken, openBraceToken, closeBraceToken);
        }
    }

    private handleOpeningAndClosingBrace(previousNode?: ts.Node, openBraceToken?: ts.Node, closeBraceToken?: ts.Node): void
    {
        if (previousNode == null || openBraceToken == null || closeBraceToken == null)
        {
            return;
        }

        const sourceFile = previousNode.getSourceFile();
        const previousNodeLine = sourceFile.getLineAndCharacterOfPosition(previousNode.getEnd()).line;
        const openBraceLine = sourceFile.getLineAndCharacterOfPosition(openBraceToken.getStart()).line;
        const closeBraceLine = sourceFile.getLineAndCharacterOfPosition(closeBraceToken.getStart()).line;

        if (previousNodeLine === openBraceLine && (!this.hasOption(OPTION_ALLOW_SINGLE_LINE_BLOCKS) || openBraceLine !== closeBraceLine))
        {
            this.addFailureAt(openBraceToken.getStart(), openBraceToken.getWidth(), Rule.OPEN_BRACE_FAILURE_STRING);
        }

        if (openBraceLine !== closeBraceLine)
        {
            const closeBraceLineStart = sourceFile.getPositionOfLineAndCharacter(closeBraceLine, 0);
            const textBeforeCloseBrace = sourceFile.text.substring(closeBraceLineStart, closeBraceToken.getStart());

            const failureMatch = textBeforeCloseBrace.match(/[^\s]/);

            if (failureMatch)
            {
                this.addFailureAt(closeBraceToken.getStart(), closeBraceToken.getWidth(), Rule.CLOSE_BRACE_FAILURE_STRING);
            }
        }
    }

    private handleWhileAfterDoClosingBrace(doNode: ts.Node, openBraceToken: ts.Node, closeBraceToken: ts.Node): void
    {
        if (doNode == null || openBraceToken == null || closeBraceToken == null)
        {
            return;
        }

        const sourceFile = doNode.getSourceFile();
        const openBraceLine = sourceFile.getLineAndCharacterOfPosition(openBraceToken.getStart()).line;
        const closeBraceLine = sourceFile.getLineAndCharacterOfPosition(closeBraceToken.getStart()).line;

        if (openBraceLine !== closeBraceLine)
        {
            const nextLineStart = sourceFile.getPositionOfLineAndCharacter(closeBraceLine + 1, 0);
            const textAfterCloseBrace = sourceFile.text.substring(closeBraceToken.getStart() + 1, nextLineStart);

            const failureMatch = textAfterCloseBrace.match(/(\s*)while[\s(]/);

            if (failureMatch)
            {
                const failureStart = closeBraceToken.getStart() + failureMatch[1].length + 1;
                const failureWidth = closeBraceToken.getWidth() + failureMatch[1].length + 1;
                this.addFailureAt(failureStart, failureWidth, Rule.WHILE_FAILURE_STRING);
            }
        }
    }

    private getFirstChildOfKind(node: ts.Node, kind: ts.SyntaxKind): ts.Node
    {
        const matches = node.getChildren().filter((child: ts.Node) => child.kind === kind);

        return matches[0];
    }

    private getLastChildOfKind(node: ts.Node, kind: ts.SyntaxKind): ts.Node
    {
        const matches = node.getChildren().filter((child: ts.Node) => child.kind === kind);

        return matches[matches.length - 1];
    }
}
