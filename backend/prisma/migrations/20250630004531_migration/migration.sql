-- CreateTable
CREATE TABLE "User" (
    "username" CHAR(30) NOT NULL,
    "password" CHAR(128) NOT NULL,
    "nome" CHAR(120) NOT NULL,
    "tipo" CHAR(1) NOT NULL,
    "status" CHAR(1) NOT NULL,
    "quant_acesso" INTEGER NOT NULL DEFAULT 0,
    "observacao" TEXT,
    "failed_attempts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "livros" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "data_leitura" TIMESTAMP(3) NOT NULL,
    "avaliacao" INTEGER,
    "resenha" TEXT,
    "userId" CHAR(30) NOT NULL,

    CONSTRAINT "livros_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "livros" ADD CONSTRAINT "livros_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
