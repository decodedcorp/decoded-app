/**
 * Head metadata for intercept modal routes from home/explore
 * Prevents SEO indexing of modal overlay pages
 */
export default function Head() {
  return (
    <>
      <meta name="robots" content="noindex,nofollow" />
      <meta name="googlebot" content="noindex,nofollow" />
    </>
  );
}
