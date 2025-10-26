triple-pendulum-api/
│
├── prisma/
│   ├── schema.prisma           # DB models
│   └── migrations/             # Prisma migrations
│
├── scripts/
│   └── simulate.py             # Python script that computes time series
│
├── src/
│   ├── app.module.ts
│   ├── main.ts
│
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.interface.ts
│   │   └── users.module.ts
│
│   ├── results/
│   │   ├── results.controller.ts
│   │   ├── results.service.ts
│   │   ├── results.interface.ts
│   │   └── results.module.ts
│
│   ├── orders/
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   ├── orders.interface.ts
│   │   └── orders.module.ts
│
│   ├── utils/
│   │   ├── prisma.service.ts
│   │   └── python-runner.ts     # NEW: Helper to call your Python script
│
│   └── common/
│       ├── dto/
│       └── guards/              # (optional) e.g., auth guards
│
│
├── package.json
├── tsconfig.json
└── README.md
