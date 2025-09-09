import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.proyecto.randyagent',
  appName: 'Chat AI+',
  webDir: 'out',
  server: {
    // Set to your dev machine IP if you want live reload in device during dev
    androidScheme: 'https'
  }
}

export default config
