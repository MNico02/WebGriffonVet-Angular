import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.griffonVet.app',
  appName: 'GriffonVetAPP',
  webDir: 'dist/webGriffonVet/browser',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
  server: {
    androidScheme: 'https'
  }
  
};

export default config;