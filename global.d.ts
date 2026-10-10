// Declaraciones de tipos para archivos que TypeScript no reconoce por defecto.
// Necesario para que funcione `import "./globals.css";` sin errores.

declare module "*.css";
declare module "*.scss";
declare module "*.sass";
declare module "*.less";