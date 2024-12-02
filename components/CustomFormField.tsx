import Image from 'next/image'
import ReactDatePicker from 'react-datepicker'
import { Control } from 'react-hook-form'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { es } from 'date-fns/locale/es'

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

import 'react-datepicker/dist/react-datepicker.css'

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
  onSelectValueChanged?: (value: any) => void
}

registerLocale('es', es)

const RenderInput = ({
  field,
  props,
  onSelectValueChanged,
}: {
  field: any
  props: CustomProps
  onSelectValueChanged: (value: any) => void
}) => {
  const handleSelectValueChanged = (value: string) => {
    field.onChange(value)
    onSelectValueChanged(value)
  }

  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="relative flex rounded-md border">
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
        <div className="flex items-center rounded-md border border-gray-300 bg-white py-[0.5rem] focus:border-gray-500 focus-visible:ring-0">
          <Image
            src="/icons/calendar.svg"
            height={24}
            width={24}
            alt="user"
            className="mx-2"
          />
          <FormControl>
            <ReactDatePicker
              className="input outline-none focus-visible:ring-0"
              showTimeSelect={props.showTimeSelect ?? false}
              selected={field.value}
              locale="es"
              onChange={(date: Date | null) => date && field.onChange(date)}
              dateFormat={props.dateFormat ?? 'dd/MM/yyyy'}
            />
          </FormControl>
        </div>
      )
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select
            onValueChange={handleSelectValueChanged}
            defaultValue={undefined}
            value={field.value}>
            <FormControl className="rounded-md border border-gray-300 bg-white focus:border-gray-500 focus-visible:ring-0">
              <SelectTrigger>
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="rounded-md border border-gray-300 bg-white focus:border-gray-500 focus-visible:ring-0">
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
  const { control, name, label, onSelectValueChanged } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="shad-input-label">{label}</FormLabel>
          )}
          <RenderInput
            field={field}
            props={props}
            onSelectValueChanged={(value: any) =>
              onSelectValueChanged && onSelectValueChanged(value)
            }
          />

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  )
}

export default CustomFormField
