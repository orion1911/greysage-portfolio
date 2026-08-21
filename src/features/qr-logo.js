/**
 * Centre logo + shared styling for the /connect QR (qr-code-styling).
 *
 * The glyph is the same polygon Monogram uses as a clipPath. It's duplicated
 * here as a fillable shape because a clip-rect SVG doesn't serialise into an
 * image cleanly — if the mark ever changes, update both.
 *
 * The badge is drawn with a cream/white halo ring baked into the image and
 * hideBackgroundDots OFF: the image simply paints over the modules, and the
 * transparent corners of its square bounding box let dots show right up to
 * the circle. That's what makes the clearing circular instead of square.
 */

// A QR is only reliably scannable as dark-on-light, so these stay fixed in
// both themes rather than following --text / --background.
export const QR_DARK = '#101010';
export const QR_LIGHT = '#ffffff';
// GREYSAGE wordmark navy, sampled from the paper-tag artwork (PPTX srgbClr).
export const QR_NAVY = '#1B2B52';

const GLYPH_POINTS =
  '63.581,46.267 73.385,50.78 83,51.625 79.89,54.737 76.184,55.293 77.273,65.25 85.828,71.629 88.321,81.117 94.314,85.435 93.928,86.988 95.012,88.119 92.054,91.853 87.229,84.851 82.409,74.896 63.581,67.581 58.137,62.137 40.987,60.521 37.29,62.445 25.931,63.226 28.034,66.829 32.353,69.215 35.015,69.911 34.569,71.373 36.976,73.029 35.108,76.607 26.555,69.062 20.797,61.516 27.331,56.382 22.842,48.384 21.267,37.123 17.686,36.777 16.016,38.886 18.933,39.166 18.35,41.324 20.33,44.088 14.849,41.908 11.757,45.058 9.89,45.524 8.037,44.711 7.261,36.777 4.988,30.822 6.794,27.753 6.794,20.907 11.305,13.75 19.396,8.147 30.599,8.147 36.655,13.911 37.286,22.462 34.952,15.461 29.665,11.26 21.263,12.661 15.506,17.64 13.481,25.574 19.706,21.062 18.772,24.485 28.684,27.431 42.421,36.31 52.845,43.467';

const GLYPH_TRANSFORM =
  'matrix(-0.5868455907472016,0,0,0.5868455907472016,55.757374436642294,-4.781031211385791)';

/**
 * Badge image data URI: halo circle → navy disc → monogram glyph.
 * Root width/height are required — Firefox and canvas drawImage refuse SVGs
 * sized only by a viewBox, and qr-code-styling then renders nothing at all.
 */
export const monogramBadgeUri = ({ halo = QR_LIGHT, disc = QR_NAVY } = {}) => {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 64 64">' +
    `<circle cx="32" cy="32" r="32" fill="${halo}"/>` +
    `<circle cx="32" cy="32" r="26" fill="${disc}"/>` +
    '<g transform="translate(17.75,17.75) scale(0.57)">' +
    `<polygon transform="${GLYPH_TRANSFORM}" points="${GLYPH_POINTS}" fill="${halo}"/>` +
    '</g></svg>';
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Shared options for every render of the connect QR (on-screen and export).
 * Level H is required: the badge occludes centre modules, and H's ~30%
 * recovery is what tolerates it. Don't raise imageSize above 0.36.
 */
export const qrOptions = (data, size) => ({
  width: size,
  height: size,
  data,
  margin: Math.round(size * 0.036),
  qrOptions: { errorCorrectionLevel: 'H' },
  image: monogramBadgeUri(),
  imageOptions: { imageSize: 0.36, margin: 0, hideBackgroundDots: false },
  dotsOptions: { type: 'dots', color: QR_DARK },
  cornersSquareOptions: { type: 'extra-rounded', color: QR_NAVY },
  cornersDotOptions: { type: 'dot', color: QR_NAVY },
  backgroundOptions: { color: QR_LIGHT },
});
