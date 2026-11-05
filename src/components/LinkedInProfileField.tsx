import { useId, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FORM_FIELD_MAX } from '@/lib/formcarry';
import { LINKEDIN_PROFILE_ERROR, normalizeLinkedInUrl } from '@/lib/linkedinUrl';
import { cn } from '@/lib/utils';

interface LinkedInProfileFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

export function LinkedInProfileField({
  id,
  value,
  onChange,
  error,
  inputClassName,
  labelClassName,
  errorClassName = 'text-sm text-destructive',
}: LinkedInProfileFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-1">
      <Label htmlFor={id} className={labelClassName}>
        LinkedIn profile (optional)
      </Label>
      <Input
        id={id}
        name="linkedin_url"
        type="text"
        inputMode="url"
        autoComplete="url"
        placeholder="linkedin.com/in/yourname"
        value={value}
        maxLength={FORM_FIELD_MAX.linkedin_url}
        onChange={(event) => onChange(event.target.value)}
        onBlur={() => {
          const trimmed = value.trim();
          if (trimmed && !/^https?:\/\//i.test(trimmed)) {
            onChange(`https://${trimmed}`);
          }
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(error ? 'border-destructive' : undefined, inputClassName)}
      />
      {error ? (
        <p id={errorId} role="alert" className={errorClassName}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function useLinkedInField() {
  const linkedinId = useId();
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [linkedinError, setLinkedinError] = useState('');

  const resolveLinkedInUrl = () => {
    const result = normalizeLinkedInUrl(linkedinUrl);
    if (!result.ok) {
      setLinkedinError(LINKEDIN_PROFILE_ERROR);
      return null;
    }
    setLinkedinError('');
    return result.url;
  };

  return {
    linkedinId,
    linkedinUrl,
    setLinkedinUrl,
    linkedinError,
    setLinkedinError,
    resolveLinkedInUrl,
  };
}
