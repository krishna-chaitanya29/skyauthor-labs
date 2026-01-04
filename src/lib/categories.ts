// Comprehensive list of article categories
// Add new categories here - they will automatically appear everywhere

export interface Category {
  value: string;
  label: string;
  color: string;
  icon?: string;
}

export const categories: Category[] = [
  { value: 'AI', label: 'Artificial Intelligence', color: 'bg-purple-500' },
  { value: 'Gaming', label: 'Gaming', color: 'bg-pink-500' },
  { value: 'News', label: 'News', color: 'bg-red-500' },
  { value: 'Entertainment', label: 'Entertainment', color: 'bg-rose-500' },
  { value: 'Money', label: 'Finance & Money', color: 'bg-green-500' },
  { value: 'Tech', label: 'Technology', color: 'bg-blue-500' },
  { value: 'Tutorial', label: 'Tutorials & Guides', color: 'bg-cyan-500' },
  { value: 'Science', label: 'Science', color: 'bg-blue-600' },
  { value: 'Crypto', label: 'Crypto & Web3', color: 'bg-amber-500' },
  { value: 'Programming', label: 'Programming', color: 'bg-indigo-500' },
  { value: 'Startup', label: 'Startups & Business', color: 'bg-orange-500' },
  { value: 'Lifestyle', label: 'Lifestyle', color: 'bg-rose-400' },
];

// Get category by value
export const getCategoryByValue = (value: string): Category | undefined => {
  return categories.find(cat => cat.value.toLowerCase() === value.toLowerCase());
};

// Get category color class
export const getCategoryColor = (value: string): string => {
  const category = getCategoryByValue(value);
  return category?.color || 'bg-gray-500';
};

// Get all category values (lowercase) for sitemap/routing
export const getCategoryValues = (): string[] => {
  return categories.map(cat => cat.value.toLowerCase());
};

// Add custom category at runtime (for dynamic categories from DB)
export const addCategory = (category: Category): void => {
  if (!categories.find(c => c.value === category.value)) {
    categories.push(category);
  }
};
