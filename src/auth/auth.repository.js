import prisma from '../db/index.js'; 

class UserExistsError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserExistsError';
    }
}

async function createUser(userData) {
    try {
        // Cek existing user
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: userData.username },
                    { email: userData.email }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.username === userData.username) {
                throw new UserExistsError('Username already taken');
            }
            if (existingUser.email === userData.email) {
                throw new UserExistsError('Email already registered');
            }
        }

        let newUser = await prisma.user.create({ 
            data: userData,
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return newUser;
    } catch (error) {
        if (error instanceof UserExistsError) {
            throw error;
        }
        if (error.code === 'P2002') {
            const fields = error.meta?.target || [];
            throw new UserExistsError(`${fields.join(', ')} already exists`);
        }
        throw new Error('Database error: ' + error.message);
    }
}

async function findUserByUsername(username) {
    return prisma.user.findUnique({ 
        where: { username },
        select: {
            id: true,
            username: true,
            email: true,
            password: true,
            role: true
        }
    });
}

export { createUser, findUserByUsername, UserExistsError };
