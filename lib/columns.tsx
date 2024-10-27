import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, ArrowUpDown, Edit, Trash } from 'lucide-react'
import { AccountColumns } from '@/constants'
import Image from 'next/image'
import { AccountModel } from '@/types/appwrite.types'

export const accountColumns: ({
  labels,
}: {
  labels: string[]
}) => ColumnDef<AccountModel>[] = ({ labels }: { labels: string[] }) => {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === 'asc')
            }>
            Id
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'account',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === 'asc')
            }>
            {labels[AccountColumns.ACCOUNT]}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === 'asc')
            }>
            {labels[AccountColumns.DESCRIPTION]}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
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
              alt={row.getValue('account')}
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
    },
    {
      id: 'actions',
      header: () => (
        <div className="text-center">{labels[AccountColumns.ACTIONS]}</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex w-full justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 focus-visible:ring-gray-500">
                  <span className="sr-only">
                    {labels[AccountColumns.ACTIONS]}
                  </span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
                  <Edit className="h-4 w-4" />
                  {labels[AccountColumns.EDIT]}
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:text-bg-gray-900 flex cursor-pointer items-center gap-2">
                  <Trash className="h-4 w-4" />
                  {labels[AccountColumns.DELETE]}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
