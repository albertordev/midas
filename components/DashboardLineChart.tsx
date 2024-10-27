'use client'

import React, { useEffect, useState } from 'react'
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

const data = [
  {
    name: 'Ene',
    balance: 1000,
    budget: 900,
  },
  {
    name: 'Feb',
    balance: 800,
    budget: 1000,
  },
  {
    name: 'Mar',
    balance: 850,
    budget: 950,
  },
  {
    name: 'Abr',
    balance: 975,
    budget: 900,
  },
  {
    name: 'Jun',
    balance: 980,
    budget: 955,
  },
  {
    name: 'Jul',
    balance: 1100,
    budget: 1000,
  },
  {
    name: 'Ago',
    balance: 960,
    budget: 880,
  },
  {
    name: 'Sep',
    balance: 925,
    budget: 950,
  },
  {
    name: 'Oct',
    balance: 1050,
    budget: 890,
  },
  {
    name: 'Nov',
    balance: 885,
    budget: 925,
  },
  {
    name: 'Dic',
    balance: 1200,
    budget: 1150,
  },
]

export const DashboardLineChart = () => {
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
