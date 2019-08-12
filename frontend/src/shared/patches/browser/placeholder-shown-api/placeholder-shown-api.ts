import "./placeholder-shown-api.scss";

document.addEventListener("animationstart", e =>
{
    if (e.animationName === "on-placeholder-shown")
    {
        (e.target as any).placeholderShown = true;
    }

    if (e.animationName === "on-placeholder-hidden")
    {
        (e.target as any).placeholderShown = false;
    }
});
