// Copia este archivo como environment.ts (desarrollo) y environment.prod.ts (producción)
// NUNCA commitear los archivos reales con las keys
export const environment = {
  production: false,
  emailjs: {
    serviceId: 'YOUR_SERVICE_ID',    // EmailJS → Email Services
    templateId: 'YOUR_TEMPLATE_ID',  // EmailJS → Email Templates
    publicKey: 'YOUR_PUBLIC_KEY',    // EmailJS → Account → API Keys
  },
};
