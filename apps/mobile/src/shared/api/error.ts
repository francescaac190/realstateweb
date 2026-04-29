export type AppErrorKind =
  | 'NETWORK'
  | 'AUTH'
  | 'VALIDATION'
  | 'NOT_FOUND'
  | 'SERVER'
  | 'UNKNOWN';

export class AppError extends Error {
  readonly kind: AppErrorKind;
  readonly status?: number;
  readonly details?: unknown;

  constructor(kind: AppErrorKind, message: string, opts?: { status?: number; details?: unknown; cause?: unknown }) {
    super(message);
    this.name = 'AppError';
    this.kind = kind;
    this.status = opts?.status;
    this.details = opts?.details;
    if (opts?.cause) (this as { cause?: unknown }).cause = opts.cause;
  }

  static fromStatus(status: number, message?: string, details?: unknown): AppError {
    const kind: AppErrorKind =
      status === 401 || status === 403
        ? 'AUTH'
        : status === 404
          ? 'NOT_FOUND'
          : status === 422 || status === 400
            ? 'VALIDATION'
            : status >= 500
              ? 'SERVER'
              : 'UNKNOWN';
    return new AppError(kind, message ?? `Request failed (${status})`, { status, details });
  }
}
