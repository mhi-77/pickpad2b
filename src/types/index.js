// Types are now handled as JSDoc comments or plain objects

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string|null} name
 * @property {string|null} username
 * @property {string|null} avatar_url
 */

/**
 * @typedef {Object} PadronRecord
 * @property {string} DOCUMENTO
 * @property {string|null} APELLIDO
 * @property {string|null} NOMBRE
 * @property {string|null} SEXO
 * @property {number|null} CLASE
 * @property {string|null} CIRCUITO
 * @property {number|null} ORDEN
 * @property {number|null} MESA
 * @property {string|null} LOCALIDAD
 * @property {string|null} NUEVO
 * @property {string|null} VNO
 * @property {string|null} AM
 * @property {string|null} ANTERIORES
 * @property {boolean|null} VOTO
 * @property {string|null} TEAM
 * @property {string|null} OBSERVACIONES
 * @property {boolean|null} OK
 */

/**
 * @typedef {Object} SearchFilters
 * @property {string} [documento]
 * @property {string} [apellido]
 * @property {string} [nombre]
 * @property {string} [localidad]
 * @property {string} [circuito]
 * @property {number} [mesa]
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