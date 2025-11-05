import { PrismaClient } from '@prisma/client';
import { DateService } from './dateService.js';

export class RegistrationService {
  constructor(prisma, dateService = new DateService()) {
    this.prisma = prisma;
    this.dateService = dateService;
  }

  async registreeriÕpilane(trainingId, studentId) {
    // Kasuta transaktsiooni, et tagada andmekonsistentsus
    return await this.prisma.$transaction(async (tx) => {
      // Leia trenn koos aktiivsete registreerimistega
      const training = await tx.training.findUnique({
        where: { id: trainingId },
        include: {
          registrations: {
            where: { status: 'ACTIVE' }
          }
        }
      });

      if (!training) {
        throw new Error('Trenni ei leitud');
      }

      // Kontrolli, kas vabu kohti on
      const aktiivsedRegistreerimised = training.registrations.length;
      if (aktiivsedRegistreerimised >= training.maxCapacity) {
        throw new Error('Trenni kohti pole saadaval');
      }

      // Kontrolli, kas õpilane on juba registreeritud
      const olemasolevRegistreerimine = await tx.registration.findUnique({
        where: {
          trainingId_studentId: {
            trainingId,
            studentId
          }
        }
      });

      if (olemasolevRegistreerimine && olemasolevRegistreerimine.status === 'ACTIVE') {
        throw new Error('Õpilane on juba registreeritud');
      }

      // Loo registreerimine
      const registration = await tx.registration.create({
        data: {
          trainingId,
          studentId,
          status: 'ACTIVE'
        }
      });

      return registration;
    });
  }

  async tühistaRegistreerimine(registrationId) {
    // Kasuta transaktsiooni
    return await this.prisma.$transaction(async (tx) => {
      // Leia registreerimine
      const registration = await tx.registration.findUnique({
        where: { id: registrationId }
      });

      if (!registration) {
        throw new Error('Registreerimist ei leitud');
      }

      if (registration.status === 'CANCELLED') {
        throw new Error('Registreerimine on juba tühistatud');
      }

      // Kasuta dateService kellaaega
      const tühistatud = await tx.registration.update({
        where: { id: registrationId },
        data: {
          status: 'CANCELLED',
          cancelledAt: this.dateService.now()
        }
      });

      return tühistatud;
    });
  }

  async arvutaHilinemistasu(registrationId) {
    // Leia registreerimine koos trenniga
    const registration = await this.prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        training: true
      }
    });

    if (!registration) {
      throw new Error('Registreerimist ei leitud');
    }

    // Kui registreerimine pole tühistatud, hilinemistasu on 0
    if (registration.status !== 'CANCELLED' || !registration.cancelledAt) {
      return 0;
    }

    // Arvuta aeg trenni algusest kuni tühistamiseni
    const trenniAlgus = new Date(registration.training.startTime);
    const tühistamiseAeg = new Date(registration.cancelledAt);

    // Kontrolli, kas tühistati hiljem kui 24h enne trenni
    const aegEnneTrenni = trenniAlgus.getTime() - tühistamiseAeg.getTime();
    const tundEnneTrenni = aegEnneTrenni / (1000 * 60 * 60);

    // Kui tühistati varem kui 24h enne trenni, hilinemistasu on 0
    if (tundEnneTrenni >= 24) {
      return 0;
    }

    // Arvuta hilinemistasu: 5 eurot tunnis
    const hilinemistasu = Math.max(0, (24 - tundEnneTrenni) * 5);
    return Math.round(hilinemistasu * 100) / 100; // Ümarda 2 kohta
  }
}
