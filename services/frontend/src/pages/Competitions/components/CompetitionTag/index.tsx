import { cn } from "@/shared/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CompetitionTagProps {
  label: string;
  variant: 'olympics' | 'status';
  className?: string;
}

const CompetitionTag = ({ label, variant, className }: CompetitionTagProps) => {
  return (
    <Badge 
      variant="secondary"
      className={cn(
        "text-xs font-medium",
        variant === 'olympics' && "bg-yellow-400 text-yellow-800 hover:bg-yellow-500 font-hse-sans",
        variant === 'status' && "bg-black text-white hover:bg-gray-800 font-hse-sans",
        className 
      )}
    >
      {label}
    </Badge>
  );
}

export default CompetitionTag