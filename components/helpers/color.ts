

class Palette {
  readonly black = "#000000";
  readonly white = "#ffffff";
  readonly gray900 = "#171717";
  readonly gray800 = "#3b3b3b";
  readonly gray700 = "#4f4f4f";
  readonly gray600 = "#616161";
  readonly gray500 = "#828282";
  readonly gray400 = "#9e9e9e";
  readonly gray300 = "#d4d4d4";
  readonly gray200 = "#e0e0e0";
  readonly gray100 = "#f2f2f2";
}

export class Color {
  private static instance: Color;
  readonly palette: Palette;

  private constructor() {
    this.palette = new Palette();
  }

  public static getInstance(): Color {
    if (!Color.instance) {
      Color.instance = new Color();
    }
    return Color.instance;
  }
}

export const color = Color.getInstance();
