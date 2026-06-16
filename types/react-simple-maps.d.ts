declare module "react-simple-maps" {
  import { FC, ReactNode, CSSProperties } from "react";

  export interface GeographyProps {
    geography: object;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: CSSProperties;
      hover?: CSSProperties;
      pressed?: CSSProperties;
    };
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (data: { geographies: Array<{ rsmKey: string } & object> }) => ReactNode;
  }

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: { scale?: number; center?: [number, number] };
    width?: number;
    height?: number;
    style?: CSSProperties;
    children?: ReactNode;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
  }

  export interface LineProps {
    from: [number, number];
    to: [number, number];
    stroke?: string;
    strokeWidth?: number;
    strokeLinecap?: string;
    strokeDasharray?: string;
  }

  export const ComposableMap: FC<ComposableMapProps>;
  export const Geographies: FC<GeographiesProps>;
  export const Geography: FC<GeographyProps>;
  export const Marker: FC<MarkerProps>;
  export const Line: FC<LineProps>;
  export const Sphere: FC<{ fill?: string; stroke?: string; strokeWidth?: number }>;
  export const Graticule: FC<{ stroke?: string; strokeWidth?: number }>;
}
