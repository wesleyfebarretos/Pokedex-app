export class NumberUtil {
    public static tryParseInt(input: string, def?: number): number | undefined {
        const output: number = parseInt(input);
        return isFinite(output) ? output : def;
    }

    public static tryParseUint(input: string, def?: number): number | undefined {
        const output: number = parseInt(input);
        return isFinite(output) ? Math.min(Math.max(output, 0), Number.MAX_SAFE_INTEGER) : def;
    }

    public static tryParseNumber(input: string, def?: number): number | undefined {
        const output: number = parseFloat(input);
        return isFinite(output) ? output : def;
    }

    public static tryParseNumberWithComma(input: string | number, def?: number): number | undefined {
        if (typeof input === "string") {
            const output = parseFloat(String(input).replace(",", "."));
            return isFinite(output) ? output : def;
        }
        return isFinite(<number>input) ? input : def;
    }

    public static clamp(input: number, min: number, max: number): number {
        return Math.min(Math.max(input, min), max);
    }

    public static zeroPadded(num: number, len = 2): string {
        return String(num).padStart(len, "0");
    }

    public static fix(input: number, fractionDigits = 1): number {
        return +input.toFixed(fractionDigits);
    }
}
