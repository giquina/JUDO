import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  Wind,
  CloudDrizzle,
  CloudFog,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Weather {
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "drizzle" | "foggy" | "windy";
  humidity?: number;
  windSpeed?: number;
  location: string;
}

export interface WeatherWidgetProps {
  weather: Weather;
  onClick?: () => void;
  className?: string;
}

const weatherIcons = {
  sunny: { icon: Sun, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  cloudy: { icon: Cloud, color: "text-gray-500", bg: "bg-gray-500/10" },
  rainy: { icon: CloudRain, color: "text-blue-500", bg: "bg-blue-500/10" },
  snowy: { icon: CloudSnow, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  drizzle: { icon: CloudDrizzle, color: "text-blue-400", bg: "bg-blue-400/10" },
  foggy: { icon: CloudFog, color: "text-gray-400", bg: "bg-gray-400/10" },
  windy: { icon: Wind, color: "text-teal-500", bg: "bg-teal-500/10" },
};

const weatherMessages = {
  sunny: "Perfect weather for outdoor training!",
  cloudy: "Good conditions for training",
  rainy: "Indoor training recommended",
  snowy: "Stay warm during training",
  drizzle: "Light rain, training possible",
  foggy: "Be careful outdoors",
  windy: "Windy conditions today",
};

export function WeatherWidget({ weather, onClick, className }: WeatherWidgetProps) {
  const { icon: Icon, color, bg } = weatherIcons[weather.condition];
  const message = weatherMessages[weather.condition];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-6 cursor-pointer transition-shadow hover:shadow-lg",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            Weather
          </h3>
          <p className="text-xs text-muted-foreground">{weather.location}</p>
        </div>

        <motion.div
          animate={{
            rotate: weather.condition === "sunny" ? [0, 360] : 0,
            scale: weather.condition === "sunny" ? [1, 1.1, 1] : 1,
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity },
          }}
          className={cn("p-2 rounded-lg", bg)}
        >
          <Icon className={cn("h-6 w-6", color)} />
        </motion.div>
      </div>

      {/* Temperature */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">{weather.temperature}</span>
          <span className="text-2xl text-muted-foreground">°C</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1 capitalize">
          {weather.condition}
        </p>
      </div>

      {/* Additional info */}
      {(weather.humidity !== undefined || weather.windSpeed !== undefined) && (
        <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
          {weather.humidity !== undefined && (
            <div className="flex items-center gap-1">
              <CloudDrizzle className="h-3 w-3" />
              <span>{weather.humidity}%</span>
            </div>
          )}
          {weather.windSpeed !== undefined && (
            <div className="flex items-center gap-1">
              <Wind className="h-3 w-3" />
              <span>{weather.windSpeed} km/h</span>
            </div>
          )}
        </div>
      )}

      {/* Training message */}
      <div className="pt-3 border-t">
        <p className="text-xs text-muted-foreground">{message}</p>
      </div>
    </motion.div>
  );
}
