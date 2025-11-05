import { RegistrationService } from '../src/services/registrationService.js';
import { PrismaClient } from '@prisma/client';

describe('Tühistamise teenus', () => {
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

  describe('tühistaRegistreerimine', () => {
    it('peab lubama tühistada aktiivse registreerimise', async () => {
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

      const registration = await registrationService.registreeriÕpilane(
        training.id,
        student.id
      );

      // Act
      const tühistatud = await registrationService.tühistaRegistreerimine(
        registration.id
      );

      // Assert
      expect(tühistatud).toBeDefined();
      expect(tühistatud.status).toBe('CANCELLED');
      expect(tühistatud.cancelledAt).toBeDefined();
    });

    it('peab muutma registreerimise staatust CANCELLED', async () => {
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

      const registration = await registrationService.registreeriÕpilane(
        training.id,
        student.id
      );

      // Act
      await registrationService.tühistaRegistreerimine(registration.id);

      // Assert
      const uuendatud = await prisma.registration.findUnique({
        where: { id: registration.id }
      });
      expect(uuendatud.status).toBe('CANCELLED');
      expect(uuendatud.cancelledAt).not.toBeNull();
    });

    it('peab lubama uue registreerimise pärast tühistamist', async () => {
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

      // Esimene registreerimine
      const registration1 = await registrationService.registreeriÕpilane(
        training.id,
        student1.id
      );

      // Tühista esimene registreerimine
      await registrationService.tühistaRegistreerimine(registration1.id);

      // Act - teine õpilane peaks saama registreerida
      const registration2 = await registrationService.registreeriÕpilane(
        training.id,
        student2.id
      );

      // Assert
      expect(registration2).toBeDefined();
      expect(registration2.status).toBe('ACTIVE');
      expect(registration2.studentId).toBe(student2.id);
    });

    it('peab viskama vea kui registreerimist ei leitud', async () => {
      // Act & Assert
      await expect(
        registrationService.tühistaRegistreerimine(999)
      ).rejects.toThrow('Registreerimist ei leitud');
    });

    it('peab viskama vea kui registreerimine on juba tühistatud', async () => {
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

      const registration = await registrationService.registreeriÕpilane(
        training.id,
        student.id
      );

      // Esimene tühistamine
      await registrationService.tühistaRegistreerimine(registration.id);

      // Act & Assert
      await expect(
        registrationService.tühistaRegistreerimine(registration.id)
      ).rejects.toThrow('Registreerimine on juba tühistatud');
    });
  });
});

