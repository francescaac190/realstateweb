import { prisma } from '../config/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt';

export async function register(name: string, email: string, password: string) {
    const exists = await prisma.user.findUnique({ where: {email} });
    if(exists) throw new Error('El correo ya se encuentra en uso.');

    const role = await prisma.role.findFirst({ where: { code: 'AGENT'}});
    if(!role) throw new Error('El rol AGENT no encontrado');

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashed,
            roleId: role.id,

        }
    })

    const token =  signToken({id: user.id});
    return { user, token };
}

export async function login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: {email}});
    if(!user) throw new Error( 'Usuario no encontrado.');

    const valid = await bcrypt.compare(password, user.password);
    if(!valid) throw new Error('Credenciales inválidas');

    const token = signToken({ id: user.id });

    return { user, token };
}