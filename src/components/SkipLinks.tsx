/**
 * SkipLinks component provides keyboard-only navigation shortcuts
 * Allows users to skip directly to main content or navigation
 * Follows WCAG 2.1 Level AA guidelines
 */
export function SkipLinks() {
  return (
    <div className="skip-links">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#navigation" className="skip-link">
        Skip to navigation
      </a>
    </div>
  );
}
