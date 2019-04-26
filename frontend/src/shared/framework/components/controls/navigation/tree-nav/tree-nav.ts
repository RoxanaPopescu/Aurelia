import { bindable, autoinject, bindingMode } from "aurelia-framework";

@autoinject
export class TreeNavCustomElement
{
    /**
     * The tree of which this is a sub-tree, or undefined if this is the root tree.
     */
    @bindable
    public tree: TreeNavCustomElement;

    /**
     * The data models representing the root nodes of the tree.
     */
    @bindable
    public model: ITreeNavNode[];

    /**
     * The selected node model.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: ITreeNavNode;

    /**
     * True to indicate that the selected node includes its children,
     * false to indicate that the selected node excludes its children,
     * or undefined to indicate that the selected node includes its
     * children only when the node is collapsed.
     * The default is undefined.
     */
    @bindable
    public selectChildren: boolean | undefined;

    /**
     * The change callback function.
     */
    @bindable()
    public change: (context: { value: ITreeNavNode }) => void;

    public navigate(node: ITreeNavNode, select?: boolean, expand?: boolean, expandChildren?: boolean, notify?: boolean): void
    {
        if (node == null)
        {
            throw new Error("Cannot navigate to an undefined node.");
        }

        const allowNotify = notify !== false;
        let shouldNotify = notify === true;

        if (select != null && this.value !== node)
        {
            this.value = node;
            shouldNotify = allowNotify;
        }

        if (expand != null && expand !== !!this.value.expanded)
        {
            this.value.expanded = expand;
            shouldNotify = allowNotify;
        }

        if (expandChildren != null && this.value.children != null)
        {
            for (const child of this.value.children)
            {
                if (expandChildren !== !!child.expanded)
                {
                    shouldNotify = allowNotify;
                }

                child.expanded = expandChildren;
            }
        }

        let current = this.value.parent;

        while (current != null)
        {
            current.expanded = true;
            current = current.parent;
        }

        if (shouldNotify && this.change != null)
        {
            this.change({ value: this.value });
        }
    }

    public isFolder = (node: ITreeNavNode) =>
    {
        return node.children != null;
    }

    public isFile = (node: ITreeNavNode) =>
    {
        return !this.isFolder(node);
    }

    protected valueChanged(newValue: ITreeNavNode, oldValue: ITreeNavNode): void
    {
        this.navigate(this.value, true, undefined, undefined, newValue !== oldValue);
    }
}

export interface ITreeNavNode
{
    name: string;

    parent?: ITreeNavNode;

    children?: ITreeNavNode[];

    expanded?: boolean;
}
