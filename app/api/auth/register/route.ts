import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/auth-db';
import { ensureUsersTable } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await ensureUsersTable();
    const { email: rawEmail, password } = await req.json();

    if (!rawEmail || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    // Normalize email: trim and lowercase (CRITICAL for case-insensitive auth)
    const email = rawEmail.trim().toLowerCase();

    if (password.length < 8) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 });
    }

    // Validate email format (after normalization)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'Este email ya está registrado' }, { status: 409 });
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create user
    const newUser = await createUser(email, passwordHash);
    
    // Log successful registration (server-side only)
    console.log(`[REG] User registered: ${email}`);
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    // Log full error server-side
    console.error('Registration error:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      stack: err.stack,
    });

    // Return user-friendly error
    if (err.code === '23505') { // Unique violation
      return NextResponse.json({ error: 'Este email ya está registrado' }, { status: 409 });
    }
    
    if (err.message?.includes('password authentication failed')) {
      console.error('Database connection failed - check POSTGRES_PASSWORD');
      return NextResponse.json({ error: 'Error de conexión con la base de datos' }, { status: 500 });
    }

    return NextResponse.json({ error: 'Error al crear la cuenta. Por favor, intenta de nuevo.' }, { status: 500 });
  }
}

