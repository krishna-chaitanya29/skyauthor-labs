// Comprehensive list of article categories
// Add new categories here - they will automatically appear everywhere

export interface Category {
  value: string;
  label: string;
  color: string;
  icon?: string;
}

export const categories: Category[] = [
  // Technology & Computing
  { value: 'Tech', label: 'Technology', color: 'bg-blue-500' },
  { value: 'AI', label: 'Artificial Intelligence', color: 'bg-purple-500' },
  { value: 'Programming', label: 'Programming & Coding', color: 'bg-indigo-500' },
  { value: 'Web Dev', label: 'Web Development', color: 'bg-cyan-500' },
  { value: 'Mobile', label: 'Mobile Apps', color: 'bg-teal-500' },
  { value: 'Cloud', label: 'Cloud & DevOps', color: 'bg-sky-500' },
  { value: 'Cybersecurity', label: 'Cybersecurity', color: 'bg-red-600' },
  { value: 'Data Science', label: 'Data Science & ML', color: 'bg-violet-500' },
  { value: 'Blockchain', label: 'Blockchain & Web3', color: 'bg-amber-500' },
  { value: 'Gaming', label: 'Gaming & Esports', color: 'bg-pink-500' },
  { value: 'Gadgets', label: 'Gadgets & Reviews', color: 'bg-slate-500' },
  
  // Business & Finance
  { value: 'Money', label: 'Finance & Money', color: 'bg-green-500' },
  { value: 'Startup', label: 'Startups & Business', color: 'bg-orange-500' },
  { value: 'Crypto', label: 'Cryptocurrency', color: 'bg-yellow-500' },
  { value: 'Investing', label: 'Investing & Stocks', color: 'bg-emerald-500' },
  { value: 'Career', label: 'Career & Jobs', color: 'bg-lime-500' },
  { value: 'Marketing', label: 'Marketing & SEO', color: 'bg-fuchsia-500' },
  { value: 'Ecommerce', label: 'E-commerce', color: 'bg-rose-500' },
  
  // Science & Innovation
  { value: 'Science', label: 'Science & Research', color: 'bg-blue-600' },
  { value: 'Space', label: 'Space & Astronomy', color: 'bg-indigo-600' },
  { value: 'Health', label: 'Health & Biotech', color: 'bg-green-600' },
  { value: 'Environment', label: 'Environment & Climate', color: 'bg-teal-600' },
  { value: 'EVs', label: 'Electric Vehicles', color: 'bg-emerald-600' },
  
  // Content & Media
  { value: 'News', label: 'Breaking News', color: 'bg-red-500' },
  { value: 'Tutorial', label: 'Tutorials & Guides', color: 'bg-cyan-500' },
  { value: 'Reviews', label: 'Reviews & Comparisons', color: 'bg-amber-600' },
  { value: 'Opinion', label: 'Opinion & Analysis', color: 'bg-purple-600' },
  { value: 'Interview', label: 'Interviews', color: 'bg-pink-600' },
  
  // Lifestyle & Productivity
  { value: 'Productivity', label: 'Productivity & Tools', color: 'bg-blue-400' },
  { value: 'Lifestyle', label: 'Lifestyle & Tech Life', color: 'bg-rose-400' },
  { value: 'Education', label: 'Education & Learning', color: 'bg-indigo-400' },
  { value: 'Design', label: 'Design & UI/UX', color: 'bg-violet-400' },
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
