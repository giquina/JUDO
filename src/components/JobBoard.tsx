import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Clock, DollarSign, Star } from "lucide-react";
import { jobs, jobCategories, jobTypes, jobLocations, type Job } from "@/lib/jobData";

interface JobBoardProps {
  onJobClick: (job: Job) => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function JobBoard({ onJobClick }: JobBoardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [locationFilter, setLocationFilter] = useState<string>("All");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === "All" || job.category === categoryFilter;
      const matchesType = typeFilter === "All" || job.type === typeFilter;
      const matchesLocation = locationFilter === "All" || job.location === locationFilter;

      return matchesSearch && matchesCategory && matchesType && matchesLocation;
    });
  }, [searchQuery, categoryFilter, typeFilter, locationFilter]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-4 lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {jobCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            {jobTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            {jobLocations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredJobs.length} {filteredJobs.length === 1 ? "position" : "positions"}
      </div>

      {/* Job Cards Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredJobs.map((job) => (
          <motion.div key={job.id} variants={fadeInUp}>
            <Card
              className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer relative group bg-card/50 backdrop-blur-sm"
              onClick={() => onJobClick(job)}
            >
              {job.featured && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1">
                    <Star className="w-3 h-3 mr-1 inline" />
                    Featured
                  </Badge>
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {job.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {job.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <CardDescription className="line-clamp-2">
                  {job.description}
                </CardDescription>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="w-4 h-4 flex-shrink-0" />
                    <span>{job.salaryRange}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{job.location}</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <span className="text-primary text-sm font-medium group-hover:underline">
                    View Details →
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* No results */}
      {filteredJobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground text-lg mb-2">No positions found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </motion.div>
      )}
    </div>
  );
}
