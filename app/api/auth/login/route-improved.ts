import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username e password são obrigatórios" }, { status: 400 })
    }

    // Query user from database
    const query = "SELECT id, username, password_hash FROM admin_users WHERE username = ?"
    const users = (await executeQuery(query, [username])) as any[]

    if (users.length === 0) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    const user = users[0]

    // Verify password with bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    const response = NextResponse.json({
      message: "Login realizado com sucesso",
      user: { id: user.id, username: user.username },
    })

    // Set authentication cookie
    response.cookies.set("auth_token", `authenticated-${user.id}-session`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
      sameSite: "lax",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

