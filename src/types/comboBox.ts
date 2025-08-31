export interface ComboBoxItem {
  id: string
  Value: string
  Label: string
}

export type ComboBoxResponse = ComboBoxItem[]

export interface University extends ComboBoxItem {}

export interface Faculty extends ComboBoxItem {}

export interface Course extends ComboBoxItem {}