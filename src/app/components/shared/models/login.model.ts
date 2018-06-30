


/**
 * Estructura de la respuesta del servidor de login de oatuh
 */
export class LoginModel {
    access_token: string;
    id_token: string;
    scope: string;
    expires_in: number;
    token_type: string;
}

/**
 * Estructura para la información del usuario
 */
export class UserInformation {
    email: string;
    email_verified: boolean;
    name: string;
    nickname: string;
    picture: string;
    sub: string;
    updated_at: string;
}


/**
 * Estructura para el objeto que almacena el perfil del usuario.
 */
export class User {
    login: boolean;
    nickname: string;
    name: string;
    role: number;
    last_name: string;
    email: string;
    email_verified: string;
    picture: string;
    access_token: string;
    sub: string;
    updated_at: string;
}

/**
 * Estructura de el objeto enviado para iniciar sesión
 */
export class Login {
    username: string;
    password: string;
}
