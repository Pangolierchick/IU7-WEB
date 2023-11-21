import { Request, Response } from "express";
import { validationResult } from "express-validator";

export function Validate(
  target: any,
  key: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;

  descriptor.value = function (req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      original.apply(this, [req, res]);
    } else {
      res.status(400).json({ errors: result.array() });
    }
  };
}
