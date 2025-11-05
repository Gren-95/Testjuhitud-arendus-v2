// Rakenduse sisendpunkt
export const app = () => {
  console.log('TDD projekt käivitatud');
};

if (import.meta.url === `file://${process.argv[1]}`) {
  app();
}

