export interface BoxPercent {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface ScanItem {
  id: string;
  name: string;
  confidence: number;
  box: BoxPercent;
}

export interface ScanData {
  photoUrl: string;
  items: ScanItem[];
}

export interface AnchorPoint {
  x: number;
  y: number;
}

export interface ConnectorAnchor {
  itemId: string;
  boxAnchor: AnchorPoint;
  cardAnchor: AnchorPoint;
}
