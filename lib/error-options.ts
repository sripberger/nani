/**
 * Interface for objects containing NaniError configuration.
 */
export interface ErrorOptions {
	/**
	 * A human-readable error message, without any cause messages.
	 *
	 * @remarks
	 * The cause message, if any, will be chained onto the end of this to create
	 * the full error message, ensuring that human programmers can easily
	 * understand the whole cause chain at a glance. If not provided, the
	 * shortMessage will be determined using the static `getDefaultMessage`
	 * method.
	 */
	shortMessage?: string;

	/**
	 * The cause of the error, if any.
	 */
	cause?: Error;

	/**
	 * Additional arbitrary data about the error.
	 */
	info?: {};

	/**
	 * Set true to omit cause messages from the error's message.
	 *
	 * @remarks
	 * If this option is set to true, the cause message will not be chained to
	 * the short message, and the error's full message will simply be the short
	 * message. Useful for when you want to simplify error messages but still
	 * preserve the cause chain.
	 */
	hideCauseMessage?: boolean;
}
