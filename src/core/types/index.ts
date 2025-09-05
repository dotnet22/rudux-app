import type { FooterPropsOverrides, GridColDef, GridPaginationModel, GridRowsProp, GridSortModel, GridToolbarProps, GridValidRowModel } from "@mui/x-data-grid";

export type DataGridToolbarProps = {
} & GridToolbarProps;

export type DataGridFooterProps = {
} & FooterPropsOverrides

export type SimpleDataGridProps<R extends GridValidRowModel = GridValidRowModel> = {
    currentPage: number;
    pageSize: number;
    handlePaginationModelChange: (model: GridPaginationModel) => void
    handleSortModelChange: (model: GridSortModel) => void,
    rows?: GridRowsProp<R>;
    columns: readonly GridColDef<R>[];
    totalRecords?: number;
    loading: boolean;
}