import { computedFrom } from "aurelia-binding";

/**
 * Represents the data for a node in a tree.
 */
export interface ITreeNode<TTreeNode extends TreeNode<TTreeNode> = any>
{
    /**
     * The slug to use in the path that identifies this node within the tree,
     * or undefined to use the name.
     */
    slug?: string;

    /**
     * The name of the node.
     */
    name: string;

    /**
     * The parent node, or undefined if this node represents the root in the tree.
     */
    parent?: TTreeNode;

    /**
     * The child nodes, or undefined if this node represents a leaf in the tree.
     */
    children?: TTreeNode[];

    /**
     * True if the node is expanded, otherwise false,
     */
    expanded?: boolean;
}

/**
 * Represents a node in a tree.
 */
export class TreeNode<TTreeNode extends TreeNode<TTreeNode> = any> implements ITreeNode<TTreeNode>
{
    /**
     * Creates a new instance of the class.
     * @param data The response data from which the instance should be created.
     * @param parent The parent node, or undefined if this node represents the root in the tree.
     */
    public constructor(data: ITreeNode<TTreeNode>, parent?: TTreeNode)
    {
        this.slug = data.slug != null ? data.slug : data.name;
        this.name = data.name;
        this.expanded = data.expanded;
        this.children = data.children;
        this.parent = parent;
    }

    /**
     * The slug to use in the path that identifies this node within the tree.
     */
    public slug: string;

    /**
     * The name of the node.
     */
    public name: string;

    /**
     * The parent node, or undefined if this node represents the root in the tree.
     */
    public parent: TTreeNode | undefined;

    /**
     * The child nodes, or undefined if this node represents a leaf in the tree.
     */
    public children: TTreeNode[] | undefined;

    /**
     * True if the node is expanded, otherwise false,
     */
    public expanded?: boolean;

    /**
     * The sequence of slugs, separated by "/", that identify the node within the tree.
     */
    @computedFrom("parent.path", "slug")
    public get path(): string
    {
        if (this.parent != null && this.parent.path)
        {
            return this.slug ? `${this.parent.path}/${this.slug}` : this.parent.path;
        }

        return this.slug || "";
    }

    /**
     * Expands every node along the path to this node, optionally including this node.
     * @param expandThis True to expand this node, false to collapse this node, or undefined to keep its current state.
     */
    public expandPath(expandThis?: boolean): void
    {
        if (this.parent != null)
        {
            this.parent.expandPath(true);
        }

        if (expandThis != null)
        {
            this.expanded = expandThis;
        }
    }

    /**
     * Finds the first node for which the specified function returns true.
     * @param testFunc The function used to determien whether a node is a match.
     * @returns The matched node, or undefined if not found.
     */
    public find(testFunc: (node: this | TTreeNode) => boolean): this | TTreeNode | undefined;

    /**
     * Finds the node matching the specified path.
     * @param path The sequence of node slugs, separated by "/", that identify the node within the tree.
     * @returns The matched node, or undefined if not found.
     */
    public find(path: string): this | TTreeNode | undefined;

    public find(nodeOrPath: string | ((node: this | TTreeNode) => boolean)): this | TTreeNode | undefined
    {
        if (nodeOrPath instanceof Function)
        {
            // Find using test function.

            if (nodeOrPath(this))
            {
                return this;
            }

            if (this.children != null)
            {
                for (const child of this.children)
                {
                    const match = child.find(nodeOrPath);

                    if (match != null)
                    {
                        return match;
                    }
                }
            }
        }
        else
        {
            // Find using path.

            const pathToThis = this.path;

            if (nodeOrPath === pathToThis)
            {
                return this;
            }

            const isPartialMatch = pathToThis === "" || nodeOrPath.startsWith(`${pathToThis}/`);

            if (isPartialMatch && this.children != null)
            {
                for (const child of this.children)
                {
                    const match = child.find(nodeOrPath);

                    if (match != null)
                    {
                        return match as any;
                    }
                }
            }
        }

        return undefined;
    }
}
