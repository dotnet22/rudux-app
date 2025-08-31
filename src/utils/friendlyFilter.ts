import dayjs from 'dayjs'
import type { FriendlyFilterModel, FriendlyFilterRecord } from '../types/program'
import type { ComboBoxItem, University } from '../types/comboBox'

export const createFriendlyFilterValue = (
  label: string,
  value: string | number | boolean | Date | null
): FriendlyFilterModel => ({
  Label: label,
  Value: value,
})

export const resolveLabelFromComboBoxData = (
  value: string | null,
  comboBoxData: ComboBoxItem[] | University[]
): string => {
  if (!value || !comboBoxData?.length) {
    return 'All'
  }
  
  const item = comboBoxData.find(item => 
    'Value' in item ? item.Value === value : false
  )
  
  return item?.Label || 'Unknown'
}

export const resolveBooleanLabel = (value: boolean | null): string => {
  if (value === null) return 'All'
  return value ? 'Active' : 'Inactive'
}

export const resolveStringLabel = (value: string | null): string => {
  if (!value || value.trim() === '') return 'All'
  return `"${value}"`
}

export const resolveDateLabel = (value: Date | null, format = 'MM/DD/YYYY'): string => {
  if (!value) return 'All'
  return dayjs(value).format(format)
}

export const createEmptyFriendlyFilter = (): FriendlyFilterModel => 
  createFriendlyFilterValue('All', null)

export const createFriendlyFilterRecord = <T>(
  filterModel: T,
  labelResolvers: Record<keyof T, (value: unknown) => string>
): FriendlyFilterRecord<T> => {
  const result = {} as FriendlyFilterRecord<T>
  
  for (const key in filterModel) {
    const value = filterModel[key]
    const resolver = labelResolvers[key]
    const label = resolver ? resolver(value) : String(value || 'All')
    
    result[key] = createFriendlyFilterValue(label, value as string | number | boolean | Date | null)
  }
  
  return result
}