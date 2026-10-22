/**
 * Configuración de cuentas y métodos de pago de Shama Producciones
 * Cuentas bancarias personales y billeteras cripto para recepción de pagos en Venezuela.
 */

export interface BankAccountConfig {
  id: string;
  bankName: string;
  code: string;
  accountNumber: string;
  accountHolder: string;
  idCard: string;
  phone: string; // Para pago móvil
  supportsPagoMovil: boolean;
  color: string;
}

export interface CryptoWalletConfig {
  id: string;
  platform: string;
  payId?: string;
  nickname?: string;
  network?: string;
  address?: string;
  instructions: string;
}

export const PAYMENT_CONFIG = {
  beneficiaryName: "Shama Producciones",
  pagoMovil: {
    phone: "0412-1234567",
    idCard: "V-12345678",
    banks: [
      {
        id: "mercantil",
        name: "Banco Mercantil",
        code: "0105",
      },
      {
        id: "banesco",
        name: "Banesco Banco Universal",
        code: "0134",
      },
      {
        id: "bdv",
        name: "Banco de Venezuela (BDV)",
        code: "0102",
      },
      {
        id: "banplus",
        name: "Banplus Banco Universal",
        code: "0174",
      },
    ],
  },
  bankAccounts: [
    {
      id: "mercantil",
      bankName: "Banco Mercantil",
      code: "0105",
      accountNumber: "0105-0000-00-0000000000",
      accountHolder: "Shama Producciones / Representante",
      idCard: "V-12345678",
      phone: "0412-1234567",
      supportsPagoMovil: true,
      color: "#005596",
    },
    {
      id: "banesco",
      bankName: "Banesco Banco Universal",
      code: "0134",
      accountNumber: "0134-0000-00-0000000000",
      accountHolder: "Shama Producciones / Representante",
      idCard: "V-12345678",
      phone: "0412-1234567",
      supportsPagoMovil: true,
      color: "#007A33",
    },
    {
      id: "bdv",
      bankName: "Banco de Venezuela",
      code: "0102",
      accountNumber: "0102-0000-00-0000000000",
      accountHolder: "Shama Producciones / Representante",
      idCard: "V-12345678",
      phone: "0412-1234567",
      supportsPagoMovil: true,
      color: "#BE0027",
    },
    {
      id: "banplus",
      bankName: "Banplus Banco Universal",
      code: "0174",
      accountNumber: "0174-0000-00-0000000000",
      accountHolder: "Shama Producciones / Representante",
      idCard: "V-12345678",
      phone: "0412-1234567",
      supportsPagoMovil: true,
      color: "#E28C00",
    },
  ],
  crypto: {
    binancePay: {
      payId: "847291039",
      nickname: "ShamaProducciones",
      qrImage: "/crypto/binance-pay-qr.svg",
      instructions: "Envía el monto exacto en USDT mediante Binance Pay sin comisión.",
    },
    usdtWallets: [
      {
        network: "TRC-20 (Tron)",
        address: "TP1u8a2KjL9oZ8...ShamaTRC20Official",
        instructions: "Red TRON (TRC20). Asegúrate de transferir el monto exacto.",
      },
      {
        network: "BEP-20 (BNB Smart Chain)",
        address: "0x3F8a992C8...ShamaBEP20Official",
        instructions: "Red BNB Chain (BEP20).",
      },
      {
        network: "Polygon (MATIC)",
        address: "0x3F8a992C8...ShamaPolygonOfficial",
        instructions: "Red Polygon POS.",
      },
    ],
  },
};
