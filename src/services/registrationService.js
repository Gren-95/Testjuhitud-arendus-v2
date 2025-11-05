import { PrismaClient } from '@prisma/client';

export class RegistrationService {
  constructor(prisma) {
    this.prisma = prisma;
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

      // Uuenda registreerimise staatust
      const tühistatud = await tx.registration.update({
        where: { id: registrationId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date()
        }
      });

      return tühistatud;
    });
  }
}
