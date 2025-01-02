import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://user:MKTK8npUuQNZXSzvTL9EzAJ8MBBEtckx@dpg-ctr66s5ds78s73diiv3g-a.singapore-postgres.render.com/vouchermgmtdb',
        },
      },
    });
  }
}
