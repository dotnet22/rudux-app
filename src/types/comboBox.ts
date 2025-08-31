export interface ComboBoxItem {
  id: string
  Value: string
  Label: string
}

export type ComboBoxResponse = ComboBoxItem[]

export interface University {
  Value: string
  Label: string
}

export type Faculty = ComboBoxItem

export type Course = ComboBoxItem