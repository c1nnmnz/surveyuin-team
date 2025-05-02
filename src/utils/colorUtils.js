/**
 * Generates a consistent color scheme based on a service name
 * @param {string} serviceName - Name of the service to generate colors for
 * @returns {Object} Object containing color values for various UI elements
 */
export function generateGradient(serviceName) {
  if (!serviceName) {
    return {
      from: '#f0f4ff',
      to: '#e0e7ff',
      accent: '#6366f1',
      text: '#4f46e5',
      buttonBg: '#3b82f6',
      buttonGradient: '#0ea5e9',
      soft: '#f9faff',
      veryLight: '#fafbff',
      primary: '#3b82f6'
    };
  }

  // Simple hash function
  const hash = serviceName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Generate distinct hue based on name
  // Use a preset list of well-spaced hues and select based on name hash
  const huePresets = [
    15,    // Orange-red
    45,    // Yellow-orange
    75,    // Yellow-green
    105,   // Green
    135,   // Teal
    165,   // Cyan
    195,   // Light blue
    225,   // Blue
    255,   // Purple-blue
    285,   // Purple
    315,   // Pink
    345    // Red-pink
  ];
  
  // Select hue from presets based on hash
  const hue = huePresets[Math.abs(hash) % huePresets.length];
  
  // Add a small random offset to create more variation
  const hueOffset = ((hash % 10) - 5);
  const finalHue = (hue + hueOffset) % 360;
  
  return {
    from: `hsl(${finalHue}, 80%, 92%)`,  // Very light pastel
    to: `hsl(${finalHue}, 70%, 85%)`,     // Slightly more saturated
    accent: `hsl(${finalHue}, 70%, 45%)`, // Accent color for icons
    text: `hsl(${finalHue}, 80%, 35%)`,   // Text color matching the theme
    buttonBg: '#3b82f6',                 // Button background color (fixed for all services)
    buttonGradient: '#0ea5e9',           // Button gradient highlight color
    // Ultra-soft versions for backgrounds
    soft: `hsl(${finalHue}, 30%, 97%)`,
    veryLight: `hsl(${finalHue}, 30%, 99%)`,
    primary: `hsl(${finalHue}, 70%, 45%)`  // Adding primary color same as accent for compatibility
  };
} 