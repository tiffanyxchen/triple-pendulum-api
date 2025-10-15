-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "theta1" DOUBLE PRECISION NOT NULL,
    "theta2" DOUBLE PRECISION NOT NULL,
    "theta3" DOUBLE PRECISION NOT NULL,
    "time" JSONB NOT NULL,
    "x1" JSONB NOT NULL,
    "y1" JSONB NOT NULL,
    "x2" JSONB NOT NULL,
    "y2" JSONB NOT NULL,
    "x3" JSONB NOT NULL,
    "y3" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Result_theta1_theta2_theta3_key" ON "Result"("theta1", "theta2", "theta3");

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
