import { bindable, autoinject, computedFrom, bindingMode } from "aurelia-framework";
import { TreeNavCustomElement, ITreeNavNode } from "../../tree-nav";

@autoinject
export class TreeNavNodeCustomElement
{
    @bindable({ defaultBindingMode: bindingMode.oneTime })
    public tree: TreeNavCustomElement;

    @bindable({ defaultBindingMode: bindingMode.oneTime })
    public model: ITreeNavNode;

    @computedFrom("node.children.length")
    protected get isFolder(): boolean
    {
        return this.model.children != null;
    }

    @computedFrom("node.children.length")
    protected get expandable(): boolean
    {
        return this.model.children != null && this.model.children.length > 0;
    }

    @computedFrom("tree.value")
    protected get active(): boolean
    {
        return this.tree.value === this.model;
    }

    @computedFrom("active", "tree.selectChildren", "model.expanded")
    protected get iconName(): string
    {
        if (this.active && (this.tree.selectChildren || (!this.model.expanded && this.tree.selectChildren == undefined)))
        {
            // Filled icon, indicating that child nodes are included.
            return "folder";
        }
        else
        {
            // Outline icon, indicating that child nodes are excluded.
            return "folder_open";
        }
    }

    protected onClick(toggle: boolean, event: MouseEvent): void
    {
        if (this.expandable && (toggle || this.active || !this.model.expanded))
        {
            this.tree.navigate(this.model, true, !this.model.expanded);
        }
        else
        {
            this.tree.navigate(this.model, true);
        }

        event.stopPropagation();
    }
}
