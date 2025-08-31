import type { FriendlyFilterModel, FriendlyFilterRecord } from '../types/program'
import type { ComboBoxItem, University } from '../types/comboBox'

export const createFriendlyFilterValue = (
  label: string,
  value: string | number | boolean | null
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

export const createEmptyFriendlyFilter = (): FriendlyFilterModel => 
  createFriendlyFilterValue('All', null)

export const createFriendlyFilterRecord = <T extends Record<string, string | null>>(
  filterModel: T,
  labelResolvers: Record<keyof T, (value: string | null) => string>
): FriendlyFilterRecord<T> => {
  const result = {} as FriendlyFilterRecord<T>
  
  for (const key in filterModel) {
    const value = filterModel[key]
    const resolver = labelResolvers[key]
    const label = resolver ? resolver(value) : String(value || 'All')
    
    result[key] = createFriendlyFilterValue(label, value)
  }
  
  return result
}