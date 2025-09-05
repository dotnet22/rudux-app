import type React from 'react'
import {
  DataGrid,
  type GridValidRowModel,
} from '@mui/x-data-grid'
import { Box, Paper, Typography } from '@mui/material'
import type { DataGridFooterProps, DataGridToolbarProps, SimpleDataGridProps } from '../../../core/types';

interface ProgramsListSlots {
  filter: React.ElementType;
  filterDisplay: React.ElementType;
  dataGridToolbar?: React.ComponentType<DataGridToolbarProps>;
  dataGridFooter?: React.ComponentType<DataGridFooterProps>;
}

interface ProgramsListSlotProps<R extends GridValidRowModel = GridValidRowModel> {
  filterProps?: Record<string, unknown>
  filterDisplayProps?: Record<string, unknown>
  dataGridProps: SimpleDataGridProps<R>;
  dataGridToolbarProps?: DataGridToolbarProps
  dataGridFooterProps?: DataGridFooterProps
}

interface ProgramsListProps {
  slots?: Partial<ProgramsListSlots>
  slotProps?: ProgramsListSlotProps
}

const ProgramsListView = ({ slots, slotProps }: ProgramsListProps) => {

  // if (error) {
  //   return (
  //     <Paper sx={{ p: 3, mt: 2 }}>
  //       <Typography color="error">Error loading programs data</Typography>
  //     </Paper>
  //   )
  // }

  const FilterSlot = slots?.filter;
  const FilterDisplaySlot = slots?.filterDisplay;
  const DataGridToolbarSlot = slots?.dataGridToolbar;
  const DataGridFooterSlot = slots?.dataGridFooter;

  const { columns, rows, currentPage, pageSize, totalRecords, loading, handlePaginationModelChange, handleSortModelChange } = slotProps!.dataGridProps;

  return (
    <>
      {FilterSlot && <FilterSlot {...(slotProps?.filterProps || {})} />}
      {FilterDisplaySlot && <FilterDisplaySlot {...(slotProps?.filterDisplayProps || {})} />}

      {/* Data Grid */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h5" gutterBottom>
          Programs
        </Typography>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationMode="server"
            sortingMode="server"
            paginationModel={{ page: currentPage, pageSize }}
            onPaginationModelChange={handlePaginationModelChange}
            onSortModelChange={handleSortModelChange}
            rowCount={totalRecords}
            loading={loading}
            pageSizeOptions={[10, 20, 50, 100]}
            disableRowSelectionOnClick
            slots={{
              toolbar: DataGridToolbarSlot,
              footer: DataGridFooterSlot
            }}
            slotProps={{
              loadingOverlay: {
                variant: 'skeleton',
                noRowsVariant: 'skeleton',
              },
            }}
          />
        </Box>
      </Paper>
    </>
  )
}

ProgramsListView.defaultProps = {
  slots: {},
  slotProps: {}
}

export default ProgramsListView
export type { ProgramsListProps as ProgramsListViewProps, ProgramsListSlotProps as ProgramsListViewSlotProps }