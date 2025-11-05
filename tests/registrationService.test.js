import { RegistrationService } from '../src/services/registrationService.js';
import { PrismaClient } from '@prisma/client';

describe('Registreerimise teenus', () => {
  let prisma;
  let registrationService;

  beforeEach(() => {
    prisma = new PrismaClient();
    registrationService = new RegistrationService(prisma);
  });

  afterEach(async () => {
    await prisma.registration.deleteMany();
    await prisma.student.deleteMany();
    await prisma.training.deleteMany();
    await prisma.$disconnect();
  });

  describe('registreeriÕpilane', () => {
    it('peab lubama registreerida kui vabu kohti on', async () => {
      // Arrange
      const training = await prisma.training.create({
        data: {
          name: 'Jõutreening',
          maxCapacity: 10,
          startTime: new Date('2024-12-01T10:00:00Z')
        }
      });

      const student = await prisma.student.create({
        data: {
          name: 'Jaan Tamm',
          email: 'jaan@example.com'
        }
      });

      // Act
      const registration = await registrationService.registreeriÕpilane(
        training.id,
        student.id
      );

      // Assert
      expect(registration).toBeDefined();
      expect(registration.trainingId).toBe(training.id);
      expect(registration.studentId).toBe(student.id);
      expect(registration.status).toBe('ACTIVE');
    });

    it('peab keelama registreerida kui kohti pole', async () => {
      // Arrange
      const training = await prisma.training.create({
        data: {
          name: 'Jõutreening',
          maxCapacity: 1,
          startTime: new Date('2024-12-01T10:00:00Z')
        }
      });

      const student1 = await prisma.student.create({
        data: {
          name: 'Jaan Tamm',
          email: 'jaan@example.com'
        }
      });

      const student2 = await prisma.student.create({
        data: {
          name: 'Mari Sepp',
          email: 'mari@example.com'
        }
      });

      // Esimene registreerimine peaks õnnestuma
      await registrationService.registreeriÕpilane(training.id, student1.id);

      // Act & Assert
      await expect(
        registrationService.registreeriÕpilane(training.id, student2.id)
      ).rejects.toThrow('Trenni kohti pole saadaval');
    });
  });
});

