import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'

import { ArrowUpDown } from 'lucide-react'
import { AccountColumns, MovementColumns } from '@/constants'
import Image from 'next/image'
import { AccountModel, MovementModel } from '@/types/appwrite.types'
import CellAction from '@/components/CellAction'
import { formatAmount } from './utils'

export const accountColumns: ({
  labels,
  actions,
}: {
  labels: string[]
  actions: string[]
}) => ColumnDef<AccountModel>[] = ({
  labels,
  actions,
}: {
  labels: string[]
  actions: string[]
}) => {
  return [
    {
      accessorKey: 'code',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === 'asc')
            }>
            {labels[AccountColumns.CODE]}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <p className="text-center text-gray-500">{row.getValue('code')}</p>
        )
      },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => {
        return (
          <p className="min-w-[100px] text-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }>
              {labels[AccountColumns.DESCRIPTION]}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </p>
        )
      },
      cell: ({ row }) => {
        return (
          <p className="text-start text-gray-500">
            {row.getValue('description')}
          </p>
        )
      },
    },
    {
      accessorKey: 'icon',
      header: () => (
        <div className="text-center">{labels[AccountColumns.ICON]}</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-full justify-center">
            <Image
              src={row.getValue('icon')}
              alt={row.getValue('code')}
              width={20}
              height={20}
            />
          </div>
        )
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => {
        return (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }>
              {labels[AccountColumns.TYPE]}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="text-center text-gray-500">
            {row.getValue('type')}
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: () => (
        <div className="text-center">{labels[AccountColumns.ACTIONS]}</div>
      ),
      cell: ({ row }) => (
        <CellAction
          origin="accounts"
          row={row}
          labels={labels}
          actions={actions}
        />
      ),
    },
  ]
}

export const movementColumns: ({
  labels,
  actions,
}: {
  labels: string[]
  actions: string[]
}) => ColumnDef<MovementModel>[] = ({
  labels,
  actions = [],
}: {
  labels: string[]
  actions: string[]
}) => {
  return [
    {
      accessorKey: 'account',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === 'asc')
            }>
            {labels[MovementColumns.ACCOUNT]}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <p className="text-center text-gray-500">{row.getValue('account')}</p>
        )
      },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => {
        return (
          <p className="min-w-[100px] text-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }>
              {labels[MovementColumns.DESCRIPTION]}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </p>
        )
      },
      cell: ({ row }) => {
        return (
          <p className="text-start text-gray-500">
            {row.getValue('description')}
          </p>
        )
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => {
        return (
          <p className="min-w-[100px] text-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }>
              {labels[MovementColumns.TYPE]}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </p>
        )
      },
      cell: ({ row }) => {
        return (
          <p className="text-center text-gray-500">{row.getValue('type')}</p>
        )
      },
    },
    {
      accessorKey: 'parsedDate',
      header: () => (
        <div className="text-center">{labels[MovementColumns.DATE]}</div>
      ),
      cell: ({ row }) => {
        return (
          <p className="text-center text-gray-500">
            {row.getValue('parsedDate')}
          </p>
        )
      },
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => {
        return (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }>
              {labels[MovementColumns.AMOUNT]}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="text-center text-gray-500">
            {formatAmount(row.getValue('amount'), 'es')}
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: () => (
        <div className="text-center">{labels[MovementColumns.ACTIONS]}</div>
      ),
      cell: ({ row }) => (
        <CellAction
          origin="movements"
          row={row}
          labels={labels}
          actions={actions}
        />
      ),
    },
  ]
}

export const historyColumns: ({
  labels,
}: {
  labels: string[]
}) => ColumnDef<MovementModel>[] = ({ labels }: { labels: string[] }) => {
  return [
    {
      accessorKey: 'account',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === 'asc')
            }>
            {labels[MovementColumns.ACCOUNT]}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <p className="text-center text-gray-500">{row.getValue('account')}</p>
        )
      },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => {
        return (
          <p className="min-w-[100px] text-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }>
              {labels[MovementColumns.DESCRIPTION]}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </p>
        )
      },
      cell: ({ row }) => {
        return (
          <p className="text-start text-gray-500">
            {row.getValue('description')}
          </p>
        )
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => {
        return (
          <p className="min-w-[100px] text-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }>
              {labels[MovementColumns.TYPE]}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </p>
        )
      },
      cell: ({ row }) => {
        return (
          <p className="text-center text-gray-500">{row.getValue('type')}</p>
        )
      },
    },
    {
      accessorKey: 'parsedDate',
      header: () => (
        <div className="text-center">{labels[MovementColumns.DATE]}</div>
      ),
      cell: ({ row }) => {
        return (
          <p className="text-center text-gray-500">
            {row.getValue('parsedDate')}
          </p>
        )
      },
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => {
        return (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }>
              {labels[MovementColumns.AMOUNT]}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="text-center text-gray-500">
            {formatAmount(row.getValue('amount'), 'es')}
          </div>
        )
      },
    },
  ]
}
