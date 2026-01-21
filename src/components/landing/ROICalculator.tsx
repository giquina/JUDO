import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TrendingUp, Clock, DollarSign } from "lucide-react";
import { calculateROI, formatCurrency } from "@/lib/landing-utils";
import { roiDefaults } from "@/lib/landing-data";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animation-variants";

export default function ROICalculator() {
  const [inputs, setInputs] = useState(roiDefaults);

  const results = calculateROI(inputs);

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-600/5" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">ROI Calculator</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            See your{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              return on investment
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate how much time and money you'll save with Judo Club Manager.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left column - Inputs */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Club Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Number of Members
                  </label>
                  <Input
                    type="number"
                    value={inputs.members}
                    onChange={(e) => handleInputChange('members', e.target.value)}
                    min="1"
                    max="1000"
                  />
                  <input
                    type="range"
                    value={inputs.members}
                    onChange={(e) => handleInputChange('members', e.target.value)}
                    min="10"
                    max="200"
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Admin Hours Per Week
                  </label>
                  <Input
                    type="number"
                    value={inputs.currentAdminHours}
                    onChange={(e) => handleInputChange('currentAdminHours', e.target.value)}
                    min="1"
                    max="40"
                  />
                  <input
                    type="range"
                    value={inputs.currentAdminHours}
                    onChange={(e) => handleInputChange('currentAdminHours', e.target.value)}
                    min="1"
                    max="40"
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Your Hourly Value (£)
                  </label>
                  <Input
                    type="number"
                    value={inputs.hourlyValue}
                    onChange={(e) => handleInputChange('hourlyValue', e.target.value)}
                    min="10"
                    max="200"
                  />
                  <input
                    type="range"
                    value={inputs.hourlyValue}
                    onChange={(e) => handleInputChange('hourlyValue', e.target.value)}
                    min="10"
                    max="100"
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Monthly Membership Fee (£)
                  </label>
                  <Input
                    type="number"
                    value={inputs.membershipFee}
                    onChange={(e) => handleInputChange('membershipFee', e.target.value)}
                    min="10"
                    max="200"
                  />
                  <input
                    type="range"
                    value={inputs.membershipFee}
                    onChange={(e) => handleInputChange('membershipFee', e.target.value)}
                    min="10"
                    max="100"
                    className="w-full mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right column - Results */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {/* Main ROI card */}
            <motion.div variants={scaleIn}>
              <Card className="bg-gradient-to-br from-primary/5 to-blue-600/5 border-primary/20">
                <CardContent className="p-8 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Monthly Net Benefit</p>
                  <p className="text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
                    {formatCurrency(results.netBenefit)}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-2xl font-bold">{results.roi.toFixed(0)}% ROI</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Payback period: <span className="font-semibold text-foreground">{results.paybackPeriod}</span>
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Breakdown cards */}
            <motion.div variants={scaleIn}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Time Saved</p>
                      <p className="text-2xl font-bold">{results.timeSaved.toFixed(1)} hrs/week</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Worth {formatCurrency(results.moneySaved)}/month
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Revenue Increase</p>
                      <p className="text-2xl font-bold">{formatCurrency(results.revenueIncrease)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    From better retention & collection
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Platform Cost</p>
                      <p className="text-xl font-semibold">{formatCurrency(results.platformCost)}/month</p>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {inputs.members <= 30 && "Starter Plan"}
                      {inputs.members > 30 && inputs.members <= 100 && "Growth Plan"}
                      {inputs.members > 100 && "Enterprise Plan"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            * Calculations based on industry averages: 70% reduction in admin time, 40% improvement in payment
            collection, and 15% better member retention. Your results may vary.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
