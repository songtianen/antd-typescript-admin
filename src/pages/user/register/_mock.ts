import { Request, Response } from 'express';

export default {
  'POST  /register': (_: Request, res: Response) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
};
