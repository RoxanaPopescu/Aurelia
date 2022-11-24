import React from "react";
import { resolveIconId } from "resources/icons";
import "./icon.scss";

export interface IconProps {
  /**
   * The name of the icon to render.
   */
  name: string | undefined;

  /**
   * The class names to apply to the element,
   */
  className?: string;

  /**
   * Called when the icon is clicked.
   */
  onClick?: (event: React.MouseEvent<SVGSVGElement>) => void;
}

/**
 * Renders the icon with the specified name.
 * Note that only icons in the `shared/src/assets/icons` can be rendered using this component.
 */
export default (props: IconProps) =>
{
  const id = props.name ? resolveIconId(props.name) : undefined;

  return (
    <>
      <svg
        onClick={event => {
          if (props.onClick) {
            event.stopPropagation();
            props.onClick(event);
          }
        }}
        className={`icon icon-${id} ${props.className || ""}`}
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        {id &&
        <use xlinkHref={`#icon-${id}`} />}
      </svg>
    </>
  );
}

// Automatically require all icons in the icons folder.

// tslint:disable-next-line:no-any
function requireAll(r: any) {
  r.keys().forEach(r);
}

// tslint:disable-next-line:no-any
requireAll((require as any).context("../../assets/icons/", true, /\.\/.*\.svg$/));
