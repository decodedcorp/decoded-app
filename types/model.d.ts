export interface imageDoc {
  id: String;
  hoverItem: HoverItem;
  tags: String[];
}

export interface HoverItem {
  itemDocId: String;
  position: Position;
}

export interface Position {
  top?: String;
  left?: String;
  right?: String;
  bottom?: String;
}

export interface Item {
  id: String;
  name: String;
  price: String;
  url: String;
  tags: String[];
}
