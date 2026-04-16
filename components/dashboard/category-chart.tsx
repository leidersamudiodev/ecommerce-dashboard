"use client"

import { useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Sector } from "recharts"
import { categoryData } from "@/lib/mock-data"
import { useDashboard } from "@/lib/dashboard-context"

const COLORS = [
  "#06b6d4",
  "#22d3ee",
  "#14b8a6",
  "#2dd4bf",
  "#67e8f9",
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: {
      name: string
      value: number
    }
  }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
        <p className="text-sm font-medium text-gray-900">{data.payload.name}</p>
        <p className="mt-1 text-sm text-gray-600">
          Porcentaje: <span className="font-semibold text-cyan-600">{data.value}%</span>
        </p>
        <p className="mt-1 text-xs text-gray-400">Click para filtrar productos</p>
      </div>
    )
  }
  return null
}

// Active shape for hover effect
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 5}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: "drop-shadow(0 0 8px rgba(6, 182, 212, 0.5))" }}
      />
    </g>
  )
}

export function CategoryChart() {
  const { setSelectedCategory, selectedCategory } = useDashboard()
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  const handlePieClick = (data: any, index: number) => {
    const categoryName = categoryData[index].name
    if (selectedCategory === categoryName) {
      setSelectedCategory(null) // Clear filter if clicking same category
    } else {
      setSelectedCategory(categoryName)
    }
  }

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(undefined)
  }

  return (
    <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-premium transition-smooth hover:shadow-premium-hover">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">
          Categorías más Vendidas
        </h3>
        <p className="text-sm text-muted-foreground">
          {selectedCategory 
            ? `Filtrando: ${selectedCategory}` 
            : "Click en una categoría para filtrar"}
        </p>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              onClick={handlePieClick}
              style={{ cursor: "pointer" }}
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="transparent"
                  className="transition-all duration-200"
                  opacity={selectedCategory && selectedCategory !== entry.name ? 0.4 : 1}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {categoryData.map((item, index) => (
          <button
            key={item.name}
            onClick={() => {
              if (selectedCategory === item.name) {
                setSelectedCategory(null)
              } else {
                setSelectedCategory(item.name)
              }
            }}
            className={`flex items-center gap-2 rounded-lg p-1.5 transition-all ${
              selectedCategory === item.name 
                ? "bg-primary/10 ring-1 ring-primary/30" 
                : "hover:bg-secondary/50"
            } ${selectedCategory && selectedCategory !== item.name ? "opacity-50" : ""}`}
          >
            <div
              className="h-3 w-3 rounded-full transition-transform"
              style={{ 
                backgroundColor: COLORS[index],
                transform: selectedCategory === item.name ? "scale(1.2)" : "scale(1)"
              }}
            />
            <span className="text-xs text-muted-foreground">
              {item.name} ({item.value}%)
            </span>
          </button>
        ))}
      </div>
      {selectedCategory && (
        <button
          onClick={() => setSelectedCategory(null)}
          className="mt-3 w-full text-xs text-primary hover:underline"
        >
          Limpiar filtro
        </button>
      )}
    </div>
  )
}
