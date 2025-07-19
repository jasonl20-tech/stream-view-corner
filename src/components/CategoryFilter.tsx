import { Button } from "@/components/ui/button";

const categories = [
  "Alle",
  "machine",
  "toys",
  "brunette", 
  "teen",
  "orgasm",
  "natural",
  "Toys",
  "Pornstart"
];

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({ activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className={`whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
            activeCategory === category
              ? "btn-primary"
              : "hover:bg-card hover:border-primary/50"
          }`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};