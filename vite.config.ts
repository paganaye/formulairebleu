import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

// Custom plugin for handling CORS
const customCorsPlugin = () => {
  return {
    name: 'configure-server-cors',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const allowedOrigin = req.headers.origin; // Dynamically allow requesting origin
        if (allowedOrigin) res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Private-Network', 'true');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204; // No content for OPTIONS preflight
          return res.end();
        }
        next();
      });
    }
  };
};


const viteConfig = defineConfig({
  plugins: [
    solidPlugin(),
    customCorsPlugin() // Add the custom CORS plugin to your Vite configuration
  ],
  build: {
    target: 'es2015',
    sourcemap: true,
    minify: true,
    outDir: "dist",
    rollupOptions: {
      output: {
        entryFileNames: "index.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo?.name?.endsWith('.css')) {
            return 'index.css';
          }
          return 'assets/[name]-[hash][extname]';
        },

      }
    }
  }
});

export default viteConfig;