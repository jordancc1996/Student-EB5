export const FORMCARRY_ENDPOINT = 'https://formcarry.com/s/8p8GuE_o-oN';

export const FORMCARRY_GENERIC_ERROR = 'Something went wrong. Please try again.';

export const FORM_FIELD_MAX = {
  name: 100,
  email: 254,
  phone: 30,
  message: 2000,
} as const;

export const FORM_PHONE_FORMAT_ERROR =
  'Enter a phone number with at least 7 digits. International numbers are fine.';

export type FormcarryFieldError = {
  message: string;
  rule?: string;
};

export type FormcarryResult = {
  ok: boolean;
  message: string;
  errors?: Record<string, FormcarryFieldError>;
};

type FormcarryJson = {
  code?: number;
  message?: string;
  errors?: Record<string, FormcarryFieldError>;
};

/** Empty is valid. Rejects junk without blocking international numbers. */
export function isPermissivePhone(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return false;
  return /^[+]?[\d\s().\-#extEXT]+$/.test(trimmed);
}

export async function submitToFormcarry(data: Record<string, unknown>): Promise<FormcarryResult> {
  const gotcha = typeof data._gotcha === 'string' ? data._gotcha.trim() : '';
  if (gotcha) {
    return { ok: true, message: '' };
  }

  try {
    const response = await fetch(FORMCARRY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...data, _gotcha: '' }),
    });

    let json: FormcarryJson = {};
    try {
      json = (await response.json()) as FormcarryJson;
    } catch {
      json = {};
    }

    if (response.ok && json.code === 200) {
      return { ok: true, message: json.message ?? '' };
    }

    return {
      ok: false,
      message: json.message || FORMCARRY_GENERIC_ERROR,
      errors: json.errors,
    };
  } catch {
    return { ok: false, message: FORMCARRY_GENERIC_ERROR };
  }
}
