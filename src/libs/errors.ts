
export class Error {
  message: string = 'Error';
  name: string = 'Model Error';
  errors: any;

  constructor(error: any) {
    this.errors = error;
  }

}

export class ValidationError extends Error {
  message: string;
  name: string = 'ValidationError';

  constructor(error: any, message: string = 'Validation error') {
    super(error);
    this.message = message;
  }
}

export class NotFoundError extends Error {
  message: string;
  name: string = "NotFoundError";

  constructor(error: any, message: string = 'Row not found') {
    super(error);
  }
}

export class InvalidActionError extends Error {
	message: string;
	name: string = 'InvalidActionError';

	constructor(error: any, message: string = 'Invalid action') {
		super(error);
		this.message = message;
	}
}