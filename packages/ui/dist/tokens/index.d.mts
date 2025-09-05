declare const tokens: {
    readonly colors: {
        readonly primary: "#EAFD66";
        readonly black: "#000000";
        readonly white: "#ffffff";
        readonly gray: {
            readonly 900: "#171717";
            readonly 800: "#3b3b3b";
            readonly 700: "#4f4f4f";
            readonly 600: "#616161";
            readonly 500: "#828282";
            readonly 400: "#9e9e9e";
            readonly 300: "#d4d4d4";
            readonly 200: "#e0e0e0";
            readonly 100: "#f2f2f2";
        };
        readonly semantic: {
            readonly success: "#16a34a";
            readonly error: "#dc2626";
            readonly warning: "#d97706";
            readonly info: "#0ea5e9";
        };
        readonly state: {
            readonly hover: "rgba(234, 253, 102, 0.1)";
            readonly active: "rgba(234, 253, 102, 0.2)";
            readonly disabled: "rgba(130, 130, 130, 0.5)";
        };
    };
    readonly spacing: {
        readonly 0: "0";
        readonly 1: "0.25rem";
        readonly 2: "0.5rem";
        readonly 3: "0.75rem";
        readonly 4: "1rem";
        readonly 5: "1.25rem";
        readonly 6: "1.5rem";
        readonly 8: "2rem";
        readonly 10: "2.5rem";
        readonly 12: "3rem";
        readonly 'button-sm': "0.5rem 0.75rem";
        readonly 'button-md': "0.75rem 1.5rem";
        readonly 'button-lg': "1rem 2rem";
        readonly 'input-padding': "0.75rem 1rem";
    };
    readonly borderRadius: {
        readonly none: "0";
        readonly sm: "0.125rem";
        readonly md: "0.375rem";
        readonly lg: "0.5rem";
        readonly xl: "0.75rem";
        readonly '2xl': "1rem";
        readonly full: "9999px";
    };
    readonly fontSize: {
        readonly xs: readonly ["0.75rem", {
            readonly lineHeight: "1rem";
        }];
        readonly sm: readonly ["0.875rem", {
            readonly lineHeight: "1.25rem";
        }];
        readonly base: readonly ["1rem", {
            readonly lineHeight: "1.5rem";
        }];
        readonly lg: readonly ["1.125rem", {
            readonly lineHeight: "1.75rem";
        }];
        readonly xl: readonly ["1.25rem", {
            readonly lineHeight: "1.75rem";
        }];
        readonly '2xl': readonly ["1.5rem", {
            readonly lineHeight: "2rem";
        }];
    };
    readonly boxShadow: {
        readonly none: "none";
        readonly sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
        readonly md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
        readonly lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
        readonly xl: "0 25px 50px -12px rgba(0, 0, 0, 0.25)";
    };
    readonly zIndex: {
        readonly base: 0;
        readonly raised: 1;
        readonly dropdown: 10;
        readonly sticky: 20;
        readonly overlay: 30;
        readonly modal: 40;
        readonly popover: 50;
        readonly tooltip: 60;
    };
    readonly transition: {
        readonly duration: {
            readonly fast: "150ms";
            readonly normal: "300ms";
            readonly slow: "500ms";
        };
        readonly timing: {
            readonly ease: "cubic-bezier(0.4, 0, 0.2, 1)";
            readonly 'ease-in': "cubic-bezier(0.4, 0, 1, 1)";
            readonly 'ease-out': "cubic-bezier(0, 0, 0.2, 1)";
        };
    };
};
type Tokens = typeof tokens;

export { type Tokens, tokens };
