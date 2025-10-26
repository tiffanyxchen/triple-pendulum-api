import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../utils/prisma.service';

describe('Results Simulation API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService],   // 👈 add this line
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should run simulation and store result in database', async () => {
    const payload = {
      theta1_init: 0.5,
      theta2_init: 0.6,
      theta3_init: 0.7,
    };

    const response = await request(app.getHttpServer())
      .post('/v1/results/simulate')
      .send(payload)
      .expect(201);

    expect(response.body).toHaveProperty('id');

    // Check the DB
    const saved = await prisma.result.findUnique({
      where: { id: response.body.id },
    });

    expect(saved).not.toBeNull();
    expect(saved?.theta1_init).toBe(0.5);
  });
});

