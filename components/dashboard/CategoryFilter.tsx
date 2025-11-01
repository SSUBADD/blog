"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"

interface Category {
  id: string
  name: string
  color: string
  count?: number
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategories?: string[]
  onCategoryToggle?: (categoryId: string) => void
}

export function CategoryFilter({
  categories,
  selectedCategories = [],
  onCategoryToggle,
}: CategoryFilterProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">카테고리별 필터</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id)
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryToggle?.(category.id)}
              className={`px-4 py-2 rounded-full border-2 transition-all ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
              }`}
            >
              <span className="font-medium">{category.name}</span>
              {category.count !== undefined && (
                <span className="ml-2 text-xs opacity-70">({category.count})</span>
              )}
            </button>
          )
        })}
      </div>
      
      {selectedCategories.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={() => selectedCategories.forEach((id) => onCategoryToggle?.(id))}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            필터 초기화
          </button>
        </div>
      )}
    </Card>
  )
}

