
/**
 * Determines if text should be black or white based on background hex color.
 * Uses the YIQ luminance formula.
 */
export const getContrastColor = (hexcolor: string): 'white' | 'black' => {
  // If hex starts with #, remove it
  const hex = hexcolor.replace("#", "");
  
  // Convert 3-digit hex to 6-digit
  const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
  const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
  const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
  
  // Calculate luminance
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  
  return yiq >= 128 ? 'black' : 'white';
};
