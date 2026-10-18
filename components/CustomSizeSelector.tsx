"use client";

import { useId } from "react";
import type { CustomSizeValidationResult } from "@/data/size-validation";

type Props = {
  sizeMode: "standard" | "custom";
  onSizeModeChange: (mode: "standard" | "custom") => void;
  length: string;
  width: string;
  thickness: string;
  onLengthChange: (val: string) => void;
  onWidthChange: (val: string) => void;
  onThicknessChange: (val: string) => void;
  standardDimensionsText?: string;
  validation: CustomSizeValidationResult;
  isSubmittedOrTouched?: boolean;
  customOnly?: boolean;
};

export default function CustomSizeSelector({
  sizeMode,
  onSizeModeChange,
  length,
  width,
  thickness,
  onLengthChange,
  onWidthChange,
  onThicknessChange,
  standardDimensionsText,
  validation,
  isSubmittedOrTouched = true,
  customOnly = false,
}: Props) {
  const baseId = useId();
  const lengthInputId = `${baseId}-length`;
  const widthInputId = `${baseId}-width`;
  const thicknessInputId = `${baseId}-thickness`;

  return (
    <div className="mt-6 border-t border-[var(--brand-border)] pt-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">
          Tùy chọn kích thước:
        </span>
        {sizeMode === "custom" && validation.isValid && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--secondary-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--secondary-ink)]">
            ✓ Kích thước hợp lệ
          </span>
        )}
      </div>

      {/* Mode Switch Buttons */}
      {!customOnly && <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onSizeModeChange("standard")}
          aria-pressed={sizeMode === "standard"}
          className={`min-h-[44px] rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
            sizeMode === "standard"
              ? "border-2 border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--text-primary)] shadow-sm"
              : "border border-gray-200 bg-white text-gray-700 hover:border-gray-400"
          }`}
        >
          1. Size tiêu chuẩn
        </button>

        <button
          type="button"
          onClick={() => onSizeModeChange("custom")}
          aria-pressed={sizeMode === "custom"}
          className={`min-h-[44px] rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
            sizeMode === "custom"
              ? "border-2 border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--text-primary)] shadow-sm"
              : "border border-gray-200 bg-white text-gray-700 hover:border-gray-400"
          }`}
        >
          2. Custom theo máy của bạn
        </button>
      </div>}

      {/* Standard Size Description */}
      {sizeMode === "standard" && standardDimensionsText && (
        <p className="mt-2 text-xs text-gray-500">
          Kích thước tiêu chuẩn của mẫu này: <strong className="text-gray-800">{standardDimensionsText}</strong>
        </p>
      )}

      {/* Custom Size Form */}
      {sizeMode === "custom" && (
        <div className="mt-4 rounded-3xl border border-amber-200/80 bg-amber-50/50 p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Chiều dài */}
            <div>
              <label
                htmlFor={lengthInputId}
                className="block text-sm font-bold text-gray-800 mb-1"
              >
                Chiều dài máy (cm) <span className="text-rose-500">*</span>
              </label>
              <input
                id={lengthInputId}
                aria-invalid={isSubmittedOrTouched && Boolean(validation.lengthError || validation.generalError)}
                aria-describedby={[isSubmittedOrTouched && validation.lengthError ? `${lengthInputId}-error` : null, isSubmittedOrTouched && validation.generalError ? `${baseId}-error` : null, `${baseId}-help`].filter(Boolean).join(" ")}
                type="number"
                required
                inputMode="decimal"
                step="0.1"
                min="10"
                max="50"
                value={length}
                onChange={(e) => onLengthChange(e.target.value)}
                placeholder="VD: 32 hoặc 32.5"
                className={`w-full min-h-[44px] rounded-2xl border px-3.5 py-2 text-sm font-semibold text-gray-900 bg-white outline-none transition focus:border-[var(--primary-ink)] ${
                  isSubmittedOrTouched && validation.lengthError
                    ? "border-rose-400 bg-rose-50/30"
                    : "border-gray-300"
                }`}
              />
              {isSubmittedOrTouched && validation.lengthError && (
                <p id={`${lengthInputId}-error`} className="mt-1 text-sm leading-relaxed font-medium text-[var(--destructive)]">
                  {validation.lengthError}
                </p>
              )}
            </div>

            {/* Chiều rộng */}
            <div>
              <label
                htmlFor={widthInputId}
                className="block text-sm font-bold text-gray-800 mb-1"
              >
                Chiều rộng máy (cm) <span className="text-rose-500">*</span>
              </label>
              <input
                id={widthInputId}
                aria-invalid={isSubmittedOrTouched && Boolean(validation.widthError || validation.generalError)}
                aria-describedby={[isSubmittedOrTouched && validation.widthError ? `${widthInputId}-error` : null, isSubmittedOrTouched && validation.generalError ? `${baseId}-error` : null, `${baseId}-help`].filter(Boolean).join(" ")}
                type="number"
                required
                inputMode="decimal"
                step="0.1"
                min="7"
                max="40"
                value={width}
                onChange={(e) => onWidthChange(e.target.value)}
                placeholder="VD: 22 hoặc 22.5"
                className={`w-full min-h-[44px] rounded-2xl border px-3.5 py-2 text-sm font-semibold text-gray-900 bg-white outline-none transition focus:border-[var(--primary-ink)] ${
                  isSubmittedOrTouched && validation.widthError
                    ? "border-rose-400 bg-rose-50/30"
                    : "border-gray-300"
                }`}
              />
              {isSubmittedOrTouched && validation.widthError && (
                <p id={`${widthInputId}-error`} className="mt-1 text-sm leading-relaxed font-medium text-[var(--destructive)]">
                  {validation.widthError}
                </p>
              )}
            </div>

            {/* Độ dày */}
            <div>
              <label
                htmlFor={thicknessInputId}
                className="block text-sm font-bold text-gray-800 mb-1"
              >
                Độ dày máy (cm) <span className="text-rose-500">*</span>
              </label>
              <input
                id={thicknessInputId}
                aria-invalid={isSubmittedOrTouched && Boolean(validation.thicknessError || validation.generalError)}
                aria-describedby={[isSubmittedOrTouched && validation.thicknessError ? `${thicknessInputId}-error` : null, isSubmittedOrTouched && validation.generalError ? `${baseId}-error` : null, `${baseId}-help`].filter(Boolean).join(" ")}
                type="number"
                required
                inputMode="decimal"
                step="0.1"
                min="0.3"
                max="6"
                value={thickness}
                onChange={(e) => onThicknessChange(e.target.value)}
                placeholder="VD: 2 hoặc 2.4"
                className={`w-full min-h-[44px] rounded-2xl border px-3.5 py-2 text-sm font-semibold text-gray-900 bg-white outline-none transition focus:border-[var(--primary-ink)] ${
                  isSubmittedOrTouched && validation.thicknessError
                    ? "border-rose-400 bg-rose-50/30"
                    : "border-gray-300"
                }`}
              />
              {isSubmittedOrTouched && validation.thicknessError && (
                <p id={`${thicknessInputId}-error`} className="mt-1 text-sm leading-relaxed font-medium text-[var(--destructive)]">
                  {validation.thicknessError}
                </p>
              )}
            </div>
          </div>

          {/* General error (e.g. length <= width, missing values) */}
          {isSubmittedOrTouched && validation.generalError && (
            <div id={`${baseId}-error`} role="status" className="rounded-2xl border border-[var(--destructive)] bg-rose-50 p-3 text-sm text-[var(--destructive)] font-medium">
              ⚠️ {validation.generalError}
            </div>
          )}

          {/* Valid preview state */}
          {validation.isValid && validation.dimensions && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-2.5 text-xs text-[var(--secondary-ink)] font-semibold flex items-center gap-2">
              <span>✓ Thông số đã nhập:</span>
              <strong className="text-gray-900">
                {validation.dimensions.lengthCm} × {validation.dimensions.widthCm} × {validation.dimensions.thicknessCm} cm
              </strong>
            </div>
          )}

          {/* Helper text */}
          <div id={`${baseId}-help`} className="space-y-2 text-sm text-gray-600 leading-relaxed border-t border-amber-200/60 pt-3">
            <p>
              📐 <strong>CaseUp sẽ may theo thông số bạn cung cấp.</strong> Vui lòng đo trực tiếp thiết bị và kiểm tra kỹ trước khi đặt hàng.
            </p>
            <p className="text-amber-800 font-medium">
              💬 CaseUp sẽ xác nhận lại kích thước trước khi tiến hành may.
            </p>
            <p className="text-sm text-gray-500">
              * Quy tắc: Chiều dài (10–50 cm), chiều rộng (7–40 cm), độ dày (0.3–6 cm). Chiều dài phải lớn hơn chiều rộng.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
