import { RegistrationService } from '../src/services/registrationService.js';
import { PrismaClient } from '@prisma/client';

describe('Hilinemistasu teenus', () => {
  let prisma;
  let registrationService;
  let mockDate;
  let originalDate;

  beforeEach(() => {
    prisma = new PrismaClient();
    registrationService = new RegistrationService(prisma);
    
    // Mock kellaaeg
    originalDate = Date;
    mockDate = new Date('2024-12-01T10:00:00Z');
    global.Date = jest.fn(() => mockDate);
    global.Date.now = jest.fn(() => mockDate.getTime());
    global.Date.parse = originalDate.parse;
  });

  afterEach(async () => {
    // Taasta originaalne Date
    global.Date = originalDate;
    
    await prisma.registration.deleteMany();
    await prisma.student.deleteMany();
    await prisma.training.deleteMany();
    await prisma.$disconnect();
  });

  describe('arvutaHilinemistasu', () => {
    it('peab arvutama hilinemistasu kui tühistatakse hiljem kui 24h enne trenni', async () => {
      // Arrange
      const trainingStartTime = new Date('2024-12-02T10:00:00Z'); // 24h pärast mockitud kellaaega
      const training = await prisma.training.create({
        data: {
          name: 'Jõutreening',
          maxCapacity: 10,
          startTime: trainingStartTime
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

      // Mock kellaaeg: 23h enne trenni (tühistatakse hiljem kui 24h enne)
      mockDate = new Date('2024-12-02T09:00:00Z'); // 1h enne trenni
      global.Date = jest.fn(() => mockDate);
      global.Date.now = jest.fn(() => mockDate.getTime());

      // Act
      const tulemus = await registrationService.tühistaRegistreerimine(
        registration.id
      );

      const hilinemistasu = await registrationService.arvutaHilinemistasu(
        registration.id
      );

      // Assert
      expect(hilinemistasu).toBeGreaterThan(0);
      expect(hilinemistasu).toBeGreaterThanOrEqual(5); // Vähemalt 5 eurot (nt 1h * 5€/h või minimaalne tasu)
    });

    it('peab mitte arvutama hilinemistasu kui tühistatakse varem kui 24h enne trenni', async () => {
      // Arrange
      const trainingStartTime = new Date('2024-12-03T10:00:00Z'); // 48h pärast mockitud kellaaega
      const training = await prisma.training.create({
        data: {
          name: 'Jõutreening',
          maxCapacity: 10,
          startTime: trainingStartTime
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

      // Mock kellaaeg: 25h enne trenni (tühistatakse varem kui 24h enne)
      mockDate = new Date('2024-12-02T09:00:00Z'); // 25h enne trenni
      global.Date = jest.fn(() => mockDate);
      global.Date.now = jest.fn(() => mockDate.getTime());

      // Act
      await registrationService.tühistaRegistreerimine(registration.id);

      const hilinemistasu = await registrationService.arvutaHilinemistasu(
        registration.id
      );

      // Assert
      expect(hilinemistasu).toBe(0);
    });

    it('peab tagastama 0 kui registreerimine pole tühistatud', async () => {
      // Arrange
      const training = await prisma.training.create({
        data: {
          name: 'Jõutreening',
          maxCapacity: 10,
          startTime: new Date('2024-12-02T10:00:00Z')
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
      const hilinemistasu = await registrationService.arvutaHilinemistasu(
        registration.id
      );

      // Assert
      expect(hilinemistasu).toBe(0);
    });
  });
});

