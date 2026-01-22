import { motion } from "framer-motion";
import { useMemo } from "react";
import { BELT_RANKS, getNextBelt } from "@/lib/judo-constants";
import { Award, ChevronRight, Clock, Target, Sparkles } from "lucide-react";

/**
 * Belt display configuration including white belt as starting point
 */
interface BeltDisplay {
  grade: string;
  name: string;
  color: string;
  hexColor: string;
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
  order: number;
}

const BELT_JOURNEY_DISPLAY: BeltDisplay[] = [
  {
    grade: "Beginner",
    name: "White",
    color: "white",
    hexColor: "#F5F5F5",
    gradientFrom: "#FFFFFF",
    gradientTo: "#E5E5E5",
    glowColor: "rgba(255, 255, 255, 0.5)",
    order: 0,
  },
  {
    grade: "6th Kyu",
    name: "Red",
    color: "red",
    hexColor: "#DC2626",
    gradientFrom: "#EF4444",
    gradientTo: "#B91C1C",
    glowColor: "rgba(220, 38, 38, 0.5)",
    order: 1,
  },
  {
    grade: "5th Kyu",
    name: "Yellow",
    color: "yellow",
    hexColor: "#EAB308",
    gradientFrom: "#FDE047",
    gradientTo: "#CA8A04",
    glowColor: "rgba(234, 179, 8, 0.5)",
    order: 2,
  },
  {
    grade: "4th Kyu",
    name: "Orange",
    color: "orange",
    hexColor: "#EA580C",
    gradientFrom: "#FB923C",
    gradientTo: "#C2410C",
    glowColor: "rgba(234, 88, 12, 0.5)",
    order: 3,
  },
  {
    grade: "3rd Kyu",
    name: "Green",
    color: "green",
    hexColor: "#16A34A",
    gradientFrom: "#22C55E",
    gradientTo: "#15803D",
    glowColor: "rgba(22, 163, 74, 0.5)",
    order: 4,
  },
  {
    grade: "2nd Kyu",
    name: "Blue",
    color: "blue",
    hexColor: "#2563EB",
    gradientFrom: "#3B82F6",
    gradientTo: "#1D4ED8",
    glowColor: "rgba(37, 99, 235, 0.5)",
    order: 5,
  },
  {
    grade: "1st Kyu",
    name: "Brown",
    color: "brown",
    hexColor: "#92400E",
    gradientFrom: "#B45309",
    gradientTo: "#78350F",
    glowColor: "rgba(146, 64, 14, 0.5)",
    order: 6,
  },
  {
    grade: "1st Dan",
    name: "Black",
    color: "black",
    hexColor: "#171717",
    gradientFrom: "#404040",
    gradientTo: "#0A0A0A",
    glowColor: "rgba(64, 64, 64, 0.6)",
    order: 7,
  },
];

interface BeltJourneyProps {
  currentBelt: string;
  totalSessions: number;
  daysSincePromotion: number;
}

export default function BeltJourney({
  currentBelt,
  totalSessions,
  daysSincePromotion,
}: BeltJourneyProps) {
  const currentBeltData = useMemo(() => {
    // Handle "white" or "Beginner" or empty
    if (!currentBelt || currentBelt.toLowerCase() === "white" || currentBelt.toLowerCase() === "beginner") {
      return BELT_JOURNEY_DISPLAY[0];
    }
    // Find by grade (e.g., "6th Kyu") or color (e.g., "red")
    return (
      BELT_JOURNEY_DISPLAY.find(
        (b) =>
          b.grade.toLowerCase() === currentBelt.toLowerCase() ||
          b.color.toLowerCase() === currentBelt.toLowerCase() ||
          b.name.toLowerCase() === currentBelt.toLowerCase()
      ) || BELT_JOURNEY_DISPLAY[0]
    );
  }, [currentBelt]);

  const nextBeltData = useMemo(() => {
    const nextIndex = currentBeltData.order + 1;
    if (nextIndex >= BELT_JOURNEY_DISPLAY.length) return null;
    return BELT_JOURNEY_DISPLAY[nextIndex];
  }, [currentBeltData]);

  const nextBeltFromConstants = useMemo(() => {
    if (currentBeltData.order === 0) {
      // White belt -> 6th Kyu Red
      return BELT_RANKS[0];
    }
    return getNextBelt(currentBeltData.grade);
  }, [currentBeltData]);

  const progressPercentage = useMemo(() => {
    return ((currentBeltData.order + 1) / BELT_JOURNEY_DISPLAY.length) * 100;
  }, [currentBeltData]);

  const daysUntilEligible = useMemo(() => {
    if (!nextBeltFromConstants?.minDaysToNext) return 0;
    // For white belt, assume they need 30 days for first promotion
    const requiredDays = currentBeltData.order === 0 ? 30 : (nextBeltFromConstants.minDaysToNext || 30);
    return Math.max(0, requiredDays - daysSincePromotion);
  }, [nextBeltFromConstants, daysSincePromotion, currentBeltData]);

  return (
    <div className="w-full">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <Award className="w-6 h-6 text-amber-500" />
          Belt Journey
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progression through the ranks
        </p>
      </motion.div>

      {/* Desktop Horizontal Layout */}
      <div className="hidden md:block">
        <DesktopBeltJourney
          belts={BELT_JOURNEY_DISPLAY}
          currentBeltOrder={currentBeltData.order}
          progressPercentage={progressPercentage}
        />
      </div>

      {/* Mobile Vertical Layout */}
      <div className="block md:hidden">
        <MobileBeltJourney
          belts={BELT_JOURNEY_DISPLAY}
          currentBeltOrder={currentBeltData.order}
        />
      </div>

      {/* Current Belt Info Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Current Belt Badge */}
          <div className="flex-shrink-0">
            <BeltBadgeLarge belt={currentBeltData} isCurrent />
          </div>

          {/* Stats */}
          <div className="flex-1 grid grid-cols-2 gap-4 w-full">
            <StatCard
              icon={<Target className="w-5 h-5" />}
              label="Total Sessions"
              value={totalSessions.toString()}
              color="blue"
            />
            <StatCard
              icon={<Clock className="w-5 h-5" />}
              label="Days at Belt"
              value={daysSincePromotion.toString()}
              color="purple"
            />
          </div>
        </div>
      </motion.div>

      {/* Next Belt Requirements */}
      {nextBeltData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6"
        >
          <NextBeltCard
            nextBelt={nextBeltData}
            daysUntilEligible={daysUntilEligible}
            daysSincePromotion={daysSincePromotion}
            minDaysRequired={nextBeltFromConstants?.minDaysToNext || 30}
          />
        </motion.div>
      )}
    </div>
  );
}

/**
 * Desktop horizontal belt progression
 */
function DesktopBeltJourney({
  belts,
  currentBeltOrder,
  progressPercentage,
}: {
  belts: BeltDisplay[];
  currentBeltOrder: number;
  progressPercentage: number;
}) {
  return (
    <div className="relative">
      {/* Background Track */}
      <div className="absolute top-1/2 left-0 right-0 h-3 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        {/* Animated Progress Line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="h-full rounded-full relative overflow-hidden"
          style={{
            background: `linear-gradient(90deg,
              ${belts[0].gradientFrom} 0%,
              ${belts[Math.min(currentBeltOrder, belts.length - 1)].gradientTo} 100%)`,
          }}
        >
          {/* Shimmer Effect */}
          <motion.div
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
          />
        </motion.div>
      </div>

      {/* Belt Nodes */}
      <div className="relative flex justify-between items-center py-8">
        {belts.map((belt, index) => (
          <BeltNode
            key={belt.grade}
            belt={belt}
            index={index}
            isCompleted={index < currentBeltOrder}
            isCurrent={index === currentBeltOrder}
            isFuture={index > currentBeltOrder}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Mobile vertical belt progression
 */
function MobileBeltJourney({
  belts,
  currentBeltOrder,
}: {
  belts: BeltDisplay[];
  currentBeltOrder: number;
}) {
  return (
    <div className="relative pl-8">
      {/* Vertical Line */}
      <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-700 rounded-full">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${((currentBeltOrder + 1) / belts.length) * 100}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="w-full rounded-full"
          style={{
            background: `linear-gradient(180deg,
              ${belts[0].gradientFrom} 0%,
              ${belts[Math.min(currentBeltOrder, belts.length - 1)].gradientTo} 100%)`,
          }}
        />
      </div>

      {/* Belt Items */}
      <div className="space-y-6">
        {belts.map((belt, index) => (
          <MobileBeltItem
            key={belt.grade}
            belt={belt}
            index={index}
            isCompleted={index < currentBeltOrder}
            isCurrent={index === currentBeltOrder}
            isFuture={index > currentBeltOrder}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Individual belt node for desktop view
 */
function BeltNode({
  belt,
  index,
  isCompleted,
  isCurrent,
  isFuture,
}: {
  belt: BeltDisplay;
  index: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isFuture: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex flex-col items-center"
    >
      {/* Belt Circle */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          isFuture ? "opacity-50" : ""
        }`}
        style={{
          background: `linear-gradient(135deg, ${belt.gradientFrom}, ${belt.gradientTo})`,
          boxShadow: isCurrent
            ? `0 0 0 4px rgba(255,255,255,0.9), 0 0 30px ${belt.glowColor}, 0 0 60px ${belt.glowColor}`
            : isCompleted
            ? `0 4px 15px ${belt.glowColor}`
            : "0 2px 8px rgba(0,0,0,0.1)",
          border: belt.color === "white" ? "2px solid #D4D4D4" : "none",
        }}
      >
        {/* Inner highlight */}
        <div
          className="absolute inset-1 rounded-full opacity-30"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.5), transparent)`,
          }}
        />

        {/* Completed checkmark or current sparkle */}
        {isCompleted && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-5 h-5 text-white drop-shadow-md"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        )}

        {isCurrent && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-white drop-shadow-md" />
          </motion.div>
        )}
      </motion.div>

      {/* Pulsing ring for current belt */}
      {isCurrent && (
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-12 h-12 rounded-full"
          style={{
            background: `radial-gradient(circle, ${belt.glowColor} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Belt Label */}
      <div className="mt-3 text-center">
        <p
          className={`text-xs font-bold ${
            isCurrent
              ? "text-gray-900 dark:text-white"
              : isCompleted
              ? "text-gray-700 dark:text-gray-300"
              : "text-gray-400 dark:text-gray-600"
          }`}
        >
          {belt.name}
        </p>
        <p
          className={`text-[10px] ${
            isCurrent
              ? "text-gray-600 dark:text-gray-400"
              : "text-gray-400 dark:text-gray-600"
          }`}
        >
          {belt.grade}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Mobile belt list item
 */
function MobileBeltItem({
  belt,
  index,
  isCompleted,
  isCurrent,
  isFuture,
}: {
  belt: BeltDisplay;
  index: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isFuture: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative flex items-center gap-4 ${isFuture ? "opacity-50" : ""}`}
    >
      {/* Belt Circle */}
      <motion.div
        className={`absolute -left-8 w-8 h-8 rounded-full flex items-center justify-center`}
        style={{
          background: `linear-gradient(135deg, ${belt.gradientFrom}, ${belt.gradientTo})`,
          boxShadow: isCurrent
            ? `0 0 0 3px rgba(255,255,255,0.9), 0 0 20px ${belt.glowColor}`
            : isCompleted
            ? `0 2px 10px ${belt.glowColor}`
            : "0 1px 4px rgba(0,0,0,0.1)",
          border: belt.color === "white" ? "2px solid #D4D4D4" : "none",
        }}
      >
        {isCompleted && (
          <svg
            className="w-4 h-4 text-white drop-shadow"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {isCurrent && <Sparkles className="w-4 h-4 text-white drop-shadow" />}
      </motion.div>

      {/* Belt Info */}
      <div
        className={`flex-1 p-4 rounded-xl transition-all ${
          isCurrent
            ? "bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-850 border-2 border-gray-300 dark:border-gray-600"
            : "bg-gray-50 dark:bg-gray-800/50"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`font-bold ${
                isCurrent
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {belt.name} Belt
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {belt.grade}
            </p>
          </div>
          {isCurrent && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white">
              Current
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Large belt badge for current belt display - realistic style
 */
function BeltBadgeLarge({ belt, isCurrent }: { belt: BeltDisplay; isCurrent?: boolean }) {
  const isLightBelt = belt.color === "white" || belt.color === "yellow";

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateY: 10 }}
      className="relative perspective-1000"
    >
      {/* Outer glow */}
      {isCurrent && (
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -inset-3 rounded-2xl blur-xl"
          style={{ background: belt.glowColor }}
        />
      )}

      {/* Realistic belt shape */}
      <div className="relative">
        {/* Belt main body */}
        <div
          className="relative w-36 h-12 rounded-sm shadow-xl overflow-hidden"
          style={{
            background: `linear-gradient(180deg, ${belt.gradientFrom} 0%, ${belt.gradientTo} 100%)`,
            border: belt.color === "white" ? "2px solid #D4D4D4" : "none",
          }}
        >
          {/* Belt texture - horizontal lines */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-px bg-black/30" style={{ marginTop: i === 0 ? 0 : 4 }} />
            ))}
          </div>

          {/* Vertical weave pattern */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-px bg-black/20"
                style={{ left: `${i * 5}%` }}
              />
            ))}
          </div>

          {/* Belt stripe */}
          <div
            className="absolute right-3 top-1.5 bottom-1.5 w-1.5 rounded-full"
            style={{ background: belt.gradientTo, filter: "brightness(0.7)" }}
          />

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/10" />

          {/* Belt text */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center ${isLightBelt ? "text-gray-800" : "text-white"}`}>
            <span className="font-bold text-base tracking-wide drop-shadow-sm">
              {belt.name}
            </span>
            <span className={`text-[10px] ${isLightBelt ? "text-gray-600" : "text-white/80"}`}>
              {belt.grade}
            </span>
          </div>
        </div>

        {/* Belt knot */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div
            className="w-6 h-6 rounded-full shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${belt.gradientFrom}, ${belt.gradientTo})`,
              border: belt.color === "white" ? "2px solid #D4D4D4" : "2px solid rgba(255,255,255,0.2)",
            }}
          />
          {/* Belt tails */}
          <div className="flex gap-1 -mt-1">
            <div
              className="w-2 h-8 rounded-b-sm shadow-md"
              style={{
                background: `linear-gradient(180deg, ${belt.gradientFrom}, ${belt.gradientTo})`,
                transform: "rotate(-8deg)",
              }}
            />
            <div
              className="w-2 h-10 rounded-b-sm shadow-md"
              style={{
                background: `linear-gradient(180deg, ${belt.gradientFrom}, ${belt.gradientTo})`,
                transform: "rotate(8deg)",
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Stat card component
 */
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "purple" | "green" | "amber";
}) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 text-blue-600 dark:text-blue-400",
    purple: "from-purple-500 to-purple-600 text-purple-600 dark:text-purple-400",
    green: "from-green-500 to-green-600 text-green-600 dark:text-green-400",
    amber: "from-amber-500 to-amber-600 text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className={`mb-2 ${colorClasses[color].split(" ")[2]} ${colorClasses[color].split(" ")[3]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

/**
 * Next belt requirements card
 */
function NextBeltCard({
  nextBelt,
  daysUntilEligible,
  daysSincePromotion,
  minDaysRequired,
}: {
  nextBelt: BeltDisplay;
  daysUntilEligible: number;
  daysSincePromotion: number;
  minDaysRequired: number;
}) {
  const progressToNextBelt = Math.min(100, (daysSincePromotion / minDaysRequired) * 100);
  const isEligible = daysUntilEligible === 0;

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <ChevronRight className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Next Belt: {nextBelt.name}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          ({nextBelt.grade})
        </span>
      </div>

      {/* Mini belt preview */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center shadow-md"
          style={{
            background: `linear-gradient(135deg, ${nextBelt.gradientFrom}, ${nextBelt.gradientTo})`,
            border: nextBelt.color === "white" ? "2px solid #D4D4D4" : "none",
          }}
        >
          <span
            className={`text-sm font-bold ${
              nextBelt.color === "white" || nextBelt.color === "yellow"
                ? "text-gray-800"
                : "text-white"
            }`}
          >
            {nextBelt.name}
          </span>
        </div>

        <div className="flex-1">
          {/* Progress bar */}
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextBelt}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full rounded-full relative overflow-hidden"
              style={{
                background: `linear-gradient(90deg, ${nextBelt.gradientFrom}, ${nextBelt.gradientTo})`,
              }}
            >
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
            </motion.div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {daysSincePromotion} / {minDaysRequired} days
            </span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {Math.round(progressToNextBelt)}%
            </span>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Requirements
        </h4>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isEligible
                ? "bg-green-500"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            {isEligible ? (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <Clock className="w-3 h-3 text-white" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Minimum Time Requirement
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isEligible
                ? "Eligible for grading!"
                : `${daysUntilEligible} days remaining`}
            </p>
          </div>
          {isEligible && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white"
            >
              Ready!
            </motion.span>
          )}
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-500">
            <Target className="w-3 h-3 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Technical Requirements
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Complete syllabus techniques for {nextBelt.grade}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
