# API Documentation - Semaphore Relayer

Esta API permite interactuar con el contrato inteligente Semaphore, un protocolo de pruebas de conocimiento cero (zero-knowledge proofs) que permite a los usuarios demostrar su pertenencia a un grupo sin revelar su identidad específica. Los endpoints facilitan la gestión de grupos, miembros y la validación/verificación de pruebas criptográficas.

## Formato de Respuesta Estandarizado

Todas las respuestas de la API siguen este formato:

```json
{
  "success": true | false,
  "message": "Mensaje descriptivo",
  "data": { ... } | null,
  "timestamp": 1234567890
}
```

## Base URL

```
http://localhost:3000/api/semaphore
```

---

## Endpoints

### 1. Crear Grupo

**POST** `/groups`

Crea un nuevo grupo Semaphore en el contrato inteligente. Un grupo es una colección de identidades que pueden generar pruebas de pertenencia.

**Body:**
```json
{
  "admin": "0x1234567890123456789012345678901234567890",  // Opcional
  "merkleTreeDuration": "3600"  // Opcional, en segundos
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Group created successfully",
  "data": {
    "groupId": "1",
    "admin": "0x1234567890123456789012345678901234567890",
    "merkleTreeDuration": "3600",
    "transaction": {
      "hash": "0xabc...",
      "blockNumber": 12345,
      "gasUsed": "150000",
      "status": "success"
    }
  },
  "timestamp": 1234567890
}
```

---

### 2. Obtener Contador de Grupos

**GET** `/groups/counter`

Obtiene el número total de grupos creados en el contrato. Útil para conocer cuántos grupos existen y cuál será el ID del próximo grupo.

**Respuesta:**
```json
{
  "success": true,
  "message": "Group counter retrieved successfully",
  "data": {
    "totalGroups": "5",
    "nextGroupId": "5"
  },
  "timestamp": 1234567890
}
```

---

### 3. Obtener Información de Grupo

**GET** `/groups/:groupId`

Obtiene toda la información de un grupo específico, incluyendo su administrador, configuración del árbol de Merkle y estado actual.

**Parámetros:**
- `groupId`: ID del grupo (en la URL)

**Respuesta:**
```json
{
  "success": true,
  "message": "Group info retrieved successfully",
  "data": {
    "id": "1",
    "admin": "0x1234567890123456789012345678901234567890",
    "merkleTreeDuration": "3600",
    "merkleTreeDepth": 20,
    "merkleTreeRoot": "12345678901234567890",
    "merkleTreeSize": "10"
  },
  "timestamp": 1234567890
}
```

---

### 4. Aceptar Administración de Grupo

**POST** `/groups/:groupId/accept-admin`

Permite al nuevo administrador designado aceptar la administración del grupo. Se usa después de que el administrador actual transfiera la administración.

**Parámetros:**
- `groupId`: ID del grupo (en la URL)

**Respuesta:**
```json
{
  "success": true,
  "message": "Group admin accepted",
  "data": {
    "groupId": "1",
    "transaction": {
      "txHash": "0xabc...",
      "blockNumber": 12346,
      "gasUsed": "100000",
      "status": "success"
    }
  },
  "timestamp": 1234567890
}
```

---

### 5. Actualizar Administrador de Grupo

**PUT** `/groups/:groupId/admin`

Transfiere la administración del grupo a una nueva dirección. El nuevo administrador deberá aceptar la administración usando el endpoint anterior.

**Parámetros:**
- `groupId`: ID del grupo (en la URL)

**Body:**
```json
{
  "newAdmin": "0x9876543210987654321098765432109876543210"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Group admin updated",
  "data": {
    "groupId": "1",
    "newAdmin": "0x9876543210987654321098765432109876543210",
    "transaction": {
      "txHash": "0xdef...",
      "blockNumber": 12347,
      "gasUsed": "120000",
      "status": "success"
    }
  },
  "timestamp": 1234567890
}
```

---

### 6. Agregar Miembro

**POST** `/members`

Agrega un único miembro (identity commitment) a un grupo específico. Solo el administrador del grupo puede agregar miembros.

**Body:**
```json
{
  "groupId": "1",
  "identityCommitment": "123456789012345678901234567890"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Member added to group",
  "data": {
    "groupId": "1",
    "identityCommitment": "123456789012345678901234567890",
    "transaction": {
      "hash": "0xghi...",
      "blockNumber": 12348,
      "gasUsed": "180000"
    }
  },
  "timestamp": 1234567890
}
```

---

### 7. Agregar Múltiples Miembros

**POST** `/members/batch`

Agrega múltiples miembros a un grupo en una sola transacción. Más eficiente en gas que agregar miembros uno por uno.

**Body:**
```json
{
  "groupId": "1",
  "identityCommitments": [
    "111111111111111111111111111111",
    "222222222222222222222222222222",
    "333333333333333333333333333333"
  ]
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "3 members added to group",
  "data": {
    "groupId": "1",
    "count": 3,
    "identityCommitments": [
      "111111111111111111111111111111",
      "222222222222222222222222222222",
      "333333333333333333333333333333"
    ],
    "transaction": {
      "hash": "0xjkl...",
      "blockNumber": 12349,
      "gasUsed": "350000"
    }
  },
  "timestamp": 1234567890
}
```

---

### 8. Eliminar Miembro

**DELETE** `/members`

Elimina un miembro de un grupo. Requiere proporcionar una prueba de Merkle para verificar que el miembro existe en el grupo.

**Body:**
```json
{
  "groupId": "1",
  "identityCommitment": "123456789012345678901234567890",
  "merkleProofSiblings": [
    "111111111111111111111111111111",
    "222222222222222222222222222222"
  ]
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Member removed from group",
  "data": {
    "groupId": "1",
    "identityCommitment": "123456789012345678901234567890",
    "transaction": {
      "txHash": "0xmno...",
      "blockNumber": 12350,
      "gasUsed": "200000",
      "status": "success"
    }
  },
  "timestamp": 1234567890
}
```

---

### 9. Actualizar Miembro

**PUT** `/members`

Actualiza el identity commitment de un miembro existente. Útil para rotar identidades sin perder la pertenencia al grupo.

**Body:**
```json
{
  "groupId": "1",
  "identityCommitment": "123456789012345678901234567890",
  "newIdentityCommitment": "999999999999999999999999999999",
  "merkleProofSiblings": [
    "111111111111111111111111111111",
    "222222222222222222222222222222"
  ]
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Member updated",
  "data": {
    "groupId": "1",
    "oldIdentityCommitment": "123456789012345678901234567890",
    "newIdentityCommitment": "999999999999999999999999999999",
    "transaction": {
      "txHash": "0xpqr...",
      "blockNumber": 12351,
      "gasUsed": "220000",
      "status": "success"
    }
  },
  "timestamp": 1234567890
}
```

---

### 10. Verificar Pertenencia de Miembro

**GET** `/members/check?groupId=1&identityCommitment=123456789012345678901234567890`

Verifica si un identity commitment específico es miembro de un grupo. No requiere transacción, es una consulta de solo lectura.

**Query Parameters:**
- `groupId`: ID del grupo
- `identityCommitment`: Identity commitment a verificar

**Respuesta:**
```json
{
  "success": true,
  "message": "Member check completed",
  "data": {
    "groupId": "1",
    "identityCommitment": "123456789012345678901234567890",
    "hasMember": true
  },
  "timestamp": 1234567890
}
```

---

### 11. Validar Prueba (On-chain)

**POST** `/proofs/validate`

Valida una prueba de conocimiento cero en la blockchain. Esto registra la prueba en el contrato y consume gas. Útil cuando necesitas un registro permanente de la validación.

**Body:**
```json
{
  "groupId": "1",
  "proof": {
    "merkleTreeDepth": "20",
    "merkleTreeRoot": "12345678901234567890",
    "nullifier": "11111111111111111111111111111111",
    "message": "22222222222222222222222222222222",
    "scope": "33333333333333333333333333333333",
    "points": [
      "1111111111111111111111111111",
      "2222222222222222222222222222",
      "3333333333333333333333333333",
      "4444444444444444444444444444",
      "5555555555555555555555555555",
      "6666666666666666666666666666",
      "7777777777777777777777777777",
      "8888888888888888888888888888"
    ]
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Proof validated on-chain",
  "data": {
    "groupId": "1",
    "nullifier": "11111111111111111111111111111111",
    "message": "22222222222222222222222222222222",
    "scope": "33333333333333333333333333333333",
    "transaction": {
      "hash": "0xstu...",
      "blockNumber": 12352,
      "gasUsed": "300000",
      "status": "success"
    }
  },
  "timestamp": 1234567890
}
```

---

### 12. Verificar Prueba (Off-chain)

**POST** `/proofs/verify`

Verifica una prueba de conocimiento cero sin registrarla en la blockchain. No consume gas, es una consulta de solo lectura. Útil para verificaciones rápidas.

**Body:**
```json
{
  "groupId": "1",
  "proof": {
    "merkleTreeDepth": "20",
    "merkleTreeRoot": "12345678901234567890",
    "nullifier": "11111111111111111111111111111111",
    "message": "22222222222222222222222222222222",
    "scope": "33333333333333333333333333333333",
    "points": [
      "1111111111111111111111111111",
      "2222222222222222222222222222",
      "3333333333333333333333333333",
      "4444444444444444444444444444",
      "5555555555555555555555555555",
      "6666666666666666666666666666",
      "7777777777777777777777777777",
      "8888888888888888888888888888"
    ]
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Proof verification completed",
  "data": {
    "groupId": "1",
    "isValid": true,
    "proof": {
      "nullifier": "11111111111111111111111111111111",
      "message": "22222222222222222222222222222222",
      "scope": "33333333333333333333333333333333"
    }
  },
  "timestamp": 1234567890
}
```

---

### 13. Obtener Dirección del Verificador

**GET** `/verifier`

Obtiene la dirección del contrato verificador de pruebas ZK que utiliza el contrato Semaphore. Útil para verificar la configuración del sistema.

**Respuesta:**
```json
{
  "success": true,
  "message": "Verifier address retrieved successfully",
  "data": {
    "verifierAddress": "0x1234567890123456789012345678901234567890"
  },
  "timestamp": 1234567890
}
```

---

## Manejo de Errores

Todas las respuestas de error siguen el mismo formato estandarizado:

**Ejemplo de error de validación:**
```json
{
  "success": false,
  "message": "Validation error",
  "data": {
    "details": {
      "formErrors": [],
      "fieldErrors": {
        "groupId": ["Expected string, received number"]
      }
    }
  },
  "timestamp": 1234567890
}
```

**Ejemplo de error HTTP:**
```json
{
  "success": false,
  "message": "Invalid admin address format",
  "data": null,
  "timestamp": 1234567890
}
```

**Ejemplo de error interno:**
```json
{
  "success": false,
  "message": "Internal server error",
  "data": null,
  "timestamp": 1234567890
}
```

---

## Notas Importantes

1. Todos los valores numéricos grandes (BigInt) se envían y reciben como strings para evitar pérdida de precisión.
2. Las direcciones Ethereum deben estar en formato hexadecimal con prefijo `0x` y 40 caracteres.
3. Los endpoints que modifican el estado de la blockchain requieren que el relayer tenga fondos suficientes para pagar el gas.
4. El timestamp en las respuestas está en milisegundos desde epoch Unix.
