import Image from 'next/image'
import ReactDatePicker from 'react-datepicker'
import { Control } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { FormFieldType } from '@/constants'
import { cn } from '@/lib/utils'

interface CustomProps {
  control: Control<any>
  name: string
  label?: string
  type?: string
  placeholder?: string
  iconSrc?: string
  iconAlt?: string
  disabled?: boolean
  dateFormat?: string
  showTimeSelect?: boolean
  children?: React.ReactNode
  renderSkeleton?: (field: any) => React.ReactNode
  fieldType: FormFieldType
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="border-dark-500 bg-dark-400 relative flex rounded-md border">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={22}
              width={22}
              alt={props.iconAlt || 'icon'}
              className="absolute -left-0.5 top-1.5 ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              type={props.type || 'text'}
              {...field}
              className={cn(
                'input focus-visible:ring-0',
                props.iconSrc && 'pl-8'
              )}
            />
          </FormControl>
        </div>
      )
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="input focus-visible:ring-0"
          />
        </FormControl>
      )
    case FormFieldType.DATE_PICKER:
      return (
        <div className="border-dark-500 bg-dark-400 flex rounded-md border">
          <Image
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt="user"
            className="ml-2"
          />
          <FormControl>
            <ReactDatePicker
              showTimeSelect={props.showTimeSelect ?? false}
              selected={field.value}
              onChange={(date: Date | null) => field.onChange(date)}
              timeInputLabel="Time:"
              dateFormat={props.dateFormat ?? 'MM/dd/yyyy'}
              wrapperClassName="date-picker"
            />
          </FormControl>
        </div>
      )
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="input">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="border-gray-300 bg-white focus:border-gray-500 focus-visible:ring-0">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      )
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null
    default:
      return null
  }
}

const CustomFormField = (props: CustomProps) => {
  const { control, name, label } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="shad-input-label">{label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  )
}

export default CustomFormField
