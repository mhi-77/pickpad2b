// Types are now handled as JSDoc comments or plain objects

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string|null} name
 * @property {number} usuario_tipo
 * @property {number|null} mesa_numero
 * @property {string} roleDescription
 * @property {string|null} avatar_url
 */

/**
 * @typedef {Object} PadronRecord
 * @property {number} documento
 * @property {string|null} apellido
 * @property {string|null} nombre
 * @property {string|null} sexo
 * @property {number|null} CLASE
 * @property {string|null} CIRCUITO
 * @property {number|null} ORDEN
 * @property {number|null} MESA
 * @property {string|null} domicilio
 * @property {string|null} NUEVO
 * @property {string|null} VNO
 * @property {string|null} AM
 * @property {string|null} ANTERIORES
 * @property {boolean|null} VOTO
 * @property {string|null} TEAM
 * @property {string|null} OBSERVACIONES
 * @property {boolean|null} OK
 * @property {boolean|null} voto_emitido
 * @property {string|null} voto_pick_at
 * @property {string|null} voto_pick_user
 * @property {string|null} emopick_user
 * @property {string|null} pick_check_user
 * @property {Object|null} profiles - Perfil del usuario que marcó el voto
 * @property {string|null} profiles.full_name - Nombre completo del usuario
 */

/**
 * @typedef {Object} SearchFilters
 * @property {string} [documento]
 * @property {string} [apellido]
 * @property {string} [nombre]
 * @property {string} [localidad]
 * @property {string} [circuito]
 * @property {number} [mesa_numero]
 * @property {number} [clase]
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user
 * @property {function(string, string): Promise<boolean>} login
 * @property {function(): void} logout
 * @property {boolean} isLoading
 */

export {};