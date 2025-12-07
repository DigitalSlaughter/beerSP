# Details

Date : 2025-12-07 17:26:41

Directory c:\\Users\\sergi\\Documents\\7ºCuatri\\IS2\\Proyecto\\BeerSP

Total : 78 files,  4424 codes, 266 comments, 846 blanks, all 5536 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [Readme.md](/Readme.md) | Markdown | 41 | 0 | 9 | 50 |
| [backend/jest.config.js](/backend/jest.config.js) | JavaScript | 8 | 1 | 3 | 12 |
| [backend/src/config/db.ts](/backend/src/config/db.ts) | TypeScript | 20 | 1 | 2 | 23 |
| [backend/src/config/r2Multer.ts](/backend/src/config/r2Multer.ts) | TypeScript | 14 | 0 | 4 | 18 |
| [backend/src/config/r2client.ts](/backend/src/config/r2client.ts) | TypeScript | 9 | 0 | 2 | 11 |
| [backend/src/context/AuthContext.tsx](/backend/src/context/AuthContext.tsx) | TypeScript JSX | 19 | 0 | 6 | 25 |
| [backend/src/controllers/AuthController.ts](/backend/src/controllers/AuthController.ts) | TypeScript | 16 | 1 | 6 | 23 |
| [backend/src/controllers/CervezaController.ts](/backend/src/controllers/CervezaController.ts) | TypeScript | 92 | 6 | 14 | 112 |
| [backend/src/controllers/DegustacionController.ts](/backend/src/controllers/DegustacionController.ts) | TypeScript | 132 | 7 | 20 | 159 |
| [backend/src/controllers/LocalController.ts](/backend/src/controllers/LocalController.ts) | TypeScript | 32 | 0 | 7 | 39 |
| [backend/src/controllers/SolicitudAmistadController.ts](/backend/src/controllers/SolicitudAmistadController.ts) | TypeScript | 80 | 4 | 29 | 113 |
| [backend/src/controllers/UsuarioController.ts](/backend/src/controllers/UsuarioController.ts) | TypeScript | 198 | 19 | 64 | 281 |
| [backend/src/data/galardones.json](/backend/src/data/galardones.json) | JSON | 68 | 0 | 1 | 69 |
| [backend/src/files/r2Delete.ts](/backend/src/files/r2Delete.ts) | TypeScript | 15 | 0 | 4 | 19 |
| [backend/src/files/r2SignedUrl.ts](/backend/src/files/r2SignedUrl.ts) | TypeScript | 14 | 0 | 5 | 19 |
| [backend/src/files/server.ts](/backend/src/files/server.ts) | TypeScript | 32 | 2 | 7 | 41 |
| [backend/src/middleware/errorHandler.ts](/backend/src/middleware/errorHandler.ts) | TypeScript | 0 | 1 | 1 | 2 |
| [backend/src/models/Cerveza.ts](/backend/src/models/Cerveza.ts) | TypeScript | 31 | 1 | 14 | 46 |
| [backend/src/models/ComentarioDegustacion.ts](/backend/src/models/ComentarioDegustacion.ts) | TypeScript | 26 | 1 | 6 | 33 |
| [backend/src/models/Degustacion.ts](/backend/src/models/Degustacion.ts) | TypeScript | 33 | 0 | 9 | 42 |
| [backend/src/models/LikeLocal.ts](/backend/src/models/LikeLocal.ts) | TypeScript | 23 | 1 | 5 | 29 |
| [backend/src/models/Local.ts](/backend/src/models/Local.ts) | TypeScript | 18 | 1 | 8 | 27 |
| [backend/src/models/SolicitudAmistad.ts](/backend/src/models/SolicitudAmistad.ts) | TypeScript | 17 | 1 | 5 | 23 |
| [backend/src/models/Usuario.ts](/backend/src/models/Usuario.ts) | TypeScript | 54 | 5 | 22 | 81 |
| [backend/src/models/UsuarioGalardon.ts](/backend/src/models/UsuarioGalardon.ts) | TypeScript | 19 | 1 | 8 | 28 |
| [backend/src/repositories/CervezaRepository.ts](/backend/src/repositories/CervezaRepository.ts) | TypeScript | 3 | 0 | 2 | 5 |
| [backend/src/repositories/ComentarioDegustacionRepository.ts](/backend/src/repositories/ComentarioDegustacionRepository.ts) | TypeScript | 3 | 0 | 1 | 4 |
| [backend/src/repositories/DegustacionRepository.ts](/backend/src/repositories/DegustacionRepository.ts) | TypeScript | 3 | 0 | 2 | 5 |
| [backend/src/repositories/LocalRepository.ts](/backend/src/repositories/LocalRepository.ts) | TypeScript | 3 | 0 | 2 | 5 |
| [backend/src/repositories/SolicitudAmistadRepository.ts](/backend/src/repositories/SolicitudAmistadRepository.ts) | TypeScript | 3 | 0 | 2 | 5 |
| [backend/src/repositories/UsuarioRepository.ts](/backend/src/repositories/UsuarioRepository.ts) | TypeScript | 3 | 1 | 2 | 6 |
| [backend/src/routes/authRoutes.ts](/backend/src/routes/authRoutes.ts) | TypeScript | 5 | 0 | 4 | 9 |
| [backend/src/routes/cervezaRoutes.ts](/backend/src/routes/cervezaRoutes.ts) | TypeScript | 11 | 1 | 4 | 16 |
| [backend/src/routes/degustacionRoutes.ts](/backend/src/routes/degustacionRoutes.ts) | TypeScript | 12 | 0 | 4 | 16 |
| [backend/src/routes/localRoutes.ts](/backend/src/routes/localRoutes.ts) | TypeScript | 10 | 0 | 4 | 14 |
| [backend/src/routes/usuarioRoutes.ts](/backend/src/routes/usuarioRoutes.ts) | TypeScript | 23 | 12 | 11 | 46 |
| [backend/src/services/AuthService.ts](/backend/src/services/AuthService.ts) | TypeScript | 40 | 4 | 11 | 55 |
| [backend/src/services/CervezaService.ts](/backend/src/services/CervezaService.ts) | TypeScript | 24 | 0 | 6 | 30 |
| [backend/src/services/ComentarioDegustacionService.ts](/backend/src/services/ComentarioDegustacionService.ts) | TypeScript | 29 | 0 | 9 | 38 |
| [backend/src/services/DegustacionService.ts](/backend/src/services/DegustacionService.ts) | TypeScript | 59 | 8 | 11 | 78 |
| [backend/src/services/GalardonService.ts](/backend/src/services/GalardonService.ts) | TypeScript | 141 | 22 | 37 | 200 |
| [backend/src/services/LocalService.ts](/backend/src/services/LocalService.ts) | TypeScript | 24 | 0 | 6 | 30 |
| [backend/src/services/SolicitudAmistadService.ts](/backend/src/services/SolicitudAmistadService.ts) | TypeScript | 63 | 11 | 17 | 91 |
| [backend/src/services/UsuarioService.ts](/backend/src/services/UsuarioService.ts) | TypeScript | 138 | 8 | 37 | 183 |
| [backend/src/tests/integration/integracion.test.ts](/backend/src/tests/integration/integracion.test.ts) | TypeScript | 93 | 14 | 17 | 124 |
| [backend/src/tests/unit/auth.controller.test.ts](/backend/src/tests/unit/auth.controller.test.ts) | TypeScript | 35 | 1 | 14 | 50 |
| [backend/src/tests/unit/cerveza.controller.test.ts](/backend/src/tests/unit/cerveza.controller.test.ts) | TypeScript | 27 | 0 | 12 | 39 |
| [backend/src/tests/unit/comentario.controller.test.ts](/backend/src/tests/unit/comentario.controller.test.ts) | TypeScript | 46 | 1 | 14 | 61 |
| [backend/src/tests/unit/degustacion.controller.test.ts](/backend/src/tests/unit/degustacion.controller.test.ts) | TypeScript | 52 | 1 | 15 | 68 |
| [backend/src/tests/unit/local.controller.test.ts](/backend/src/tests/unit/local.controller.test.ts) | TypeScript | 42 | 1 | 17 | 60 |
| [backend/src/tests/unit/solicitud.controller.test.ts](/backend/src/tests/unit/solicitud.controller.test.ts) | TypeScript | 40 | 0 | 12 | 52 |
| [backend/src/tests/unit/usuario.controller.test.ts](/backend/src/tests/unit/usuario.controller.test.ts) | TypeScript | 27 | 0 | 8 | 35 |
| [backend/src/tests/utils/expressMocks.ts](/backend/src/tests/utils/expressMocks.ts) | TypeScript | 15 | 1 | 2 | 18 |
| [backend/src/utils/validators.tsx](/backend/src/utils/validators.tsx) | TypeScript JSX | 10 | 0 | 1 | 11 |
| [backend/tsconfig.json](/backend/tsconfig.json) | JSON with Comments | 15 | 0 | 1 | 16 |
| [frontend/index.html](/frontend/index.html) | HTML | 12 | 0 | 1 | 13 |
| [frontend/postcss.config.js](/frontend/postcss.config.js) | JavaScript | 6 | 0 | 1 | 7 |
| [frontend/src/api/index.ts](/frontend/src/api/index.ts) | TypeScript | 6 | 0 | 3 | 9 |
| [frontend/src/components/Button.tsx](/frontend/src/components/Button.tsx) | TypeScript JSX | 17 | 0 | 4 | 21 |
| [frontend/src/components/Footer.tsx](/frontend/src/components/Footer.tsx) | TypeScript JSX | 7 | 0 | 3 | 10 |
| [frontend/src/components/MainLayout.tsx](/frontend/src/components/MainLayout.tsx) | TypeScript JSX | 13 | 1 | 3 | 17 |
| [frontend/src/components/Navbar.tsx](/frontend/src/components/Navbar.tsx) | TypeScript JSX | 16 | 0 | 3 | 19 |
| [frontend/src/components/ProtectedRoute.tsx](/frontend/src/components/ProtectedRoute.tsx) | TypeScript JSX | 13 | 0 | 6 | 19 |
| [frontend/src/components/SideBar.tsx](/frontend/src/components/SideBar.tsx) | TypeScript JSX | 82 | 5 | 16 | 103 |
| [frontend/src/main.tsx](/frontend/src/main.tsx) | TypeScript JSX | 12 | 0 | 2 | 14 |
| [frontend/src/pages/Amigos.tsx](/frontend/src/pages/Amigos.tsx) | TypeScript JSX | 338 | 6 | 28 | 372 |
| [frontend/src/pages/Degustaciones.tsx](/frontend/src/pages/Degustaciones.tsx) | TypeScript JSX | 653 | 53 | 64 | 770 |
| [frontend/src/pages/Galardones.tsx](/frontend/src/pages/Galardones.tsx) | TypeScript JSX | 159 | 3 | 17 | 179 |
| [frontend/src/pages/Home.tsx](/frontend/src/pages/Home.tsx) | TypeScript JSX | 317 | 47 | 62 | 426 |
| [frontend/src/pages/Login.tsx](/frontend/src/pages/Login.tsx) | TypeScript JSX | 79 | 1 | 10 | 90 |
| [frontend/src/pages/Profile.tsx](/frontend/src/pages/Profile.tsx) | TypeScript JSX | 292 | 4 | 33 | 329 |
| [frontend/src/pages/Register.tsx](/frontend/src/pages/Register.tsx) | TypeScript JSX | 235 | 4 | 27 | 266 |
| [frontend/src/pages/VerifyEmail.tsx](/frontend/src/pages/VerifyEmail.tsx) | TypeScript JSX | 48 | 1 | 6 | 55 |
| [frontend/src/routes/AppRoutes.tsx](/frontend/src/routes/AppRoutes.tsx) | TypeScript JSX | 63 | 1 | 6 | 70 |
| [frontend/src/styles/globals.css](/frontend/src/styles/globals.css) | PostCSS | 6 | 0 | 2 | 8 |
| [frontend/src/utils/validators.ts](/frontend/src/utils/validators.ts) | TypeScript | 10 | 0 | 1 | 11 |
| [frontend/tailwind.config.js](/frontend/tailwind.config.js) | JavaScript | 10 | 1 | 1 | 12 |
| [frontend/tsconfig.json](/frontend/tsconfig.json) | JSON with Comments | 20 | 0 | 1 | 21 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)