import { sequelize } from '../../../config/database.js';

export const generateReceiptNumber = async () => {
    // Generate RCP-YYYYMM-XXXXX format
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const prefix = `RCP-${year}${month}-`;
    
    // In a real production scenario, use a sequence or transaction-safe max counter.
    // We count existing receipts for this month to generate the next number.
    const [results] = await sequelize.query(`
        SELECT COUNT(*) as count 
        FROM "FeePayments" 
        WHERE "receiptNumber" LIKE '${prefix}%'
    `);
    
    const count = parseInt(results[0].count || 0) + 1;
    const suffix = String(count).padStart(5, '0');
    
    return `${prefix}${suffix}`;
};
