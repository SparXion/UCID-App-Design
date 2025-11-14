-- AlterTable
ALTER TABLE "Student" ADD COLUMN "hybridMode" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SkillTree" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "marketingBlurb" TEXT NOT NULL,
    "subfieldId" TEXT NOT NULL,
    "isHybrid" BOOLEAN NOT NULL DEFAULT false,
    "hybridType" TEXT,
    "systemBlurb" TEXT,
    CONSTRAINT "SkillTree_subfieldId_fkey" FOREIGN KEY ("subfieldId") REFERENCES "Subfield" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SkillTree" ("id", "marketingBlurb", "name", "subfieldId") SELECT "id", "marketingBlurb", "name", "subfieldId" FROM "SkillTree";
DROP TABLE "SkillTree";
ALTER TABLE "new_SkillTree" RENAME TO "SkillTree";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
