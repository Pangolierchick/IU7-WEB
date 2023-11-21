export class ReadOnlyError extends Error {
  constructor() {
    super("Read-only transactions allowed.");
    this.name = "ReadOnlyError";
  }
}
