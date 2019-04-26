import { computedFrom } from "aurelia-binding";

/**
 * Represents the data for a node in a tree.
 */
export interface ITreeNode<TTreeNode extends TreeNode = TreeNode<any>>
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
export class TreeNode<TTreeNode extends TreeNode = TreeNode<any>> implements ITreeNode
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
            return `${this.parent.path}/${this.slug}`;
        }

        return this.slug;
    }

    /**
     * Finds the node matching the specified path.
     * @param path The sequence of node slugs, separated by "/", that identify the node within the tree.
     * @returns The node matching the specified path, or undefined if not found.
     */
    public find(path: string): this | TTreeNode | undefined
    {
        const expanded = path.endsWith("/");
        const unexpandedPath = expanded ? path.substring(0, path.length - 1) : path;

        if (unexpandedPath === this.slug)
        {
            return this;
        }

        const slugs = unexpandedPath.split("/");

        let nodes: TreeNode[] | undefined = this.slug ? [this] : this.children;

        let node: TreeNode | undefined;

        while (slugs.length > 0)
        {
            if (nodes == null)
            {
                return undefined;
            }

            const slug = slugs.shift();
            node = nodes.find(s => s.slug === slug);

            if (node == null)
            {
                return undefined;
            }

            nodes = node.children;
        }

        return node as any;
    }

    /**
     * Removes the specified child nodes from this node.
     * @param nodes The nodes to remove.
     */
    public removeChildren(...nodes: TTreeNode[]): void
    {
        if (this.children == null)
        {
            return;
        }

        for (const node of nodes)
        {
            if (node.parent !== this)
            {
                throw new Error("Cannot remove node that is not a child of this node.");
            }

            this.children.splice(this.children.indexOf(node), 1);
            node.parent = undefined;
        }
    }

    /**
     * Adds the specified child nodes to this node,
     * removing them from any previous parent node.
     * @param nodes The nodes to add.
     */
    public addChildren(...nodes: TTreeNode[]): void
    {
        if (this.children == null)
        {
            this.children = [];
        }

        for (const node of nodes)
        {
            if (node.parent)
            {
                node.parent.removeChildren(node);
            }

            node.parent = this;
        }

        this.children.push(...nodes);
    }
}
