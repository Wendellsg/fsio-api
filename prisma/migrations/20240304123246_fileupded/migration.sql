-- CreateEnum
CREATE TYPE "FileTypeEnum" AS ENUM ('image', 'video', 'document');

-- CreateEnum
CREATE TYPE "ExtensionEnum" AS ENUM ('jpg', 'jpeg', 'png', 'gif', 'mp4', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'zip', 'rar', 'tar', 'gz');

-- CreateEnum
CREATE TYPE "ExerciseCategoryEnum" AS ENUM ('legs', 'arms', 'back', 'chest', 'shoulders', 'abs', 'cardio');

-- CreateEnum
CREATE TYPE "RoutineFrequencyTypeEnum" AS ENUM ('day', 'week', 'month');

-- CreateEnum
CREATE TYPE "RoutinePeriodEnum" AS ENUM ('morning', 'afternoon', 'night');

-- CreateEnum
CREATE TYPE "UserRoleEnum" AS ENUM ('patient', 'professional', 'admin');

-- CreateEnum
CREATE TYPE "AppointmentStatusEnum" AS ENUM ('scheduled', 'canceled', 'done');

-- CreateEnum
CREATE TYPE "RequestStatusEnum" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comments" TEXT NOT NULL,
    "painLevel" INTEGER NOT NULL,
    "effortLevel" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "routineId" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatusEnum" NOT NULL DEFAULT 'scheduled',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "professionalId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentComment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,

    CONSTRAINT "AppointmentComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evolution" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "clinicalDiagnosis" TEXT NOT NULL,
    "physicalDiagnosis" TEXT NOT NULL,
    "evolution" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "professionalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Evolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ExerciseCategoryEnum" NOT NULL,
    "image" TEXT,
    "video" TEXT,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExercisesOnUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ExercisesOnUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Routine" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL,
    "frequencyType" "RoutineFrequencyTypeEnum" NOT NULL DEFAULT 'day',
    "repetitions" INTEGER NOT NULL,
    "series" INTEGER NOT NULL,
    "period" "RoutinePeriodEnum" NOT NULL DEFAULT 'morning',
    "userId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,

    CONSTRAINT "Routine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "resetPasswordToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT,
    "imageFileId" TEXT,
    "phone" TEXT,
    "roles" "UserRoleEnum"[] DEFAULT ARRAY['patient']::"UserRoleEnum"[],
    "height" INTEGER,
    "weight" INTEGER,
    "birthDate" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "RequestStatusEnum" NOT NULL DEFAULT 'pending',
    "professionalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professional" (
    "id" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "phone" TEXT,
    "profession" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "licenseState" TEXT NOT NULL,
    "licenseImage" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "presentation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileUploaded" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT,
    "type" "FileTypeEnum" NOT NULL,
    "size" INTEGER NOT NULL,
    "extension" "ExtensionEnum" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FileUploaded_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExerciseToExercisesOnUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProfessionalsToPatients" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FileUploadedToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentComment_appointmentId_key" ON "AppointmentComment"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Professional_addressId_key" ON "Professional"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Professional_userId_key" ON "Professional"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_key" ON "Address"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_ExerciseToExercisesOnUser_AB_unique" ON "_ExerciseToExercisesOnUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ExerciseToExercisesOnUser_B_index" ON "_ExerciseToExercisesOnUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProfessionalsToPatients_AB_unique" ON "_ProfessionalsToPatients"("A", "B");

-- CreateIndex
CREATE INDEX "_ProfessionalsToPatients_B_index" ON "_ProfessionalsToPatients"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FileUploadedToUser_AB_unique" ON "_FileUploadedToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FileUploadedToUser_B_index" ON "_FileUploadedToUser"("B");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentComment" ADD CONSTRAINT "AppointmentComment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evolution" ADD CONSTRAINT "Evolution_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evolution" ADD CONSTRAINT "Evolution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExercisesOnUser" ADD CONSTRAINT "ExercisesOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToExercisesOnUser" ADD CONSTRAINT "_ExerciseToExercisesOnUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToExercisesOnUser" ADD CONSTRAINT "_ExerciseToExercisesOnUser_B_fkey" FOREIGN KEY ("B") REFERENCES "ExercisesOnUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfessionalsToPatients" ADD CONSTRAINT "_ProfessionalsToPatients_A_fkey" FOREIGN KEY ("A") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfessionalsToPatients" ADD CONSTRAINT "_ProfessionalsToPatients_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileUploadedToUser" ADD CONSTRAINT "_FileUploadedToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "FileUploaded"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileUploadedToUser" ADD CONSTRAINT "_FileUploadedToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
