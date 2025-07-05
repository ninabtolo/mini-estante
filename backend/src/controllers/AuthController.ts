import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
// Em uma implementação de recuperação de senha com e-mail real, precisaríamos de bibliotecas adicionais:
// import crypto from 'crypto'; // Para gerar tokens aleatórios
// import nodemailer from 'nodemailer'; // Para enviar emails

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Nome de usuário e senha são obrigatórios' });
      }

      // tive q fazer trim no username para evitar problemas com espaços em branco
      const trimmedUsername = username.trim();

      const user = await prisma.user.findUnique({ 
        where: { username: trimmedUsername } 
      });

      if (!user) {
        console.log(`Falha no login: Usuário ${trimmedUsername} não encontrado`);
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      if (user.status === 'B') {
        return res.status(403).json({ error: 'Usuário está bloqueado' });
      }

      if (user.status === 'I') {
        return res.status(403).json({ error: 'Usuário está inativo' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        console.log(`Falha no login: Senha incorreta para o usuário ${trimmedUsername}`);
      
        const failedAttempts = user.failed_attempts + 1;
        
        if (failedAttempts >= 3) {
          await prisma.user.update({
            where: { username: trimmedUsername },
            data: {
              status: 'B',
              failed_attempts: failedAttempts
            }
          });
          return res.status(403).json({ error: 'Usuário bloqueado devido a múltiplas tentativas falhas' });
        }
        
        await prisma.user.update({
          where: { username: trimmedUsername },
          data: { failed_attempts: failedAttempts }
        });
        
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      await prisma.user.update({
        where: { username: trimmedUsername },
        data: {
          failed_attempts: 0,
          quant_acesso: user.quant_acesso + 1
        }
      });

      const token = jwt.sign(
        { id: user.username, tipo: user.tipo },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: process.env.JWT_EXPIRATION || '8h' }
      );

      return res.json({
        user: {
          username: user.username,
          nome: user.nome,
          tipo: user.tipo,
          quant_acesso: user.quant_acesso
        },
        token
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async logout(req: Request, res: Response) {
    return res.status(204).send();
  }

  // Método para iniciar o processo de recuperação de senha
  // Este método seria responsável por:
  // 1. Verificar se o email existe no sistema
  // 2. Gerar um token único
  // 3. Salvar o token e sua data de expiração no banco de dados
  // 4. Enviar um email com o link para redefinição de senha
  /*
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório' });
      }

      // Validação básica de formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Formato de email inválido' });
      }

      const user = await prisma.user.findFirst({
        where: { email: email.trim() }
      });

      // Por segurança, não revelamos se o email existe ou não
      // Apenas retornamos uma mensagem genérica
      if (!user) {
        return res.status(200).json({ 
          message: 'Se este email estiver associado a uma conta, enviaremos instruções para redefinir sua senha.'
        });
      }

      // Gerar token aleatório
      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 3600000); // Expira em 1 hora

      // Salvar token no banco de dados
      await prisma.user.update({
        where: { username: user.username },
        data: {
          reset_token: resetToken,
          reset_token_expires: resetTokenExpires
        }
      });

      // Em uma implementação real, aqui enviaria o email
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      await sendPasswordResetEmail(email, resetLink);

      return res.status(200).json({ 
        message: 'Se este email estiver associado a uma conta, enviaremos instruções para redefinir sua senha.'
      });
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  */

  // Método para validar o token de redefinição de senha
  // Este método seria chamado quando o usuário acessa o link enviado por email
  /*
  async validateResetToken(req: Request, res: Response) {
    try {
      const { token } = req.params;
      
      const user = await prisma.user.findFirst({
        where: {
          reset_token: token,
          reset_token_expires: {
            gt: new Date()
          }
        }
      });

      if (!user) {
        return res.status(400).json({ error: 'Token inválido ou expirado' });
      }

      return res.status(200).json({ valid: true });
    } catch (error) {
      console.error('Erro na validação do token:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  */

  // Método para redefinir a senha usando o token
  // Este método seria chamado quando o usuário submete o formulário de redefinição de senha
  /*
  async resetPassword(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ error: 'Nova senha é obrigatória' });
      }

      const user = await prisma.user.findFirst({
        where: {
          reset_token: token,
          reset_token_expires: {
            gt: new Date()
          }
        }
      });

      if (!user) {
        return res.status(400).json({ error: 'Token inválido ou expirado' });
      }

      // Hash da nova senha
      const hashedPassword = await bcrypt.hash(password, 12);

      // Atualizar senha e limpar os campos de redefinição
      await prisma.user.update({
        where: { username: user.username },
        data: {
          password: hashedPassword,
          reset_token: null,
          reset_token_expires: null,
          failed_attempts: 0 // Resetar tentativas falhas de login
        }
      });

      return res.status(200).json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
      console.error('Erro na redefinição de senha:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  */

  // Função auxiliar para enviar email (seria implementada em um serviço separado)
  /*
  async function sendPasswordResetEmail(email: string, resetLink: string) {
    // Configuração do transportador de email (usando ambiente de desenvolvimento)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Conteúdo do email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Recuperação de Senha - Mini Estante',
      text: `Você solicitou a redefinição de senha. Clique no link a seguir para redefinir sua senha: ${resetLink}`,
      html: `
        <p>Você solicitou a redefinição de senha.</p>
        <p>Clique no link a seguir para redefinir sua senha:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou esta redefinição, ignore este email.</p>
      `
    };

    // Enviar email
    await transporter.sendMail(mailOptions);
  }
  */
}

export default new AuthController();
