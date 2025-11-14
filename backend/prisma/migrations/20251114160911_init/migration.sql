-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "embedding" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "bio" TEXT,
    "portfolioUrl" TEXT,
    CONSTRAINT "Profile_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Interest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "strength" INTEGER NOT NULL,
    CONSTRAINT "Interest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Talent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "measuredScore" INTEGER NOT NULL,
    CONSTRAINT "Talent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Industry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Subfield" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "industryId" TEXT NOT NULL,
    CONSTRAINT "Subfield_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SkillTree" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "marketingBlurb" TEXT NOT NULL,
    "subfieldId" TEXT NOT NULL,
    CONSTRAINT "SkillTree_subfieldId_fkey" FOREIGN KEY ("subfieldId") REFERENCES "Subfield" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "skillTreeId" TEXT NOT NULL,
    CONSTRAINT "Skill_skillTreeId_fkey" FOREIGN KEY ("skillTreeId") REFERENCES "SkillTree" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "durationHours" INTEGER NOT NULL,
    "skillId" TEXT NOT NULL,
    CONSTRAINT "Course_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SpecializedTraining" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "skillTreeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "SpecializedTraining_skillTreeId_fkey" FOREIGN KEY ("skillTreeId") REFERENCES "SkillTree" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SkillProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "proficiency" INTEGER NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "SkillProgress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SkillProgress_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CoopOpportunity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "industryId" TEXT,
    "subfieldId" TEXT,
    "skillTreeId" TEXT,
    "company" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "openings" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CoopOpportunity_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CoopOpportunity_subfieldId_fkey" FOREIGN KEY ("subfieldId") REFERENCES "Subfield" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CoopOpportunity_skillTreeId_fkey" FOREIGN KEY ("skillTreeId") REFERENCES "SkillTree" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_studentId_key" ON "Profile"("studentId");

-- CreateIndex
CREATE INDEX "Interest_studentId_idx" ON "Interest"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Interest_studentId_topic_key" ON "Interest"("studentId", "topic");

-- CreateIndex
CREATE INDEX "Talent_studentId_idx" ON "Talent"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_name_key" ON "Industry"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Subfield_name_industryId_key" ON "Subfield"("name", "industryId");

-- CreateIndex
CREATE INDEX "Skill_skillTreeId_idx" ON "Skill"("skillTreeId");

-- CreateIndex
CREATE UNIQUE INDEX "SpecializedTraining_skillTreeId_key" ON "SpecializedTraining"("skillTreeId");

-- CreateIndex
CREATE INDEX "SkillProgress_studentId_idx" ON "SkillProgress"("studentId");

-- CreateIndex
CREATE INDEX "SkillProgress_skillId_idx" ON "SkillProgress"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "SkillProgress_studentId_skillId_key" ON "SkillProgress"("studentId", "skillId");
