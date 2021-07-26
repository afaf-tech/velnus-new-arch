export interface ErrorBaseParam {
  // TODO: Currently not used
  devMessage?: string;
  solution?: string | string[];
  detail?: string | string[];
}

export class ErrorBase {
  /**
   * Custom error message from default error
   */
  message: string;

  /**
   * Error message only avaiable in dev mode
   */
  devMessage?: string;

  /**
   * Is need for trace or log
   */
  error?: Error;

  solution?: string | string[];

  detail?: string | string[];

  constructor(message: string);

  constructor(message: string, params: ErrorBaseParam);

  constructor(error: Error, message: string);

  constructor(error: Error, message: string, params?: ErrorBaseParam);

  constructor(
    messageOrError: string | Error,
    messageOrParams?: string | ErrorBaseParam,
    params?: ErrorBaseParam,
  ) {
    if (!params) {
      // 1 or 2 args
      if (typeof messageOrParams === 'string') {
        this.message = messageOrParams;
        this.error = messageOrError as Error;
      } else if (messageOrParams) {
        this.message = messageOrError as string;
        this.setParams(messageOrParams);
      } else {
        this.message = messageOrError as string;
      }
    } else {
      // 3 args
      this.message = messageOrParams as string;
      this.error = messageOrError as Error;
      this.setParams(params);
    }
  }

  /**
   * Set detail or solution property
   *
   * @description
   * arg params use any because kemungkinan yang di isi bukan hanya ErrorBaseParam
   * bisa juga variable kosong, untuk lebih detail coba lihat pada class constructor
   */
  setParams(params: ErrorBaseParam): void {
    if (!params) return;
    if ('detail' in params) {
      this.detail = params.detail;
    }
    if ('solution' in params) {
      this.solution = params.solution;
    }
    if ('devMessage' in params) {
      this.devMessage = params.devMessage;
    }
  }
}
