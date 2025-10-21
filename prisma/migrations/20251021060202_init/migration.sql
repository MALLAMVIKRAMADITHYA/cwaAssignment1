-- CreateTable
CREATE TABLE "CommandLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT,
    "owner" TEXT,
    "repo" TEXT,
    "command" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "output" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
