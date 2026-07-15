import { Request } from 'express';
export function getPdf(req: Request) {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  return files?.['pdf']?.[0];
}
