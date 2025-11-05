import { PrismaClient } from '@prisma/client';

export class RegistrationService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async registreeriÕpilane(trainingId, studentId) {
    // Leia trenn koos aktiivsete registreerimistega
    const training = await this.prisma.training.findUnique({
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

    // Loo registreerimine
    const registration = await this.prisma.registration.create({
      data: {
        trainingId,
        studentId,
        status: 'ACTIVE'
      }
    });

    return registration;
  }
}
