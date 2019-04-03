import { autoinject, containerless } from "aurelia-framework";
import { Router } from "aurelia-router";

@autoinject
@containerless
export class NavLinksCustomElement
{
    public constructor(router: Router)
    {
        this.router = router;
    }

    public router: Router;
}
