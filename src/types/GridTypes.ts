import { GridProps } from '@mui/material/Grid';

export interface CustomGridItemProps extends GridProps {
  item: true;
  xs: number;
  md?: number;
  component?: 'div' | 'section' | 'article';
}
