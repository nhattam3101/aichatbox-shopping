export type CustomDimensions = {
  lengthCm: number;
  widthCm: number;
  thicknessCm: number;
};

export type CustomSizeValidationResult = {
  isValid: boolean;
  lengthError?: string;
  widthError?: string;
  thicknessError?: string;
  generalError?: string;
  dimensions?: CustomDimensions;
};

/**
 * Validates a single dimension string:
 * - numeric only
 * - must be > 0
 * - max 1 decimal place (e.g. 32 or 32.5)
 * - no letters, no negative numbers, no scientific notation (no e/E, +, -)
 */
export function isValidDecimalString(val: string): boolean {
  if (typeof val !== "string") return false;
  const trimmed = val.trim();
  if (!trimmed) return false;
  return /^\d+(\.\d{1})?$/.test(trimmed) && parseFloat(trimmed) > 0;
}

export function validateCustomDimensions(
  lengthStr: string,
  widthStr: string,
  thicknessStr: string
): CustomSizeValidationResult {
  const lTrim = (lengthStr ?? "").trim();
  const wTrim = (widthStr ?? "").trim();
  const tTrim = (thicknessStr ?? "").trim();

  // Missing values
  if (!lTrim || !wTrim || !tTrim) {
    return {
      isValid: false,
      generalError: "Vui lòng nhập đầy đủ kích thước máy.",
      lengthError: !lTrim ? "Vui lòng nhập chiều dài máy." : undefined,
      widthError: !wTrim ? "Vui lòng nhập chiều rộng máy." : undefined,
      thicknessError: !tTrim ? "Vui lòng nhập độ dày máy." : undefined,
    };
  }

  const isLValidFormat = isValidDecimalString(lTrim);
  const isWValidFormat = isValidDecimalString(wTrim);
  const isTValidFormat = isValidDecimalString(tTrim);

  const lNum = isLValidFormat ? parseFloat(lTrim) : NaN;
  const wNum = isWValidFormat ? parseFloat(wTrim) : NaN;
  const tNum = isTValidFormat ? parseFloat(tTrim) : NaN;

  let lengthError: string | undefined;
  let widthError: string | undefined;
  let thicknessError: string | undefined;

  // Length: 10 - 50 cm
  if (!isLValidFormat || isNaN(lNum) || lNum < 10 || lNum > 50) {
    lengthError = "Chiều dài phải nằm trong khoảng 10–50 cm.";
  }

  // Width: 7 - 40 cm
  if (!isWValidFormat || isNaN(wNum) || wNum < 7 || wNum > 40) {
    widthError = "Chiều rộng phải nằm trong khoảng 7–40 cm.";
  }

  // Thickness: 0.3 - 6 cm
  if (!isTValidFormat || isNaN(tNum) || tNum < 0.3 || tNum > 6) {
    thicknessError = "Độ dày phải nằm trong khoảng 0.3–6 cm.";
  }

  if (lengthError || widthError || thicknessError) {
    return {
      isValid: false,
      lengthError,
      widthError,
      thicknessError,
    };
  }

  // Length must be greater than width
  if (lNum <= wNum) {
    return {
      isValid: false,
      generalError: "Chiều dài nên lớn hơn chiều rộng. Vui lòng kiểm tra lại kích thước máy.",
    };
  }

  return {
    isValid: true,
    dimensions: {
      lengthCm: lNum,
      widthCm: wNum,
      thicknessCm: tNum,
    },
  };
}
