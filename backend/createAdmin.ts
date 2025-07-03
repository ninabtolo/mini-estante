import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const username = 'admin7'; 
    const password = 'admin123'; 
    
    const existingAdmin = await prisma.user.findUnique({
      where: { username }
    });
    
    if (existingAdmin) {
      console.log('Usuário administrador já existe');
      return;
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        nome: 'Administrator7',
        tipo: '0', 
        status: 'A',
        quant_acesso: 0,
        failed_attempts: 0
      }
    });

    console.log('Usuário administrador criado com sucesso:', admin.username);
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();