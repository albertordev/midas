'use client'

import { BalanceVsBudget } from '@/types'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'


export const DashboardLineChart = ({
  data,
}: {
  data: BalanceVsBudget[]
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          name="Saldo"
          dataKey="balance"
          stroke="#A16207"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          name="Presupuesto"
          dataKey="budget"
          stroke="#3B82F6"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
