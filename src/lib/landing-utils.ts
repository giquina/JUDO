// Helper functions for landing page

// Format currency
export function formatCurrency(amount: number, currency: string = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format large numbers with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-GB").format(num);
}

// Calculate ROI based on inputs
export interface ROIInputs {
  members: number;
  avgSessionsPerMonth: number;
  currentAdminHours: number;
  hourlyValue: number;
  membershipFee: number;
}

export interface ROIResults {
  timeSaved: number;
  moneySaved: number;
  revenueIncrease: number;
  totalMonthlyValue: number;
  platformCost: number;
  netBenefit: number;
  roi: number;
  paybackPeriod: string;
}

export function calculateROI(inputs: ROIInputs): ROIResults {
  const { members, currentAdminHours, hourlyValue, membershipFee } = inputs;

  // Time savings: 70% reduction in admin time
  const timeSaved = currentAdminHours * 0.7;
  const moneySaved = timeSaved * hourlyValue * 4; // Monthly

  // Revenue increase: 40% reduction in late payments + 15% better retention
  const currentMonthlyRevenue = members * membershipFee;
  const latePaymentRecovery = currentMonthlyRevenue * 0.05; // Assume 5% currently late
  const retentionIncrease = currentMonthlyRevenue * 0.15 * (1/12); // 15% annual retention spread monthly
  const revenueIncrease = latePaymentRecovery + retentionIncrease;

  // Total monthly value
  const totalMonthlyValue = moneySaved + revenueIncrease;

  // Platform cost (simplified tiered pricing)
  let platformCost = 29;
  if (members > 100) platformCost = 99;
  else if (members > 30) platformCost = 49;

  // Net benefit
  const netBenefit = totalMonthlyValue - platformCost;

  // ROI percentage
  const roi = ((netBenefit / platformCost) * 100);

  // Payback period
  const paybackMonths = platformCost / totalMonthlyValue;
  const paybackPeriod = paybackMonths < 0.5
    ? "Less than 2 weeks"
    : paybackMonths < 1
    ? `${Math.ceil(paybackMonths * 30)} days`
    : `${Math.ceil(paybackMonths)} month${Math.ceil(paybackMonths) > 1 ? 's' : ''}`;

  return {
    timeSaved,
    moneySaved,
    revenueIncrease,
    totalMonthlyValue,
    platformCost,
    netBenefit,
    roi,
    paybackPeriod
  };
}

// Smooth scroll to section
export function scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId);
  if (element) {
    const offset = 80; // Account for sticky nav
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
}

// Check if element is in viewport
export function isInViewport(element: HTMLElement, offset: number = 0): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 - offset &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Debounce function for scroll events
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Generate icon component name from string
export function getIconName(iconString: string): string {
  // Convert kebab-case or snake_case to PascalCase
  return iconString
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}
