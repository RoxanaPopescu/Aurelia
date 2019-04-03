// When imported, this file requires all SVG icons within the folder,
// thereby establishing them as dependencies, and ensuring that they
// are bundled by the Webpack plugin `svg-sprite-plugin`.

function requireAll(r: any): void
{
    r.keys().forEach(r);
}

// Note that the arguments here must be literals, as they are parsed during build.
// While the pattern here matches files within subfolders, thus allowing some organization,
// note that only the file name itself is used for the icon ID - so avoid collisions.
//
requireAll((require as any).context("resources/icons", true, /.*\.svg$/));

export default null;
