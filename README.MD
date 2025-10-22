# FermentaIA

FermentaIA es una solución agéntica impulsada por inteligencia artificial, diseñada para mejorar el proceso de fermentación del café en las zonas rurales de Colombia. Su objetivo principal es asistir a los caficultores en la toma de decisiones, analizando datos como la temperatura y el pH, y ofreciendo recomendaciones para estandarizar y hacer más trazables los procesos. El proyecto busca aumentar la calidad del café en un 30%, reducir pérdidas y empoderar a las comunidades rurales con tecnología accesible. En el futuro, planea integrar sensores, modelos predictivos y expandirse a otros cultivos.

## Miembros
- Estefanía Ríos Reinosa
- Lizbeth Yajahira Franco
- Julio César Cortázar

## Tabla de contenidos
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Características](#características)
- [Cómo contribuir](#cómo-contribuir)
- [Licencia](#licencia)

## Requisitos
- Node.js >= 16
- npm
- (Opcional) MongoDB si usas la persistencia local/remota

## Instalación
1. Clona el repositorio:
```bash
git clone https://github.com/lizbeth0319/FermentaIA.git
cd FermentaIA
```

2. Instala dependencias (usa package.json):
```bash
npm install
```

Si necesitas instalar paquetes específicos manualmente:
```bash
npm install express express-validator dotenv bcrypt cors jsonwebtoken axios mongoose
```

## Configuración
Crea un archivo `.env` en la raíz con las variables necesarias. Ejemplo mínimo:
```
PORT=3000
MONGO_URI=tu_uri_de_mongodb
JWT_SECRET=una_clave_secreta
```

## Uso
Inicia la aplicación en modo desarrollo (según script en package.json):
```bash
npm run dev
```
o en producción:
```bash
npm start
```

## Características
- Agente inteligente para optimizar fermentación de café.
- Funcionalidad offline-first.
- Interfaz y lógica pensadas para entornos rurales.

## Cómo contribuir
1. Haz fork del proyecto.
2. Crea una rama: `git checkout -b feature/nueva-caracteristica`
3. Haz commits claros y descriptivos.
4. Abre un Pull Request al repositorio original.

## Licencia
Proyecto bajo licencia MIT. Consulta el archivo `LICENSE.md` para más detalles.