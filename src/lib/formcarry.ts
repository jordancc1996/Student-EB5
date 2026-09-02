export const FORMCARRY_ENDPOINT = 'https://formcarry.com/s/8p8GuE_o-oN';

export const FORMCARRY_GENERIC_ERROR = 'Something went wrong. Please try again.';

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

export async function submitToFormcarry(data: Record<string, unknown>): Promise<FormcarryResult> {
  try {
    const response = await fetch(FORMCARRY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
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
